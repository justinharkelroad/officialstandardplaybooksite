"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface DailyFrameIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface DailyFrameIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SUN_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    scale: 1,
    translateY: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  animate: {
    opacity: [0.85, 1],
    scale: [0.92, 1.08, 1],
    translateY: [2, -1, 0],
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const RAY_VARIANTS: Variants = {
  normal: {
    opacity: 0.75,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    opacity: [0.35, 1, 0.75],
    scale: [0.85, 1.08, 1],
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const CHECK_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  animate: {
    pathLength: [0, 1],
    transition: { duration: 0.45, ease: "easeOut", delay: 0.18 },
  },
};

const FRAME_VARIANTS: Variants = {
  normal: {
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const DailyFrameIcon = forwardRef<DailyFrameIconHandle, DailyFrameIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          style={{ overflow: "visible" }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g
            animate={controls}
            style={{ transformOrigin: "12px 12px" }}
            variants={FRAME_VARIANTS}
          >
            <path d="M5 9V6.5A1.5 1.5 0 0 1 6.5 5H9" />
            <path d="M15 5h2.5A1.5 1.5 0 0 1 19 6.5V9" />
            <path d="M19 15v2.5a1.5 1.5 0 0 1-1.5 1.5H15" />
            <path d="M9 19H6.5A1.5 1.5 0 0 1 5 17.5V15" />
          </motion.g>

          <motion.g
            animate={controls}
            style={{ transformOrigin: "12px 11px" }}
            variants={RAY_VARIANTS}
          >
            <path d="M12 3v2" />
            <path d="m7.8 5.2 1.1 1.1" />
            <path d="m16.2 5.2-1.1 1.1" />
          </motion.g>

          <motion.g
            animate={controls}
            style={{ transformOrigin: "12px 12px" }}
            variants={SUN_VARIANTS}
          >
            <path d="M7 13a5 5 0 0 1 10 0" />
            <path d="M5 13h14" />
          </motion.g>

          <motion.path
            animate={controls}
            d="m8.5 16.2 2 2 5-5"
            initial={false}
            variants={CHECK_VARIANTS}
          />
        </svg>
      </div>
    );
  },
);

DailyFrameIcon.displayName = "DailyFrameIcon";

export { DailyFrameIcon };
