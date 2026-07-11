import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parse, format } from "date-fns";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";
import { domainConfig } from "./playbook-constants";

interface PowerPlayChecklistItemProps {
  id: string;
  title: string;
  completed: boolean;
  scheduledTime?: string | null;
  categoryLabel: string | null;
  categoryDomain: PlaybookDomain | null;
  onToggleComplete: (id: string) => void;
}

function formatTime(timeStr: string): string {
  try {
    // Postgres TIME comes as "HH:MM:SS" or "HH:MM"
    const normalized = timeStr.length === 5 ? timeStr + ":00" : timeStr;
    const parsed = parse(normalized, "HH:mm:ss", new Date());
    return format(parsed, "h:mm a");
  } catch {
    return timeStr;
  }
}

export function PowerPlayChecklistItem({
  id,
  title,
  completed,
  scheduledTime,
  categoryLabel,
  categoryDomain,
  onToggleComplete,
}: PowerPlayChecklistItemProps) {
  const dc = categoryDomain ? domainConfig[categoryDomain] : null;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg p-3 transition-colors",
        completed ? "opacity-70" : "hover:bg-muted/50"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggleComplete(id)}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            completed && "line-through text-muted-foreground"
          )}
        >
          {title}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {scheduledTime && (
            <span className="text-xs text-muted-foreground">
              {formatTime(scheduledTime)}
            </span>
          )}
          {categoryLabel && dc && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-5 border font-medium",
                dc.bg,
                dc.color
              )}
            >
              {categoryLabel}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
