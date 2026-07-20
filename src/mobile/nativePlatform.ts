import { Capacitor } from "@capacitor/core";

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function getNativePlatform(): "ios" | "android" | "web" {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android" ? platform : "web";
}
