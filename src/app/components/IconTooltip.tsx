import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { spScopeClass } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

type IconTooltipProps = {
  label: string;
  children: ReactNode;
  detail?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  disabled?: boolean;
};

/**
 * Standard help treatment for icon-only and consequence-heavy controls.
 * The trigger remains usable by touch and keyboard; the tooltip is additive.
 */
export function IconTooltip({
  label,
  detail,
  children,
  side = "top",
  align = "center",
  disabled = false,
}: IconTooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={180}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          collisionPadding={12}
          className={cn(
            spScopeClass(),
            "max-w-[280px] border-foreground/20 bg-popover p-3 text-left text-popover-foreground",
          )}
        >
          <p className="text-xs font-semibold">{label}</p>
          {detail ? (
            <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
              {detail}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
