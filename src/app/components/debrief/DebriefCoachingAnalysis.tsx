import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft,
  Stamp,
  Sparkles,
} from "lucide-react";
import { DebriefScoreRing } from "./DebriefScoreRing";
import type { WeekSummaryData } from "@/app/hooks/useWeekSummary";

interface DebriefCoachingAnalysisProps {
  weekSummary: WeekSummaryData;
  existingAnalysis: string | null;
  onSeal: () => void;
  onBack: () => void;
  sealing: boolean;
}

export function DebriefCoachingAnalysis({
  weekSummary,
  existingAnalysis,
  onSeal,
  onBack,
  sealing,
}: DebriefCoachingAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(existingAnalysis);

  // Sync from prop when it changes (e.g. review refetched after save)
  useEffect(() => {
    if (existingAnalysis && !analysis) {
      setAnalysis(existingAnalysis);
    }
  }, [existingAnalysis]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <Sparkles className="h-6 w-6 text-[#2997FF] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-foreground">Your Coach's Analysis</h2>
        <p className="text-sm text-muted-foreground mt-1">Personalized insights from your weekly debrief</p>
      </div>

      {/* Score summary */}
      <div className="flex justify-center">
        <DebriefScoreRing total={weekSummary.totalPoints} max={56} size="sm" />
      </div>

      {/* Analysis content */}
      {analysis ? (
        <div className="bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.03] rounded-xl p-6 border border-border space-y-1">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {analysis.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-sm text-foreground/80 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-foreground/5 rounded-xl p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground">
            Seal your debrief to prepare your personalized coaching report. We’ll send it to your email when it’s ready.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onSeal}
          disabled={sealing}
          size="lg"
          className="bg-[#2997FF] hover:bg-[#2997FF] text-white font-semibold px-8 rounded-full"
        >
          <Stamp className="mr-2 h-5 w-5" />
          {sealing ? "Sealing..." : "Seal Your Debrief"}
        </Button>
      </div>
    </div>
  );
}
