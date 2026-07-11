import { Dumbbell, Heart, Briefcase } from "lucide-react";
import { LatinCross } from "@/app/components/icons/LatinCross";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";

export const domainConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  body: { label: "BODY", icon: Dumbbell, color: "text-[#2997FF]", bg: "bg-[#2997FF]/10 border-[#2997FF]/20" },
  being: { label: "BEING", icon: LatinCross, color: "text-[#2997FF]", bg: "bg-[#2997FF]/10 border-[#2997FF]/20" },
  balance: { label: "BALANCE", icon: Heart, color: "text-[#2997FF]", bg: "bg-[#2997FF]/10 border-[#2997FF]/20" },
  business: { label: "BIZ", icon: Briefcase, color: "text-[#2997FF]", bg: "bg-[#2997FF]/10 border-[#2997FF]/20" },
};

export const domainLabel = (domain: PlaybookDomain | string | null): string | null => {
  if (!domain) return null;
  return domainConfig[domain]?.label ?? null;
};
