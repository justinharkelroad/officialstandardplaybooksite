import { ArrowRight, CalendarRange, CheckCircle2, ListChecks, Rocket, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type Cadence = "quarterly" | "monthly" | "weekly" | "daily";

const CADENCE_ITEMS = [
  {
    key: "quarterly" as const,
    label: "Quarterly",
    outcome: "Direction",
    to: "/app/life-targets",
    icon: CalendarRange,
  },
  {
    key: "monthly" as const,
    label: "This Month",
    outcome: "Focus",
    to: "/app/monthly-missions",
    icon: Rocket,
  },
  {
    key: "weekly" as const,
    label: "Weekly",
    outcome: "Plays",
    to: "/app/weekly-playbook",
    icon: ListChecks,
  },
  {
    key: "daily" as const,
    label: "Daily",
    outcome: "Proof",
    to: "/app/core4",
    icon: Sun,
  },
];

type CadenceMapProps = {
  active?: Cadence;
  compact?: boolean;
  className?: string;
  completed?: Partial<Record<Cadence, boolean>>;
  showHandoffNote?: boolean;
};

export function CadenceMap({
  active,
  compact = false,
  className,
  completed,
  showHandoffNote = false,
}: CadenceMapProps) {
  return (
    <div
      className={cn(
        "border-[1.5px] border-foreground bg-card",
        compact ? "p-3" : "p-4 sm:p-5",
        className,
      )}
      aria-label="Standard Playbook planning cadence"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="sp-label text-[9px] text-foreground/50">The operating rhythm</p>
          {!compact ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Direction becomes focus, focus becomes a plan, and the plan becomes proof.
            </p>
          ) : null}
        </div>
        {showHandoffNote ? (
          <span className="text-[11px] text-muted-foreground">
            Quarterly seeds This Month. You choose what moves into Weekly and Daily.
          </span>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {CADENCE_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          const isComplete = completed?.[item.key];

          return (
            <div key={item.key} className="contents">
              <Link
                to={item.to}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group flex min-h-16 items-center gap-3 border px-3 py-2 transition-colors",
                  isActive
                    ? "border-[#2997FF] bg-[#2997FF] text-white"
                    : "border-foreground/20 bg-background/40 text-foreground hover:border-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center border",
                    isActive ? "border-white/50" : "border-foreground/20",
                  )}
                >
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="min-w-0">
                  <span className="sp-label block text-[9px] opacity-65">{item.outcome}</span>
                  <span className="block text-sm font-semibold uppercase tracking-[0.05em]">
                    {item.label}
                  </span>
                </span>
              </Link>
              {index < CADENCE_ITEMS.length - 1 ? (
                <ArrowRight
                  className="hidden h-4 w-4 self-center text-foreground/35 sm:block"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
