import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getDebriefWeekKey } from "@/app/lib/date-utils";
import { Button } from "@/components/ui/button";
import { ClipboardEdit, X } from "lucide-react";

// Reworked from source: tier gating removed (every member has the Debrief)
// and dismissal is localStorage-only (the source's banner_dismissals table
// was not transplanted).
const BANNER_KEY_PREFIX = "debrief_sunday";

export function DebriefSundayBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean | null>(null);

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
  const showBanner = dayOfWeek === 0 || dayOfWeek === 6;
  const weekKey = getDebriefWeekKey(today);
  const bannerKey = `${BANNER_KEY_PREFIX}_${weekKey}`;
  const localStorageKey = user?.id ? `banner_dismissed_${user.id}_${bannerKey}` : null;

  useEffect(() => {
    if (!user?.id || !showBanner) return;
    setDismissed(!!(localStorageKey && localStorage.getItem(localStorageKey)));
  }, [user?.id, showBanner, localStorageKey]);

  useEffect(() => {
    if (!user?.id || !showBanner || dismissed === true) return;

    supabase
      .from("weekly_reviews")
      .select("status")
      .eq("user_id", user.id)
      .eq("week_key", weekKey)
      .maybeSingle()
      .then(({ data }) => {
        setCompleted(data?.status === "completed");
      });
  }, [user?.id, showBanner, weekKey, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    if (localStorageKey) localStorage.setItem(localStorageKey, "1");
  };

  if (!showBanner || dismissed !== false || completed === true || completed === null) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-sky-50 to-slate-100 dark:from-neutral-900 dark:to-black text-foreground dark:text-white rounded-xl p-5 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-foreground/10 rounded-lg p-2.5">
          <ClipboardEdit className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-base">Your weekend Debrief is ready</p>
          <p className="text-sm text-muted-foreground dark:text-white/60 mt-0.5">Reflect on your week, plan the next one, and get your coaching analysis.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate("/app/debrief")}
          className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full px-6"
        >
          Begin Debrief
        </Button>
        <button onClick={handleDismiss} className="text-muted-foreground/50 hover:text-muted-foreground dark:text-white/30 dark:hover:text-white/60 p-1" aria-label="Dismiss weekly debrief banner">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
