import { Browser } from "@capacitor/browser";
import { isNativePlatform } from "@/mobile/nativePlatform";

export async function openExternalUrl(url: string): Promise<void> {
  if (!isNativePlatform()) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  if (/^https?:/i.test(url)) {
    await Browser.open({ url });
    return;
  }

  window.location.href = url;
}

export function isExternalHttpUrl(url: URL): boolean {
  return /^https?:$/.test(url.protocol) && url.origin !== window.location.origin;
}
