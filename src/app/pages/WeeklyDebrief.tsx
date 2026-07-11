import { useState } from "react";
import { useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getDebriefWeekKey, weekKeyToDateRange, formatWeekLabel } from "@/app/lib/date-utils";
import { DebriefWizard } from "@/app/components/debrief/DebriefWizard";
import { DebriefCompleted } from "@/app/components/debrief/DebriefCompleted";
import { useWeekSummary } from "@/app/hooks/useWeekSummary";
import { useWeeklyDebrief } from "@/app/hooks/useWeeklyDebrief";
import type { WeeklyReview } from "@/app/hooks/useWeeklyDebrief";
import { useFocusItems } from "@/app/hooks/useFocusItems";
import { useDebriefStats } from "@/app/hooks/useDebriefStats";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";

export default function WeeklyDebrief() {
  const { user, loading: authLoading } = useAuth();
  const [pastReview, setPastReview] = useState<WeeklyReview | null>(null);
  const [loadingPast, setLoadingPast] = useState(false);

  // Debrief week: on Mon/Tue shows previous week (grace period)
  const weekKey = getDebriefWeekKey();
  const { monday, sunday } = weekKeyToDateRange(weekKey);
  const weekLabel = formatWeekLabel(monday, sunday);

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

  // Focus items for creating bench items from domain reflections
  const { createItem } = useFocusItems();

  const handleRequestAnalysis = async (reviewId: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("analyze_debrief", {
      body: { review_id: reviewId },
    });
    if (error) throw error;
    return data?.analysis || "";
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
