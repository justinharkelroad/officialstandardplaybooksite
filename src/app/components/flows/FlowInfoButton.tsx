import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Hover copy that helps a user pick the RIGHT flow for the moment they're in.
// Keyed on flow_templates.slug. Each line leads with "Use it when…" and
// separates the flow from its nearest neighbor.
export const FLOW_INFO: Record<string, string> = {
  grateful:
    "Use it when something good is hitting you and you don't want it to just pass. It breaks your gratitude down — story vs. facts, what you actually want, the lesson underneath — and lands on one move in the next 24 hours to honor it. Reach for this when life is good and you want to go deeper, not just feel it and move on.",
  idea:
    "Use it when something lit up — an idea, project, or opportunity — and you want to take it seriously before it fades. It forces the idea specific, makes you name four measurable facts to track, and weighs what changes if you execute against what it costs if you don't. Pick this to pressure-test a possibility and walk out with a real plan.",
  war:
    "Use it when you're facing a real goal or hard challenge you intend to win. Heavier than the Idea Flow: you name the enemy, define what winning looks like, and map four fronts — each with its obstacle, the move to beat it, and who's in the foxhole with you. Reach for this when it's not just an idea, it's a fight, and you need a campaign.",
  irritation:
    "Use it when someone or something is getting to you — frustrated, angry, resentful, stuck in a loop. It surfaces the story you're telling yourself, tests it against the facts, plays out where it ends if you ignore it, then has you write a new story that actually serves you. Reach for this to defuse the charge instead of stewing or reacting.",
  discovery:
    "Use it right after you learn something worth keeping — a book, training, podcast, conversation, or experience. It captures what landed, pulls the one lesson, and makes you choose which part of your life to apply it in so it doesn't get forgotten by tomorrow. Pick this over Gratitude when the win is something you learned, not just something you feel.",
  prayer:
    "Use it when you're carrying something — a person, a situation, a weight — and want to bring it to God. No Core 4 lens: you name what's on your heart, speak directly to Him, and walk out with the lesson and one action that lives the prayer out. Reach for this to lay something down and get clearer.",
  bible:
    "Use it during or right after time in the Word. Anchored to a specific scripture, it turns what you read into Start, Stop, and Keep commitments — each with how you'll measure it and the belief that holds it in place. Pick this over the Prayer Flow when you want the Word to drive specific action, not just a conversation with God.",
};

interface FlowInfoButtonProps {
  slug?: string | null;
  className?: string;
}

export function FlowInfoButton({ slug, className }: FlowInfoButtonProps) {
  const text = slug ? FLOW_INFO[slug.trim().toLowerCase()] : undefined;
  if (!text) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Why use this flow"
          // Card is clickable (starts the flow); keep the info tap from launching it.
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            className,
          )}
        >
          <Info className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="end"
        className="max-w-xs whitespace-normal text-left leading-relaxed"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
