import { useState, useMemo } from 'react';
import { useCore4Stats, Core4Domain } from '@/app/hooks/useCore4Stats';
import { useFlowStats } from '@/app/hooks/useFlowStats';
import { useFocusItems } from '@/app/hooks/useFocusItems';
import { usePlaybookStats } from '@/app/hooks/usePlaybookStats';
import { WeeklyHistoryCard } from '@/app/components/core4/WeeklyHistoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, Heart, Briefcase, Flame, ChevronLeft, ChevronRight, 
  Loader2, Zap
} from 'lucide-react';
import { LatinCross } from '@/app/components/icons/LatinCross';
import { format, addDays, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { SmartBackButton } from '@/app/components/SmartBackButton';
import { HelpButton } from '@/app/components/HelpButton';
import { CadenceMap } from '@/app/components/CadenceMap';
import { IconTooltip } from '@/app/components/IconTooltip';
import { AppIcon } from "@/app/components/icons/appIcons";
import { useQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { getCurrentQuarter } from "@/app/lib/quarterUtils";

const domains: { key: Core4Domain; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'body', label: 'BODY', icon: Dumbbell, color: 'from-[#2997FF] to-[#2997FF]' },
  { key: 'being', label: 'BEING', icon: LatinCross, color: 'from-[#2997FF] to-[#2997FF]' },
  { key: 'balance', label: 'BALANCE', icon: Heart, color: 'from-[#2997FF] to-[#2997FF]' },
  { key: 'business', label: 'BUSINESS', icon: Briefcase, color: 'from-[#2997FF] to-[#2997FF]' },
];

export default function Core4() {
  const {
    todayEntry,
    todayPoints,
    weeklyPoints,
    weeklyGoal,
    currentStreak,
    longestStreak,
    totalPoints,
    weeklyActivity,
    entries,
    loading,
    toggleDomain,
    isDateEditable,
    selectedDate,
    setSelectedDate,
    selectedWeekStart,
    navigateWeek,
    getEntryForDate,
  } = useCore4Stats();

  const flowStats = useFlowStats();
  const playbookStats = usePlaybookStats();
  const { items: playbookItems } = useFocusItems();
  const { data: quarterlyTargets } = useQuarterlyTargets(getCurrentQuarter());
  const dailyProofByDomain: Record<Core4Domain, string[]> = {
    body: Array.isArray(quarterlyTargets?.body_daily_actions) ? quarterlyTargets.body_daily_actions : [],
    being: Array.isArray(quarterlyTargets?.being_daily_actions) ? quarterlyTargets.being_daily_actions : [],
    balance: Array.isArray(quarterlyTargets?.balance_daily_actions) ? quarterlyTargets.balance_daily_actions : [],
    business: Array.isArray(quarterlyTargets?.business_daily_actions) ? quarterlyTargets.business_daily_actions : [],
  };

  const core4EntriesForHistory = useMemo(() => {
    return entries.map(entry => ({
      date: entry.date,
      points: (entry.body_completed ? 1 : 0) +
              (entry.being_completed ? 1 : 0) +
              (entry.balance_completed ? 1 : 0) +
              (entry.business_completed ? 1 : 0),
    }));
  }, [entries]);

  // Check if domain is completed for the selected date
  const isDomainCompleted = (domain: Core4Domain): boolean => {
    const entry = getEntryForDate(format(selectedDate, 'yyyy-MM-dd'));
    if (!entry) return false;
    return entry[`${domain}_completed`] as boolean;
  };

  // Get points for selected date
  const selectedDatePoints = useMemo(() => {
    const entry = getEntryForDate(format(selectedDate, 'yyyy-MM-dd'));
    if (!entry) return 0;
    return (entry.body_completed ? 1 : 0) +
           (entry.being_completed ? 1 : 0) +
           (entry.balance_completed ? 1 : 0) +
           (entry.business_completed ? 1 : 0);
  }, [selectedDate, getEntryForDate]);

  const handleToggle = async (domain: Core4Domain) => {
    await toggleDomain(domain, selectedDate);
  };

  const canEdit = isDateEditable(selectedDate);

  // Combined score: Core 4 weekly (max 28) + Flow weekly (max 7) + Playbook weekly (max 21) = 56
  const combinedWeeklyScore = weeklyPoints + flowStats.weeklyProgress + playbookStats.weeklyPoints;
  const combinedWeeklyGoal = 56;
  const combinedPercentage = Math.min(
    Math.round((combinedWeeklyScore / combinedWeeklyGoal) * 100),
    100
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 max-w-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="mx-auto flex max-w-4xl min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-3">
            <SmartBackButton
              authenticatedPath="/app"
              authenticatedLabel="Hub"
              className="h-11 shrink-0 px-2 sm:px-3"
            />
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="text-lg font-bold sm:text-xl">Personal Growth</h1>
                <HelpButton videoKey="core4_page" />
              </div>
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">Core 4, Flow, and Weekly Playbook tracker</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between border-t border-border/60 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-lg font-bold">{combinedWeeklyScore} / {combinedWeeklyGoal}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl min-w-0 space-y-6 px-0 py-5 sm:space-y-8 sm:px-4 sm:py-6">
        <CadenceMap active="daily" compact showHandoffNote />

        {/* Week Navigator */}
        <Card className="bg-card border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <IconTooltip label="View previous week">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateWeek('prev')}
                  aria-label="View previous week"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </IconTooltip>
              <span className="min-w-0 px-2 text-center text-sm font-medium sm:text-base">
                {format(selectedWeekStart, 'MMM d')} - {format(addDays(selectedWeekStart, 6), 'MMM d, yyyy')}
              </span>
              <IconTooltip
                label="View next week"
                detail="Future weeks stay unavailable until they begin."
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateWeek('next')}
                  disabled={addDays(selectedWeekStart, 7) > new Date()}
                  aria-label="View next week"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </IconTooltip>
            </div>
            
            <div className="grid min-w-0 grid-cols-7 gap-1 sm:gap-2">
              {weeklyActivity.map((day) => (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDate(day.date)}
                  className={cn(
                    "flex min-w-0 flex-col items-center px-0.5 py-2 transition-all sm:p-2",
                    day.isToday && "ring-2 ring-primary",
                    day.points === 4 && "bg-gradient-to-br from-[#2997FF]/20 to-[#2997FF]/20",
                    day.isFuture && "opacity-40"
                  )}
                >
                  <span className="text-xs text-muted-foreground">{day.dayLabel}</span>
                  <span className={cn(
                    "text-lg font-bold",
                    day.points === 4 ? "text-[#2997FF]" : day.points > 0 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {day.points}
                  </span>
                  {day.points === 4 && <Flame className="h-3 w-3 text-[#2997FF]" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Date Display */}
        <div className="text-center">
          <p className="text-xl font-bold sm:text-2xl">
            {format(selectedDate, 'EEEE, MMMM do yyyy')}
          </p>
          {!isToday(selectedDate) && (
            <Button 
              variant="link" 
              className="text-primary"
              onClick={() => setSelectedDate(new Date())}
            >
              Go to Today
            </Button>
          )}
        </div>

        {/* Main Content - 2 column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Domain Buttons */}
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
            {domains.map(({ key, label, icon: Icon, color }) => {
              const completed = isDomainCompleted(key);
              const proofIdeas = dailyProofByDomain[key];
              const primaryProof = proofIdeas[0];
              return (
                <IconTooltip
                  key={key}
                  label={completed ? `${label} is complete` : `Mark ${label} complete`}
                  detail={
                    primaryProof
                      ? `Today's proof: ${primaryProof}`
                      : "Complete the action you committed to in this domain, then mark it here."
                  }
                >
                  <button
                    onClick={() => handleToggle(key)}
                    disabled={!canEdit}
                    aria-pressed={completed}
                    aria-label={
                      primaryProof
                        ? `${completed ? "Mark incomplete" : "Mark complete"}: ${label}. Today's proof: ${primaryProof}`
                        : `${completed ? "Mark incomplete" : "Mark complete"}: ${label}`
                    }
                    className={cn(
                      "flex min-w-0 flex-col items-center justify-center gap-2 p-4 transition-all duration-300 sm:p-8",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      completed
                        ? `bg-gradient-to-br ${color} text-white shadow-xl scale-[1.02]`
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                      !canEdit && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Icon className={cn("h-10 w-10", completed && "text-white")} />
                    <span className={cn(
                      "text-sm font-bold tracking-wider",
                      completed ? "text-white" : "text-muted-foreground"
                    )}>
                      {label}
                    </span>
                    <span
                      className={cn(
                        "line-clamp-2 min-h-8 text-center text-[11px] font-normal normal-case leading-4 tracking-normal",
                        completed ? "text-white/80" : "text-muted-foreground",
                      )}
                    >
                      {primaryProof ?? "Complete today's commitment"}
                      {proofIdeas.length > 1 ? ` +${proofIdeas.length - 1} more` : ""}
                    </span>
                  </button>
                </IconTooltip>
              );
            })}
          </div>

          {/* Right: Status Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-8xl">
                {selectedDatePoints === 4 ? <AppIcon name="streak" className="h-5 w-5" /> : <AppIcon name="reflect" className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-4xl font-bold">{selectedDatePoints}/4</p>
                <p className="text-muted-foreground">
                  {isToday(selectedDate) ? "Today's Score" : format(selectedDate, 'MMM d') + ' Score'}
                </p>
              </div>
              {currentStreak > 0 && isToday(selectedDate) && (
                <div className="flex items-center justify-center gap-2 text-[#2997FF]">
                  <Flame className="h-6 w-6" />
                  <span className="text-xl font-bold">{currentStreak} day streak!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score Section - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* The Score */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">THE SCORE</p>
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${combinedPercentage * 2.83} 283`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{combinedWeeklyScore}</span>
                  <span className="text-xs text-muted-foreground">/ {combinedWeeklyGoal}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Core 4: {weeklyPoints}/28</p>
                <p>Flow: {flowStats.weeklyProgress}/7</p>
                <p>Playbook: {playbookStats.weeklyPoints}/21</p>
              </div>
            </CardContent>
          </Card>

          {/* The Streaks */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 text-center">THE STREAKS</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-[#2997FF]" />
                  <p className="text-xl font-bold">{flowStats.currentStreak}</p>
                  <p className="text-xs text-muted-foreground">Flow</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-[#2997FF]" />
                  <p className="text-xl font-bold">{currentStreak}</p>
                  <p className="text-xs text-muted-foreground">Core 4</p>
                </div>
              </div>
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>Longest: Flow {flowStats.longestStreak} | Core {longestStreak}</p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Weekly History */}
        <WeeklyHistoryCard 
          core4Entries={core4EntriesForHistory}
          flowSessions={flowStats.sessions}
          playbookItems={playbookItems}
        />
      </div>
    </div>
  );
}
