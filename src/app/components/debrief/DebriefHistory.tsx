import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/app/lib/auth";
import { weekKeyToDateRange, formatWeekLabel } from "@/app/lib/date-utils";
import { DebriefScoreRing } from "./DebriefScoreRing";
import { ChevronRight, Loader2 } from "lucide-react";

interface DebriefHistoryProps {
  onViewDebrief: (weekKey: string) => void;
  showEmpty?: boolean;
}

export function DebriefHistory({ onViewDebrief, showEmpty = false }: DebriefHistoryProps) {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["debrief-history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("weekly_reviews")
        .select("id, week_key, total_points, core4_points, flow_points, playbook_points, status, completed_at, domain_reflections")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("week_key", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (reviews.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className="mt-8 w-full max-w-sm rounded-xl border border-dashed border-border/70 bg-muted/30 px-5 py-8 text-center">
        <p className="text-sm font-medium text-foreground">No past debriefs yet</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Your sealed weekly debriefs will appear here.
        </p>
      </div>
    );
  }

  // Calculate average rating per review
  const getAvgRating = (reflections: Record<string, unknown> | null) => {
    if (!reflections) return null;
    const domains = ["body", "being", "balance", "business"];
    const ratings = domains
      .map(d => (reflections[d] as Record<string, unknown> | undefined)?.rating as number | undefined)
      .filter((r): r is number => typeof r === "number");
    if (ratings.length === 0) return null;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const reviewsWithLabels = reviews.map((r) => {
    const { monday, sunday } = weekKeyToDateRange(r.week_key);
    return { ...r, dateLabel: formatWeekLabel(monday, sunday) };
  });

  return (
    <div className="mt-8 w-full max-w-sm mx-auto">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center">Past Debriefs</p>
      <div className="space-y-2">
        {reviewsWithLabels.map((r) => (
          <button
            key={r.id}
            onClick={() => onViewDebrief(r.week_key)}
            className="w-full flex items-center gap-3 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-lg px-4 py-3 transition-all text-left group"
          >
            <DebriefScoreRing total={r.total_points ?? 0} max={56} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{r.dateLabel}</p>
              <p className="text-xs text-muted-foreground">
                {r.core4_points ?? 0}/28 · {r.flow_points ?? 0}/7 · {r.playbook_points ?? 0}/21
                {getAvgRating(r.domain_reflections as Record<string, unknown> | null) && ` · Avg ${getAvgRating(r.domain_reflections as Record<string, unknown> | null)}/10`}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
