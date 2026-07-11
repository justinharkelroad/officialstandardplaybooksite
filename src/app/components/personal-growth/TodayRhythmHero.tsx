import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpButton } from "@/app/components/HelpButton";
import { SectionHelpTip } from "@/components/ui/section-help-tip";
import { cn } from "@/lib/utils";
import { useCore4Stats, type Core4Domain } from "@/app/hooks/useCore4Stats";
import { useFlowStats } from "@/app/hooks/useFlowStats";
import { usePlaybookStats } from "@/app/hooks/usePlaybookStats";
import {
  DOMAIN_ORDER,
  DOMAIN_TOKENS,
  type PersonalGrowthDomain,
} from "./domainTokens";

const WEEKLY_GOAL = 56;
const CORE4_WEEKLY_GOAL = 28;
const FLOW_WEEKLY_GOAL = 7;
const PLAYBOOK_WEEKLY_GOAL = 21;

export function TodayRhythmHero() {
  const {
    todayEntry,
    todayPoints,
    weeklyPoints,
    currentStreak,
    longestStreak,
    loading,
    toggleDomain,
  } = useCore4Stats();
  const flowStats = useFlowStats();
  const playbookStats = usePlaybookStats();

  const combinedWeeklyPoints =
    weeklyPoints + flowStats.weeklyProgress + playbookStats.weeklyPoints;
  const progressPct = Math.min(
    100,
    Math.round((combinedWeeklyPoints / WEEKLY_GOAL) * 100),
  );
  const isDomainCompleted = (domain: Core4Domain): boolean => {
    if (!todayEntry) return false;
    return Boolean(todayEntry[`${domain}_completed` as keyof typeof todayEntry]);
  };

  const handleToggle = async (domain: Core4Domain) => {
    await toggleDomain(domain);
  };

  if (loading) {
    return (
      <Card className="border-border/70 bg-card/95">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      spotlight
      className="overflow-hidden border-border bg-card"
    >
      <CardContent className="space-y-6 p-6 md:p-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
            <CalendarTile date={new Date()} />
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Your Personal Growth
                </p>
                <HelpButton videoKey="core4_page" />
                <SectionHelpTip
                  title="Personal Growth Score"
                  body="Tracks Core 4 habits (28pts), Flow sessions (7pts), and Weekly Playbook (21pts: 20 Power Plays + 1 One Big Thing) for a combined 56-point weekly score."
                />
              </div>
              <h2 className="text-2xl font-semibold uppercase tracking-[0.06em] leading-tight md:text-3xl">
                Today&rsquo;s Rhythm
              </h2>
              <p className="text-sm text-muted-foreground">
                Check off the four domains that keep you whole. Flow and the
                Playbook fill in the rest.
              </p>
            </div>
          </div>
          <Link to="/core4" className="shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              View Core 4 detail
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-center">
          <ScoreRing
            value={combinedWeeklyPoints}
            goal={WEEKLY_GOAL}
            progressPct={progressPct}
            core4={weeklyPoints}
            flow={flowStats.weeklyProgress}
            playbook={playbookStats.weeklyPoints}
          />

          <div className="space-y-4">
            <StreakRow
              flowStreak={flowStats.currentStreak}
              core4Streak={currentStreak}
              flowLongest={flowStats.longestStreak}
              core4Longest={longestStreak}
              flowCompletedToday={flowStats.todayCompleted}
              flowWeeklyProgress={flowStats.weeklyProgress}
            />
            <div className="flex justify-center sm:justify-start">
              <TodayLine
                todayPoints={todayPoints}
                flowCompletedToday={flowStats.todayCompleted}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Today&rsquo;s Core 4
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Tap a domain to check it off
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {DOMAIN_ORDER.map((key) => {
              const token = DOMAIN_TOKENS[key];
              const Icon = token.icon;
              const completed = isDomainCompleted(key as Core4Domain);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleToggle(key as Core4Domain)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-xl p-6 transition-all duration-300",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    completed
                      ? cn("scale-[1.02] shadow-xl", token.solidClass)
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-10 w-10",
                      completed ? "text-white" : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-bold tracking-wider uppercase",
                      completed ? "text-white" : "text-muted-foreground",
                    )}
                  >
                    {token.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Link to="/core4" className="block">
          <Button variant="outline" className="w-full justify-between">
            Open Core 4 week
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

type ScoreRingProps = {
  value: number;
  goal: number;
  progressPct: number;
  core4: number;
  flow: number;
  playbook: number;
};

function ScoreRing({
  value,
  goal,
  progressPct,
  core4,
  flow,
  playbook,
}: ScoreRingProps) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-4xl font-bold">{value}</span>
            <span className="mt-1 text-sm font-medium text-muted-foreground">
              / {goal}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          This week
        </span>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-5 sm:justify-start">
        <MiniRing
          value={core4}
          goal={CORE4_WEEKLY_GOAL}
          label="Core 4"
          strokeClass="text-[#078a52]"
        />
        <MiniRing
          value={flow}
          goal={FLOW_WEEKLY_GOAL}
          label="Flow"
          strokeClass="text-[#43089f] dark:text-[#b48cff]"
        />
        <MiniRing
          value={playbook}
          goal={PLAYBOOK_WEEKLY_GOAL}
          label="Playbook"
          strokeClass="text-[#0089ad]"
        />
      </div>
    </div>
  );
}

function MiniRing({
  value,
  goal,
  label,
  strokeClass,
}: {
  value: number;
  goal: number;
  label: string;
  strokeClass: string;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, (value / Math.max(1, goal)) * 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-500", strokeClass)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold tabular-nums">
            {value}
            <span className="font-normal text-muted-foreground">/{goal}</span>
          </span>
        </div>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

type StreakRowProps = {
  flowStreak: number;
  core4Streak: number;
  flowLongest: number;
  core4Longest: number;
  flowCompletedToday: boolean;
  flowWeeklyProgress: number;
};

function StreakRow({
  flowStreak,
  core4Streak,
  flowLongest,
  core4Longest,
  flowCompletedToday,
  flowWeeklyProgress,
}: StreakRowProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StreakTile
        label="Flow streak"
        value={flowStreak}
        longest={flowLongest}
        Icon={Zap}
        iconClass="bg-[#43089f]/15 text-[#43089f] dark:text-[#b48cff]"
        activeToday={flowCompletedToday}
      />
      <StreakTile
        label="Core 4 streak"
        value={core4Streak}
        longest={core4Longest}
        Icon={Flame}
        iconClass="bg-orange-500/15 text-orange-500"
      />
      <FlowStartTile weeklyProgress={flowWeeklyProgress} />
    </div>
  );
}

function FlowStartTile({ weeklyProgress }: { weeklyProgress: number }) {
  const progressPct = Math.min(
    100,
    Math.round((weeklyProgress / FLOW_WEEKLY_GOAL) * 100),
  );

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#43089f]/15 text-[#43089f] dark:text-[#b48cff]">
        <Sparkles className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold leading-none">Flow</p>
          <span className="shrink-0 text-xs font-semibold tabular-nums">
            {weeklyProgress}/{FLOW_WEEKLY_GOAL}{" "}
            <span className="font-normal text-muted-foreground">days</span>
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          Weekly rhythm
        </p>
        <div
          role="progressbar"
          aria-label={`${weeklyProgress} of ${FLOW_WEEKLY_GOAL} Flow days complete this week`}
          aria-valuemin={0}
          aria-valuemax={FLOW_WEEKLY_GOAL}
          aria-valuenow={weeklyProgress}
          className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-[#43089f] transition-[width] duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      <Button asChild size="sm" className="h-7 shrink-0 px-2 text-xs">
        <Link to="/flows">Start</Link>
      </Button>
    </div>
  );
}

function StreakTile({
  label,
  value,
  longest,
  Icon,
  iconClass,
  activeToday,
}: {
  label: string;
  value: number;
  longest: number;
  Icon: typeof Flame;
  iconClass: string;
  activeToday?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          iconClass,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold leading-none">{value}</span>
          <span className="text-xs text-muted-foreground">
            {value === 1 ? "day" : "days"}
          </span>
          {activeToday ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#43089f] dark:text-[#b48cff]">
              · Active
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {label} · longest {longest}
        </p>
      </div>
    </div>
  );
}

function TodayLine({
  todayPoints,
  flowCompletedToday,
}: {
  todayPoints: number;
  flowCompletedToday: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span>
        Today:{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {todayPoints}/4
        </span>
      </span>
      <span className="text-border">•</span>
      <span
        className={cn(
          "inline-flex items-center gap-1",
          flowCompletedToday ? "text-[#43089f] dark:text-[#b48cff]" : "",
        )}
      >
        <Zap className="h-3.5 w-3.5" />
        {flowCompletedToday ? "Flow done" : "Flow pending"}
      </span>
    </div>
  );
}

function CalendarTile({ date }: { date: Date }) {
  const month = format(date, "MMM");
  const day = format(date, "d");
  const weekday = format(date, "EEE");

  return (
    <div
      className="flex h-16 w-16 shrink-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm"
      aria-label={format(date, "EEEE, MMMM d")}
    >
      <div className="flex h-[18px] items-center justify-center bg-[#af0000] text-[10px] font-bold uppercase tracking-[0.14em] text-white">
        {month}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center leading-none">
        <span className="text-2xl font-bold tabular-nums">{day}</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          {weekday}
        </span>
      </div>
    </div>
  );
}
