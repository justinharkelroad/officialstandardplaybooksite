import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AudioLines,
  CalendarRange,
  ClipboardEdit,
  Rocket,
} from "lucide-react";
import { DebriefSundayBanner } from "@/app/components/dashboard/DebriefSundayBanner";
import { TodaysPowerPlays } from "@/app/components/playbook/TodaysPowerPlays";
import { TodayRhythmHero } from "@/app/components/personal-growth/TodayRhythmHero";
import { PersonalGrowthPod } from "@/app/components/personal-growth/PersonalGrowthPod";
import { DailyFrameWidget } from "@/app/components/daily-frame/DailyFrameWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import {
  formatQuarterDisplay,
  getCurrentQuarter,
} from "@/app/lib/quarterUtils";
import { getDebriefWeekKey } from "@/app/lib/date-utils";
import { cn } from "@/lib/utils";
import { getDomainToken } from "@/app/components/personal-growth/domainTokens";
import { getPersonalGrowthFocusLabel } from "@/app/lib/personalGrowthFocusLabel";
import { resolvePrimaryTargetsFromQuarterly } from "@/app/lib/quarterlyTargetSelection";

type MissionRow = {
  id: string;
  domain: string;
  mission: string;
  why: string;
  updated_at: string | null;
  created_at: string | null;
};

const DOMAIN_LABELS: Record<string, string> = {
  body: "Body",
  being: "Being",
  balance: "Balance",
  business: "Business",
};

const DOMAIN_ORDER = ["body", "being", "balance", "business"];

function missionTimestamp(row: Pick<MissionRow, "updated_at" | "created_at">) {
  const timestamp = new Date(row.updated_at ?? row.created_at ?? 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function dedupeMonthlyMissionRows(rows: MissionRow[]) {
  const latestByDomain = new Map<string, MissionRow>();

  for (const row of rows) {
    const existing = latestByDomain.get(row.domain);
    const isNewer =
      existing &&
      (missionTimestamp(row) > missionTimestamp(existing) ||
        (missionTimestamp(row) === missionTimestamp(existing) && row.id > existing.id));

    if (!existing || isNewer) {
      latestByDomain.set(row.domain, row);
    }
  }

  return [...latestByDomain.values()].sort((a, b) => {
    const aDomainIndex = DOMAIN_ORDER.includes(a.domain)
      ? DOMAIN_ORDER.indexOf(a.domain)
      : DOMAIN_ORDER.length;
    const bDomainIndex = DOMAIN_ORDER.includes(b.domain)
      ? DOMAIN_ORDER.indexOf(b.domain)
      : DOMAIN_ORDER.length;
    const domainDiff = aDomainIndex - bDomainIndex;
    if (domainDiff !== 0) return domainDiff;
    return missionTimestamp(b) - missionTimestamp(a);
  });
}

function FocusAccordionCard({
  value,
  domain,
  statement,
  detail,
  emptyCopy,
}: {
  value: string;
  domain: string;
  statement: string | null | undefined;
  detail?: string;
  emptyCopy: string;
}) {
  const token = getDomainToken(domain);
  const Icon = token?.icon;
  const focusLabel = getPersonalGrowthFocusLabel(domain, statement);

  return (
    <AccordionItem
      value={value}
      className={cn(
        "h-full overflow-hidden rounded-xl border bg-muted/20",
        token?.borderClass,
      )}
    >
      <AccordionTrigger className="min-h-28 px-4 py-4 text-left hover:no-underline">
        <div className="flex min-w-0 items-center gap-3 pr-3">
          {Icon ? (
            <span
              aria-hidden="true"
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                token?.softClass,
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {DOMAIN_LABELS[domain] ?? domain}
            </p>
            <p className="mt-1 line-clamp-2 text-lg font-semibold uppercase leading-tight tracking-[0.04em] text-foreground">
              {focusLabel}
            </p>
            <p className="mt-1 text-xs font-normal text-muted-foreground">
              Expand for the full statement
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border/50 px-4 pt-4">
        <p className="text-sm font-medium leading-6">
          {statement?.trim() || emptyCopy}
        </p>
        {detail ? (
          <div className="mt-3 rounded-lg bg-background/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Weekly measure
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}

function SectionHeading({
  label,
  meta,
}: {
  label: string;
  meta?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-[1.5px] border-[#0A0A0B] pb-3">
      <h2 className="text-[clamp(28px,3.6vw,44px)] text-[#0A0A0B]">
        {label}
      </h2>
      {meta ? (
        <span className="sp-label pb-1 text-[11px] text-[#0A0A0B]/55">
          &bull;&nbsp;&nbsp;{meta}
        </span>
      ) : null}
    </div>
  );
}

type DebriefStatus = "completed" | "in_progress" | "not_started" | "loading";

function DebriefPod() {
  const { user } = useAuth();
  const [status, setStatus] = useState<DebriefStatus>("loading");
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const weekKey = useMemo(() => getDebriefWeekKey(today), [today]);
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      if (!user?.id) {
        if (!cancelled) setStatus("not_started");
        return;
      }

      const { data, error } = await supabase
        .from("weekly_reviews")
        .select("status, completed_at")
        .eq("user_id", user.id)
        .eq("week_key", weekKey)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Failed to load debrief status:", error);
        setStatus("not_started");
        return;
      }

      if (!data) {
        setStatus("not_started");
        setCompletedAt(null);
        return;
      }

      setStatus(
        data.status === "completed" ? "completed" : "in_progress",
      );
      setCompletedAt(data.completed_at ?? null);
    };

    void fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [user?.id, weekKey]);

  const statusCopy: Record<DebriefStatus, { eyebrow: string; body: string }> = {
    loading: { eyebrow: "Loading…", body: "" },
    not_started: {
      eyebrow: "Weekly reflection",
      body: "Close the loop on last week and set next week's One Big Thing.",
    },
    in_progress: {
      eyebrow: "In progress",
      body: "Pick up where you left off in the Debrief wizard.",
    },
    completed: {
      eyebrow: "Completed",
      body: completedAt
        ? `Finished ${format(new Date(completedAt), "MMM d")}. Your coaching analysis is ready.`
        : "Your coaching analysis is ready.",
    },
  };

  const { eyebrow, body } = statusCopy[status];
  const canOpen = isWeekend || status === "completed";

  return (
    <PersonalGrowthPod
      title="Weekly Debrief"
      tagline="Reflect on the week, then plan the next."
      icon={ClipboardEdit}
      accent="month"
      iconAccent="business"
      active={status === "completed" || status === "in_progress"}
      className="h-full"
      badge={
        <Badge
          variant={status === "completed" ? "default" : "secondary"}
          className="shrink-0"
        >
          {status === "completed"
            ? "Done"
            : !isWeekend
              ? "Weekend only"
              : status === "in_progress"
              ? "In progress"
              : status === "loading"
                ? "…"
                : "Open now"}
        </Badge>
      }
      cta={
        canOpen
          ? {
              to: "/app/debrief",
              label:
                status === "completed"
                  ? "Review this week's debrief"
                  : status === "in_progress"
                    ? "Continue debrief"
                    : "Start Weekly Debrief",
            }
          : undefined
      }
    >
      <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        {body ? (
          <p className="mt-1 text-sm">{body}</p>
        ) : null}
      </div>
      {!canOpen ? (
        <Button
          type="button"
          variant="outline"
          disabled
          aria-label="Start Weekly Debrief — available Saturday and Sunday"
          className="mt-auto w-full justify-start border-[#64748b]/40 bg-[#64748b]/10 text-[#475569] disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#cbd5e1]"
        >
          Start Weekly Debrief
        </Button>
      ) : null}
    </PersonalGrowthPod>
  );
}

function MonthlyMissionsPod() {
  const { user } = useAuth();
  const [missionRows, setMissionRows] = useState<MissionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMissions, setExpandedMissions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchMissions = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setMissionRows([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      const monthYear = format(new Date(), "yyyy-MM");
      const { data, error } = await supabase
        .from("core4_monthly_missions")
        .select("id, domain, title, weekly_measurable, updated_at, created_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq("month_year", monthYear)
        .order("domain")
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (error) {
        console.error("Failed to load monthly missions:", error);
      }

      if (!cancelled) {
        setMissionRows(
          dedupeMonthlyMissionRows((data || []).map((mission) => ({
            id: mission.id,
            domain: mission.domain,
            mission: mission.title,
            why: mission.weekly_measurable ?? "",
            updated_at: mission.updated_at ?? null,
            created_at: mission.created_at ?? null,
          }))),
        );
        setIsLoading(false);
      }
    };

    void fetchMissions();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const missionValues = useMemo(
    () =>
      missionRows
        .slice(0, 4)
        .map((row, index) => `mission-${row.domain}-${index}`),
    [missionRows],
  );
  const allMissionsExpanded =
    missionValues.length > 0 &&
    missionValues.every((value) => expandedMissions.includes(value));

  return (
    <PersonalGrowthPod
      title="Monthly Missions"
      tagline="One mission per domain, built on your quarterly targets."
      icon={Rocket}
      accent="month"
      badge={
        <Badge variant="secondary" className="shrink-0">
          {missionRows.length}/4 set
        </Badge>
      }
      cta={{ to: "/app/monthly-missions", label: "Open Monthly Missions" }}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Loading monthly missions…
        </p>
      ) : missionRows.length > 0 ? (
        <div className="space-y-2">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              aria-label={
                allMissionsExpanded
                  ? "Collapse all monthly missions"
                  : "Expand all monthly missions"
              }
              onClick={() =>
                setExpandedMissions(allMissionsExpanded ? [] : missionValues)
              }
            >
              {allMissionsExpanded ? "Collapse all" : "Expand all"}
            </Button>
          </div>
          <Accordion
            type="multiple"
            value={expandedMissions}
            onValueChange={setExpandedMissions}
            className="grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2"
          >
            {missionRows.slice(0, 4).map((row, index) => {
              return (
                <FocusAccordionCard
                  key={`${row.domain}-${index}`}
                  value={`mission-${row.domain}-${index}`}
                  domain={row.domain}
                  statement={row.mission}
                  detail={row.why}
                  emptyCopy="No monthly mission set yet."
                />
              );
            })}
          </Accordion>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No monthly missions set yet. Pick one mission per domain to anchor
          this month.
        </p>
      )}
    </PersonalGrowthPod>
  );
}

function QuarterlyTargetsPod() {
  const currentQuarter = getCurrentQuarter();
  const { data: targets, isLoading } = useQuarterlyTargets(currentQuarter);
  const [expandedTargets, setExpandedTargets] = useState<string[]>([]);

  const targetRows = useMemo(() => {
    if (!targets) return [];
    const primaryTargets = resolvePrimaryTargetsFromQuarterly(targets);
    return [
      { key: "body", value: primaryTargets.body },
      { key: "being", value: primaryTargets.being },
      { key: "balance", value: primaryTargets.balance },
      { key: "business", value: primaryTargets.business },
    ];
  }, [targets]);
  const setTargetCount = targetRows.filter((row) => Boolean(row.value)).length;
  const targetValues = targetRows.map((row) => `target-${row.key}`);
  const allTargetsExpanded =
    targetValues.length > 0 &&
    targetValues.every((value) => expandedTargets.includes(value));

  return (
    <PersonalGrowthPod
      title="Quarterly Targets"
      tagline={formatQuarterDisplay(currentQuarter)}
      icon={CalendarRange}
      accent="quarter"
      badge={
        <Badge variant="secondary" className="shrink-0">
          {setTargetCount}/4 set
        </Badge>
      }
      cta={{ to: "/app/life-targets", label: "Open Quarterly Targets" }}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Loading quarterly targets…
        </p>
      ) : targetRows.length > 0 ? (
        <div className="space-y-2">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              aria-label={
                allTargetsExpanded
                  ? "Collapse all quarterly targets"
                  : "Expand all quarterly targets"
              }
              onClick={() =>
                setExpandedTargets(allTargetsExpanded ? [] : targetValues)
              }
            >
              {allTargetsExpanded ? "Collapse all" : "Expand all"}
            </Button>
          </div>
          <Accordion
            type="multiple"
            value={expandedTargets}
            onValueChange={setExpandedTargets}
            className="grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2"
          >
            {targetRows.map((row) => {
              return (
                <FocusAccordionCard
                  key={row.key}
                  value={`target-${row.key}`}
                  domain={row.key}
                  statement={row.value}
                  emptyCopy="No quarterly target set yet."
                />
              );
            })}
          </Accordion>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Set your quarterly targets to give your daily habits a clear
          direction.
        </p>
      )}
    </PersonalGrowthPod>
  );
}

function NinetyDayAudioPod() {
  const { user } = useAuth();
  const [hasCompletedTrack, setHasCompletedTrack] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sessionId = window.localStorage.getItem("theta_session_id");

    if (!sessionId || !user?.id) {
      setHasCompletedTrack(false);
      return undefined;
    }

    const fetchTrackStatus = async () => {
      const { data, error } = await supabase
        .from("theta_tracks")
        .select("id")
        .eq("session_id", sessionId)
        .eq("user_id", user.id)
        .eq("status", "completed")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Failed to load 90 Day Audio status:", error);
      }

      if (!cancelled) setHasCompletedTrack(Boolean(data));
    };

    void fetchTrackStatus();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <PersonalGrowthPod
      title="90 Day Audio"
      tagline="Your personalized theta talk track to reinforce the targets you're chasing."
      icon={AudioLines}
      accent="month"
      iconAccent="being"
      active={hasCompletedTrack}
      className="h-full"
      cta={{ to: "/app/theta-talk-track", label: "Open 90 Day Audio" }}
    >
      <div className="rounded-lg border border-border/60 p-3 text-sm text-muted-foreground">
        Rebuild or revisit your theta track whenever your quarterly targets
        shift.
      </div>
    </PersonalGrowthPod>
  );
}

export default function PersonalGrowthDashboard() {
  const today = new Date();
  const monthLabel = format(today, "LLLL yyyy");
  const weekRange = format(today, "MMM d");
  const quarterLabel = formatQuarterDisplay(getCurrentQuarter());

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <div className="space-y-8">
        <DebriefSundayBanner />

        <TodayRhythmHero />

        <section className="space-y-3">
          <SectionHeading label="This Quarter" meta={quarterLabel} />
          <QuarterlyTargetsPod />
        </section>

        <section className="space-y-3">
          <SectionHeading label="This Month" meta={monthLabel} />
          <MonthlyMissionsPod />
        </section>

        <section className="space-y-3">
          <SectionHeading label="This Week" meta={`Week of ${weekRange}`} />
          <div className="grid auto-rows-fr items-stretch gap-4 lg:grid-cols-2">
            <TodaysPowerPlays variant="personal-growth" />
            <DailyFrameWidget
              showRecent={false}
              variant="personal-growth"
              className="h-full w-full"
            />
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeading
            label="Reflect & Reinforce"
            meta={format(today, "EEEE, MMM d")}
          />
          <div className="grid auto-rows-fr items-stretch gap-4 lg:grid-cols-2">
            <DebriefPod />
            <NinetyDayAudioPod />
          </div>
        </section>
      </div>
    </div>
  );
}
