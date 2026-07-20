import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { isNativePlatform } from "@/mobile/nativePlatform";

export type AppLifecycleState = "active" | "background";

export function getAppLifecycleState(): AppLifecycleState {
  return document.visibilityState === "visible" ? "active" : "background";
}

export async function listenForAppLifecycle(
  listener: (state: AppLifecycleState) => void,
): Promise<PluginListenerHandle | null> {
  if (!isNativePlatform()) return null;
  return App.addListener("appStateChange", ({ isActive }) => listener(isActive ? "active" : "background"));
}
