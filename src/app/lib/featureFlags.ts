import { useAuth } from '@/app/lib/auth';

type FeatureFlags = Record<string, unknown>;

export const enableSaveToReport = true;
export const enableMetrics = true;
export const enableMeetingFrameModeAware = import.meta.env.VITE_MEETING_FRAME_MODE_AWARE === 'true';

function readFeatureFlags(metadata: unknown): FeatureFlags {
  if (!metadata || typeof metadata !== 'object') return {};
  const featureFlags = (metadata as { feature_flags?: unknown }).feature_flags;
  return featureFlags && typeof featureFlags === 'object'
    ? (featureFlags as FeatureFlags)
    : {};
}

/**
 * Simple beta flag lookup for user-scoped rollouts.
 *
 * Justin flips agent-driven Flows in Supabase Dashboard:
 * Auth -> Users -> select user -> Raw user meta data:
 * { "feature_flags": { "agent_driven_flows": true } }
 */
export function useFeatureFlag(flagName: string): boolean {
  const { user } = useAuth();
  const flags = readFeatureFlags(user?.user_metadata);
  return flags[flagName] === true;
}
