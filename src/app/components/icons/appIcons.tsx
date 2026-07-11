// Line-icon vocabulary for the member app.
//
// The Flows feature already speaks in stroked, currentColor line icons
// (icons/brain, hand-heart, telescope…). Everything else used to fall back to
// cartoon emoji (💪 ✝️ 🔥 💎 👑 🎉), which read as a different product. These
// are the lucide equivalents in the same language: stroke-only, inherit color,
// so they pick up the black/white/blue palette automatically.
import {
  Award,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Headphones,
  Heart,
  Library,
  PartyPopper,
  Scale,
  Sparkles,
  Star,
  Tag,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LatinCross } from "@/app/components/icons/LatinCross";
import { cn } from "@/lib/utils";

export type DomainKey = "body" | "being" | "balance" | "business";

/** Core 4 domains — same glyphs the hub's domain tokens use. */
export const DOMAIN_ICONS: Record<DomainKey, LucideIcon | typeof LatinCross> = {
  body: Dumbbell,
  being: LatinCross,
  balance: Heart,
  business: Briefcase,
};

/** Milestones and status, replacing 🔥 ⭐ 💎 👑 🎉 ✅ ⚠️ 🧠 📚 📊 🎧. */
export const APP_ICONS = {
  streak: Flame,
  star: Star,
  gem: Gem,
  crown: Crown,
  celebrate: PartyPopper,
  success: CheckCircle2,
  warning: TriangleAlert,
  reflect: Sparkles,
  library: Library,
  metric: Tag,
  headphones: Headphones,
  award: Award,
  verified: BadgeCheck,
} satisfies Record<string, LucideIcon>;

export type AppIconKey = keyof typeof APP_ICONS;

/** Renders a domain glyph inline, sized to the surrounding text. */
export function DomainIcon({
  domain,
  className,
}: {
  domain: string;
  className?: string;
}) {
  const Icon = DOMAIN_ICONS[domain.toLowerCase() as DomainKey];
  if (!Icon) return null;
  return <Icon className={cn("h-4 w-4 shrink-0", className)} aria-hidden />;
}

/** Renders a status/milestone glyph inline, sized to the surrounding text. */
export function AppIcon({
  name,
  className,
}: {
  name: AppIconKey;
  className?: string;
}) {
  const Icon = APP_ICONS[name];
  return <Icon className={cn("h-4 w-4 shrink-0", className)} aria-hidden />;
}
