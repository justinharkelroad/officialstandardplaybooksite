import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PauseCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyFlowReflection } from "@/app/hooks/useWeeklyFlowReflection";
import {
  getBrowserTimezone,
  getWeeklyReflectionWindow,
  takeReflectionSentences,
} from "@/app/lib/weeklyReflectionWeek";
import { cn } from "@/lib/utils";

type WeeklyReflectionPreviewProps = {
  className?: string;
};

function PreviewLink({ label = "Open Reflection" }: { label?: string }) {
  return (
    <Link
      to="/app/reflection"
      className="group inline-flex min-h-11 items-center justify-center gap-2 border-[1.5px] border-foreground px-4 text-xs font-bold text-foreground transition-colors hover:border-[#2997FF] hover:bg-[#2997FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function PreviewSkeleton({ className }: WeeklyReflectionPreviewProps) {
  return (
    <section
      aria-label="Loading Weekly Reflection"
      className={cn("border-y-[1.5px] border-foreground py-5", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="border-t border-foreground/20 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-14 w-full" />
        </div>
      </div>
    </section>
  );
}

export function WeeklyReflectionPreview({ className }: WeeklyReflectionPreviewProps) {
  const timezone = useMemo(() => getBrowserTimezone(), []);
  const currentWindow = useMemo(
    () => getWeeklyReflectionWindow(new Date(), timezone),
    [timezone],
  );
  const {
    reflection,
    memoryPaused,
    isLoading,
    isFetching,
    isError,
  } = useWeeklyFlowReflection(currentWindow);

  if (isLoading && !reflection) {
    return <PreviewSkeleton className={className} />;
  }

  const hasSynthesis = Boolean(
    reflection?.reflectionText ||
      reflection?.signals.length ||
      reflection?.iamStatements.length,
  );

  if (isError && !reflection) {
    return (
      <section className={cn("border-y-[1.5px] border-foreground py-5", className)}>
        <h3 className="text-2xl text-foreground">Weekly Reflection</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Your reflection could not load here. Open the full view to try again.
        </p>
        <div className="mt-5">
          <PreviewLink />
        </div>
      </section>
    );
  }

  if (memoryPaused && !hasSynthesis) {
    return (
      <section className={cn("border-y-[1.5px] border-foreground py-5", className)}>
        <div className="flex items-start gap-3">
          <PauseCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2997FF]" />
          <div>
            <h3 className="text-2xl text-foreground">Weekly Reflection is paused</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Weekly synthesis follows your Flowing memory setting. Your completed Flows remain available.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <PreviewLink />
          <Link
            to="/app/flows/profile"
            className="inline-flex min-h-11 items-center justify-center px-3 text-xs font-semibold text-[#0066CC] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF] dark:text-[#2997FF]"
          >
            Manage Flowing memory
          </Link>
        </div>
      </section>
    );
  }

  if (
    !reflection ||
    reflection.generationStatus === "empty" ||
    (reflection.generationStatus === "failed" && !hasSynthesis)
  ) {
    return (
      <section className={cn("border-y-[1.5px] border-foreground py-5", className)}>
        <div className="flex items-start gap-3">
          <Sparkles aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2997FF]" />
          <div>
            <h3 className="text-2xl text-foreground">Your week is taking shape</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Complete a Flow to begin building your Weekly Reflection, signals, and I AM Statements.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <PreviewLink />
        </div>
      </section>
    );
  }

  if (reflection.generationStatus === "generating" && !hasSynthesis) {
    return <PreviewSkeleton className={className} />;
  }

  const reflectionPreview = takeReflectionSentences(
    reflection.reflectionText || reflection.headline || "",
    2,
  );
  const signals = reflection.signals.slice(0, 2);
  const featuredStatement = reflection.iamStatements[0]?.text ?? null;
  const isUpdating = isFetching || reflection.generationStatus === "generating";

  return (
    <section
      aria-labelledby="weekly-reflection-preview-heading"
      className={cn("border-y-[1.5px] border-foreground py-5 sm:py-6", className)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 id="weekly-reflection-preview-heading" className="text-3xl text-foreground">
              Weekly Reflection
            </h3>
            {memoryPaused ? (
              <span className="sp-label text-[10px] text-[#0066CC] dark:text-[#2997FF]">
                Paused
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {currentWindow.label}
            {reflection.sourceCount
              ? ` · ${reflection.sourceCount} ${reflection.sourceCount === 1 ? "Flow" : "Flows"}`
              : ""}
          </p>
        </div>
        <PreviewLink label="Read Reflection" />
      </div>

      {memoryPaused ? (
        <div className="mt-5 flex items-start gap-3 border-y border-foreground/20 py-3 text-sm text-muted-foreground">
          <PauseCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#2997FF]" />
          <p>
            Showing your last complete reflection. New synthesis is paused with Flowing memory.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div className="min-w-0">
          {reflectionPreview ? (
            <p className="max-w-[72ch] text-base leading-7 text-foreground/85">
              {reflectionPreview}
            </p>
          ) : null}

          {signals.length > 0 ? (
            <ul className="mt-5 space-y-2" aria-label="Your strongest signals">
              {signals.map((signal, index) => (
                <li key={`${signal.text}-${index}`} className="flex gap-3 text-sm leading-6 text-foreground">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-[#2997FF]" />
                  <span>{signal.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="border-t border-foreground/20 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="sp-label text-[10px] text-muted-foreground">Featured I AM Statement</p>
          {featuredStatement ? (
            <blockquote className="mt-3 text-lg font-semibold leading-7 text-foreground">
              {featuredStatement}
            </blockquote>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your statements will build as more of this week comes into view.
            </p>
          )}
          {isUpdating && !memoryPaused ? (
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground" role="status">
              <RefreshCw aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-[#2997FF]" />
              Updating from your latest Flow
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default WeeklyReflectionPreview;
