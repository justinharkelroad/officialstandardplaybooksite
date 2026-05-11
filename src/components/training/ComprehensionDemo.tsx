import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const ANSWER_FULL =
  "When the customer says 'I'll think about it,' I use the 3-question gap method to surface the real coverage concern, then walk-the-block on umbrella so they see what they don't have.";

const FEEDBACK_FULL =
  'Strong reference to the 3-question gap method and walk-the-block. Could specify the umbrella focus more directly.';

const RUBRIC = [
  { label: 'Specificity', score: 3, max: 3 },
  { label: 'Comprehension', score: 3, max: 3 },
  { label: 'Actionability', score: 2, max: 2 },
  { label: 'Alignment', score: 1, max: 2 },
];

const FINAL_SCORE = 9;
const TYPE_DURATION_MS = 1000;
const TYPE_TICK_MS = 40;

export default function ComprehensionDemo() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setPhase(0); setTyped(''); setScoreCount(0);
      return;
    }
    if (reduced) {
      setTyped(ANSWER_FULL); setScoreCount(FINAL_SCORE); setPhase(6);
      return;
    }
    let cancelled = false;
    const t: number[] = [];
    setPhase(1);
    const charsPerTick = Math.max(1, Math.ceil(ANSWER_FULL.length / (TYPE_DURATION_MS / TYPE_TICK_MS)));
    const typeInt = window.setInterval(() => {
      if (cancelled) return;
      setTyped((prev) => {
        if (prev.length >= ANSWER_FULL.length) {
          window.clearInterval(typeInt);
          return ANSWER_FULL;
        }
        return ANSWER_FULL.slice(0, Math.min(ANSWER_FULL.length, prev.length + charsPerTick));
      });
    }, TYPE_TICK_MS);
    t.push(window.setTimeout(() => !cancelled && setPhase(2), 1200));
    t.push(window.setTimeout(() => !cancelled && setPhase(3), 1800));
    t.push(window.setTimeout(() => {
      if (cancelled) return;
      setPhase(4);
      let n = 0;
      const inc = window.setInterval(() => {
        if (cancelled) { window.clearInterval(inc); return; }
        n += 1;
        setScoreCount(n);
        if (n >= FINAL_SCORE) window.clearInterval(inc);
      }, 60);
    }, 3400));
    t.push(window.setTimeout(() => !cancelled && setPhase(5), 4000));
    t.push(window.setTimeout(() => !cancelled && setPhase(6), 4300));
    return () => { cancelled = true; window.clearInterval(typeInt); t.forEach(window.clearTimeout); };
  }, [inView, reduced]);

  const showRubric = phase >= 3;
  const showScore = phase >= 4;
  const showBadge = phase >= 5;
  const showFeedback = phase >= 6;
  const showEvaluating = phase >= 2 && phase < 3;

  return (
    <div ref={ref} aria-hidden style={{ maxWidth: 760, marginInline: 'auto' }}>
      <div style={{
        background: '#fff', border: `1.5px solid ${ink}`, padding: '28px 28px',
      }}>
        <p style={{
          fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
          color: ink, opacity: 0.55, textTransform: 'uppercase', marginBottom: 12,
        }}>
          Reflection Answer
        </p>
        <p style={{
          fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
          color: ink, margin: 0, minHeight: 64,
        }}>
          {typed}
          {phase === 1 && !reduced && (
            <span style={{
              display: 'inline-block', width: 2, height: 18, background: blue,
              verticalAlign: '-3px', marginLeft: 2, animation: 'cd-blink 0.8s steps(2) infinite',
            }} />
          )}
        </p>

        <div style={{ minHeight: 24, marginTop: 16 }}>
          <AnimatePresence>
            {showEvaluating && (
              <motion.div
                key="ev"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: 6, height: 6, background: blue,
                    animation: `cd-bounce 1s ${i * 0.15}s infinite`,
                  }} />
                ))}
                <span style={{
                  fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                  color: ink, opacity: 0.55, textTransform: 'uppercase',
                }}>
                  Evaluating…
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showRubric && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16,
            paddingTop: 16, borderTop: `1px solid ${ink}1a`,
          }}>
            {RUBRIC.map((r, i) => {
              const pct = (r.score / r.max) * 100;
              return (
                <div key={r.label}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: body, fontSize: 12, fontWeight: 500, color: ink,
                    marginBottom: 4,
                  }}>
                    <span>{r.label}</span>
                    <span style={{ opacity: 0.55, letterSpacing: '0.04em' }}>{r.score}/{r.max}</span>
                  </div>
                  <div style={{ height: 4, background: `${ink}14` }}>
                    <motion.div
                      style={{ height: '100%', background: blue }}
                      initial={reduced ? { width: `${pct}%` } : { width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.2, ease: EASE }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showScore && (
          <div style={{
            marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 12,
          }}>
            <span style={{
              fontFamily: '"Anton", "Archivo Black", Impact, sans-serif',
              fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em', color: ink,
            }}>
              {scoreCount}
            </span>
            <span style={{
              fontFamily: body, fontSize: 14, fontWeight: 500, color: ink, opacity: 0.55,
            }}>
              / 10
            </span>
            <AnimatePresence>
              {showBadge && (
                <motion.span
                  key="pass"
                  initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
                    background: blue, color: '#fff', padding: '4px 10px',
                    textTransform: 'uppercase', marginLeft: 8,
                  }}>
                  Pass
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        {showFeedback && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{
              marginTop: 18, padding: 16,
              background: paper, border: `1px solid ${ink}1a`,
            }}>
            <p style={{
              fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
              color: blue, textTransform: 'uppercase', marginBottom: 6,
            }}>
              Feedback
            </p>
            <p style={{ fontFamily: body, fontSize: 13, color: ink, lineHeight: 1.55, margin: 0 }}>
              {FEEDBACK_FULL}
            </p>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes cd-blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes cd-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
    </div>
  );
}
