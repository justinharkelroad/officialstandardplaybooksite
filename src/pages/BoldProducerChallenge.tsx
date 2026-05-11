import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import VideoModal from '@/components/VideoModal';
import ContentMeta from '@/components/ContentMeta';
import SEOHead from '@/components/SEOHead';

import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const red = '#C8102E';

/* ── External links ────────────────────────────────────── */
const ENROLL_URL = 'https://createthestandard.com/credit-card-page';
const BOOK_CALL_URL = 'https://AGENCYCOACHING.as.me/standardfit';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': any;
    }
  }
}

/* ── Reveal helper ─────────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);


/* ══════════════════════════════════════════════════════
   HERO — vertical Wistia video + offer
   ══════════════════════════════════════════════════════ */
const Hero = () => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Producer Challenge · 6 Weeks · $299
        </p>
      </Reveal>

      <Reveal>
        <h1 style={{
          fontFamily: display,
          fontSize: 'clamp(48px, 11vw, 200px)',
          lineHeight: 0.86, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
        }}>
          THE PRODUCER<br />
          <span className="md:pl-[6vw] inline-block" style={{ color: blue }}>CHALLENGE.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, maxWidth: 720, marginTop: 28,
        }}>
          Transform your producer from reactive chaos to systematic execution — in 42 days. You'll see every step.
        </p>
      </Reveal>

      {/* Video + offer column */}
      <div className="grid grid-cols-12 gap-8 mt-16">
        <Reveal className="col-span-12 md:col-span-6">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginBottom: 14,
          }}>
            // Watch The Walkthrough
          </p>
          <motion.div
            whileHover={{ rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', background: ink, padding: 8,
              maxWidth: 380, marginInline: 'auto',
              boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
              transform: 'rotate(-2deg)',
            }}>
            <div style={{ aspectRatio: '9/16', background: '#000', overflow: 'hidden' }}>
              <style dangerouslySetInnerHTML={{
                __html: `
                  wistia-player[media-id='1bz6nrl5ip']:not(:defined) {
                    background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/1bz6nrl5ip/swatch');
                    display: block;
                    filter: blur(5px);
                    padding-top:177.78%;
                  }
                  wistia-player[media-id='1bz6nrl5ip'] {
                    width: 100%;
                    height: 100%;
                  }
                `
              }} />
              <wistia-player media-id="1bz6nrl5ip" aspect="0.5625"></wistia-player>
            </div>
          </motion.div>
        </Reveal>

        <div className="col-span-12 md:col-span-6 flex flex-col gap-5">
          {/* Problem block */}
          <Reveal delay={0.1}>
            <div style={{
              border: `1.5px solid ${red}`,
              padding: '24px 22px',
              background: 'transparent',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: red, textTransform: 'uppercase', marginBottom: 10,
              }}>
                / The Problem
              </p>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(18px, 2.2vw, 24px)',
                lineHeight: 1.2, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                Mood. Motivation. Chaos. No system.
              </p>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.75, marginTop: 12,
              }}>
                Your producer relies on mood and motivation. Follow-up is emotional and chaotic. They operate without a documented system and communication with you is reactive.
              </p>
            </div>
          </Reveal>

          {/* Possibility block */}
          <Reveal delay={0.15}>
            <div style={{
              border: `1.5px solid ${blue}`,
              padding: '24px 22px',
              background: 'transparent',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: blue, textTransform: 'uppercase', marginBottom: 10,
              }}>
                / The Possibility
              </p>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(18px, 2.2vw, 24px)',
                lineHeight: 1.2, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                Daily system. Predictable follow-up. Direct comms.
              </p>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.75, marginTop: 12,
              }}>
                After 6 weeks, they execute on a daily system. Follow-up becomes predictable. They proactively communicate takeaways and action items — directly to you.
              </p>
            </div>
          </Reveal>

          {/* Pricing & CTAs */}
          <Reveal delay={0.2}>
            <div style={{ background: ink, color: paper, padding: '24px 22px' }}>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(20px, 2.6vw, 30px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, textAlign: 'center',
              }}>
                6 Weeks · 30 Trainings · <span style={{ color: blue }}>$299</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-3">
              <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
                  padding: '18px 0', textAlign: 'center', transition: 'all .25s',
                }}
                className="hover:bg-[#2997FF]">
                Enroll Now →
              </a>
              <VideoModal
                videoId="1NzNXlsGOQs"
                title="Challenge Quick Explainer"
                trigger={
                  <button
                    style={{
                      fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                      color: ink, background: 'transparent', textTransform: 'uppercase',
                      padding: '14px 0', border: `1.5px solid ${ink}`, cursor: 'pointer',
                      transition: 'all .25s', width: '100%',
                    }}
                    className="hover:bg-black hover:text-white">
                    Quick Explainer
                  </button>
                }
              />
            </div>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em',
              color: ink, opacity: 0.55, textAlign: 'center', marginTop: 14,
            }}>
              Rolling enrollment — sign up by Friday, they start Monday. App access immediately upon checkout.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'PRODUCER CHALLENGE' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
  <div style={{
    background: bg, color, transform: `rotate(${rotate}deg)`,
    padding: '14px 0', whiteSpace: 'nowrap', overflow: 'hidden',
    width: '120%', marginLeft: '-10%',
    borderTop: `1px solid ${color}33`, borderBottom: `1px solid ${color}33`,
  }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'sp-marquee 28s linear infinite' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: editorial, fontSize: 'clamp(22px, 3.4vw, 44px)', letterSpacing: '0.04em', fontWeight: 400 }}>{phrase}</span>
          <span aria-hidden style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 999, background: dot, flexShrink: 0 }} />
        </span>
      ))}
    </div>
  </div>
);

const MarqueeBands = () => (
  <div style={{ background: paper, padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="42 DAYS · 30 TRAININGS" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="PRODUCER CHALLENGE" />
    </div>
    <style>{`
      @keyframes sp-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════════════
   CORE PROMISE — before / after lists
   ══════════════════════════════════════════════════════ */
const CorePromiseSection = () => {
  const before = [
    'Relies on mood and motivation',
    'Follow-up is emotional and chaotic',
    'Avoids uncomfortable conversations',
    'Operates without a documented system',
    'Communication with leadership is reactive',
  ];
  const after = [
    'Executes based on a daily system',
    'Follow-up is a documented, predictable cadence',
    'Asks bold questions to uncover truth',
    'Builds and refines a personal process',
    'Proactively communicates takeaways and action items',
  ];

  return (
    <section style={{ background: paper, padding: '120px 24px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 28,
          }}>
            / The Core Promise
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            NOT INFORMATION.<br />
            <span style={{ color: blue }}>AN OPERATING SYSTEM.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-12 gap-8 mt-16">
          {/* Before */}
          <Reveal className="col-span-12 md:col-span-6">
            <div style={{
              border: `1.5px solid ${red}`,
              padding: '32px 28px', height: '100%',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: red, textTransform: 'uppercase', marginBottom: 14,
              }}>
                ✕ Before · Unstructured Producer
              </p>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(24px, 3vw, 36px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
              }}>
                Reactive. Chaotic.
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {before.map((b) => (
                  <li key={b} style={{
                    fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
                    color: ink, padding: '12px 0', borderBottom: `1px solid ${ink}1a`,
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}>
                    <span style={{ color: red, fontSize: 14, flexShrink: 0, fontWeight: 700, lineHeight: '22px' }}>✕</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* After */}
          <Reveal delay={0.1} className="col-span-12 md:col-span-6">
            <div style={{
              border: `1.5px solid ${blue}`,
              padding: '32px 28px', height: '100%',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: blue, textTransform: 'uppercase', marginBottom: 14,
              }}>
                ✓ After · Systematic Producer
              </p>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(24px, 3vw, 36px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
              }}>
                Documented. Predictable.
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {after.map((a) => (
                  <li key={a} style={{
                    fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
                    color: ink, padding: '12px 0', borderBottom: `1px solid ${ink}1a`,
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}>
                    <span style={{ color: blue, fontSize: 14, flexShrink: 0, fontWeight: 700, lineHeight: '22px' }}>✓</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   SYSTEM NOT COURSE — 3 differentiators
   ══════════════════════════════════════════════════════ */
const differentiators = [
  { num: '01', title: 'A Daily Action Loop', body: "Producers don't just consume content. They are required to declare a takeaway and a measurable action every single day, training them to deploy what they learn immediately." },
  { num: '02', title: 'Direct Feedback to You', body: 'You are not left in the dark. You receive daily and weekly reports directly from your producer, giving you an unprecedented view into their engagement and application.' },
  { num: '03', title: 'Holistic Development', body: "Performance isn't just about sales tactics. We build the whole producer through the Core 4: Body, Being, Balance, and Business — ensuring the rest of their life fuels their work, not drains it." },
];

const SystemNotCourseSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Why It's Different
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
        }}>
          A SYSTEM.<br />NOT A COURSE.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
          color: paper, opacity: 0.75, maxWidth: 600, marginBottom: 56,
        }}>
          Other programs provide content. We provide a mechanism for verifiable change.
        </p>
      </Reveal>

      <div style={{ borderTop: `1px solid ${paper}33` }}>
        {differentiators.map((d, i) => (
          <Reveal key={d.num} delay={i * 0.06}>
            <div style={{
              borderBottom: `1px solid ${paper}33`,
              padding: '36px 0',
              display: 'grid',
              gridTemplateColumns: '60px 1fr 2fr',
              gap: 24,
              alignItems: 'baseline',
            }}>
              <span style={{
                fontFamily: editorial, fontSize: 22, color: paper,
                opacity: 0.4, letterSpacing: '-0.01em',
              }}>
                {d.num}
              </span>
              <h4 style={{
                fontFamily: display, fontSize: 'clamp(22px, 3vw, 36px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {d.title}
              </h4>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: paper, opacity: 0.8,
              }}>
                {d.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   ACCOUNTABILITY ENGINE — 30 daily + 6 weekly
   ══════════════════════════════════════════════════════ */
const AccountabilitySection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Accountability Engine
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          YOU SEE EVERY<br />REP. EVERY DAY.
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 gap-8">
        {/* 30 daily reports */}
        <Reveal className="col-span-12 md:col-span-6">
          <div style={{
            border: `1px solid ${ink}`,
            padding: '36px 28px', height: '100%',
          }}>
            <div className="flex items-baseline gap-4 mb-6">
              <span style={{
                fontFamily: display, fontSize: 'clamp(64px, 8vw, 110px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
              }}>
                30
              </span>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(16px, 2vw, 22px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                Daily Action<br />Reports
              </p>
            </div>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.75, marginBottom: 18,
            }}>
              The moment your producer completes a module, you receive an email with their answers to two exact questions:
            </p>
            <div style={{ borderLeft: `3px solid ${blue}`, paddingLeft: 16 }}>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 600, fontStyle: 'italic',
                color: blue, marginBottom: 8,
              }}>
                "What is your takeaway from today's topic?"
              </p>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 600, fontStyle: 'italic',
                color: blue,
              }}>
                "What is one measurable item you can take action on today?"
              </p>
            </div>
          </div>
        </Reveal>

        {/* 6 weekly stacks */}
        <Reveal delay={0.1} className="col-span-12 md:col-span-6">
          <div style={{
            border: `1px solid ${ink}`,
            padding: '36px 28px', height: '100%',
          }}>
            <div className="flex items-baseline gap-4 mb-6">
              <span style={{
                fontFamily: display, fontSize: 'clamp(64px, 8vw, 110px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
              }}>
                6
              </span>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(16px, 2vw, 22px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                Weekly Discovery<br />Stacks
              </p>
            </div>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.75, marginBottom: 18,
            }}>
              Every Friday, your producer completes a "Discovery Stack" — a guided reflection on the week's lessons, challenges, and revelations.
            </p>
            <div style={{ background: ink, color: paper, padding: 16 }}>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: paper, opacity: 0.85,
              }}>
                They share the full PDF report directly with you, giving you deep insight into their growth journey.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   DAILY RHYTHM — 3 step process
   ══════════════════════════════════════════════════════ */
const rhythmSteps = [
  { num: '01', title: 'Watch', body: 'They start each day with a short, focused training video (one of 30 modules) inside The Armory. Topics range from mindsets to advanced sales tactics.' },
  { num: '02', title: 'Act', body: 'The training is followed by a prompt to declare a specific, measurable action they will take that day based on the lesson. The focus is on application, not just theory.' },
  { num: '03', title: 'Report', body: 'They submit their daily form, which is instantly emailed to you. This closes the loop and hardwires accountability into their daily routine.' },
];

const DailyRhythmSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Daily Rhythm
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
        }}>
          WATCH. ACT.<br />
          <span style={{ color: blue }}>REPORT.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.7, maxWidth: 600, marginBottom: 56,
        }}>
          A simple, repeatable process designed to build momentum and turn learning into habit.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {rhythmSteps.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: blue,
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(28px, 3.5vw, 48px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.7, marginTop: 14,
              }}>
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   CURRICULUM — 6 weeks
   ══════════════════════════════════════════════════════ */
const weeks = [
  { week: 1, focus: 'Building the Engine', topics: ['Core 4 Framework', 'Gratitude Stacking', 'Micro Wins', 'Discovery Stack #1'] },
  { week: 2, focus: 'Installing the Process', topics: ['Daily Non-Negotiables', 'Structured Follow-Up', 'Appointments That Hold'] },
  { week: 3, focus: 'Lead Management Mastery', topics: ['Speed to Contact (60-second rule)', 'Three Bucket System', 'CRM Clarity'] },
  { week: 4, focus: 'Relationship & Retention', topics: ['The Art of Asking', 'Referral Revolution', 'Onboarding', 'Connection Without Expectation'] },
  { week: 5, focus: 'Closing & Conviction', topics: ['COIs', 'Reframing Price', 'One-Call Close', 'Graceful Objection Handling'] },
  { week: 6, focus: 'Sustaining Momentum', topics: ['Setting Standards', '90-Day Target Setting', 'Reflection on Transformation'] },
];

const CurriculumSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Curriculum
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          SIX WEEKS.<br />ZERO FLUFF.
        </h2>
      </Reveal>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
        {weeks.map((w, i) => (
          <Reveal key={w.week} delay={i * 0.04}>
            <li style={{
              borderBottom: `1px solid ${ink}`,
              padding: '32px 8px',
              display: 'grid',
              gridTemplateColumns: '80px 1fr 2fr',
              gap: 24,
              alignItems: 'baseline',
            }}
              className="hover:bg-black/[0.03] transition-colors"
            >
              <span style={{
                fontFamily: display, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: blue,
              }}>
                {String(w.week).padStart(2, '0')}
              </span>
              <h4 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.6vw, 32px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {w.focus}
              </h4>
              <ul style={{
                listStyle: 'none', margin: 0, padding: 0,
                display: 'flex', flexWrap: 'wrap', gap: '6px 16px',
              }}>
                {w.topics.map((t) => (
                  <li key={t} style={{
                    fontFamily: body, fontSize: 13, fontWeight: 500, letterSpacing: '0.02em',
                    color: ink, opacity: 0.7,
                  }}>
                    · {t}
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   CULTURAL IMPACT
   ══════════════════════════════════════════════════════ */
const CulturalSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Beyond Skills
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
        }}>
          BUILDING<br />A CULTURE.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.7, maxWidth: 720, marginBottom: 56,
        }}>
          The challenge is designed to build a culture of communication and clarity — not just a better salesperson.
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8">
        {[
          { label: 'Critical Conversations', body: "Modules on follow-up, referrals, and onboarding explicitly instruct the producer to get clarity from leadership on the agency's process. If they're unsure, you'll see it in their daily report." },
          { label: 'Bridging Leadership Gap', body: "The daily feedback loop opens a new channel of communication. You'll gain insight into their thinking, challenges, and wins — creating a stronger, more authentic connection than typical performance reviews." },
        ].map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08} className="col-span-12 md:col-span-6">
            <div style={{
              border: `1px solid ${ink}`,
              padding: '32px 28px', height: '100%',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: blue, textTransform: 'uppercase', marginBottom: 14,
              }}>
                / {String(i + 1).padStart(2, '0')}
              </p>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(24px, 3vw, 36px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18,
              }}>
                {c.label}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.75,
              }}>
                {c.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   TECH STACK
   ══════════════════════════════════════════════════════ */
const tools = [
  { num: '01', label: 'The Armory', body: 'The central hub for all 30 video training modules. Content is released daily to prevent binging and ensure paced, deliberate learning.' },
  { num: '02', label: 'Core 4 Tracker', body: 'Producers gamify their progress with daily habit-tracking across Body, Being, Balance, and Business — building the foundation for sustained sales success.' },
  { num: '03', label: 'Stacking', body: 'A guided reflection tool with 19 different frameworks (Gratitude, Irritation, etc). Teaches producers how to process emotions, separate feelings from facts, and find the lesson in any situation.' },
];

const TechStackSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Technology
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
        }}>
          BUILT FOR<br />THE PHONE.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
          color: paper, opacity: 0.75, maxWidth: 600, marginBottom: 56,
        }}>
          Full access to a professional-grade platform for training and personal development. Desktop or mobile (iOS & Android).
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 md:col-span-7">
          <div style={{ borderTop: `1px solid ${paper}33` }}>
            {tools.map((t, i) => (
              <Reveal key={t.num} delay={i * 0.06}>
                <div style={{
                  borderBottom: `1px solid ${paper}33`,
                  padding: '28px 0',
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr',
                  gap: 20,
                  alignItems: 'baseline',
                }}>
                  <span style={{
                    fontFamily: editorial, fontSize: 22, color: paper,
                    opacity: 0.4, letterSpacing: '-0.01em',
                  }}>
                    {t.num}
                  </span>
                  <div>
                    <h4 style={{
                      fontFamily: display, fontSize: 'clamp(22px, 2.6vw, 32px)',
                      lineHeight: 1, letterSpacing: '-0.01em', color: paper,
                      textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 8,
                    }}>
                      {t.label}
                    </h4>
                    <p style={{
                      fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                      color: paper, opacity: 0.75,
                    }}>
                      {t.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="col-span-12 md:col-span-5">
          <motion.div
            whileHover={{ rotate: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: paper, padding: '14px 14px 22px',
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.55)',
              transform: 'rotate(4deg)',
              maxWidth: 480, marginInline: 'auto',
            }}
          >
            <div style={{ overflow: 'hidden', background: '#eee' }}>
              <img src="/lovable-uploads/862c875f-96ae-42fe-b043-eec8370ea39e.png"
                alt="The Standard App"
                style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
              color: ink, textTransform: 'uppercase', marginTop: 14, textAlign: 'center',
            }}>
              The Standard App
            </p>
          </motion.div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   ROI — for owner / for producer
   ══════════════════════════════════════════════════════ */
const ROISection = () => {
  const ownerBenefits = [
    'Full visibility through 30 daily reports',
    'Deeper insight from 6 weekly reflections',
    'A clear process for closing skill and system gaps',
    'A producer who takes ownership of their results',
  ];
  const producerBenefits = [
    'A repeatable system for daily execution',
    'Clarity on high-leverage sales activities',
    'Tools to manage the stress of a sales role',
    'A 90-day plan to continue their growth',
  ];

  return (
    <section style={{ background: paper, padding: '120px 24px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 28,
          }}>
            / The Return
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
          }}>
            BOTH SIDES<br />OF THE TABLE WIN.
          </h2>
        </Reveal>

        <div className="grid grid-cols-12 gap-8">
          {[
            { label: 'For You · The Owner', items: ownerBenefits },
            { label: 'For Your Producer', items: producerBenefits },
          ].map((c, idx) => (
            <Reveal key={c.label} delay={idx * 0.1} className="col-span-12 md:col-span-6">
              <div style={{
                border: `1px solid ${ink}`,
                padding: '32px 28px', height: '100%',
              }}>
                <p style={{
                  fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                  color: blue, textTransform: 'uppercase', marginBottom: 24,
                }}>
                  {c.label}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {c.items.map((b) => (
                    <li key={b} style={{
                      fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
                      color: ink, padding: '12px 0', borderBottom: `1px solid ${ink}1a`,
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                      <span style={{ color: blue, fontSize: 14, flexShrink: 0, fontWeight: 700, lineHeight: '22px' }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   OUTCOME — Integrity / Resilience / Loyalty
   ══════════════════════════════════════════════════════ */
const outcomes = [
  { label: 'Integrity', body: 'They learn to keep their word to themselves and to you.' },
  { label: 'Resilience', body: 'They learn to process challenges constructively rather than emotionally.' },
  { label: 'Loyalty', body: 'They see an owner who invests in their total growth — leading to higher staff retention and a culture that attracts other top performers.' },
];

const OutcomeSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Ultimate Outcome
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
        }}>
          A TRANSFORMED<br />TEAM MEMBER.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
          color: paper, opacity: 0.75, maxWidth: 600, marginBottom: 56,
        }}>
          The goal isn't just a better producer. It's a more committed teammate.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${paper}33` }}>
        {outcomes.map((o, i) => (
          <Reveal key={o.label} delay={i * 0.08}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${paper}33`,
              borderRight: i < 2 ? `1px solid ${paper}33` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 22, color: blue, opacity: 0.85,
                letterSpacing: '-0.01em',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(28px, 3.5vw, 48px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {o.label}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: paper, opacity: 0.8, marginTop: 14,
              }}>
                {o.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   LOGISTICS
   ══════════════════════════════════════════════════════ */
const logistics = [
  { num: '01', label: 'Rolling Enrollment', body: 'No fixed start date. The challenge is always active. Sign up any producer by Friday and they automatically begin the following Monday.' },
  { num: '02', label: 'Automated Kickoff', body: "The Sunday before they start, your producer receives an automated welcome email and text with their app login, password setup, and the optional 'Sunday Service' form to plan their week." },
  { num: '03', label: 'Daily Reminders', body: 'To ensure engagement, producers receive a daily text reminder at 9:00 a.m. local time to complete their module.' },
];

const LogisticsSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Logistics
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          THREE STEPS.<br />THEY START MONDAY.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {logistics.map((l, i) => (
          <Reveal key={l.num} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 22, color: ink,
                opacity: 0.4, letterSpacing: '-0.01em',
              }}>
                {l.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(22px, 2.8vw, 36px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {l.label}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.7, marginTop: 12,
              }}>
                {l.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FINAL CTA — pricing block
   ══════════════════════════════════════════════════════ */
const FinalCTA = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Lock It In
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8">
        <Reveal className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, opacity: 0.6, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Producer Challenge · Per Producer
          </p>
          <div style={{ position: 'relative', display: 'inline-block', paddingBottom: 8 }}>
            <h2 style={{
              fontFamily: display, fontSize: 'clamp(72px, 18vw, 260px)',
              lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
              margin: 0, fontWeight: 400, position: 'relative', zIndex: 1,
            }}>
              $299
            </h2>
            <p style={{
              fontFamily: editorial, fontSize: 'clamp(22px, 2.8vw, 40px)',
              lineHeight: 1, letterSpacing: '-0.01em', color: blue,
              margin: 0, marginTop: 16,
              fontWeight: 400, textTransform: 'uppercase',
              position: 'relative', zIndex: 2,
            }}>
              per producer · one time
            </p>
          </div>

          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.75, marginTop: 28, maxWidth: 520,
          }}>
            30 daily reports + 6 weekly reflections sent directly to you. Enroll any producer by Friday for a Monday kickoff.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
                padding: '16px 30px', transition: 'all .25s',
              }}
              className="hover:bg-[#2997FF]">
              Enroll Now →
            </a>
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                color: ink, background: 'transparent', textTransform: 'uppercase', textDecoration: 'none',
                padding: '15px 28px', border: `1.5px solid ${ink}`, transition: 'all .25s',
              }}
              className="hover:bg-black hover:text-white">
              Book a Call →
            </a>
          </div>
        </Reveal>

        <div className="col-span-12 md:col-span-5">
          <Reveal delay={0.1}>
            <div style={{
              background: ink, color: paper, padding: '32px 28px',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                color: blue, textTransform: 'uppercase', marginBottom: 14,
              }}>
                ★ The Promise
              </p>
              <p style={{
                fontFamily: display, fontSize: 'clamp(24px, 2.8vw, 32px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14,
              }}>
                42 days.<br />Zero guesswork.
              </p>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                color: paper, opacity: 0.85,
              }}>
                Daily action loop. Weekly Discovery Stack. Direct visibility for you. All enrollments are final — we provide immediate access to the full system.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════════ */
const faqs = [
  { q: 'When does the challenge start?', a: 'The Producer Challenge runs on a rolling enrollment basis. Sign up any producer by Friday and they will automatically begin the following Monday. There are no fixed cohort dates — the system is always ready.' },
  { q: 'How much time does this require daily?', a: 'Each daily module takes approximately 3-5 minutes to watch. Including the action declaration and submission, expect 10-15 minutes per day. The weekly Discovery Stack takes about 20-30 minutes on Fridays.' },
  { q: 'What if my producer misses a day?', a: "All content remains accessible throughout the 6-week period. While daily completion is encouraged for building the habit loop, producers can catch up if needed. You'll see exactly which modules they've completed through the daily reports." },
  { q: 'What access do I get as the owner?', a: "You receive every daily action report via email, plus the full PDF of each weekly Discovery Stack. This gives you unprecedented visibility into your producer's engagement, takeaways, and action commitments." },
  { q: "What's included in the app access?", a: 'Your producer gets 60 days of full access to The Standard App, including The Armory (30 training modules), Core 4 Tracker (habit gamification), and all 19 Stacking frameworks for emotional processing and reflection.' },
  { q: 'What is the "Core 4"?', a: 'The Core 4 tracks daily habits that drive performance: Body (health and energy), Being (mindset and spiritual alignment), Balance (relationships and gratitude), and Business (productivity and sales execution). Each checked box equals proof of daily integrity.' },
  { q: 'What is a "Discovery Stack"?', a: 'A guided reflection form completed each Friday. It helps participants process lessons, wins, and challenges for the week, then share the link with leadership for visibility.' },
  { q: 'What topics are covered in the 6 weeks?', a: 'Sales, communication, and leadership skills including: Consistency & Non-Negotiables, Follow-Up Systems, Speed to Contact, The Three-Bucket System, Referrals & Retention, Objection Handling, Closing Confidence, and Setting 90-Day Targets.' },
  { q: 'What happens after completion?', a: 'At the six-week mark, participants can continue using the app via monthly membership (Stack or Arsenal). Agency Owners can get access to 25% off a Membership Level in Standard for life.' },
  { q: "What's the investment policy?", a: 'All enrollments are final. We provide immediate access to the full system and are confident in the transformation your producer will experience.' },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 28,
          }}>
            / Questions
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
          }}>
            ASKED &<br />ANSWERED.
          </h2>
        </Reveal>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={Math.min(i * 0.03, 0.18)}>
                <li
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ borderBottom: `1px solid ${ink}`, cursor: 'pointer' }}
                  className="hover:bg-black/[0.03] transition-colors"
                >
                  <div style={{
                    padding: '24px 16px',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: 20,
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: editorial, fontSize: 18, color: ink,
                      opacity: isOpen ? 1 : 0.4, letterSpacing: '-0.01em',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 style={{
                      fontFamily: editorial, fontSize: 'clamp(16px, 1.8vw, 22px)',
                      lineHeight: 1.2, letterSpacing: '-0.01em', color: ink,
                      textTransform: 'uppercase', margin: 0, fontWeight: 400,
                    }}>
                      {item.q}
                    </h4>
                    <span aria-hidden style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, border: `1.5px solid ${ink}`,
                      fontFamily: body, fontSize: 16, fontWeight: 400,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      background: isOpen ? ink : 'transparent',
                      color: isOpen ? paper : ink,
                      transition: 'all .35s ease',
                    }}>
                      +
                    </span>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 28px 96px' }}>
                      <p style={{
                        fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                        color: ink, opacity: 0.75, maxWidth: 720,
                      }}>
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   GIANT CTA — ENROLL.
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => (
  <section
    onClick={() => window.open(ENROLL_URL, '_blank')}
    style={{
      background: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
    }}
    role="button" aria-label="Enroll in the Producer Challenge">
    <div className="max-w-[1440px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Your Move
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
          lineHeight: 0.82, letterSpacing: '-0.03em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          ENROLL.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
        }}>
          Click anywhere &nbsp;→&nbsp; Sign up at $299 per producer
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
const BoldFooter = () => (
  <footer style={{ background: ink, color: paper, padding: '60px 24px 30px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: `1px solid ${paper}1a` }}>
        <div className="col-span-2">
          <img src={standardLogo} alt="Standard Playbook"
            style={{ height: 22, filter: 'invert(1)', marginBottom: 18 }} />
          <p style={{
            fontFamily: body, fontSize: 16, lineHeight: 1.5, marginBottom: 22,
            maxWidth: 380, opacity: 0.85,
          }}>
            High-performance coaching for insurance agency owners. Raise your standard and live the playbook.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560049427918"
              target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }}
              className="hover:opacity-100">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/justinhark/"
              target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }}
              className="hover:opacity-100">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {[
          { title: 'Programs', items: [
            { label: 'Boardroom', href: '/boardroom' },
            { label: 'Directive', href: '/directive' },
            { label: '8-Week', href: '/sales-experience' },
            { label: 'Producer Challenge', href: '/the-challenge' },
          ]},
          { title: 'Company', items: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
          ]},
        ].map((col) => (
          <div key={col.title}>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em',
              opacity: 0.5, textTransform: 'uppercase', marginBottom: 14,
            }}>
              {col.title}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {col.items.map((it) => (
                <li key={it.label} style={{ marginBottom: 8 }}>
                  <Link to={it.href} style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.85, textDecoration: 'none' }} className="hover:opacity-100">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p style={{ fontFamily: body, fontSize: 11, opacity: 0.5, letterSpacing: '0.08em' }}>
          © {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   MOBILE STICKY CTA
   ══════════════════════════════════════════════════════ */
const MobileStickyCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40"
    style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}>
    <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer"
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase',
        display: 'block', textAlign: 'center', textDecoration: 'none',
      }}>
      Enroll Now →
    </a>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldProducerChallenge = () => {
  // Load Wistia player scripts on mount
  useEffect(() => {
    const wistiaPlayerScript = document.createElement('script');
    wistiaPlayerScript.src = 'https://fast.wistia.com/player.js';
    wistiaPlayerScript.async = true;
    document.body.appendChild(wistiaPlayerScript);

    const wistiaEmbedScript = document.createElement('script');
    wistiaEmbedScript.src = 'https://fast.wistia.com/embed/1bz6nrl5ip.js';
    wistiaEmbedScript.async = true;
    wistiaEmbedScript.type = 'module';
    document.body.appendChild(wistiaEmbedScript);

    return () => {
      const wp = document.querySelector('script[src="https://fast.wistia.com/player.js"]');
      if (wp) document.body.removeChild(wp);
      const we = document.querySelector('script[src="https://fast.wistia.com/embed/1bz6nrl5ip.js"]');
      if (we) document.body.removeChild(we);
    };
  }, []);

  return (
    <>
      <SEOHead config={{
        title: 'The Producer Challenge — 6-Week Sales Transformation',
        description: 'Transform your producer from reactive chaos to systematic execution in 42 days. Daily accountability, weekly reports, and full visibility into their growth.',
        keywords: ['producer challenge', 'sales training', 'insurance producer', 'accountability', 'team development'],
      }} />
      <div style={{ background: paper, fontFamily: body, color: ink }}>
        <BoldNav />
        <Hero />
        <MarqueeBands />
        <CorePromiseSection />
        <SystemNotCourseSection />
        <AccountabilitySection />
        <DailyRhythmSection />
        <CurriculumSection />
        <CulturalSection />
        <TechStackSection />
        <ROISection />
        <OutcomeSection />
        <LogisticsSection />
        <FinalCTA />
        <FAQSection />
        <GiantCTA />
        <BoldFooter />
        <ContentMeta lastUpdated="March 2026" />
        <MobileStickyCTA />
      </div>
    </>
  );
};

export default BoldProducerChallenge;
