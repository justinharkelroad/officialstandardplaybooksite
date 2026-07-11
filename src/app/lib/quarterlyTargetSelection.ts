import type { QuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";

export const QUARTERLY_TARGET_DOMAINS = [
  "body",
  "being",
  "balance",
  "business",
] as const;

export type QuarterlyTargetDomain = (typeof QUARTERLY_TARGET_DOMAINS)[number];

export type QuarterlyTargetValues = Record<QuarterlyTargetDomain, string>;

export function resolvePrimaryTargetsFromQuarterly(
  targets: QuarterlyTargets,
): QuarterlyTargetValues {
  return QUARTERLY_TARGET_DOMAINS.reduce<QuarterlyTargetValues>(
    (resolved, domain) => {
      const target1 = targets[`${domain}_target`]?.trim() ?? "";
      const target2 = targets[`${domain}_target2`]?.trim() ?? "";
      const primaryIsTarget1 = targets[`${domain}_primary_is_target1`] ?? true;
      const selectedTarget = primaryIsTarget1
        ? target1 || target2
        : target2 || target1;

      resolved[domain] = selectedTarget;
      return resolved;
    },
    { body: "", being: "", balance: "", business: "" },
  );
}
