import { cn } from "@/lib/utils";
import { Heart, Brain, Scale, Briefcase } from "lucide-react";

const DOMAINS = [
  { key: "body", label: "Body", icon: Heart, color: "bg-[#2997FF]/20 text-[#2997FF] border-[#2997FF]/30" },
  { key: "being", label: "Being", icon: Brain, color: "bg-[#2997FF]/20 text-[#2997FF] border-[#2997FF]/30" },
  { key: "balance", label: "Balance", icon: Scale, color: "bg-[#2997FF]/20 text-[#2997FF] border-[#2997FF]/30" },
  { key: "business", label: "Business", icon: Briefcase, color: "bg-[#2997FF]/20 text-[#2997FF] border-[#2997FF]/30" },
] as const;

interface DebriefDomainTabsProps {
  activeDomain: string;
  onDomainChange: (domain: string) => void;
  completedDomains?: string[];
}

export function DebriefDomainTabs({ activeDomain, onDomainChange, completedDomains = [] }: DebriefDomainTabsProps) {
  return (
    <div className="flex gap-2">
      {DOMAINS.map(({ key, label, icon: Icon, color }) => {
        const isActive = activeDomain === key;
        const isCompleted = completedDomains.includes(key);

        return (
          <button
            key={key}
            onClick={() => onDomainChange(key)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all",
              isActive
                ? color + " border-current"
                : "bg-foreground/5 text-muted-foreground border-border hover:bg-foreground/10"
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {isCompleted && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2997FF] rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
