"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface CrossIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CrossIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CROSS_VARIANTS: Variants = {
  normal: {
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
  animate: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 1.4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const CrossIcon = forwardRef<CrossIconHandle, CrossIconProps>(
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
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave]
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
          strokeWidth="16"
          style={{ overflow: "visible" }}
          viewBox="0 0 256 256"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            variants={CROSS_VARIANTS}
            style={{ transformOrigin: "128px 128px" }}
            d="M112,24h32a8,8,0,0,1,8,8V80h48a8,8,0,0,1,8,8v32a8,8,0,0,1-8,8H152v96a8,8,0,0,1-8,8H112a8,8,0,0,1-8-8V128H56a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h48V32A8,8,0,0,1,112,24Z"
          />
        </svg>
      </div>
    );
  }
);

CrossIcon.displayName = "CrossIcon";

export { CrossIcon };
