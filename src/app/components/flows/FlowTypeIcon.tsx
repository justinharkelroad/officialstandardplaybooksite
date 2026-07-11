import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { AnnoyedIcon } from '@/app/components/icons/annoyed';
import { BrainIcon } from '@/app/components/icons/brain';
import { CrossIcon } from '@/app/components/icons/cross';
import { DailyFrameIcon } from '@/app/components/icons/daily-frame';
import { HandFistIcon } from '@/app/components/icons/hand-fist';
import { HandHeartIcon } from '@/app/components/icons/hand-heart';
import { HandsPrayingIcon } from '@/app/components/icons/hands-praying';
import { TelescopeIcon } from '@/app/components/icons/telescope';
import { cn } from '@/lib/utils';
import { NotebookPen } from "lucide-react";

export type FlowTypeIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type FlowTypeIconComponent = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> &
  { size?: number } &
  RefAttributes<FlowTypeIconHandle>
>;

const FLOW_TYPE_ICONS: Record<string, FlowTypeIconComponent> = {
  grateful: HandHeartIcon as FlowTypeIconComponent,
  idea: BrainIcon as FlowTypeIconComponent,
  war: HandFistIcon as FlowTypeIconComponent,
  irritation: AnnoyedIcon as FlowTypeIconComponent,
  discovery: TelescopeIcon as FlowTypeIconComponent,
  prayer: HandsPrayingIcon as FlowTypeIconComponent,
  bible: CrossIcon as FlowTypeIconComponent,
  'daily-frame': DailyFrameIcon as FlowTypeIconComponent,
};

const FLOW_ICON_SIZES = {
  sm: 20,
  md: 28,
  lg: 44,
  xl: 56,
} as const;

type FlowTypeIconSize = keyof typeof FLOW_ICON_SIZES;

interface FlowTypeIconProps {
  flowSlug?: string | null;
  fallback?: ReactNode;
  size?: FlowTypeIconSize | number;
  active?: boolean;
  animateOnHover?: boolean;
  className?: string;
  iconClassName?: string;
  'aria-label'?: string;
}

function normalizeFlowSlug(flowSlug?: string | null) {
  return flowSlug?.trim().toLowerCase().replace(/\s+/g, '-') ?? '';
}

export function FlowTypeIcon({
  flowSlug,
  fallback,
  size = 'md',
  active = false,
  animateOnHover = false,
  className,
  iconClassName,
  'aria-label': ariaLabel,
}: FlowTypeIconProps) {
  const iconRef = useRef<FlowTypeIconHandle | null>(null);
  const reducedMotion = useReducedMotion();
  const normalizedSlug = normalizeFlowSlug(flowSlug);
  const Icon = FLOW_TYPE_ICONS[normalizedSlug];
  const resolvedSize = typeof size === 'number' ? size : FLOW_ICON_SIZES[size];

  useEffect(() => {
    if (!Icon || reducedMotion) {
      void iconRef.current?.stopAnimation();
      return;
    }

    if (active) {
      void iconRef.current?.startAnimation();
      return;
    }

    void iconRef.current?.stopAnimation();
  }, [Icon, active, reducedMotion]);

  const startHoverAnimation = useCallback(() => {
    if (!Icon || !animateOnHover || reducedMotion) return;
    void iconRef.current?.startAnimation();
  }, [Icon, animateOnHover, reducedMotion]);

  const stopHoverAnimation = useCallback(() => {
    if (!Icon || !animateOnHover) return;
    void iconRef.current?.stopAnimation();
  }, [Icon, animateOnHover]);

  if (!Icon) {
    return (
      <span
        className={cn('inline-flex items-center justify-center leading-none', className)}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
      >
        {fallback ?? <NotebookPen className="h-[0.9em] w-[0.9em]" aria-hidden />}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center justify-center text-current', className)}
      onMouseEnter={startHoverAnimation}
      onMouseLeave={stopHoverAnimation}
      onFocus={startHoverAnimation}
      onBlur={stopHoverAnimation}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <Icon
        key={normalizedSlug}
        ref={iconRef}
        size={resolvedSize}
        className={cn('flex items-center justify-center', iconClassName)}
      />
    </span>
  );
}

export function hasFlowTypeIcon(flowSlug?: string | null) {
  return Boolean(FLOW_TYPE_ICONS[normalizeFlowSlug(flowSlug)]);
}
