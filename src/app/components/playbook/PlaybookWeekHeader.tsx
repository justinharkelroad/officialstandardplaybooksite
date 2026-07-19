import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { format, addDays, isToday, isBefore, startOfDay } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface PlaybookWeekHeaderProps {
  weekStart: Date;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  weeklyPoints: number;
  dayItemCounts: Record<string, number>;
  dayCompletedCounts: Record<string, number>;
}

function DroppableDayTab({
  dateStr,
  index,
  selected,
  isCurrentDay,
  isPast,
  isBonus,
  label,
  dayNum,
  total,
  completed,
  onSelectDay,
}: {
  dateStr: string;
  index: number;
  selected: boolean;
  isCurrentDay: boolean;
  isPast: boolean;
  isBonus: boolean;
  label: string;
  dayNum: string;
  total: number;
  completed: number;
  onSelectDay: (i: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `day-drop-${dateStr}`, data: { dateStr } });

  return (
    <button
      ref={setNodeRef}
      onClick={() => onSelectDay(index)}
      className={cn(
        "flex min-w-0 flex-col items-center px-0.5 py-2 text-xs transition-all sm:px-1",
        selected
          ? isBonus
            ? "bg-muted-foreground/80 text-primary-foreground shadow-sm"
            : "bg-primary text-primary-foreground shadow-sm"
          : isCurrentDay
            ? isBonus
              ? "bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20"
              : "bg-primary/10 text-primary hover:bg-primary/20"
            : isBonus
              ? "bg-muted/30 text-muted-foreground/60 hover:bg-muted/50"
              : "bg-muted/50 text-muted-foreground hover:bg-muted",
        isPast && !selected && "opacity-60",
        isOver && total < 4 && "ring-2 ring-[#2997FF] ring-offset-2 ring-offset-background scale-105"
      )}
    >
      <span className="font-medium sm:hidden">{label.slice(0, 1)}</span>
      <span className="hidden font-medium sm:inline">{label}</span>
      <span className={cn(
        "text-lg font-bold leading-tight",
        selected ? "text-primary-foreground" : ""
      )}>
        {dayNum}
      </span>
      {isBonus ? (
        <span className={cn(
          "text-[9px] font-medium uppercase tracking-wider mt-1",
          selected ? "text-primary-foreground/70" : "text-muted-foreground/50"
        )}>
          Bonus
        </span>
      ) : (
        /* Completion dots */
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: Math.max(total, 0) }, (_, j) => (
            <div
              key={j}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                j < completed
                  ? selected ? "bg-primary-foreground" : "bg-primary"
                  : selected ? "bg-primary-foreground/30" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </button>
  );
}

export function PlaybookWeekHeader({
  weekStart,
  selectedDayIndex,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
  weeklyPoints,
  dayItemCounts,
  dayCompletedCounts,
}: PlaybookWeekHeaderProps) {
  const weekLabel = `Week of ${format(weekStart, "MMM d")}`;
  const today = startOfDay(new Date());
  const progress = Math.min(weeklyPoints / 20, 1);
  const circumference = 2 * Math.PI * 15.5; // ~97.4

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const isCurrentDay = isToday(date);
    const isPast = isBefore(date, today) && !isCurrentDay;
    const isBonus = i >= 5; // Sat (5) and Sun (6)
    const total = dayItemCounts[dateStr] || 0;
    const completed = dayCompletedCounts[dateStr] || 0;
    return { date, dateStr, label: format(date, "EEE"), dayNum: format(date, "d"), isCurrentDay, isPast, isBonus, total, completed };
  });

  return (
    <div className="space-y-3">
      {/* Week navigation + score ring */}
      <div className="flex min-w-0 items-center justify-between gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Mini progress ring */}
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="2.5"
              />
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke={weeklyPoints >= 20 ? "hsl(142, 71%, 45%)" : "hsl(var(--primary))"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${progress * circumference} ${circumference}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {weeklyPoints >= 20 ? (
                <Target className="h-4 w-4 text-[#2997FF]" />
              ) : (
                <span className="text-xs font-bold">{weeklyPoints}</span>
              )}
            </div>
          </div>

          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold">{weekLabel}</p>
            <p className="text-xs text-muted-foreground">
              <span className={cn("font-medium", weeklyPoints >= 20 ? "text-[#2997FF]" : "text-foreground")}>
                {weeklyPoints}
              </span>
              <span>/20 pts</span>
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day tabs — each is a drop target */}
      <div className="grid min-w-0 grid-cols-7 gap-1">
        {days.map((day, i) => (
          <DroppableDayTab
            key={day.dateStr}
            dateStr={day.dateStr}
            index={i}
            selected={selectedDayIndex === i}
            isCurrentDay={day.isCurrentDay}
            isPast={day.isPast}
            isBonus={day.isBonus}
            label={day.label}
            dayNum={day.dayNum}
            total={day.total}
            completed={day.completed}
            onSelectDay={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
}
