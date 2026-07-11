import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, startOfWeek } from "date-fns";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";
import type { PlaybookTag } from "@/app/hooks/usePlaybookTags";

interface ScheduleItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemTitle: string;
  weekStart: Date;
  tags: PlaybookTag[];
  dayItemCounts: Record<string, number>;
  onConfirm: (date: string, domain?: PlaybookDomain, subTagId?: string, scheduledTime?: string) => void;
  defaultDate?: string;
}

const domainOptions: { value: PlaybookDomain; label: string }[] = [
  { value: "body", label: "Body" },
  { value: "being", label: "Being" },
  { value: "balance", label: "Balance" },
  { value: "business", label: "Business" },
];

export function ScheduleItemDialog({
  open,
  onOpenChange,
  itemTitle,
  weekStart,
  tags,
  dayItemCounts,
  onConfirm,
  defaultDate,
}: ScheduleItemDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [domain, setDomain] = useState<PlaybookDomain | "">("");
  const [subTagId, setSubTagId] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");

  // Pre-select date when opened from drag-and-drop
  useEffect(() => {
    if (open && defaultDate) {
      setSelectedDate(defaultDate);
    }
  }, [open, defaultDate]);

  // Reset state when dialog opens/closes
  const resetState = () => {
    setSelectedDate("");
    setDomain("");
    setSubTagId("");
    setScheduledTime("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState();
    onOpenChange(nextOpen);
  };

  // Generate Mon-Sun for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const count = dayItemCounts[dateStr] || 0;
    const isBonus = i >= 5; // Sat & Sun
    return { date, dateStr, label: format(date, "EEE, MMM d"), count, isBonus };
  });

  const availableTags = domain ? tags.filter((t) => t.domain === domain) : [];

  // Generate time options (30-min increments, 6 AM to 9 PM)
  const timeOptions = Array.from({ length: 31 }, (_, i) => {
    const totalMinutes = 360 + i * 30; // start at 6:00 AM (360 min)
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const label = `${displayH}:${String(m).padStart(2, "0")} ${period}`;
    return { value, label };
  });

  const handleConfirm = () => {
    if (!selectedDate) return;
    const timeVal = scheduledTime && scheduledTime !== "none" ? scheduledTime : undefined;
    onConfirm(selectedDate, domain || undefined, subTagId || undefined, timeVal);
    handleOpenChange(false);
  };

  const selectedDayCount = dayItemCounts[selectedDate] || 0;
  const isFull = selectedDayCount >= 4;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Power Play</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              &ldquo;{itemTitle}&rdquo;
            </p>
          </div>

          {/* Day picker */}
          <div className="space-y-2">
            <Label>Day</Label>
            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((wd) => (
                <button
                  key={wd.dateStr}
                  disabled={wd.count >= 4}
                  onClick={() => setSelectedDate(wd.dateStr)}
                  className={`
                    flex flex-col items-center rounded-lg border p-2 text-xs transition-all
                    ${selectedDate === wd.dateStr
                      ? wd.isBonus
                        ? "border-muted-foreground bg-muted-foreground/10 ring-1 ring-muted-foreground"
                        : "border-primary bg-primary/5 ring-1 ring-primary"
                      : wd.isBonus
                        ? "border-border/50 bg-muted/30 text-muted-foreground/60 hover:border-muted-foreground/50"
                        : "border-border hover:border-primary/50"
                    }
                    ${wd.count >= 4 ? "border-destructive/30 bg-destructive/5 opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <span className="font-medium">{format(wd.date, "EEE")}</span>
                  <span className={wd.isBonus ? "text-muted-foreground/60" : "text-muted-foreground"}>{format(wd.date, "d")}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {wd.count}/4
                  </span>
                </button>
              ))}
            </div>
            {isFull && selectedDate && (
              <p className="text-xs text-destructive">This day already has 4 Power Plays.</p>
            )}
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label>Time (optional)</Label>
            <Select value={scheduledTime} onValueChange={setScheduledTime}>
              <SelectTrigger>
                <SelectValue placeholder="No time set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No time set</SelectItem>
                {timeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label>Domain (optional)</Label>
            <Select value={domain} onValueChange={(v) => { setDomain(v as PlaybookDomain); setSubTagId(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain..." />
              </SelectTrigger>
              <SelectContent>
                {domainOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-tag */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <Label>Sub-tag (optional)</Label>
              <Select value={subTagId} onValueChange={setSubTagId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-tag..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDate || isFull}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
