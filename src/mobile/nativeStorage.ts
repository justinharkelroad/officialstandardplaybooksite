import { Preferences } from "@capacitor/preferences";
import { isNativePlatform } from "@/mobile/nativePlatform";

export async function persistNativePreference(key: string, value: string): Promise<void> {
  if (isNativePlatform()) {
    await Preferences.set({ key, value });
    return;
  }
  localStorage.setItem(key, value);
}

export async function getNativePreference(key: string): Promise<string | null> {
  if (isNativePlatform()) return (await Preferences.get({ key })).value;
  return localStorage.getItem(key);
}

export async function removeNativePreference(key: string): Promise<void> {
  if (isNativePlatform()) {
    await Preferences.remove({ key });
    return;
  }
  localStorage.removeItem(key);
}
