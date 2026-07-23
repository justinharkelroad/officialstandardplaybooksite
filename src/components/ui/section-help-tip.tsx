import { forwardRef } from "react";
import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { spScopeClass } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

interface SectionHelpTipProps {
  title?: string;
  body: string;
}

export const SectionHelpTip = forwardRef<HTMLSpanElement, SectionHelpTipProps>(
  ({ title, body }, ref) => {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={ref}
            role="button"
            tabIndex={0}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
            aria-label={title ? `${title} help` : "Section help"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <CircleHelp className="h-3.5 w-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          collisionPadding={12}
          className={cn(
            spScopeClass(),
            "w-max max-w-[calc(100vw-24px)] p-3 sm:max-w-[320px]",
          )}
        >
          {title && <p className="text-xs font-semibold mb-1">{title}</p>}
          <p className="text-xs leading-relaxed">{body}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  }
);

SectionHelpTip.displayName = "SectionHelpTip";
