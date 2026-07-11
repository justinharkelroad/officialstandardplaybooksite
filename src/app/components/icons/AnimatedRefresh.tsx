import { forwardRef, useCallback } from "react";
import type { SVGProps } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedRefreshProps
  extends Omit<
    SVGProps<SVGSVGElement>,
    | "ref"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
    | "onDrag"
    | "onDragEnd"
    | "onDragEnter"
    | "onDragExit"
    | "onDragLeave"
    | "onDragOver"
    | "onDragStart"
    | "onDrop"
    | "values"
  > {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

const AnimatedRefresh = forwardRef<SVGSVGElement, AnimatedRefreshProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 2,
      className,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [scope, animate] = useAnimate();
    const shouldReduceMotion = useReducedMotion();

    const setRefs = useCallback(
      (node: SVGSVGElement | null) => {
        (scope as unknown as { current: SVGSVGElement | null }).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, scope],
    );

    const start = useCallback(async () => {
      if (shouldReduceMotion) {
        await animate(scope.current, { opacity: [1, 0.65, 1] }, { duration: 0.2 });
        return;
      }

      await animate(scope.current, { rotate: 180 }, { duration: 0.35, ease: "easeInOut" });
    }, [animate, scope, shouldReduceMotion]);

    const stop = useCallback(async () => {
      await animate(scope.current, { rotate: 0, opacity: 1 }, { duration: 0.3, ease: "easeInOut" });
    }, [animate, scope]);

    return (
      <motion.svg
        ref={setRefs}
        onHoverStart={start}
        onHoverEnd={stop}
        onFocus={(event) => {
          void start();
          onFocus?.(event);
        }}
        onBlur={(event) => {
          void stop();
          onBlur?.(event);
        }}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("shrink-0", className)}
        style={{ transformOrigin: "50% 50%", ...props.style }}
        {...props}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
      </motion.svg>
    );
  },
);

AnimatedRefresh.displayName = "AnimatedRefresh";

export { AnimatedRefresh };
