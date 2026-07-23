import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  Circle,
  Compass,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/app/lib/auth";
import { useCore4Stats } from "@/app/hooks/useCore4Stats";
import { useFlowStats } from "@/app/hooks/useFlowStats";
import { useFocusItems } from "@/app/hooks/useFocusItems";
import { useQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { getCurrentQuarter } from "@/app/lib/quarterUtils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function OnboardingChecklist() {
  const { user, member } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const core4 = useCore4Stats();
  const flows = useFlowStats();
  const { items } = useFocusItems();
  const { data: targets } = useQuarterlyTargets(getCurrentQuarter());
  const [monthlyMissionCount, setMonthlyMissionCount] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const storageKey = `sp-onboarding-dismissed:${user?.id ?? "unknown"}`;

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  useEffect(() => {
    const shouldOpen = new URLSearchParams(location.search).get("setup") === "1";
    if (!shouldOpen) return;

    setDismissed(false);
    setExpanded(true);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // The guide still opens for this session.
    }
    navigate("/app", { replace: true });
  }, [location.search, navigate, storageKey]);

  useEffect(() => {
    let cancelled = false;

    const loadMonthlyMissions = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("core4_monthly_missions")
        .select("domain")
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq("month_year", format(new Date(), "yyyy-MM"));

      if (!cancelled) {
        setMonthlyMissionCount(new Set((data ?? []).map((row) => row.domain)).size);
      }
    };

    void loadMonthlyMissions();
    return () => {
      cancelled = true;
    };
  }, [user?.id, targets?.updated_at]);

  const targetCount = useMemo(() => {
    if (!targets) return 0;
    return [
      targets.body_target,
      targets.being_target,
      targets.balance_target,
      targets.business_target,
    ].filter(Boolean).length;
  }, [targets]);

  const checklist = [
    {
      label: "Make today real",
      detail: "Check off one Core Four domain for a quick first win.",
      to: "/app/core4",
      action: "Open Daily",
      complete: core4.todayPoints > 0,
    },
    {
      label: "Set your direction",
      detail: "Create one quarterly target in each Core Four domain.",
      to: "/app/life-targets",
      action: "Build Quarterly",
      complete: targetCount === 4,
    },
    {
      label: "Give this month a job",
      detail: "Approve or write at least one live monthly mission.",
      to: "/app/monthly-missions",
      action: "Set This Month",
      complete: monthlyMissionCount > 0,
    },
    {
      label: "Choose the next move",
      detail: "Put one meaningful item on your Weekly Bench.",
      to: "/app/weekly-playbook",
      action: "Open Weekly",
      complete: items.length > 0,
    },
    {
      label: "Use your coach",
      detail: "Complete your first guided Flow.",
      to: "/app/flows",
      action: "Start a Flow",
      complete: flows.totalFlows > 0,
    },
  ];

  const completed = checklist.filter((item) => item.complete).length;
  const progress = (completed / checklist.length) * 100;
  const nextItem = checklist.find((item) => !item.complete);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // Dismissal just will not persist in private mode.
    }
  }, [storageKey]);

  if (dismissed) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setDismissed(false);
          setExpanded(true);
        }}
        className="gap-2"
      >
        <Compass className="h-4 w-4" />
        Open setup guide
      </Button>
    );
  }

  return (
    <section className="border-[1.5px] border-foreground bg-card" aria-labelledby="setup-guide-title">
      <div className="flex items-start gap-4 border-b border-foreground/20 p-4 sm:p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-foreground text-background">
          <Compass className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="sp-label text-[9px] text-[#2997FF]">Start here</p>
              <h2 id="setup-guide-title" className="mt-1 text-2xl">
                Build your operating rhythm
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Welcome{member?.full_name ? `, ${member.full_name.split(" ")[0]}` : ""}. One useful
                action at each speed is enough to make the system yours.
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                className="gap-2"
              >
                {completed}/{checklist.length}
                <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={dismiss}
                aria-label="Dismiss setup guide"
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-1.5" />
        </div>
      </div>

      {expanded ? (
        <div className="grid gap-px bg-foreground/15 sm:grid-cols-2 lg:grid-cols-5">
          {checklist.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "group flex min-h-44 flex-col bg-card p-4 transition-colors hover:bg-muted/50",
                !item.complete && item === nextItem && "ring-2 ring-inset ring-[#2997FF]",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="sp-label text-[9px] text-muted-foreground">
                  Step {index + 1}
                </span>
                {item.complete ? (
                  <span className="flex h-6 w-6 items-center justify-center bg-[#2997FF] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <Circle className="h-5 w-5 text-foreground/25" />
                )}
              </div>
              <h3 className="mt-4 text-lg">{item.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
              <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#2997FF]">
                {item.complete ? "Review" : item.action}
              </span>
            </Link>
          ))}
        </div>
      ) : nextItem ? (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            <Sparkles className="mr-2 inline h-4 w-4 text-[#2997FF]" />
            Next: <span className="font-semibold">{nextItem.label}</span>
          </p>
          <Button asChild size="sm">
            <Link to={nextItem.to}>{nextItem.action}</Link>
          </Button>
        </div>
      ) : (
        <div className="p-4 text-sm font-medium">
          Your operating rhythm is live. Keep using the Hub to choose the next useful move.
        </div>
      )}
    </section>
  );
}
