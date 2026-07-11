import { DomainCascadeCard } from "./DomainCascadeCard";
import type { QuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { formatQuarterDisplay } from "@/app/lib/quarterUtils";

interface CascadeViewProps {
  targets: QuarterlyTargets;
  selectedDailyActions: Record<string, string[]>;
  quarter: string;
}

const DOMAINS = [
  { 
    key: 'body', 
    label: 'Body', 
    color: 'border-[#2997FF]/50 bg-[#2997FF]/5',
    textColor: 'text-[#2997FF] dark:text-[#2997FF]'
  },
  { 
    key: 'being', 
    label: 'Being', 
    color: 'border-[#2997FF]/50 bg-[#2997FF]/5',
    textColor: 'text-[#2997FF] dark:text-[#2997FF]'
  },
  { 
    key: 'balance', 
    label: 'Balance', 
    color: 'border-[#2997FF]/50 bg-[#2997FF]/5',
    textColor: 'text-[#2997FF] dark:text-[#2997FF]'
  },
  { 
    key: 'business', 
    label: 'Business', 
    color: 'border-[#2997FF]/50 bg-[#2997FF]/5',
    textColor: 'text-[#2997FF] dark:text-[#2997FF]'
  },
] as const;

export function CascadeView({ targets, selectedDailyActions, quarter }: CascadeViewProps) {
  return (
    <div className="space-y-6">
      {/* Quarter Info */}
      <div className="bg-muted/50 rounded-lg p-4 border">
        <h2 className="text-lg font-semibold mb-1">Planning Period</h2>
        <p className="text-muted-foreground">{formatQuarterDisplay(quarter)} - Your 90-Day Focus</p>
      </div>

      {/* Domain Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {DOMAINS.map((domain) => {
          const primaryIsTarget1 = targets[`${domain.key}_primary_is_target1` as keyof QuarterlyTargets] ?? true;
          const primaryTarget = primaryIsTarget1 
            ? targets[`${domain.key}_target` as keyof QuarterlyTargets]
            : targets[`${domain.key}_target2` as keyof QuarterlyTargets];
          const primaryNarrative = primaryIsTarget1
            ? targets[`${domain.key}_narrative` as keyof QuarterlyTargets]
            : targets[`${domain.key}_narrative2` as keyof QuarterlyTargets];

          // Extract the correct missions subset (target1 or target2)
          const monthlyAll = targets[`${domain.key}_monthly_missions` as keyof QuarterlyTargets] as any;
          const selectedMissions = monthlyAll ? (primaryIsTarget1 ? monthlyAll.target1 : monthlyAll.target2) : null;

          // Skip if no primary target
          if (!primaryTarget) return null;

          return (
            <DomainCascadeCard
              key={domain.key}
              domainKey={domain.key}
              domainLabel={domain.label}
              color={domain.color}
              textColor={domain.textColor}
              quarterlyTarget={primaryTarget as string}
              narrative={primaryNarrative as string}
              monthlyMissions={selectedMissions}
              dailyActions={selectedDailyActions[domain.key] || []}
              currentTargets={targets}
              quarter={quarter}
            />
          );
        })}
      </div>
    </div>
  );
}
