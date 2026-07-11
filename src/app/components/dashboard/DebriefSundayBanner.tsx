import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getDebriefWeekKey } from "@/app/lib/date-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
    <div className="relative mb-6 flex items-center justify-between gap-4 bg-[#0A0A0B] p-5 text-[#F4F2EE]">
      <div className="flex items-center gap-4">
        <span aria-hidden className="hidden h-3 w-3 shrink-0 rounded-full bg-[#2997FF] sm:block" />
        <div>
          <p className="sp-display text-xl leading-none">Your weekend Debrief is ready</p>
          <p className="sp-label mt-2 text-[10px] text-[#F4F2EE]/60">
            Reflect on your week, plan the next one, get your coaching analysis.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate("/app/debrief")}
          className="border-[1.5px] border-[#F4F2EE] bg-[#F4F2EE] px-6 font-bold text-[#0A0A0B] hover:border-[#2997FF] hover:bg-[#2997FF] hover:text-white"
        >
          Begin Debrief
        </Button>
        <button onClick={handleDismiss} className="p-1 text-[#F4F2EE]/40 hover:text-[#F4F2EE]" aria-label="Dismiss weekly debrief banner">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
