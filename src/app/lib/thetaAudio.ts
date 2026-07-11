export interface ThetaAudioDeviceSignals {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
  coarsePointer: boolean;
  deviceMemory?: number;
}

const IOS_DEVICE_PATTERN = /iPad|iPhone|iPod/i;

export function getThetaAudioDeviceSignals(): ThetaAudioDeviceSignals {
  const nav = window.navigator as Navigator & { deviceMemory?: number };

  return {
    userAgent: nav.userAgent || "",
    platform: nav.platform || "",
    maxTouchPoints: nav.maxTouchPoints || 0,
    coarsePointer: window.matchMedia?.("(pointer: coarse)")?.matches ?? false,
    deviceMemory: nav.deviceMemory,
  };
}

export function isLikelyIosDevice(signals: ThetaAudioDeviceSignals): boolean {
  return (
    IOS_DEVICE_PATTERN.test(signals.userAgent) ||
    IOS_DEVICE_PATTERN.test(signals.platform) ||
    (signals.platform === "MacIntel" && signals.maxTouchPoints > 1)
  );
}

export function isLikelyConstrainedThetaRenderDevice(signals: ThetaAudioDeviceSignals): boolean {
  if (isLikelyIosDevice(signals)) return true;

  if (signals.coarsePointer && typeof signals.deviceMemory === "number") {
    return signals.deviceMemory <= 4;
  }

  return false;
}

export function estimateThetaOfflineRenderBytes(durationSeconds: number, sampleRate: number, channels: number): number {
  const pcmBytes = durationSeconds * sampleRate * channels * Float32Array.BYTES_PER_ELEMENT;
  const renderedCopyBytes = pcmBytes;
  const encoderScratchBytes = durationSeconds * sampleRate * channels * Int16Array.BYTES_PER_ELEMENT;

  return pcmBytes + renderedCopyBytes + encoderScratchBytes;
}

export function formatThetaAudioBytes(bytes: number): string {
  const megabytes = bytes / (1024 * 1024);
  return `${Math.round(megabytes)} MB`;
}
