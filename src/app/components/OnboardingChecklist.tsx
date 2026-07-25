import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  Circle,
  Compass,
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
  const { items, isPending: focusItemsPending } = useFocusItems();
  const { data: targets, isPending: targetsPending } = useQuarterlyTargets(getCurrentQuarter());
  const [monthlyMissionCount, setMonthlyMissionCount] = useState(0);
  const [monthlyMissionsLoading, setMonthlyMissionsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [forcedOpen, setForcedOpen] = useState(false);
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [viewInitialized, setViewInitialized] = useState(false);

  const dismissedStorageKey = `sp-onboarding-dismissed:${user?.id ?? "unknown"}`;
  const expandedStorageKey = `sp-onboarding-expanded:${user?.id ?? "unknown"}`;

  useEffect(() => {
    if (!user?.id) return;

    setViewInitialized(false);
    try {
      setDismissed(localStorage.getItem(dismissedStorageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [dismissedStorageKey, user?.id]);

  useEffect(() => {
    const shouldOpen = new URLSearchParams(location.search).get("setup") === "1";
    if (!shouldOpen) return;

    setDismissed(false);
    setExpanded(true);
    setForcedOpen(true);
    setViewInitialized(true);
    try {
      localStorage.removeItem(dismissedStorageKey);
    } catch {
      // The guide still opens for this session.
    }
    navigate("/app", { replace: true });
  }, [dismissedStorageKey, location.search, navigate]);

  useEffect(() => {
    let cancelled = false;

    const loadMonthlyMissions = async () => {
      if (!user?.id) {
        if (!cancelled) setMonthlyMissionsLoading(false);
        return;
      }

      setMonthlyMissionsLoading(true);
      try {
        const { data } = await supabase
          .from("core4_monthly_missions")
          .select("domain")
          .eq("user_id", user.id)
          .eq("status", "active")
          .eq("month_year", format(new Date(), "yyyy-MM"));

        if (!cancelled) {
          setMonthlyMissionCount(new Set((data ?? []).map((row) => row.domain)).size);
        }
      } finally {
        if (!cancelled) setMonthlyMissionsLoading(false);
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
  const checklistReady =
    !core4.loading &&
    !flows.loading &&
    !focusItemsPending &&
    !targetsPending &&
    !monthlyMissionsLoading;

  useEffect(() => {
    if (!checklistReady || dismissed !== false || forcedOpen) return;

    if (completed === checklist.length) {
      setExpanded(false);
      setViewInitialized(true);
      return;
    }

    try {
      setExpanded(localStorage.getItem(expandedStorageKey) !== "0");
    } catch {
      setExpanded(true);
    }
    setViewInitialized(true);
  }, [
    checklist.length,
    checklistReady,
    completed,
    dismissed,
    expandedStorageKey,
    forcedOpen,
  ]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setForcedOpen(false);
    try {
      localStorage.setItem(dismissedStorageKey, "1");
    } catch {
      // Dismissal just will not persist in private mode.
    }
  }, [dismissedStorageKey]);

  const toggleExpanded = useCallback(() => {
    setForcedOpen(false);
    setExpanded((value) => {
      const nextValue = !value;
      try {
        localStorage.setItem(expandedStorageKey, nextValue ? "1" : "0");
      } catch {
        // Expansion state just will not persist in private mode.
      }
      return nextValue;
    });
  }, [expandedStorageKey]);

  if (dismissed === null || dismissed || !checklistReady || !viewInitialized) return null;

  if (!expanded) {
    const compactTitle = nextItem?.label ?? "Your operating rhythm is live";
    const compactLabel = nextItem
      ? `Next step · ${completed}/${checklist.length}`
      : `Setup complete · ${completed}/${checklist.length}`;

    return (
      <section
        className="border-[1.5px] border-foreground bg-card"
        aria-labelledby="setup-guide-title"
      >
        <div className="flex min-w-0 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-foreground text-background">
              {nextItem ? <Compass className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </span>
            <div className="min-w-0">
              <p className="sp-label text-[9px] text-[#2997FF]">{compactLabel}</p>
              <h2 id="setup-guide-title" className="mt-1 truncate text-lg">
                {compactTitle}
              </h2>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:shrink-0">
            {nextItem ? (
              <Button asChild size="sm" className="min-h-10 flex-1 sm:flex-none">
                <Link to={nextItem.to}>{nextItem.action}</Link>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
              aria-expanded={false}
              aria-controls="setup-guide-steps"
              className="min-h-10 flex-1 gap-2 sm:flex-none"
            >
              Review guide
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={dismiss}
              aria-label="Hide setup guide"
              title="Hide setup guide. Reopen it from How It Works."
              className="min-h-10 gap-2 px-3"
            >
              <X className="h-4 w-4" />
              <span className="hidden lg:inline">Hide guide</span>
            </Button>
          </div>
        </div>
      </section>
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
                onClick={toggleExpanded}
                aria-expanded={true}
                aria-controls="setup-guide-steps"
                className="gap-2"
              >
                {completed}/{checklist.length}
                <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={dismiss}
                aria-label="Hide setup guide"
                title="Hide setup guide. Reopen it from How It Works."
                className="gap-2 px-3"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Hide guide</span>
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-1.5" />
        </div>
      </div>

      <div
        id="setup-guide-steps"
        className="grid gap-px bg-foreground/15 sm:grid-cols-2 lg:grid-cols-5"
      >
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
    </section>
  );
}
