import { PlaybookItemCard } from "./PlaybookItemCard";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import type { FocusItem, PlaybookDomain } from "@/app/hooks/useFocusItems";

interface PlaybookDayViewProps {
  date: Date;
  items: FocusItem[];
  queueItems: FocusItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUnschedule: (id: string) => void;
  readOnly?: boolean;
  isBonus?: boolean;
}

export function PlaybookDayView({
  date,
  items,
  queueItems,
  onToggleComplete,
  onDelete,
  onUnschedule,
  readOnly,
  isBonus,
}: PlaybookDayViewProps) {
  const today = isToday(date);
  const completedCount = items.filter((i) => i.completed).length;
  const dayLabel = format(date, "EEEE, MMM d");

  return (
    <div className="space-y-3">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <h3
          className={cn(
            "text-sm font-semibold",
            today && !isBonus && "text-primary",
            isBonus && "text-muted-foreground"
          )}
        >
          {today ? "Today" : dayLabel}
          {today && (
            <span className="text-xs text-muted-foreground font-normal ml-2">
              {format(date, "MMM d")}
            </span>
          )}
          {isBonus && (
            <span className="text-[10px] font-normal text-muted-foreground/60 ml-2">
              Bonus — doesn't count toward points
            </span>
          )}
        </h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{items.length} done
        </span>
      </div>

      {/* Power Play slots */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          No Power Plays scheduled
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <PlaybookItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              domain={item.domain as PlaybookDomain | null}
              subTagName={item.sub_tag?.name ?? null}
              sourceType={item.source_type}
              sourceName={item.source_name}
              completed={item.completed}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onUnschedule={onUnschedule}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {/* Queue section (collapsed by default on non-today days) */}
      {today && queueItems.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Queue ({queueItems.length})
          </p>
          <div className="space-y-2">
            {queueItems.map((item) => (
              <PlaybookItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                domain={item.domain as PlaybookDomain | null}
                subTagName={item.sub_tag?.name ?? null}
                sourceType={item.source_type}
                sourceName={item.source_name}
                completed={item.completed}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUnschedule={onUnschedule}
                readOnly={readOnly}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
