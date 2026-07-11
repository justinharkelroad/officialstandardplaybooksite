import { forwardRef, useCallback, useRef } from "react";
import type { SVGProps } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedDownloadProps
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

const AnimatedDownload = forwardRef<SVGSVGElement, AnimatedDownloadProps>(
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
    const isAnimatingRef = useRef(false);
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
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      if (shouldReduceMotion) {
        await animate(".arrow-head, .arrow-stem, .tray", { opacity: [1, 0.65, 1] }, { duration: 0.2 });
        isAnimatingRef.current = false;
        return;
      }

      while (isAnimatingRef.current) {
        void animate(
          ".arrow-head",
          { y: [0, 8, 8, -8, 0], opacity: [1, 0, 0, 0, 1] },
          { duration: 0.85, times: [0, 0.4, 0.5, 0.6, 1], ease: "easeInOut" },
        );

        await animate(
          ".arrow-stem",
          { y: [0, 8, 8, -8, 0], opacity: [1, 0, 0, 0, 1] },
          { duration: 0.85, times: [0, 0.3, 0.4, 0.5, 1], ease: "easeInOut" },
        );

        if (!isAnimatingRef.current) break;

        await animate(
          ".tray",
          { y: [0, 2, 0], scale: [1, 1.04, 1] },
          { duration: 0.25, ease: "easeOut" },
        );

        if (!isAnimatingRef.current) break;
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
    }, [animate, shouldReduceMotion]);

    const stop = useCallback(() => {
      isAnimatingRef.current = false;
      void animate(
        ".arrow-head, .arrow-stem, .tray",
        { y: 0, opacity: 1, scale: 1 },
        { duration: 0.25 },
      );
    }, [animate]);

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
          stop();
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
        style={{ overflow: "visible", ...props.style }}
        {...props}
      >
        <motion.path
          className="tray"
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          style={{ transformOrigin: "center bottom" }}
        />
        <motion.path
          className="arrow-stem"
          d="M12 15V3"
          style={{ transformOrigin: "center" }}
        />
        <motion.path
          className="arrow-head"
          d="m7 10 5 5 5-5"
          style={{ transformOrigin: "center" }}
        />
      </motion.svg>
    );
  },
);

AnimatedDownload.displayName = "AnimatedDownload";

export { AnimatedDownload };
