import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { SystemBars, SystemBarsStyle } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { useLocation, useNavigate } from "react-router-dom";
import { isExternalHttpUrl, openExternalUrl } from "@/mobile/nativeLinks";
import { listenForAppLifecycle } from "@/mobile/nativeLifecycle";
import { getNativePlatform, isNativePlatform } from "@/mobile/nativePlatform";
import { recordMobileDiagnostic } from "@/mobile/mobileDiagnostics";

export default function NativeBootstrap() {
  const navigate = useNavigate();
  const location = useLocation();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.nativePlatform = getNativePlatform();
    if (!isNativePlatform()) return;

    let disposed = false;
    const handles: Array<{ remove: () => Promise<void> }> = [];

    void Network.getStatus().then(({ connected, connectionType }) => {
      if (!disposed) setOffline(!connected);
      recordMobileDiagnostic("network-initial", { connected, connectionType });
    });
    void Network.addListener("networkStatusChange", ({ connected, connectionType }) => {
      setOffline(!connected);
      recordMobileDiagnostic("network-change", { connected, connectionType });
    }).then((handle) => {
      if (disposed) void handle.remove();
      else handles.push(handle);
    });
    void listenForAppLifecycle((state) => {
      recordMobileDiagnostic("app-state", { state });
      window.dispatchEvent(new CustomEvent("standard:app-state", { detail: { state } }));
    }).then((handle) => {
      if (!handle) return;
      if (disposed) void handle.remove();
      else handles.push(handle);
    });

    void SystemBars.setStyle({ style: SystemBarsStyle.Default });

    const onError = (event: ErrorEvent) => {
      recordMobileDiagnostic("window-error", { name: event.error instanceof Error ? event.error.name : "Error" });
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      recordMobileDiagnostic("unhandled-rejection", {
        name: event.reason instanceof Error ? event.reason.name : "Unknown",
      });
    };
    const onVoiceDiagnostic = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, string | number | boolean | null>>).detail;
      recordMobileDiagnostic("voice", detail);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("standard:voice-diagnostic", onVoiceDiagnostic);

    return () => {
      disposed = true;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("standard:voice-diagnostic", onVoiceDiagnostic);
      handles.forEach((handle) => void handle.remove());
      delete document.documentElement.dataset.nativePlatform;
    };
  }, []);

  useEffect(() => {
    if (!isNativePlatform() || getNativePlatform() !== "android") return;
    let disposed = false;
    let handle: { remove: () => Promise<void> } | null = null;
    void App.addListener("backButton", ({ canGoBack }) => {
      if (location.pathname !== "/app" && location.pathname !== "/login" && canGoBack) navigate(-1);
      else void App.exitApp();
    }).then((nextHandle) => {
      if (disposed) void nextHandle.remove();
      else handle = nextHandle;
    });
    return () => {
      disposed = true;
      if (handle) void handle.remove();
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!isNativePlatform()) return;
    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (!isExternalHttpUrl(url) && url.protocol !== "mailto:" && url.protocol !== "tel:") return;
      event.preventDefault();
      void openExternalUrl(url.href);
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  if (!offline) return null;
  return (
    <div className="mobile-network-banner" role="status">
      You’re offline. Saved screens remain visible; reconnect to sync or continue coaching.
    </div>
  );
}
