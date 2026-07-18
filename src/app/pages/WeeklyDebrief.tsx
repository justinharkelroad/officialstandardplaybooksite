import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseFunctionErrorMessage } from "@/app/lib/supabaseFunctionErrors";
import { getDebriefWeekKey, weekKeyToDateRange, formatWeekLabel, isDebriefWindowOpen } from "@/app/lib/date-utils";
import { DebriefWizard } from "@/app/components/debrief/DebriefWizard";
import { DebriefCompleted } from "@/app/components/debrief/DebriefCompleted";
import { DebriefHistory } from "@/app/components/debrief/DebriefHistory";
import { useWeekSummary } from "@/app/hooks/useWeekSummary";
import { useWeeklyDebrief } from "@/app/hooks/useWeeklyDebrief";
import type { WeeklyReview } from "@/app/hooks/useWeeklyDebrief";
import { useFocusItems } from "@/app/hooks/useFocusItems";
import { useDebriefStats } from "@/app/hooks/useDebriefStats";
import { ArrowLeft, CalendarClock, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";

export default function WeeklyDebrief() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pastReview, setPastReview] = useState<WeeklyReview | null>(null);
  const [loadingPast, setLoadingPast] = useState(false);

  // Debrief week: on Mon/Tue shows previous week (grace period)
  const weekKey = getDebriefWeekKey();
  const { monday, sunday } = weekKeyToDateRange(weekKey);
  const weekLabel = formatWeekLabel(monday, sunday);
  const historyRequested = searchParams.get("history") === "1";
  const debriefWindowOpen = isDebriefWindowOpen();

  const weekSummary = useWeekSummary(weekKey);
  const stats = useDebriefStats(weekKey);
  const {
    review,
    isLoading,
    createOrResume,
    saveStep,
    saveGratitudeNote,
    saveDomainReflection,
    saveNextWeekOBT,
    completeDebrief,
  } = useWeeklyDebrief(weekKey);

  const queryClient = useQueryClient();

  // Focus items for creating bench items from domain reflections
  const { createItem } = useFocusItems();

  const handleRequestAnalysis = async (reviewId: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("analyze_debrief", {
      body: { review_id: reviewId },
    });
    if (error) throw new Error(await getSupabaseFunctionErrorMessage(error, { fallbackMessage: "AI feedback isn't configured yet" }));
    return data?.analysis || "";
  };

  // Sealed view: run the analysis, then pull the saved report back into the cache.
  const handleRequestAnalysisAndRefresh = async (reviewId: string): Promise<string> => {
    const analysis = await handleRequestAnalysis(reviewId);
    await queryClient.invalidateQueries({ queryKey: ["weekly-debrief", user?.id, weekKey] });
    return analysis;
  };

  const handleAddToBench = (title: string, domain: string) => {
    createItem.mutate({
      title,
      priority_level: "mid",
      zone: "bench",
      domain: domain as PlaybookDomain,
    });
  };

  const handleViewPastDebrief = async (pastWeekKey: string) => {
    if (!user?.id) return;
    // Don't reload current week as a "past" view — it's already shown with full stats
    if (pastWeekKey === weekKey) {
      setPastReview(null);
      return;
    }
    setLoadingPast(true);
    try {
      const { data, error } = await supabase
        .from("weekly_reviews")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_key", pastWeekKey)
        .maybeSingle();
      if (error || !data) {
        toast.error("Could not load debrief");
        return;
      }
      setPastReview(data as unknown as WeeklyReview);
      window.scrollTo(0, 0);
    } finally {
      setLoadingPast(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadingPast) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const showDebriefArchive = historyRequested || (!debriefWindowOpen && review?.status !== "completed");

  if (showDebriefArchive && !pastReview) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#2997FF]" />
              <span className="text-sm font-medium text-muted-foreground">Past debriefs</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/app")}
              className="h-8 px-3 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>
        </header>

        <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-10 text-center">
          <History className="mb-4 h-8 w-8 text-[#2997FF]" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Debrief archive</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Review your past debriefs</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Revisit your scores, reflections, next-week plan, and coaching analysis at any time.
          </p>

          {!debriefWindowOpen && review?.status !== "completed" ? (
            <div className="mt-6 flex w-full max-w-md items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-4 text-left">
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">New debriefs open Sunday and Monday</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  The archive stays available all week. Return Sunday or Monday to start the next debrief.
                </p>
              </div>
            </div>
          ) : null}

          <DebriefHistory onViewDebrief={handleViewPastDebrief} showEmpty />

          {historyRequested && debriefWindowOpen && review?.status !== "completed" ? (
            <Button className="mt-8" onClick={() => setSearchParams({})}>
              {review?.status === "in_progress" ? "Continue this week's debrief" : "Start this week's debrief"}
            </Button>
          ) : null}
        </main>
      </div>
    );
  }

  // Show past debrief viewer
  if (pastReview) {
    const { monday: pastMonday, sunday: pastSunday } = weekKeyToDateRange(pastReview.week_key);
    const pastWeekLabel = formatWeekLabel(pastMonday, pastSunday);
    return (
      <DebriefCompleted
        review={pastReview}
        weekLabel={pastWeekLabel}
        exitPath="/app"
        onBack={() => setPastReview(null)}
        onViewDebrief={handleViewPastDebrief}
      />
    );
  }

  // Show completed view when this week's debrief is sealed
  if (review?.status === "completed") {
    return (
      <DebriefCompleted
        review={review}
        weekLabel={weekLabel}
        stats={stats}
        exitPath="/app"
        onViewDebrief={handleViewPastDebrief}
        onRequestAnalysis={handleRequestAnalysisAndRefresh}
      />
    );
  }

  return (
    <DebriefWizard
      weekLabel={weekLabel}
      weekKey={weekKey}
      weekSummary={weekSummary}
      stats={stats}
      review={review}
      isLoading={isLoading}
      exitPath="/app"
      onCreateOrResume={() => createOrResume.mutateAsync()}
      onSaveStep={(step) => saveStep.mutate(step)}
      onSaveGratitudeNote={(note) => saveGratitudeNote.mutate(note)}
      onSaveDomainReflection={(domain, reflection) => saveDomainReflection.mutate({ domain, reflection })}
      onAddToBench={handleAddToBench}
      onSaveNextWeekOBT={(obt) => saveNextWeekOBT.mutate(obt)}
      onRequestAnalysis={handleRequestAnalysis}
      onCompleteDebrief={(scores) => completeDebrief.mutateAsync(scores)}
      onViewDebrief={handleViewPastDebrief}
    />
  );
}
