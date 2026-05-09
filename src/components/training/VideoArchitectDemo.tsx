import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2080FF';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const FRAMEWORK_BULLETS = [
  'Identify the real objection',
  'Reframe with a question',
  'Anchor to coverage value',
];

export default function VideoArchitectDemo() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) { setPhase(0); return; }
    if (reduced) { setPhase(7); return; }
    let cancelled = false;
    const t: number[] = [];
    setPhase(1);
    t.push(window.setTimeout(() => !cancelled && setPhase(2), 800));
    t.push(window.setTimeout(() => !cancelled && setPhase(3), 1400));
    t.push(window.setTimeout(() => !cancelled && setPhase(4), 2100));
    t.push(window.setTimeout(() => !cancelled && setPhase(5), 2800));
    t.push(window.setTimeout(() => !cancelled && setPhase(6), 3500));
    t.push(window.setTimeout(() => !cancelled && setPhase(7), 4500));
    return () => { cancelled = true; t.forEach(window.clearTimeout); };
  }, [inView, reduced]);

  const showVideo = phase >= 1;
  const showArrow = phase >= 2;
  const showHook = phase >= 3;
  const showFramework = phase >= 4;
  const showApplication = phase >= 5;
  const showStandDeliver = phase >= 6;
  const showHighlight = phase >= 7;

  return (
    <div ref={ref} aria-hidden style={{
      background: '#fff', border: `1.5px solid ${ink}`, padding: '32px 28px',
      maxWidth: 980, marginInline: 'auto',
    }}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] gap-6 items-center">
        {/* LEFT — video thumb */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: showVideo ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div style={{
            position: 'relative', aspectRatio: '16/9',
            background: ink, color: paper, border: `1px solid ${ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: paper, color: ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={20} fill="currentColor" />
            </div>
            <span style={{
              position: 'absolute', bottom: 10, right: 12,
              fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
              color: paper, opacity: 0.7,
            }}>
              12:34
            </span>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: `${paper}1a` }}>
              <motion.div
                style={{ height: '100%', background: blue }}
                initial={reduced ? { width: '64%' } : { width: 0 }}
                animate={{ width: showVideo ? '64%' : 0 }}
                transition={{ duration: reduced ? 0 : 3.5, ease: EASE }}
              />
            </div>
          </div>
          <p style={{
            fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginTop: 10,
          }}>
            Source Video
          </p>
        </motion.div>

        {/* ARROW */}
        <motion.div
          className="hidden md:flex"
          style={{ color: ink, justifyContent: 'center', alignItems: 'center' }}
          initial={reduced ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: showArrow ? 1 : 0, scaleX: showArrow ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <svg viewBox="0 0 80 12" preserveAspectRatio="none" width="60" height="12" aria-hidden>
            <path d="M0 6 L72 6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M68 1 L73 6 L68 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* RIGHT — generated framework */}
        <motion.div
          style={{
            background: paper, border: `1.5px solid ${ink}`, padding: '20px 18px',
            display: 'flex', flexDirection: 'column', gap: 14, minHeight: 240,
          }}
          animate={showHighlight ? {
            boxShadow: [
              `0 0 0 0 ${blue}00`,
              `0 0 0 6px ${blue}30`,
              `0 0 0 0 ${blue}00`,
            ],
          } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {showHook && (
            <Section label="Hook">Why most agencies lose objection calls in the first 30 seconds.</Section>
          )}
          {showFramework && (
            <Section label="Framework">
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {FRAMEWORK_BULLETS.map((b) => (
                  <li key={b} style={{
                    fontFamily: body, fontSize: 13, color: ink, lineHeight: 1.5,
                    padding: '4px 0', display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <span style={{
                      display: 'inline-block', width: 6, height: 6, background: blue,
                      marginTop: 7, flexShrink: 0,
                    }} />
                    {b}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {showApplication && (
            <Section label="Application Exercise">Roleplay this objection with a partner. 3 reps each side.</Section>
          )}
          {showStandDeliver && (
            <Section label="Stand-And-Deliver">Present your reframe to the team in under 60 seconds.</Section>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const reduced = !!useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <p style={{
        fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
        color: blue, textTransform: 'uppercase', marginBottom: 6,
      }}>
        {label}
      </p>
      {typeof children === 'string'
        ? <p style={{ fontFamily: body, fontSize: 13, color: ink, lineHeight: 1.5, margin: 0 }}>{children}</p>
        : children}
    </motion.div>
  );
}
