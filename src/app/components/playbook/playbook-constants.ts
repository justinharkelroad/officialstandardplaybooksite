import { Dumbbell, Heart, Briefcase } from "lucide-react";
import { LatinCross } from "@/app/components/icons/LatinCross";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";

export const domainConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  body: { label: "BODY", icon: Dumbbell, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
  being: { label: "BEING", icon: LatinCross, color: "text-purple-600", bg: "bg-purple-500/10 border-purple-500/20" },
  balance: { label: "BALANCE", icon: Heart, color: "text-rose-600", bg: "bg-rose-500/10 border-rose-500/20" },
  business: { label: "BIZ", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/20" },
};

export const domainLabel = (domain: PlaybookDomain | string | null): string | null => {
  if (!domain) return null;
  return domainConfig[domain]?.label ?? null;
};
