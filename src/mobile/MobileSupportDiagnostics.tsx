import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Network } from "@capacitor/network";
import { Share } from "@capacitor/share";
import { LifeBuoy } from "lucide-react";
import { getMobileDiagnostics } from "@/mobile/mobileDiagnostics";
import { getNativePlatform, isNativePlatform } from "@/mobile/nativePlatform";

interface AppInfo {
  name: string;
  version: string;
  build: string;
}

export default function MobileSupportDiagnostics() {
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    if (!isNativePlatform()) return;
    void App.getInfo().then(({ name, version, build }) => setInfo({ name, version, build }));
  }, []);

  if (!isNativePlatform() || !info) return null;

  const shareDiagnostics = async () => {
    const network = await Network.getStatus();
    const report = {
      app: info.name,
      version: info.version,
      build: info.build,
      platform: getNativePlatform(),
      connected: network.connected,
      connectionType: network.connectionType,
      events: getMobileDiagnostics(),
      privacy: "No journal answers, transcript text, passwords, or auth tokens are included.",
    };
    await Share.share({
      title: "Standard Playbook diagnostics",
      text: JSON.stringify(report, null, 2),
      dialogTitle: "Copy or share app diagnostics",
    });
  };

  return (
    <button
      type="button"
      onClick={() => void shareDiagnostics()}
      aria-label="Share app support diagnostics"
      title={`Standard Playbook ${info.version} (${info.build})`}
      className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground/60 transition-colors hover:text-[#2997FF] lg:h-auto lg:w-auto"
    >
      <LifeBuoy className="h-4 w-4" />
    </button>
  );
}
