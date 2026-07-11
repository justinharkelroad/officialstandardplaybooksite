import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getDebriefWeekKey } from "@/app/lib/date-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Belongs to whichever theme is active rather than inverting against it: in
  // light it's the landing's ink band on paper; in dark it's a raised ink card
  // with the same blue rule, so it reads as part of the page.
  return (
    <div
      className={cn(
        "relative mb-6 flex items-center justify-between gap-4 border-l-4 border-l-[#2997FF] p-5",
        "bg-foreground text-background",
        "dark:bg-card dark:text-foreground dark:border-y-[1.5px] dark:border-r-[1.5px] dark:border-y-foreground/20 dark:border-r-foreground/20",
      )}
    >
      <div className="flex items-center gap-4">
        <div>
          <p className="sp-display text-xl leading-none">Your weekend Debrief is ready</p>
          <p className="sp-label mt-2 text-[10px] text-background/60 dark:text-foreground/55">
            Reflect on your week, plan the next one, get your coaching analysis.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate("/app/debrief")}
          className={cn(
            "border-[1.5px] px-6 font-bold",
            "border-background bg-background text-foreground",
            "dark:border-foreground dark:bg-foreground dark:text-background",
            "hover:border-[#2997FF] hover:bg-[#2997FF] hover:text-white",
            "dark:hover:border-[#2997FF] dark:hover:bg-[#2997FF] dark:hover:text-white",
          )}
        >
          Begin Debrief
        </Button>
        <button
          onClick={handleDismiss}
          className="p-1 text-background/40 hover:text-background dark:text-foreground/40 dark:hover:text-foreground"
          aria-label="Dismiss weekly debrief banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
