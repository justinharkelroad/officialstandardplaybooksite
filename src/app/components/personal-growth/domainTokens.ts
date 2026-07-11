import { Briefcase, CalendarRange, Dumbbell, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LatinCross } from "@/app/components/icons/LatinCross";

export type PersonalGrowthDomain = "body" | "being" | "balance" | "business";

export type DomainToken = {
  key: PersonalGrowthDomain | CadenceKey;
  label: string;
  tagline: string;
  icon: LucideIcon | typeof LatinCross;
  hex: string;
  ringClass: string;
  solidClass: string;
  softClass: string;
  softHoverClass: string;
  borderClass: string;
  glowClass: string;
};

export const DOMAIN_TOKENS: Record<PersonalGrowthDomain, DomainToken> = {
  body: {
    key: "body",
    label: "Body",
    tagline: "Move, fuel, and rest the machine.",
    icon: Dumbbell,
    hex: "#078a52",
    ringClass: "ring-[#078a52]",
    solidClass: "bg-[#078a52] text-white shadow-[#078a52]/30",
    softClass: "bg-[#078a52]/15 text-[#078a52] dark:text-[#3fd99a]",
    softHoverClass: "hover:bg-[#078a52]/25",
    borderClass: "border-[#078a52]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(7,138,82,0.35)]",
  },
  being: {
    key: "being",
    label: "Being",
    tagline: "Grow the inner life.",
    icon: LatinCross,
    hex: "#43089f",
    ringClass: "ring-[#43089f]",
    solidClass: "bg-[#43089f] text-white shadow-[#43089f]/30",
    softClass: "bg-[#43089f]/15 text-[#43089f] dark:text-[#b48cff]",
    softHoverClass: "hover:bg-[#43089f]/25",
    borderClass: "border-[#43089f]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(67,8,159,0.35)]",
  },
  balance: {
    key: "balance",
    label: "Balance",
    tagline: "Tend relationships and the life outside work.",
    icon: Heart,
    hex: "#fc7981",
    ringClass: "ring-[#fc7981]",
    solidClass: "bg-[#fc7981] text-white shadow-[#fc7981]/30",
    softClass: "bg-[#fc7981]/15 text-[#fc7981] dark:text-[#fda4aa]",
    softHoverClass: "hover:bg-[#fc7981]/25",
    borderClass: "border-[#fc7981]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(252,121,129,0.35)]",
  },
  business: {
    key: "business",
    label: "Business",
    tagline: "Build the craft and the company.",
    icon: Briefcase,
    hex: "#0089ad",
    ringClass: "ring-[#0089ad]",
    solidClass: "bg-[#0089ad] text-white shadow-[#0089ad]/30",
    softClass: "bg-[#0089ad]/15 text-[#0089ad] dark:text-[#53c8e7]",
    softHoverClass: "hover:bg-[#0089ad]/25",
    borderClass: "border-[#0089ad]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(0,137,173,0.35)]",
  },
};

export const DOMAIN_ORDER: PersonalGrowthDomain[] = [
  "body",
  "being",
  "balance",
  "business",
];

export function getDomainToken(
  key: string | null | undefined,
): DomainToken | null {
  if (!key) return null;
  const normalized = key.toLowerCase() as PersonalGrowthDomain;
  return DOMAIN_TOKENS[normalized] ?? null;
}

// Cadence accents — time-horizon framing, distinct from the four life domains.
export type CadenceKey = "today" | "quarter" | "month";

export const CADENCE_TOKENS: Record<CadenceKey, DomainToken> = {
  today: {
    key: "today",
    label: "Today",
    tagline: "What moves the needle right now.",
    icon: Briefcase,
    hex: "#af0000",
    ringClass: "ring-[#af0000]",
    solidClass: "bg-[#af0000] text-white shadow-[#af0000]/30",
    softClass: "bg-[#af0000]/15 text-[#af0000] dark:text-[#ff6b6b]",
    softHoverClass: "hover:bg-[#af0000]/25",
    borderClass: "border-[#af0000]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(175,0,0,0.35)]",
  },
  quarter: {
    key: "quarter",
    label: "Quarter",
    tagline: "Keep the longer horizon visible.",
    icon: CalendarRange,
    hex: "#64748b",
    ringClass: "ring-[#64748b]",
    solidClass: "bg-[#64748b] text-white shadow-[#64748b]/30",
    softClass: "bg-[#64748b]/15 text-[#475569] dark:text-[#cbd5e1]",
    softHoverClass: "hover:bg-[#64748b]/25",
    borderClass: "border-[#64748b]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(100,116,139,0.35)]",
  },
  month: {
    key: "month",
    label: "Month",
    tagline: "Turn direction into this month's focus.",
    icon: CalendarRange,
    hex: "#64748b",
    ringClass: "ring-[#64748b]",
    solidClass: "bg-[#64748b] text-white shadow-[#64748b]/30",
    softClass: "bg-[#64748b]/15 text-[#475569] dark:text-[#cbd5e1]",
    softHoverClass: "hover:bg-[#64748b]/25",
    borderClass: "border-[#64748b]/40",
    glowClass: "shadow-[0_0_0_1px_rgba(100,116,139,0.35)]",
  },
};

export function getAccentToken(
  key: PersonalGrowthDomain | CadenceKey,
): DomainToken {
  if (key in CADENCE_TOKENS) {
    return CADENCE_TOKENS[key as CadenceKey];
  }
  return DOMAIN_TOKENS[key as PersonalGrowthDomain];
}
