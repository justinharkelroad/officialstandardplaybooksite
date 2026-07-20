export type MicrophonePermissionState = "prompt" | "granted" | "denied" | "unavailable";

export async function getMicrophonePermissionState(): Promise<MicrophonePermissionState> {
  if (!("permissions" in navigator) || !navigator.permissions?.query) return "prompt";
  try {
    const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return result.state;
  } catch {
    return "prompt";
  }
}

export async function requestMicrophonePermission(): Promise<MicrophonePermissionState> {
  if (!navigator.mediaDevices?.getUserMedia) return "unavailable";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return "granted";
  } catch (error) {
    if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
      return "denied";
    }
    throw error;
  }
}
