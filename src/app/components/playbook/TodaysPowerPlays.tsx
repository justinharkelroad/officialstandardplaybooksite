import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useFocusItems } from "@/app/hooks/useFocusItems";
import { getWeekKey } from "@/app/lib/date-utils";
import { PersonalGrowthPod } from "@/app/components/personal-growth/PersonalGrowthPod";
import { PowerPlayChecklistItem } from "./PowerPlayChecklistItem";
import { domainConfig } from "./playbook-constants";
import type { PlaybookDomain } from "@/app/hooks/useFocusItems";

type TodaysPowerPlaysProps = {
  variant?: "default" | "personal-growth";
};

export function TodaysPowerPlays({
  variant = "default",
}: TodaysPowerPlaysProps) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const weekKey = getWeekKey(new Date());
  const { items, isLoading, completeItem, uncompleteItem } = useFocusItems(weekKey);

  const todayItems = useMemo(() => {
    const filtered = items.filter(
      (i) => i.zone === "power_play" && i.scheduled_date === todayStr
    );
    // Sort by scheduled_time ascending, nulls last
    return filtered.sort((a, b) => {
      const aTime = a.scheduled_time ?? "";
      const bTime = b.scheduled_time ?? "";
      if (!aTime && !bTime) return 0;
      if (!aTime) return 1;
      if (!bTime) return -1;
      return aTime.localeCompare(bTime);
    });
  }, [items, todayStr]);

  const completedCount = todayItems.filter((i) => i.completed).length;
  const oneBigThing = useMemo(
    () => items.find((item) => item.zone === "one_big_thing"),
    [items],
  );
  const isPersonalGrowth = variant === "personal-growth";

  const handleToggle = (id: string) => {
    const item = todayItems.find((i) => i.id === id);
    if (!item) return;
    if (item.completed) {
      uncompleteItem.mutate(id);
    } else {
      completeItem.mutate(id);
    }
  };

  // Dashboard embeds stay compact; the Personal Growth page always keeps the
  // planning entry point visible, even before this week's plays are set.
  if (isLoading) return null;
  if (todayItems.length === 0 && !isPersonalGrowth) return null;

  return (
    <PersonalGrowthPod
      eyebrow={isPersonalGrowth ? "Weekly action plan" : "Scheduled Actions"}
      title={isPersonalGrowth ? "Power Plays" : "Today's Power Plays"}
      tagline={
        isPersonalGrowth
          ? "Set the few actions that move your targets forward, then work them here."
          : undefined
      }
      icon={ListChecks}
      accent="month"
      iconAccent="today"
      active={Boolean(oneBigThing?.title) || todayItems.length > 0}
      badge={
        todayItems.length > 0 ? (
          <Badge variant="secondary" className="shrink-0">
            {completedCount}/{todayItems.length} done
          </Badge>
        ) : undefined
      }
      cta={
        isPersonalGrowth
          ? { to: "/app/weekly-playbook", label: "Set Power Plays" }
          : undefined
      }
    >
      {isPersonalGrowth ? (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            One Big Thing
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            {oneBigThing?.title ?? "Choose the main win for this week."}
          </p>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/weekly-playbook">
              View Week
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {todayItems.length > 0 ? (
        <div className="space-y-0.5">
          {todayItems.map((item) => (
            <PowerPlayChecklistItem
              key={item.id}
              id={item.id}
              title={item.title}
              completed={item.completed}
              scheduledTime={item.scheduled_time}
              categoryLabel={
                item.sub_tag?.name ??
                (item.domain ? domainConfig[item.domain]?.label ?? null : null)
              }
              categoryDomain={item.domain as PlaybookDomain | null}
              onToggleComplete={handleToggle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
          No Power Plays are scheduled for today. Set this week's plays to see
          them here.
        </div>
      )}
    </PersonalGrowthPod>
  );
}
