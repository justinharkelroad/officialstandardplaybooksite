"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface HandsPrayingIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface HandsPrayingIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const LEFT_HAND_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    translateX: 0,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
  animate: {
    rotate: [0, -4, 0],
    translateX: [0, -1, 0],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const RIGHT_HAND_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    translateX: 0,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
  animate: {
    rotate: [0, 4, 0],
    translateX: [0, 1, 0],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const HandsPrayingIcon = forwardRef<HandsPrayingIconHandle, HandsPrayingIconProps>(
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
          <motion.g
            animate={controls}
            variants={LEFT_HAND_VARIANTS}
            style={{ transformOrigin: "128px 230px" }}
          >
            <path d="M118.63,181.37,88.69,211.31l-44-44L64,148,101,25.78A13.77,13.77,0,0,1,114.22,16h0A13.78,13.78,0,0,1,128,29.78v129A32,32,0,0,1,118.63,181.37Z" />
            <path d="M44.69,167.31,26.34,185.66a8,8,0,0,0,0,11.31L59,229.66a8,8,0,0,0,11.31,0l18.35-18.35" />
          </motion.g>
          <motion.g
            animate={controls}
            variants={RIGHT_HAND_VARIANTS}
            style={{ transformOrigin: "128px 230px" }}
          >
            <path d="M141.78,16h0A13.77,13.77,0,0,1,155,25.78L192,148l20.27,20.27-45,43-29.94-29.94A32,32,0,0,1,128,158.75v-129A13.78,13.78,0,0,1,141.78,16Z" />
            <path d="M167.31,211.31l18.35,18.35a8,8,0,0,0,11.31,0L229.66,197a8,8,0,0,0,0-11.31l-18.35-18.35" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

HandsPrayingIcon.displayName = "HandsPrayingIcon";

export { HandsPrayingIcon };
