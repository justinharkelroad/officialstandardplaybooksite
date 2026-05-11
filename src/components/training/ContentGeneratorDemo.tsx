import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const TOPIC_FULL = "How to handle the 'I'll think about it' objection";
const LESSON_FULL =
  "When a prospect says \"I'll think about it,\" they're usually telling you one of three things: they don't see enough value, they don't trust the timing, or they have an unspoken objection. Use the 3-question gap method to surface the real concern before you respond…";

const QUIZ = [
  { q: "What are the three reasons a prospect says 'I'll think about it'?", choices: ['Value, timing, hidden objection', 'Price, options, urgency', 'Email follow-up only', 'They are always genuine'] },
  { q: 'Which method surfaces the real coverage concern?', choices: ['3-question gap method', 'Hard close', 'Discount stacking', 'Generic call back'] },
  { q: "What's the next step after the 3-question gap?", choices: ['Walk-the-block on umbrella', 'End the call', 'Send a quote and wait', 'Transfer to manager'] },
];

const TOPIC_DURATION_MS = 1500;
const LESSON_DURATION_MS = 2300;
const TICK_MS = 30;

export default function ContentGeneratorDemo() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const [phase, setPhase] = useState(0);
  const [topic, setTopic] = useState('');
  const [lesson, setLesson] = useState('');
  const [quizCount, setQuizCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'draft' | 'quiz'>('draft');
  const [pulseBtn, setPulseBtn] = useState(false);

  useEffect(() => {
    if (!inView) {
      setPhase(0); setTopic(''); setLesson(''); setQuizCount(0);
      setActiveTab('draft'); setPulseBtn(false); return;
    }
    if (reduced) {
      setTopic(TOPIC_FULL); setLesson(LESSON_FULL); setQuizCount(QUIZ.length);
      setActiveTab('quiz'); setPhase(5); return;
    }

    let cancelled = false;
    const t: number[] = [];

    setPhase(1);
    const topicCharsPerTick = Math.max(1, Math.ceil(TOPIC_FULL.length / (TOPIC_DURATION_MS / TICK_MS)));
    const topicInt = window.setInterval(() => {
      if (cancelled) return;
      setTopic((prev) => {
        if (prev.length >= TOPIC_FULL.length) {
          window.clearInterval(topicInt);
          return TOPIC_FULL;
        }
        return TOPIC_FULL.slice(0, Math.min(TOPIC_FULL.length, prev.length + topicCharsPerTick));
      });
    }, TICK_MS);

    t.push(window.setTimeout(() => {
      if (cancelled) return;
      setPhase(2);
      setPulseBtn(true);
      window.setTimeout(() => !cancelled && setPulseBtn(false), 350);
    }, 1700));

    t.push(window.setTimeout(() => {
      if (cancelled) return;
      setPhase(3);
      const lessonCharsPerTick = Math.max(1, Math.ceil(LESSON_FULL.length / (LESSON_DURATION_MS / TICK_MS)));
      const lessonInt = window.setInterval(() => {
        if (cancelled) { window.clearInterval(lessonInt); return; }
        setLesson((prev) => {
          if (prev.length >= LESSON_FULL.length) {
            window.clearInterval(lessonInt);
            return LESSON_FULL;
          }
          return LESSON_FULL.slice(0, Math.min(LESSON_FULL.length, prev.length + lessonCharsPerTick));
        });
      }, TICK_MS);
      t.push(lessonInt as unknown as number);
    }, 2200));

    t.push(window.setTimeout(() => {
      if (!cancelled) { setPhase(4); setActiveTab('quiz'); }
    }, 4700));

    t.push(window.setTimeout(() => {
      if (cancelled) return;
      setPhase(5);
      let n = 0;
      const inc = window.setInterval(() => {
        if (cancelled) { window.clearInterval(inc); return; }
        n += 1;
        setQuizCount(n);
        if (n >= QUIZ.length) window.clearInterval(inc);
      }, 220);
    }, 5000));

    return () => {
      cancelled = true; window.clearInterval(topicInt); t.forEach(window.clearTimeout);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} aria-hidden style={{ maxWidth: 760, marginInline: 'auto' }}>
      <div style={{
        background: '#fff', border: `1.5px solid ${ink}`, padding: 0,
      }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${ink}1a` }}>
          {(['draft', 'quiz'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button key={tab} type="button" disabled
                style={{
                  flex: 1, padding: '14px 16px',
                  fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: isActive ? ink : `${ink}66`,
                  background: isActive ? paper : '#fff', border: 'none',
                  borderBottom: isActive ? `2px solid ${blue}` : '2px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  cursor: 'default',
                  transition: 'all 0.3s',
                }}>
                <Sparkles size={12} />
                {tab === 'draft' ? 'Generate Draft' : 'Generate Quiz'}
              </button>
            );
          })}
        </div>

        {/* Pane */}
        <div style={{ padding: '24px 24px 28px' }}>
          {activeTab === 'draft' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{
                fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                color: ink, opacity: 0.55, textTransform: 'uppercase', margin: 0,
              }}>
                Topic
              </p>
              <div style={{
                background: paper, border: `1px solid ${ink}33`,
                padding: '12px 14px', minHeight: 44,
                fontFamily: body, fontSize: 14, color: ink,
              }}>
                {topic}
                {phase === 1 && !reduced && (
                  <span style={{
                    display: 'inline-block', width: 2, height: 14, background: blue,
                    verticalAlign: '-2px', marginLeft: 2,
                    animation: 'cg-blink 0.8s steps(2) infinite',
                  }} />
                )}
              </div>
              <motion.button
                type="button" disabled
                animate={pulseBtn ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{
                  fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#fff', background: ink, border: `1.5px solid ${ink}`,
                  padding: '12px 22px', textTransform: 'uppercase', cursor: 'default',
                  display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
                }}>
                <Sparkles size={12} />
                Generate Lesson
              </motion.button>
              {phase >= 3 && (
                <div style={{
                  background: paper, border: `1px solid ${ink}1a`,
                  padding: 14, marginTop: 4,
                  fontFamily: body, fontSize: 13, color: ink, lineHeight: 1.55,
                  minHeight: 80,
                }}>
                  {lesson}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{
                fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                color: ink, opacity: 0.55, textTransform: 'uppercase', margin: 0,
              }}>
                Quiz From Lesson
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUIZ.slice(0, quizCount).map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{
                      background: paper, border: `1px solid ${ink}1a`, padding: '14px 16px',
                    }}>
                    <p style={{
                      fontFamily: body, fontSize: 13, fontWeight: 600, color: ink, margin: 0, marginBottom: 10,
                    }}>
                      Q{idx + 1}. {item.q}
                    </p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {item.choices.map((c) => (
                        <li key={c} style={{
                          fontFamily: body, fontSize: 12, color: ink, opacity: 0.75,
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <span style={{
                            display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                            border: `1.5px solid ${ink}33`, flexShrink: 0,
                          }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cg-blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
