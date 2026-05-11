import { useEffect, useRef, useState } from 'react';

const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ink = '#0A0A0B';
const blue = '#2997FF';

interface MirrorStarRatingProps {
  value: number | null;
  onRate: (value: number) => void;
  /** Auto-advance callback fired ~300ms after a tap. */
  onAdvance?: (value: number) => void;
  autoAdvanceMs?: number;
  lowAnchor?: string;
  highAnchor?: string;
  disabled?: boolean;
}

const Star = ({ filled, onClick, hoverFilled, onMouseEnter, onMouseLeave, label }: {
  filled: boolean;
  hoverFilled: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  label: string;
}) => {
  const showFilled = hoverFilled || filled;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={label}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 6,
        lineHeight: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', transition: 'transform 0.15s ease' }}
      >
        <path
          d="M24 4 L29.5 17.6 L44 19 L33 28.6 L36.4 43 L24 35.2 L11.6 43 L15 28.6 L4 19 L18.5 17.6 Z"
          fill={showFilled ? blue : 'transparent'}
          stroke={ink}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const MirrorStarRating = ({
  value,
  onRate,
  onAdvance,
  autoAdvanceMs = 300,
  lowAnchor = "We don't have this",
  highAnchor = 'Dialed in',
  disabled = false,
}: MirrorStarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const advanceTimer = useRef<number | null>(null);

  // Clear any pending advance on unmount so stale timers can't fire after the
  // component is gone (or after the user has navigated to a new step).
  useEffect(() => {
    return () => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
    };
  }, []);

  const handleClick = (n: number) => {
    if (disabled) return;
    onRate(n);
    if (onAdvance) {
      // Cancel any in-flight advance from a prior tap so a single advance
      // happens per "settled" rating, no matter how fast the user taps.
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current);
      }
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null;
        onAdvance(n);
      }, autoAdvanceMs);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          maxWidth: 360,
          margin: '0 auto',
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (value ?? 0) >= n;
          const hoverFilled = hover !== null && hover >= n;
          return (
            <Star
              key={n}
              label={`Rate ${n} star${n === 1 ? '' : 's'}`}
              filled={filled}
              hoverFilled={hoverFilled}
              onClick={() => handleClick(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 360,
          margin: '12px auto 0',
        }}
      >
        <span
          style={{
            fontFamily: body,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: ink,
            opacity: 0.6,
            maxWidth: 110,
            lineHeight: 1.3,
          }}
        >
          {lowAnchor}
        </span>
        <span
          style={{
            fontFamily: body,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: ink,
            opacity: 0.6,
            maxWidth: 110,
            textAlign: 'right',
            lineHeight: 1.3,
          }}
        >
          {highAnchor}
        </span>
      </div>
    </div>
  );
};

export default MirrorStarRating;
