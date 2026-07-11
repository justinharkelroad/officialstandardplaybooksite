import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Search, Plus, GripVertical, Dumbbell, Heart, Briefcase, Trash2 } from "lucide-react";
import { LatinCross } from "@/app/components/icons/LatinCross";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { FocusItem, PlaybookDomain } from "@/app/hooks/useFocusItems";

const domainFilters: { key: PlaybookDomain | "all"; label: string; icon?: React.ElementType; color?: string }[] = [
  { key: "all", label: "All" },
  { key: "body", label: "Body", icon: Dumbbell, color: "text-[#2997FF]" },
  { key: "being", label: "Being", icon: LatinCross, color: "text-[#2997FF]" },
  { key: "balance", label: "Balance", icon: Heart, color: "text-[#2997FF]" },
  { key: "business", label: "Biz", icon: Briefcase, color: "text-[#2997FF]" },
];

interface PlaybookBenchPanelProps {
  items: FocusItem[];
  onSchedule: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export function PlaybookBenchPanel({
  items,
  onSchedule,
  onDelete,
  onCreateNew,
}: PlaybookBenchPanelProps) {
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<PlaybookDomain | "all">("all");

  const filtered = items
    .filter((item) => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (domainFilter !== "all" && item.domain !== domainFilter) return false;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

  const uncompletedItems = filtered.filter((i) => !i.completed);
  const completedItems = filtered.filter((i) => i.completed);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">The Bench</h3>
        <Button variant="ghost" size="sm" onClick={onCreateNew} className="h-7 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          New
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Filter bench..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Domain filter chips */}
      <div className="flex gap-1 flex-wrap">
        {domainFilters.map((df) => (
          <button
            key={df.key}
            onClick={() => setDomainFilter(df.key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              domainFilter === df.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {df.icon && <df.icon className={cn("h-3 w-3", domainFilter !== df.key && df.color)} />}
            {df.label}
          </button>
        ))}
      </div>

      {/* Bench items */}
      <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
        {uncompletedItems.length === 0 && completedItems.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            {search || domainFilter !== "all" ? "No matching items" : "Your bench is empty"}
          </p>
        ) : (
          <>
            {uncompletedItems.map((item) => (
              <BenchItem key={item.id} item={item} onSchedule={onSchedule} onDelete={onDelete} />
            ))}
            {completedItems.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">
                  Completed ({completedItems.length})
                </p>
                {completedItems.slice(0, 5).map((item) => (
                  <BenchItem key={item.id} item={item} onSchedule={onSchedule} onDelete={onDelete} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BenchItem({
  item,
  onSchedule,
  onDelete,
}: {
  item: FocusItem;
  onSchedule: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `bench-${item.id}`,
    data: { itemId: item.id, title: item.title },
    disabled: item.completed,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const domainColors: Record<string, string> = {
    body: "bg-[#2997FF]",
    being: "bg-[#2997FF]",
    balance: "bg-[#2997FF]",
    business: "bg-[#2997FF]",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-md border px-2.5 py-2 text-sm transition-all",
        item.completed ? "bg-muted/30 border-border/50" : "bg-card border-border hover:shadow-sm",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      {!item.completed && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
      )}
      {item.domain && (
        <div className={cn("h-2 w-2 rounded-full shrink-0", domainColors[item.domain])} />
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "flex-1 truncate text-xs cursor-default",
              item.completed && "line-through text-muted-foreground"
            )}
          >
            {item.title}
          </span>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[250px] text-xs">
          <p className="whitespace-normal">{item.title}</p>
          {item.description && (
            <p className="text-muted-foreground mt-1 whitespace-normal">{item.description}</p>
          )}
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!item.completed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onSchedule(item.id)}
            title="Schedule"
          >
            <Calendar className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(item.id)}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
