import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StandardFitModal from '@/components/StandardFitModal';
import SEOHead from '@/components/SEOHead';

import standardLogo from '@/assets/standard-word-logo.png';

const STORAGE_BASE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';
const salesExpDashImg = `${STORAGE_BASE}/Sales%20Experience%20Dashboard.png`;
const teamMeetingImg = `${STORAGE_BASE}/Team%20%26%20Meeting%20Hub.png`;
const trainingModulesImg = `${STORAGE_BASE}/Training%20Modules%20w%20Feedback.png`;

const VIMEO_ID = '1184535551';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const red = '#C8102E';

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
   LOGO HEADER (no nav — application landing)
   ══════════════════════════════════════════════════════ */
const LogoHeader = () => (
  <header
    style={{
      background: paper,
      padding: '20px 24px',
      borderBottom: `1px solid ${ink}`,
      position: 'sticky', top: 0, zIndex: 50,
    }}
    className="flex items-center justify-center"
  >
    <Link to="/" aria-label="Standard Playbook">
      <img src={standardLogo} alt="Standard Playbook"
        style={{ height: 22, filter: 'brightness(0)' }} />
    </Link>
  </header>
);

/* ── Primary CTA button ─────────────────────────────────── */
const BookCallButton = ({
  label = 'Book Your Strategy Call',
  onClick,
  size = 'default',
  variant = 'filled',
}: {
  label?: string;
  onClick: () => void;
  size?: 'default' | 'large';
  variant?: 'filled' | 'outlined' | 'paper';
}) => {
  const baseStyle: React.CSSProperties = {
    fontFamily: body,
    fontSize: size === 'large' ? 14 : 13,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.25s',
    border: `1.5px solid ${ink}`,
    padding: size === 'large' ? '18px 36px' : '15px 28px',
    textDecoration: 'none',
    display: 'inline-block',
  };
  const variantStyle: React.CSSProperties =
    variant === 'filled'
      ? { color: '#fff', background: ink }
      : variant === 'paper'
        ? { color: ink, background: paper, border: 'none' }
        : { color: ink, background: 'transparent' };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variantStyle }}
      className={variant === 'filled' ? 'hover:bg-[#2997FF] hover:border-[#2997FF]' : 'hover:bg-black hover:text-white'}
    >
      {label} →
    </button>
  );
};

/* ══════════════════════════════════════════════════════
   HERO — VSL + single CTA
   ══════════════════════════════════════════════════════ */
const HeroSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: paper, padding: '60px 24px 100px', position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / 8-Week Sales Management Experience · Application
        </p>
      </Reveal>

      <Reveal>
        <h1 style={{
          fontFamily: display,
          fontSize: 'clamp(40px, 10vw, 180px)',
          lineHeight: 0.9, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
        }}>
          STOP MANAGING<br />
          <span className="md:pl-[4vw] inline-block">CHAOS. START</span><br />
          <span className="md:pl-[12vw] inline-block" style={{ color: blue }}>RUNNING A SYSTEM.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, marginTop: 28, maxWidth: 720,
        }}>
          The 8-Week Sales Management Experience — built for Allstate, Farmers, and State Farm agency owners who are tired of being their own sales manager.
        </p>
      </Reveal>

      {/* VSL Frame */}
      <Reveal delay={0.25}>
        <motion.div
          whileHover={{ rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', background: ink, padding: 8,
            maxWidth: 980, marginInline: 'auto', marginTop: 32,
            boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
            transform: 'rotate(-1.5deg)',
          }}>
          <div style={{ aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&muted=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="8-Week Sales Management Experience"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </motion.div>
      </Reveal>

      <Reveal delay={0.35}>
        <div className="flex flex-col items-center mt-14 gap-6">
          <BookCallButton onClick={onBookCall} size="large" />
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            style={{
              fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, opacity: 0.7, textTransform: 'uppercase',
            }}>
            <span className="flex items-center gap-2"><span style={{ color: blue, fontWeight: 700 }}>✓</span> 45-min call with Justin</span>
            <span className="flex items-center gap-2"><span style={{ color: blue, fontWeight: 700 }}>✓</span> No pitch deck</span>
            <span className="flex items-center gap-2"><span style={{ color: blue, fontWeight: 700 }}>✓</span> Money-back guarantee</span>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = '8-WEEK EXPERIENCE' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="8 WEEKS · GUARANTEED" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="STOP BEING THE MANAGER" />
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
   PROBLEM
   ══════════════════════════════════════════════════════ */
const ProblemSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Problem
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 9vw, 140px)',
          lineHeight: 0.92, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          GREAT MONTH.<br />
          <span className="md:pl-[6vw] inline-block">BAD MONTH.</span><br />
          <span className="md:pl-[12vw] inline-block">GREAT MONTH.</span><br />
          <span className="md:pl-[18vw] inline-block">BAD MONTH.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: display, fontSize: 'clamp(24px, 4.5vw, 60px)',
          lineHeight: 1, letterSpacing: '-0.01em', color: blue,
          textTransform: 'uppercase', marginTop: 48, fontWeight: 400, maxWidth: 900,
        }}>
          THAT'S NOT A SALES TEAM.<br />THAT'S A COIN FLIP.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PROMISE
   ══════════════════════════════════════════════════════ */
const PromiseSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Promise
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 8vw, 120px)',
          lineHeight: 0.92, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          IN 8 WEEKS,<br />
          <span className="md:pl-[8vw] inline-block">THE FRAMEWORK</span><br />
          <span className="md:pl-[14vw] inline-block">IS INSTALLED.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="flex flex-wrap gap-x-10 gap-y-3 mt-12">
          {['A Process.', 'A Scorecard.', 'A Rhythm.', 'A Guarantee.'].map((p) => (
            <span key={p} style={{
              fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 32px)',
              letterSpacing: '-0.01em', color: paper, opacity: 0.85,
            }}>
              {p}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THREE SYSTEMS
   ══════════════════════════════════════════════════════ */
const systems = [
  { num: '01', label: 'Sales Process', body: 'A documented, repeatable call framework. Your entire team follows the same playbook.' },
  { num: '02', label: 'Accountability Framework', body: 'Weekly rhythm, scorecards, clear expectations. No more winging it.' },
  { num: '03', label: 'Consequence Ladder', body: 'A clear progression for when someone misses the standard — built by you, for your culture. No templates forced on your team.' },
];

const SystemsSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / What You Walk Away With
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            THREE SYSTEMS.<br />INSTALLED.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            By week eight, all three are running inside your agency — not in a doc, not in your head.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {systems.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.06}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: blue,
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(22px, 2.8vw, 32px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {s.label}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.7, marginTop: 14,
              }}>
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="text-center mt-14">
          <BookCallButton onClick={onBookCall} />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   HOW IT WORKS — weekly rhythm
   ══════════════════════════════════════════════════════ */
const weekly = [
  { when: 'Every Monday', body: 'A training video drops. Short, tactical, watchable in 20 minutes.' },
  { when: 'Every Wednesday', body: 'A training document lands. Scripts, frameworks, and the exact words to use.' },
  { when: 'Every Friday', body: "Your sales team runs a discovery flow and declares the week's takeaways." },
  { when: 'Every Week', body: 'A 1:1 Zoom call with Justin — for you, or for your sales manager.' },
  { when: 'Every Week', body: "You grade 4 of your team's calls. Each rep. Every week. Unlimited reps." },
  { when: 'By Week 8', body: 'Your sales process is documented. Your consequence ladder is installed. Your team is on the system.' },
];

const HowItWorksSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / How It Works
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            8 WEEKS<br />INSIDE STANDARD.
          </h2>
        </Reveal>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${paper}33` }}>
        {weekly.map((w, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li style={{
              borderBottom: `1px solid ${paper}33`,
              padding: '24px 8px',
              display: 'grid',
              gridTemplateColumns: 'minmax(140px, 200px) 1fr',
              gap: 24,
              alignItems: 'baseline',
            }}>
              <span style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: blue, textTransform: 'uppercase',
              }}>
                {w.when}
              </span>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(18px, 2.4vw, 28px)',
                lineHeight: 1.15, letterSpacing: '-0.01em', color: paper,
                margin: 0, fontWeight: 400,
              }}>
                {w.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   WHAT'S INCLUDED — deliverable numerals
   ══════════════════════════════════════════════════════ */
const deliverables = [
  { qty: '8', label: 'Monday training videos', sub: 'Short, tactical, watchable in 20 minutes.' },
  { qty: '8', label: 'Wednesday playbook docs', sub: 'Scripts, frameworks, and the exact words to use.' },
  { qty: '8', label: 'Friday team discovery flows', sub: "Run by your team to declare the week's takeaways." },
  { qty: '8', label: '1:1 coaching calls with Justin', sub: 'For you, or for your sales manager. 45 minutes.' },
  { qty: '32+', label: 'Graded calls per rep', sub: '4 per rep, every week. Unlimited reps.' },
  { qty: '∞', label: 'Full Agency Brain access', sub: 'Sequencing, weekly debriefs, Core Four tracking, unlimited training.' },
];

const WhatsIncludedSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / What's Included
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          EVERY DELIVERABLE.<br />IN WRITING.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {deliverables.map((d, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06}>
            <div style={{
              padding: '40px 28px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: `1px solid ${ink}`,
              display: 'flex', flexDirection: 'column', gap: 0,
            }}
              className="lg:[&:nth-child(3n)]:!border-r-0 md:max-lg:[&:nth-child(2n)]:!border-r-0"
            >
              <span style={{
                fontFamily: display, fontSize: 'clamp(72px, 9vw, 128px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
                marginBottom: 24, display: 'block',
              }}>
                {d.qty}
              </span>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(16px, 1.7vw, 20px)',
                lineHeight: 1.1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {d.label}
              </p>
              <p style={{
                fontFamily: body, fontSize: 13, fontWeight: 400, lineHeight: 1.5,
                color: ink, opacity: 0.6, marginTop: 8,
              }}>
                {d.sub}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div style={{
          marginTop: 40, padding: '32px 28px', background: ink, color: paper,
        }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"
        >
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              color: blue, textTransform: 'uppercase', marginBottom: 6,
            }}>
              ★ By Week 8
            </p>
            <p style={{
              fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 28px)',
              lineHeight: 1.1, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400,
            }}>
              Process. Framework. Ladder.<br />Documented. Installed. Running.
            </p>
          </div>
          <BookCallButton onClick={onBookCall} variant="paper" />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   TOOLS — 3 polaroids
   ══════════════════════════════════════════════════════ */
const tools = [
  { label: 'Dashboard', title: 'Whole agency at a glance.', img: salesExpDashImg, tilt: -5 },
  { label: 'Team Hub', title: 'Run your weekly rhythm in one place.', img: teamMeetingImg, tilt: 4 },
  { label: 'Training', title: 'Graded calls, feedback, reps.', img: trainingModulesImg, tilt: -3 },
];

const ToolsSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Platform
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          BUILT TO RUN<br />THE SYSTEM.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {tools.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.08}>
            <motion.div
              whileHover={{ rotate: 0, scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#fff', padding: '14px 14px 22px',
                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
                transform: `rotate(${t.tilt}deg)`,
              }}>
              <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: '#eee' }}>
                <img src={t.img} alt={t.label} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: 16 }}>
                <p style={{
                  fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                  color: blue, textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {t.label}
                </p>
                <h4 style={{
                  fontFamily: display, fontSize: 22, lineHeight: 1.05, letterSpacing: '-0.01em',
                  color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
                }}>
                  {t.title}
                </h4>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   TESTIMONIALS
   ══════════════════════════════════════════════════════ */
const textTestimonials = [
  {
    quote: "Creating and enforcing a standard is something every leader needs help with. Working with Justin was a game changer — you don't realize what you're missing until you have someone who truly understands your challenges and helps deliver results that matter. Accountability was something I struggled to implement, but once we established and enforced our own standards, it forced everyone to level up.",
    name: 'Luis S.',
    location: 'Arkansas',
  },
  {
    quote: "Working with Justin over the 8-week training was eye-opening and transformative — he showed me how to become a stronger, more accountable leader for my team and can truly bulletproof your agency, as long as you're able to hold yourself accountable as well.",
    name: 'Jonas B.',
    location: 'Florida',
  },
  {
    quote: "The point in the 8 weeks that shifted for my manager was when I realized that the structure we were so focused on wasn't even the issue. It was the confidence to have the conversations she lacked. Justin installed that into the coaching and it was night and day by the time it was over.",
    name: 'Stacey C.',
    location: 'Utah',
  },
];

const TestimonialsSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Testimonials
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          WHAT OWNERS<br />ARE SAYING.
        </h2>
      </Reveal>

      {/* Featured video testimonial */}
      <div className="grid grid-cols-12 gap-8 items-center mb-20">
        <Reveal className="col-span-12 md:col-span-7">
          <h3 style={{
            fontFamily: display, fontSize: 'clamp(28px, 4.5vw, 60px)',
            lineHeight: 1, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            "HE PAID ATTENTION<br />TO MY CULTURE<br />FIRST."
          </h3>
          <p style={{
            fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.16em',
            color: ink, opacity: 0.7, textTransform: 'uppercase', marginTop: 24,
          }}>
            Dan Westrick — Allstate Agency Owner
          </p>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-5">
          <div style={{
            background: '#000', padding: 12, transform: 'rotate(3deg)',
            boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
            maxWidth: 320, marginInline: 'auto',
          }}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/p5r3aelfj0?autoPlay=false&fullscreenButton=true&playButton=true&smallPlayButton=true&volumeControl=true&controlsVisibleOnLoad=true"
              title="Dan Westrick Success Story"
              allow="autoplay; fullscreen"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              className="w-full"
              style={{ aspectRatio: '9/16', border: 'none', display: 'block' }}
            />
          </div>
        </Reveal>
      </div>

      {/* Text testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {textTestimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <article style={{
              border: `1px solid ${ink}`, padding: '28px 24px', height: '100%',
              display: 'flex', flexDirection: 'column',
            }}>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.85, margin: 0, flex: 1,
              }}>
                "{t.quote}"
              </p>
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${ink}1a` }}>
                <p style={{
                  fontFamily: editorial, fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                  textTransform: 'uppercase', margin: 0, fontWeight: 400,
                }}>
                  {t.name}
                </p>
                <p style={{
                  fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                  color: blue, textTransform: 'uppercase', marginTop: 4,
                }}>
                  {t.location}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FIT CHECK
   ══════════════════════════════════════════════════════ */
const notFor = [
  "You're looking for a guru who'll tell you to hustle harder",
  "You're not willing to implement the process I hand you",
  "You're okay with your current results",
  'You think your sales manager will figure it out on their own',
];
const forYou = [
  'You\'re done with "great month, bad month"',
  "You're ready to stop being the sales manager",
  "You'll actually do the work for 8 weeks",
  'You want a system, not motivation',
];

const FitSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Fit Check
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          IS THIS<br />FOR YOU?
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal>
          <div style={{
            border: `1.5px solid ${red}`, padding: '32px 28px', height: '100%',
          }}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              color: red, textTransform: 'uppercase', marginBottom: 14,
            }}>
              ✕ This is NOT for you if
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {notFor.map((item) => (
                <li key={item} style={{
                  fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
                  color: ink, padding: '12px 0', borderBottom: `1px solid ${ink}1a`,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <span style={{ color: red, fontSize: 14, lineHeight: '22px', flexShrink: 0, fontWeight: 700 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{
            border: `1.5px solid ${blue}`, padding: '32px 28px', height: '100%',
            background: `${blue}08`,
          }}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              color: blue, textTransform: 'uppercase', marginBottom: 14,
            }}>
              ✓ This IS for you if
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {forYou.map((item) => (
                <li key={item} style={{
                  fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
                  color: ink, padding: '12px 0', borderBottom: `1px solid ${ink}1a`,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <span style={{ color: blue, fontSize: 14, lineHeight: '22px', flexShrink: 0, fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.25}>
        <div className="text-center mt-14">
          <BookCallButton onClick={onBookCall} />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   GUARANTEE
   ══════════════════════════════════════════════════════ */
const GuaranteeSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-8 items-center">
        <Reveal className="col-span-12 md:col-span-4 flex justify-center md:justify-start">
          <div style={{
            width: 200, height: 200, borderRadius: '50%', position: 'relative',
            background: 'linear-gradient(145deg, #d4a843, #f5d673, #c4952a)',
            boxShadow: '0 0 0 6px #c4952a, 0 0 60px rgba(212,168,67,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'rotate(-6deg)',
          }}>
            <div style={{
              width: 170, height: 170, borderRadius: '50%',
              border: '2px solid rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '1.2px', color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>Money Back</span>
              <span style={{ fontFamily: display, fontSize: 56, fontWeight: 400, color: ink, lineHeight: 1, marginTop: 4 }}>100%</span>
              <span style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', marginTop: 4 }}>Guarantee</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 16,
          }}>
            / The Guarantee
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 96px)',
            lineHeight: 0.92, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            THE ONLY<br />GUARANTEE<br />THAT MATTERS.
          </h2>
          <div className="space-y-4 mt-8" style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: paper, opacity: 0.85, maxWidth: 640,
          }}>
            <p>
              The program is backed by a full money-back guarantee. Stay in the 8 weeks, do the work, and if you want your money back — ask. You'll get it.
            </p>
            <p>
              The guarantee isn't there because this is a silver bullet. It's there because what you do inside the 8 weeks determines what you get out of it. The refund is yours either way.
            </p>
            <p style={{ color: blue, fontWeight: 600 }}>
              I only want money from people who implement.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════════ */
const faqs = [
  { q: 'How much time per week does this take?', a: "The owner or sales manager commits about 2 hours per week — one 45-minute coaching call, plus time reviewing your team's graded calls, walking through the week's processes, and making sure the training content is being adhered to." },
  { q: 'Do I run the 1:1 calls or does my sales manager?', a: 'Either one. You pick who needs the coaching more — the owner or the manager. Many agencies do both and split the weekly call.' },
  { q: "What if I don't have a sales manager yet?", a: 'Then this will help you hire one correctly and install the system before you promote someone. I can tell you on the strategy call if the 8-Week is the right fit for where you are, or if something else makes more sense first.' },
  { q: 'What size agency does this work for?', a: 'Anywhere from 2-person agencies to 20+ person operations. Bigger teams tend to get more leverage from the weekly accountability rhythm — more producers to grade, more pressure points to work on.' },
  { q: 'What if my sales manager quits halfway through?', a: 'You keep every document, every process, every training. The system lives inside your agency, not inside one person. If they quit, you onboard the next person onto a process that already exists.' },
  { q: 'Does this work for State Farm, Farmers, or independent agencies — or just Allstate?', a: "The sales process, accountability framework, and consequence ladder work across any captive or independent. The training examples lean Allstate because that's where I spent 20 years — but the mechanics are the same across carriers. Most of my current clients are Allstate; I'm also actively coaching Farmers and State Farm owners." },
  { q: 'What does "graded calls" actually mean?', a: 'Four calls per rep per week get scored by Standard against a rubric. Your rep sees exactly where they scored, what they missed, and what to do differently. Unlimited reps — if you have 3 producers or 13, every one of them gets graded calls every week.' },
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
              <Reveal key={i} delay={Math.min(i * 0.04, 0.2)}>
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
                      fontFamily: editorial, fontSize: 'clamp(15px, 1.7vw, 20px)',
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
   FINAL CTA — APPLY.
   ══════════════════════════════════════════════════════ */
const FinalCTASection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section
    onClick={onBookCall}
    style={{
      background: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
    }}
    role="button" aria-label="Book a strategy call"
  >
    <div className="max-w-[1440px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Ready to stop being the sales manager?
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
          lineHeight: 0.82, letterSpacing: '-0.03em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          APPLY.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.75, marginTop: 32, textTransform: 'uppercase',
        }}>
          Click anywhere &nbsp;→&nbsp; 45 minutes with Justin · No pitch deck · Money-back guarantee
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MINIMAL FOOTER
   ══════════════════════════════════════════════════════ */
const MinimalFooter = () => (
  <footer style={{ background: paper, borderTop: `1px solid ${ink}`, padding: '24px' }}>
    <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <p style={{
        fontFamily: body, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
        color: ink, opacity: 0.6, margin: 0, textTransform: 'uppercase',
      }}>
        A Standard Playbook program · © {new Date().getFullYear()} Standard Playbook Inc · All rights reserved
      </p>
      <div className="flex items-center gap-6">
        <Link to="/privacy"
          style={{
            fontFamily: body, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
            color: ink, opacity: 0.6, textDecoration: 'none', textTransform: 'uppercase',
          }}
          className="hover:opacity-100">
          Privacy
        </Link>
        <Link to="/terms"
          style={{
            fontFamily: body, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
            color: ink, opacity: 0.6, textDecoration: 'none', textTransform: 'uppercase',
          }}
          className="hover:opacity-100">
          Terms
        </Link>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldEightWeekApply = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <SEOHead />
      <LogoHeader />
      <HeroSection onBookCall={openBooking} />
      <MarqueeBands />
      <ProblemSection />
      <PromiseSection />
      <SystemsSection onBookCall={openBooking} />
      <HowItWorksSection />
      <WhatsIncludedSection onBookCall={openBooking} />
      <ToolsSection />
      <TestimonialsSection />
      <FitSection onBookCall={openBooking} />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTASection onBookCall={openBooking} />
      <MinimalFooter />
      <StandardFitModal open={bookingOpen} onOpenChange={setBookingOpen} source="8-week-apply" />
    </div>
  );
};

export default BoldEightWeekApply;
