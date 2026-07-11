import { forwardRef, useCallback } from "react";
import type { SVGProps } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedTrophyProps
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

const AnimatedTrophy = forwardRef<SVGSVGElement, AnimatedTrophyProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 2,
      className,
      onMouseEnter,
      onMouseLeave,
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
        await animate(".trophy-group", { opacity: [1, 0.72, 1] }, { duration: 0.2 });
        return;
      }

      void animate(
        ".trophy-group",
        {
          y: [0, -3, -3, 0],
          rotate: [0, -8, 8, 0],
        },
        {
          duration: 0.65,
          ease: "easeOut",
          times: [0, 0.4, 0.72, 1],
        },
      );

      const confettiSequences = [
        { selector: ".confetti-1", x: [0, -9], y: [0, -12], rotate: [0, 120] },
        { selector: ".confetti-2", x: [0, -4], y: [0, -14], rotate: [0, -90] },
        { selector: ".confetti-3", x: [0, 4], y: [0, -14], rotate: [0, 100] },
        { selector: ".confetti-4", x: [0, 9], y: [0, -12], rotate: [0, -120] },
      ];

      confettiSequences.forEach((confetti) => {
        void animate(
          confetti.selector,
          {
            x: confetti.x,
            y: confetti.y,
            rotate: confetti.rotate,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
          },
          {
            duration: 0.65,
            ease: "easeOut",
            delay: 0.08,
          },
        );
      });
    }, [animate, shouldReduceMotion]);

    const stop = useCallback(() => {
      void animate(".trophy-group", { y: 0, rotate: 0, opacity: 1 }, { duration: 0.2 });
      void animate(
        ".confetti-1, .confetti-2, .confetti-3, .confetti-4",
        { opacity: 0, scale: 0 },
        { duration: 0.15 },
      );
    }, [animate]);

    return (
      <motion.svg
        ref={setRefs}
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
        onHoverStart={start}
        onHoverEnd={stop}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={(event) => {
          void start();
          onFocus?.(event);
        }}
        onBlur={(event) => {
          stop();
          onBlur?.(event);
        }}
        {...props}
      >
        <motion.g
          className="trophy-group"
          style={{ transformOrigin: "center 20px" }}
        >
          <path d="M6 9H4.5a1 1 0 0 1 0-5H6" />
          <path d="M18 9h1.5a1 1 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" />
          <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" />
          <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
          <motion.rect
            className="confetti-1"
            x="11"
            y="6"
            width="2"
            height="2"
            rx="0.5"
            fill="#f6c945"
            stroke="none"
            opacity={0}
            style={{ transformOrigin: "center" }}
          />
          <motion.rect
            className="confetti-2"
            x="12"
            y="5"
            width="2"
            height="2"
            rx="0.5"
            fill="#2997FF"
            stroke="none"
            opacity={0}
            style={{ transformOrigin: "center" }}
          />
          <motion.rect
            className="confetti-3"
            x="13"
            y="6"
            width="2"
            height="2"
            rx="0.5"
            fill="#2997FF"
            stroke="none"
            opacity={0}
            style={{ transformOrigin: "center" }}
          />
          <motion.rect
            className="confetti-4"
            x="12"
            y="7"
            width="2"
            height="2"
            rx="0.5"
            fill="#2997FF"
            stroke="none"
            opacity={0}
            style={{ transformOrigin: "center" }}
          />
        </motion.g>
      </motion.svg>
    );
  },
);

AnimatedTrophy.displayName = "AnimatedTrophy";

export { AnimatedTrophy };
