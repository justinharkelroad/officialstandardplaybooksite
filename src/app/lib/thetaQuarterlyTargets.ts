import type { QuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import {
  resolvePrimaryTargetsFromQuarterly,
  type QuarterlyTargetValues,
} from "@/app/lib/quarterlyTargetSelection";

export type ThetaTargetValues = QuarterlyTargetValues;

export function resolveThetaTargetsFromQuarterly(
  targets: QuarterlyTargets,
): ThetaTargetValues {
  return resolvePrimaryTargetsFromQuarterly(targets);
}

export function getThetaQuarterlyTargetsFingerprint(
  quarter: string,
  targets: ThetaTargetValues,
): string {
  return JSON.stringify({ quarter, targets });
}

export function hasThetaTargetValues(targets: ThetaTargetValues): boolean {
  return Object.values(targets).some((target) => target.length > 0);
}
