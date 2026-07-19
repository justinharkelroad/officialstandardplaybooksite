import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PauseCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyFlowReflection, useWeeklyFlowReflectionHistory } from "@/app/hooks/useWeeklyFlowReflection";
import {
  getBrowserTimezone,
  getWeeklyReflectionWindow,
  getWeeklyReflectionWindowFromKey,
  isWeeklyReflectionWeekKey,
  shiftWeeklyReflectionWeek,
} from "@/app/lib/weeklyReflectionWeek";
import type {
  WeeklyFlowReflection,
  WeeklyReflectionSourceFlow,
} from "@/app/types/weeklyReflection";
import { cn } from "@/lib/utils";

function formatGeneratedAt(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatSourceDate(flow: WeeklyReflectionSourceFlow) {
  const localDate = /^\d{4}-\d{2}-\d{2}$/.test(flow.localDate)
    ? new Date(`${flow.localDate}T12:00:00Z`)
    : new Date(flow.completedAt);

  if (Number.isNaN(localDate.getTime())) return "Completed Flow";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: /^\d{4}-\d{2}-\d{2}$/.test(flow.localDate) ? "UTC" : undefined,
  }).format(localDate);
}

function getEvidenceFlows(
  evidenceSessionIds: string[],
  sourceFlows: WeeklyReflectionSourceFlow[],
) {
  const evidenceIds = new Set(evidenceSessionIds);
  return sourceFlows.filter((flow) => evidenceIds.has(flow.id));
}

function EvidenceLinks({
  evidenceSessionIds,
  sourceFlows,
  inverted = false,
}: {
  evidenceSessionIds: string[];
  sourceFlows: WeeklyReflectionSourceFlow[];
  inverted?: boolean;
}) {
  const evidenceFlows = getEvidenceFlows(evidenceSessionIds, sourceFlows);
  if (evidenceFlows.length === 0) return null;

  return (
    <p
      className={cn(
        "mt-2 text-xs leading-5",
        inverted ? "text-background/60" : "text-muted-foreground",
      )}
    >
      From{" "}
      {evidenceFlows.map((flow, index) => (
        <span key={flow.id}>
          {index > 0 ? ", " : null}
          <Link
            to={`/app/flows/view/${flow.id}`}
            className={cn(
              "underline decoration-current/40 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF]",
              inverted
                ? "text-background hover:text-[#2997FF]"
                : "text-foreground hover:text-[#0066CC] dark:hover:text-[#2997FF]",
            )}
          >
            {flow.title || flow.templateName || "Completed Flow"}
          </Link>
        </span>
      ))}
    </p>
  );
}

function ReflectionLoading() {
  return (
    <div aria-label="Loading Weekly Reflection" className="space-y-12 py-4">
      <section className="space-y-4">
        <Skeleton className="h-9 w-3/4 max-w-xl" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-full max-w-3xl" />
          <Skeleton className="h-5 w-11/12 max-w-3xl" />
          <Skeleton className="h-5 w-2/3 max-w-3xl" />
        </div>
      </section>
      <section className="space-y-3 border-t border-foreground/20 pt-7">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </section>
      <section className="bg-foreground p-6 sm:p-8">
        <Skeleton className="h-7 w-52 bg-background/20" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-14 w-full bg-background/15" />
          <Skeleton className="h-14 w-full bg-background/15" />
          <Skeleton className="h-14 w-full bg-background/15" />
        </div>
      </section>
    </div>
  );
}

function ReflectionError({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <section className="border-y-[1.5px] border-foreground py-10" role="alert">
      <div className="flex max-w-2xl items-start gap-4">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#2997FF]" />
        <div>
          <h2 className="text-2xl text-foreground">Reflection unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 min-h-11 border-[1.5px] border-foreground"
            disabled={isRetrying}
            onClick={onRetry}
          >
            <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}

function ReflectionEmpty({ isCurrentWeek }: { isCurrentWeek: boolean }) {
  return (
    <section className="border-y-[1.5px] border-foreground py-10">
      <Sparkles aria-hidden="true" className="h-7 w-7 text-[#2997FF]" />
      <h2 className="mt-5 text-3xl text-foreground">
        {isCurrentWeek ? "Your week is taking shape" : "No reflection for this week"}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        {isCurrentWeek
          ? "Complete a Flow to give Weekly Reflection something real to reflect. Your signals and I AM Statements will build as the week develops."
          : "No completed Flows were found in this week, so there is nothing to synthesize."}
      </p>
      <Button asChild className="mt-6 min-h-11">
        <Link to="/app/flows">
          {isCurrentWeek ? "Start a Flow" : "Browse your Flows"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}

function MemoryPausedNotice() {
  return (
    <section className="border-[1.5px] border-foreground bg-muted/30 p-5 sm:p-6">
      <div className="flex max-w-3xl items-start gap-4">
        <PauseCircle aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#2997FF]" />
        <div>
          <h2 className="text-2xl text-foreground">Weekly Reflection is paused</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Weekly synthesis follows your Flowing memory setting. Completed Flows can still appear below, but no reflection, signals, or I AM Statements are created while memory is paused.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 min-h-11 border-[1.5px] border-foreground"
          >
            <Link to="/app/flows/profile">Manage Flowing memory</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SourceFlowLedger({ sourceFlows }: { sourceFlows: WeeklyReflectionSourceFlow[] }) {
  if (sourceFlows.length === 0) return null;

  return (
    <section aria-labelledby="reflection-sources-heading" className="border-t-[1.5px] border-foreground pt-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="reflection-sources-heading" className="text-3xl text-foreground">
            From Your Flows
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The completed work behind this reflection.
          </p>
        </div>
        <span className="sp-label text-[10px] text-muted-foreground">
          {sourceFlows.length} {sourceFlows.length === 1 ? "Flow" : "Flows"}
        </span>
      </div>

      <ul className="mt-6 border-y border-foreground/20">
        {sourceFlows.map((flow) => (
          <li
            key={flow.id}
            id={`reflection-source-${flow.id}`}
            className="border-b border-foreground/15 last:border-b-0"
          >
            <Link
              to={`/app/flows/view/${flow.id}`}
              className="group grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:ring-inset sm:grid-cols-[9rem_minmax(0,1fr)_auto]"
            >
              <span className="hidden text-sm text-muted-foreground sm:block">
                {formatSourceDate(flow)}
              </span>
              <span className="min-w-0">
                <span className="block break-words text-sm font-semibold normal-case tracking-normal text-foreground transition-colors group-hover:text-[#0066CC] dark:group-hover:text-[#2997FF]">
                  {flow.title || flow.templateName || "Completed Flow"}
                </span>
                <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-muted-foreground sm:hidden">
                  {formatSourceDate(flow)}
                </span>
                {flow.domain || flow.templateName ? (
                  <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-muted-foreground">
                    {[flow.domain, flow.templateName].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#2997FF]"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReflectionContent({ reflection }: { reflection: WeeklyFlowReflection }) {
  const generatedAt = formatGeneratedAt(reflection.generatedAt);
  const synthesisSources = reflection.synthesisSourceFlows ?? reflection.sourceFlows;

  return (
    <article className="space-y-12">
      <section
        className={cn(
          "grid gap-8",
          reflection.signals.length > 0 &&
            "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-0",
        )}
      >
        <div aria-labelledby="weekly-reflection-heading" className="min-w-0 lg:pr-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="weekly-reflection-heading" className="text-[clamp(30px,4vw,46px)] text-foreground">
              {reflection.headline || "Weekly Reflection"}
            </h2>
            {generatedAt ? (
              <span className="text-xs text-muted-foreground">Updated {generatedAt}</span>
            ) : null}
          </div>
          {reflection.reflectionText ? (
            <p className="mt-5 max-w-[72ch] text-base leading-7 text-foreground/85 sm:text-lg sm:leading-8">
              {reflection.reflectionText}
            </p>
          ) : null}
        </div>

        {reflection.signals.length > 0 ? (
          <div
            aria-labelledby="reflection-signals-heading"
            className="min-w-0 border-t border-foreground/25 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          >
            <h2 id="reflection-signals-heading" className="text-3xl text-foreground">
              Your Signals
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              What is repeating, shifting, or becoming clearer in your words.
            </p>
            <ul className="mt-5 border-t border-foreground/20">
              {reflection.signals.map((signal, index) => (
                <li
                  key={`${signal.text}-${index}`}
                  className="border-b border-foreground/15 py-4"
                >
                  <div className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-[#2997FF]" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-6 text-foreground">
                        {signal.text}
                      </p>
                      <EvidenceLinks
                        evidenceSessionIds={signal.evidenceSessionIds}
                        sourceFlows={synthesisSources}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {reflection.iamStatements.length > 0 ? (
        <section
          aria-labelledby="reflection-iam-heading"
          className="border-[1.5px] border-foreground bg-foreground p-5 text-background sm:p-8"
        >
          <h2 id="reflection-iam-heading" className="text-3xl text-background">
            I AM Statements
          </h2>
          <p className="mt-2 text-sm leading-6 text-background/65">
            Built from this week&apos;s Flows and the direction you said you want to go.
          </p>
          <ul className="mt-7 border-y border-background/20">
            {reflection.iamStatements.map((statement, index) => (
              <li
                key={`${statement.text}-${index}`}
                className="border-b border-background/15 py-5 last:border-b-0"
              >
                <div className="flex gap-4">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 bg-[#2997FF]" />
                  <div className="min-w-0">
                    <p className="max-w-[68ch] text-lg font-semibold leading-7 text-background sm:text-xl sm:leading-8">
                      {statement.text}
                    </p>
                    <EvidenceLinks
                      evidenceSessionIds={statement.evidenceSessionIds}
                      sourceFlows={synthesisSources}
                      inverted
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SourceFlowLedger sourceFlows={reflection.sourceFlows} />
    </article>
  );
}

export default function WeeklyReflection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const timezone = useMemo(() => getBrowserTimezone(), []);
  const currentWindow = useMemo(
    () => getWeeklyReflectionWindow(new Date(), timezone),
    [timezone],
  );
  const requestedWeekKey = searchParams.get("week");
  const selectedWeekKey =
    requestedWeekKey &&
    isWeeklyReflectionWeekKey(requestedWeekKey) &&
    requestedWeekKey <= currentWindow.weekKey
      ? requestedWeekKey
      : currentWindow.weekKey;
  const selectedWindow = useMemo(
    () => getWeeklyReflectionWindowFromKey(selectedWeekKey, timezone),
    [selectedWeekKey, timezone],
  );

  const {
    reflection,
    memoryPaused,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    refresh,
    isRefreshing,
    refreshFailure,
    refreshError,
  } = useWeeklyFlowReflection(selectedWindow);
  const history = useWeeklyFlowReflectionHistory(timezone);

  useEffect(() => {
    document.title = "Weekly Reflection | Standard Playbook";
    return () => {
      document.title = "Standard Playbook";
    };
  }, []);

  const historyWeekKeys = useMemo(() => {
    const keys = new Set<string>([currentWindow.weekKey, selectedWeekKey]);
    history.data?.availableWeeks.forEach((item) => keys.add(item.weekKey));
    history.data?.reflections.forEach((item) => keys.add(item.weekKey));
    return [...keys].sort((a, b) => b.localeCompare(a));
  }, [currentWindow.weekKey, history.data, selectedWeekKey]);

  const chooseWeek = (weekKey: string) => {
    setSearchParams(weekKey === currentWindow.weekKey ? {} : { week: weekKey });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const previousWeek = () => {
    chooseWeek(shiftWeeklyReflectionWeek(selectedWeekKey, -1, timezone).weekKey);
  };

  const nextWeek = () => {
    const next = shiftWeeklyReflectionWeek(selectedWeekKey, 1, timezone);
    if (next.weekKey <= currentWindow.weekKey) chooseWeek(next.weekKey);
  };

  const isCurrentWeek = selectedWeekKey === currentWindow.weekKey;
  const hasSynthesis = Boolean(
    reflection?.reflectionText ||
      reflection?.signals.length ||
      reflection?.iamStatements.length,
  );
  const visibleError =
    (error instanceof Error ? error.message : null) ||
    (refreshFailure instanceof Error ? refreshFailure.message : null) ||
    refreshError ||
    reflection?.lastError ||
    null;
  const isUpdating =
    isFetching || isRefreshing || reflection?.generationStatus === "generating";

  const retry = () => {
    if (reflection) {
      void refresh().catch(() => undefined);
    } else {
      void refetch();
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-2 sm:py-6">
      <header className="border-b-[1.5px] border-foreground pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-[clamp(38px,7vw,68px)] text-foreground">
              Weekly Reflection
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              See how you are showing up, what is becoming clear, and who your words say you are becoming.
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 border-[1.5px] border-foreground"
              onClick={previousWeek}
              aria-label="View previous week"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <label className="min-w-0 flex-1 lg:w-[260px] lg:flex-none">
              <span className="sr-only">Choose reflection week</span>
              <select
                value={selectedWeekKey}
                onChange={(event) => chooseWeek(event.target.value)}
                className="min-h-11 w-full min-w-0 border-[1.5px] border-foreground bg-background px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {historyWeekKeys.map((weekKey) => (
                  <option key={weekKey} value={weekKey}>
                    {weekKey === currentWindow.weekKey ? "This week · " : ""}
                    {getWeeklyReflectionWindowFromKey(weekKey, timezone).label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 border-[1.5px] border-foreground"
              onClick={nextWeek}
              disabled={isCurrentWeek}
              aria-label="View next week"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-5 flex min-h-6 flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {selectedWindow.label}
            {reflection?.sourceCount
              ? ` · ${reflection.sourceCount} ${reflection.sourceCount === 1 ? "Flow" : "Flows"} across ${reflection.sourceDayCount} ${reflection.sourceDayCount === 1 ? "day" : "days"}`
              : ""}
          </span>
          <span aria-live="polite" className="flex items-center gap-2">
            {isUpdating ? (
              <>
                <RefreshCw aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-[#2997FF]" />
                Updating from your Flows
              </>
            ) : reflection?.isStale ? (
              "A newer version is being prepared"
            ) : null}
          </span>
        </div>
      </header>

      <div className="mt-8 space-y-10">
        {memoryPaused ? <MemoryPausedNotice /> : null}

        {isLoading && !reflection ? <ReflectionLoading /> : null}

        {!isLoading && isError && !reflection ? (
          <ReflectionError
            message={visibleError || "Weekly Reflection could not load. Please try again."}
            onRetry={retry}
            isRetrying={isUpdating}
          />
        ) : null}

        {!isLoading && !isError && !memoryPaused && !reflection ? (
          <ReflectionEmpty isCurrentWeek={isCurrentWeek} />
        ) : null}

        {reflection && !memoryPaused && reflection.generationStatus === "empty" ? (
          <ReflectionEmpty isCurrentWeek={isCurrentWeek} />
        ) : null}

        {reflection &&
        !memoryPaused &&
        reflection.generationStatus === "generating" &&
        !hasSynthesis ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground" role="status">
              Building your reflection from {reflection.sourceCount} completed {reflection.sourceCount === 1 ? "Flow" : "Flows"}.
            </p>
            <ReflectionLoading />
          </div>
        ) : null}

        {reflection &&
        !memoryPaused &&
        reflection.generationStatus === "failed" &&
        !hasSynthesis ? (
          <ReflectionError
            message={visibleError || "Your Flows are safe, but the reflection could not be prepared yet."}
            onRetry={retry}
            isRetrying={isUpdating}
          />
        ) : null}

        {reflection && hasSynthesis ? (
          <>
            {!memoryPaused && (visibleError || reflection.isStale) ? (
              <div
                className="border border-foreground/25 bg-muted/30 p-4 text-sm"
                role="status"
              >
                <p className="leading-6 text-muted-foreground">
                  {visibleError
                    ? "You are seeing the last complete reflection. The newest update could not finish."
                    : "You are seeing the last complete reflection while the newest version is prepared."}
                </p>
              </div>
            ) : null}
            <ReflectionContent reflection={reflection} />
          </>
        ) : null}

        {reflection && memoryPaused && !hasSynthesis ? (
          <SourceFlowLedger sourceFlows={reflection.sourceFlows} />
        ) : null}
      </div>
    </div>
  );
}
