import { forwardRef, useCallback, useRef } from "react";
import type { SVGProps } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedUploadProps
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

const AnimatedUpload = forwardRef<SVGSVGElement, AnimatedUploadProps>(
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
        await animate(".arrow-group", { opacity: [1, 0.65, 1] }, { duration: 0.2 });
        isAnimatingRef.current = false;
        return;
      }

      while (isAnimatingRef.current) {
        await animate(".arrow-group", { y: -12, opacity: 0 }, { duration: 0.35, ease: "easeIn" });
        if (!isAnimatingRef.current) break;

        await animate(".arrow-group", { y: 12, opacity: 0 }, { duration: 0 });
        await animate(".arrow-group", { y: 0, opacity: 1 }, { duration: 0.35, ease: "easeOut" });
        if (!isAnimatingRef.current) break;

        await new Promise((resolve) => setTimeout(resolve, 180));
      }
    }, [animate, shouldReduceMotion]);

    const stop = useCallback(() => {
      isAnimatingRef.current = false;
      void animate(".arrow-group", { y: 0, opacity: 1 }, { duration: 0.25, ease: "easeOut" });
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <motion.g className="arrow-group">
          <path d="M12 3v12" />
          <path d="m17 8-5-5-5 5" />
        </motion.g>
      </motion.svg>
    );
  },
);

AnimatedUpload.displayName = "AnimatedUpload";

export { AnimatedUpload };
