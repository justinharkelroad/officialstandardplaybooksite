import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import spIconWhite from "@/assets/sp-icon-white.png";
import { cn } from "@/lib/utils";

type StandardProgressMarkProps = {
  points: number;
  dateKey: string;
  scoreLabel: string;
  className?: string;
};

const LOGO_TOP = 31;
const LOGO_HEIGHT = 138;
const COMPLETE_SCORE = 4;

const sparkPositions = [
  { x: 28, y: 55, delay: 0.05 },
  { x: 171, y: 49, delay: 0.12 },
  { x: 33, y: 151, delay: 0.16 },
  { x: 167, y: 145, delay: 0.09 },
];

function sparkPath(x: number, y: number) {
  return [
    `M ${x} ${y - 4}`,
    `L ${x + 1.35} ${y - 1.35}`,
    `L ${x + 4} ${y}`,
    `L ${x + 1.35} ${y + 1.35}`,
    `L ${x} ${y + 4}`,
    `L ${x - 1.35} ${y + 1.35}`,
    `L ${x - 4} ${y}`,
    `L ${x - 1.35} ${y - 1.35}`,
    "Z",
  ].join(" ");
}

export function StandardProgressMark({
  points,
  dateKey,
  scoreLabel,
  className,
}: StandardProgressMarkProps) {
  const safePoints = Math.min(Math.max(points, 0), COMPLETE_SCORE);
  const progress = safePoints / COMPLETE_SCORE;
  const fillHeight = LOGO_HEIGHT * progress;
  const fillY = LOGO_TOP + LOGO_HEIGHT - fillHeight;
  const shouldReduceMotion = useReducedMotion();
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");
  const maskId = `standard-progress-mask-${svgId}`;
  const outlineFilterId = `standard-progress-outline-${svgId}`;
  const previous = useRef({ dateKey, points: safePoints });
  const [celebrationRun, setCelebrationRun] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    const previousValue = previous.current;
    const completedNow =
      previousValue.dateKey === dateKey &&
      previousValue.points < COMPLETE_SCORE &&
      safePoints === COMPLETE_SCORE;

    previous.current = { dateKey, points: safePoints };

    if (previousValue.dateKey !== dateKey || safePoints < COMPLETE_SCORE || shouldReduceMotion) {
      setIsCelebrating(false);
    }

    if (!completedNow || shouldReduceMotion) {
      return;
    }

    setCelebrationRun((run) => run + 1);
    setIsCelebrating(true);
    const timeout = window.setTimeout(() => setIsCelebrating(false), 1200);

    return () => window.clearTimeout(timeout);
  }, [dateKey, safePoints, shouldReduceMotion]);

  const isComplete = safePoints === COMPLETE_SCORE;

  return (
    <div
      className={cn("flex flex-col items-center text-center", className)}
      aria-label={`${safePoints} of 4 domains complete. ${scoreLabel}.`}
    >
      <div className="relative h-52 w-52 sm:h-60 sm:w-60">
        <motion.svg
          viewBox="0 0 200 200"
          className="h-full w-full overflow-visible text-muted-foreground"
          aria-hidden="true"
          animate={
            isCelebrating
              ? { scale: [1, 1.035, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "50% 50%" }}
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
              <image
                href={spIconWhite}
                x="0"
                y="0"
                width="200"
                height="200"
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>
            <filter
              id={outlineFilterId}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius="1.35"
                result="expanded"
              />
              <feComposite
                in="expanded"
                in2="SourceAlpha"
                operator="out"
                result="outline"
              />
              <feFlood floodColor="currentColor" floodOpacity="0.62" result="outlineColor" />
              <feComposite in="outlineColor" in2="outline" operator="in" />
            </filter>
          </defs>

          <image
            href={spIconWhite}
            x="0"
            y="0"
            width="200"
            height="200"
            preserveAspectRatio="xMidYMid meet"
            filter={`url(#${outlineFilterId})`}
          />

          <motion.rect
            x="0"
            width="200"
            rx="1"
            fill="#2997FF"
            mask={`url(#${maskId})`}
            initial={false}
            animate={{ y: fillY, height: fillHeight }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.55, bounce: 0 }
            }
          />

          <AnimatePresence>
            {isCelebrating && !shouldReduceMotion ? (
              <motion.g key={celebrationRun}>
                <motion.circle
                  cx="100"
                  cy="100"
                  fill="none"
                  stroke="#2997FF"
                  strokeWidth="1.5"
                  initial={{ r: 65, opacity: 0.72 }}
                  animate={{ r: 91, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                {sparkPositions.map((spark, index) => (
                  <motion.path
                    key={`${celebrationRun}-${index}`}
                    d={sparkPath(spark.x, spark.y)}
                    fill="#2997FF"
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.6] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.68,
                      delay: spark.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformBox: "view-box",
                      transformOrigin: `${spark.x}px ${spark.y}px`,
                    }}
                  />
                ))}
              </motion.g>
            ) : null}
          </AnimatePresence>
        </motion.svg>
      </div>

      <div className="-mt-2" aria-live="polite">
        <p className={cn("text-4xl font-bold tabular-nums", isComplete && "text-[#2997FF]")}>
          {safePoints}/4
        </p>
        <p className="text-muted-foreground">{scoreLabel}</p>
        <AnimatePresence initial={false}>
          {isComplete ? (
            <motion.p
              key="complete"
              className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2997FF]"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              Daily Standard Met
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
