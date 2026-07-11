import { useAuth } from '@/app/lib/auth';

type FeatureFlags = Record<string, unknown>;

export const enableSaveToReport = true;
export const enableMetrics = true;
export const enableMeetingFrameModeAware = import.meta.env.VITE_MEETING_FRAME_MODE_AWARE === 'true';

/**
 * Flags that are ON for every member by default. Agent-driven Flows are the
 * standard experience; no per-user profile lookup is required.
 */
const DEFAULT_FLAGS: Record<string, boolean> = {
  agent_driven_flows: true,
};

function readFeatureFlags(metadata: unknown): FeatureFlags {
  if (!metadata || typeof metadata !== 'object') return {};
  const featureFlags = (metadata as { feature_flags?: unknown }).feature_flags;
  return featureFlags && typeof featureFlags === 'object'
    ? (featureFlags as FeatureFlags)
    : {};
}

/**
 * Feature flag lookup. Defaults come from DEFAULT_FLAGS; an explicit
 * boolean in the user's auth metadata (feature_flags) overrides the default.
 */
export function useFeatureFlag(flagName: string): boolean {
  const { user } = useAuth();
  const flags = readFeatureFlags(user?.user_metadata);
  if (typeof flags[flagName] === 'boolean') return flags[flagName] === true;
  return DEFAULT_FLAGS[flagName] ?? false;
}
