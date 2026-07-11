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

// Brand palette: black, white, blue. Nothing else.
// The four domains are told apart by icon and label — not by hue — so the app
// reads as one brand instead of a rainbow dashboard. Blue is reserved for
// "done / active"; ink and paper carry everything else.
const BLUE = "#2997FF";

const brandToken = (
  key: PersonalGrowthDomain | CadenceKey,
  label: string,
  tagline: string,
  icon: LucideIcon | typeof LatinCross,
): DomainToken => ({
  key,
  label,
  tagline,
  icon,
  hex: BLUE,
  ringClass: "ring-[#2997FF]",
  solidClass: "bg-[#2997FF] text-white",
  softClass: "bg-[#2997FF]/12 text-[#2997FF]",
  softHoverClass: "hover:bg-[#2997FF]/20",
  borderClass: "border-foreground/25",
  glowClass: "shadow-none",
});

export const DOMAIN_TOKENS: Record<PersonalGrowthDomain, DomainToken> = {
  body: brandToken("body", "Body", "Move, fuel, and rest the machine.", Dumbbell),
  being: brandToken("being", "Being", "Grow the inner life.", LatinCross),
  balance: brandToken(
    "balance",
    "Balance",
    "Tend relationships and the life outside work.",
    Heart,
  ),
  business: brandToken(
    "business",
    "Business",
    "Build the craft and the company.",
    Briefcase,
  ),
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
// "Today" is the only one that earns the blue; the longer horizons stay ink.
export type CadenceKey = "today" | "quarter" | "month";

const inkToken = (
  key: CadenceKey,
  label: string,
  tagline: string,
  icon: LucideIcon,
): DomainToken => ({
  key,
  label,
  tagline,
  icon,
  hex: "#0A0A0B",
  ringClass: "ring-foreground",
  solidClass: "bg-foreground text-background",
  softClass: "bg-foreground/10 text-foreground",
  softHoverClass: "hover:bg-foreground/15",
  borderClass: "border-foreground/25",
  glowClass: "shadow-none",
});

export const CADENCE_TOKENS: Record<CadenceKey, DomainToken> = {
  today: brandToken("today", "Today", "What moves the needle right now.", Briefcase),
  quarter: inkToken(
    "quarter",
    "Quarter",
    "Keep the longer horizon visible.",
    CalendarRange,
  ),
  month: inkToken(
    "month",
    "Month",
    "Turn direction into this month's focus.",
    CalendarRange,
  ),
};

export function getAccentToken(
  key: PersonalGrowthDomain | CadenceKey,
): DomainToken {
  if (key in CADENCE_TOKENS) {
    return CADENCE_TOKENS[key as CadenceKey];
  }
  return DOMAIN_TOKENS[key as PersonalGrowthDomain];
}
