import type { PersonalGrowthDomain } from "@/app/components/personal-growth/domainTokens";

const DOMAIN_FALLBACKS: Record<PersonalGrowthDomain, string> = {
  body: "Body Focus",
  being: "Being Focus",
  balance: "Balance Focus",
  business: "Business Focus",
};

export function getPersonalGrowthFocusLabel(
  domain: string,
  statement: string | null | undefined,
): string {
  const normalizedDomain = domain.toLowerCase() as PersonalGrowthDomain;
  const fallback = DOMAIN_FALLBACKS[normalizedDomain] ?? "Primary Focus";
  const cleanStatement = (statement ?? "").trim().replace(/\s+/g, " ");

  if (!cleanStatement) return fallback;

  // Never infer or manufacture a different goal from private target text. The
  // card clamps long text visually and reveals the complete text when opened.
  return cleanStatement;
}
