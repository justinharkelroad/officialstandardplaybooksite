import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import VideoPlayer from '@/components/VideoPlayer';
import ContentMeta from '@/components/ContentMeta';

import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

/* ── Stripe links ──────────────────────────────────────── */
const STRIPE_JOIN = 'https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l';
const STRIPE_BURN = 'https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8';

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
   HERO
   ══════════════════════════════════════════════════════ */
const Hero = () => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Membership · $299/mo
        </p>
      </Reveal>

      <Reveal>
        <h1 style={{
          fontFamily: display,
          fontSize: 'clamp(40px, 8vw, 132px)',
          lineHeight: 0.9, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
        }}>
          STOP BEING THE SMARTEST<br />
          <span className="inline-block" style={{ color: blue }}>ONE IN YOUR OFFICE.</span>
        </h1>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            The mastermind for insurance agency owners who want a direct line to operators who've already built what you're trying to build — including the software and the <span style={{ color: blue }}>AI</span> running inside it.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start gap-3 flex-wrap">
          <a href="#includes"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-black hover:text-white">
            What's Inside
          </a>
          <a href={STRIPE_JOIN} target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '15px 28px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-[#2997FF] hover:border-[#2997FF]">
            Claim Your Seat →
          </a>
        </Reveal>
      </div>

      {/* Hero video */}
      <Reveal delay={0.4}>
        <div className="mt-16">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginBottom: 14,
          }}>
            // The Boardroom Walkthrough
          </p>
          <motion.div
            whileHover={{ rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', background: ink, padding: 8,
              maxWidth: 1080, marginInline: 'auto',
              boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
              transform: 'rotate(-1.5deg)',
            }}>
            <div style={{ aspectRatio: '16/9', background: '#000' }}>
              <VideoPlayer videoId="36Ns-DrlHEA" title="The Boardroom Walkthrough"
                className="w-full h-full" />
            </div>
          </motion.div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'THE BOARDROOM' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} />
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
   INCLUDES
   ══════════════════════════════════════════════════════ */
const includedItems: React.ReactNode[] = [
  '2 Hour Group Boardroom Call',
  <>Agency Brain access — <span style={{ color: blue }}>AI</span> tools and daily Flow library included</>,
  'Access to The Mirror Self-Assessment',
  'I AM THE STANDARD T-Shirt',
  'I AM THE STANDARD Wristband',
  'Standard Playbook Pen',
  '1v1 Video Coaching 24/7 w/ Justin',
  <>20 <span style={{ color: blue }}>AI</span> Calls Scored Per Month In Standard Call Scoring</>,
];

const IncludesSection = () => (
  <section id="includes" style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / What's Included
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            EVERY MONTH.<br />
            <span style={{ color: blue }}>EVERY MEMBER.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            Eight deliverables. Built so the room stays high-signal and the work compounds month over month.
          </p>
        </Reveal>
      </div>

      <ul style={{
        listStyle: 'none', margin: 0, padding: 0,
        borderTop: `1px solid ${ink}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      }}>
        {includedItems.map((item, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li style={{
              borderBottom: `1px solid ${ink}`,
              padding: '24px 16px',
              display: 'flex', alignItems: 'center', gap: 16,
              minHeight: 80,
            }}
              className="hover:bg-black/[0.03] transition-colors"
            >
              <span style={{
                fontFamily: editorial, fontSize: 16, color: ink,
                opacity: 0.4, letterSpacing: '-0.01em', minWidth: 32,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ color: blue, fontSize: 18, lineHeight: 1, flexShrink: 0, fontWeight: 700 }}>✓</span>
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(15px, 1.3vw, 18px)',
                lineHeight: 1.2, letterSpacing: '-0.01em',
                color: ink, textTransform: 'uppercase', fontWeight: 400,
              }}>
                {item}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PRICING — bold pricing block
   ══════════════════════════════════════════════════════ */
const PricingSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Claim Your Seat
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-7">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, opacity: 0.6, textTransform: 'uppercase', marginBottom: 12,
            }}>
              Boardroom Membership · Monthly
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
                / month
              </p>
            </div>

            <p style={{
              fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
              color: ink, opacity: 0.75, marginTop: 28, maxWidth: 520,
            }}>
              Sit in a room of agency owners who are building what you're building. Make the contacts. Build a mastermind so sharp nobody else can touch your numbers.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <a href={STRIPE_JOIN} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
                  padding: '16px 30px', transition: 'all .25s',
                }}
                className="hover:bg-[#2997FF]">
                Claim Your Seat →
              </a>
              <a href={STRIPE_BURN} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                  color: ink, background: 'transparent', textTransform: 'uppercase', textDecoration: 'none',
                  padding: '15px 28px', border: `1.5px solid ${ink}`, transition: 'all .25s',
                }}
                className="hover:bg-black hover:text-white">
                Burn The Boats →
              </a>
            </div>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Reveal delay={0.1}>
            <div style={{
              background: ink, color: paper, padding: '32px 28px',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                color: blue, textTransform: 'uppercase', marginBottom: 14,
              }}>
                ★ The Standard Promise
              </p>
              <p style={{
                fontFamily: display, fontSize: 'clamp(24px, 2.8vw, 32px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14,
              }}>
                Stop guessing.<br />Start leading.
              </p>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                color: paper, opacity: 0.8,
              }}>
                Direct access to proven operators, the apparel, the scoring credits, and the room. Cancel anytime in Stripe.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   IT'S NOT JUST BUSINESS — Being / Body / Balance
   ══════════════════════════════════════════════════════ */
const pillars = [
  {
    label: 'Being',
    headline: 'Sharpen mind & spirit.',
    sub: "Lock in who you are before the workday locks in who you'll be. Daily Flows and morning grounding inside the app — the practice that decides whether you run the agency or the agency runs you.",
    videoId: 'jFDqWyLuwHI',
    tilt: -3,
  },
  {
    label: 'Body',
    headline: 'Weaponize your health.',
    sub: 'Body fuels everything else. Workout templates, macro goals, and a habit tracker log every rep and meal — so high energy becomes your baseline, not your good day.',
    videoId: 'qUWOzQF1Xrg',
    tilt: 3,
  },
  {
    label: 'Balance',
    headline: 'Marriage. Kids. Mission.',
    sub: 'Date nights, one-on-one time with each kid, fast family check-ins — scheduled and tracked, so home life shows progress too.',
    videoId: 'RMsIHtsv2ak',
    tilt: -2,
  },
];

const PillarsSection = () => (
  <section style={{ background: paper, padding: '40px 24px 120px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16 mt-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / The Truth
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 8vw, 120px)',
            lineHeight: 0.92, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            IT'S NOT JUST<br />
            <span style={{ color: blue }}>BUSINESS.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            A thriving agency isn't built on numbers alone. The Boardroom keeps owners internally grounded, physically strong, and at peace at home — because that's where the numbers actually come from.
          </p>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {pillars.map((p, i) => {
          const reverse = i % 2 === 1;
          return (
            <Reveal key={p.label} delay={i * 0.08}>
              <div style={{ borderBottom: `1px solid ${ink}`, padding: '64px 0' }}>
                <div className={`grid grid-cols-12 gap-8 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
                  <div className={`col-span-12 md:col-span-6 ${reverse ? 'md:[direction:ltr]' : ''}`}>
                    <span style={{
                      fontFamily: editorial, fontSize: 22, color: ink,
                      opacity: 0.35, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 14,
                    }}>
                      {String(i + 1).padStart(2, '0')} / 03
                    </span>
                    <p style={{
                      fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                      color: blue, textTransform: 'uppercase', marginBottom: 14,
                    }}>
                      {p.label}
                    </p>
                    <h3 style={{
                      fontFamily: display, fontSize: 'clamp(32px, 4.6vw, 64px)',
                      lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
                      textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18,
                    }}>
                      {p.headline}
                    </h3>
                    <p style={{
                      fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                      color: ink, opacity: 0.75, maxWidth: 520,
                    }}>
                      {p.sub}
                    </p>
                  </div>
                  <div className={`col-span-12 md:col-span-6 ${reverse ? 'md:[direction:ltr]' : ''}`}>
                    <motion.div
                      whileHover={{ rotate: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: ink, padding: 8,
                        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
                        transform: `rotate(${p.tilt}deg)`,
                        maxWidth: 540, marginInline: 'auto',
                      }}>
                      <div style={{ aspectRatio: '16/9', background: '#000' }}>
                        <VideoPlayer videoId={p.videoId} title={p.label}
                          className="w-full h-full" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FAQ — bold accordion
   ══════════════════════════════════════════════════════ */
const faq = [
  { q: '"Is this right for someone at my level?"', a: "If you're asking, you already know. The real question: how much longer are you willing to let \"your level\" be your ceiling?" },
  { q: '"What if I\'m not ready?"', a: "Nobody's ever ready. Ready is a feeling you get after you start, not before." },
  { q: '"How fast will I see results?"', a: 'Wrong question. Ask instead: "How much has playing small already cost you?"' },
  { q: '"What if I\'m the smallest one in the room?"', a: "Then you're finally in a room that can change your trajectory. Being the smartest guy in the room is expensive. Being the one with the most to learn? That pays." },
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
            / The Questions
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
          }}>
            THAT REVEAL<br />EVERYTHING.
          </h2>
        </Reveal>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <li style={{
                  borderBottom: `1px solid ${ink}`,
                  cursor: 'pointer',
                }}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="hover:bg-black/[0.03] transition-colors"
                >
                  <div style={{
                    padding: '28px 16px',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: 20,
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: editorial, fontSize: 22, color: ink,
                      opacity: isOpen ? 1 : 0.4, letterSpacing: '-0.01em',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 style={{
                      fontFamily: display, fontSize: 'clamp(20px, 2.6vw, 34px)',
                      lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                      textTransform: 'uppercase', margin: 0, fontWeight: 400,
                    }}>
                      {item.q}
                    </h4>
                    <span aria-hidden style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, border: `1.5px solid ${ink}`,
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
                    <div style={{ padding: '0 16px 36px 96px' }}>
                      <p style={{
                        fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
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
   THE PRACTICE — the seven daily Flows
   ══════════════════════════════════════════════════════ */
const boardroomFlows = [
  { name: 'War Flow', desc: "When it's not just an idea, it's a fight. Name the enemy, define winning, map four fronts (obstacle, move, ally). Walk out with a campaign." },
  { name: 'Idea Flow', desc: 'When something lit up. Force it specific. Four measurable facts. Execute-vs-cost-of-not. Walk out with a real plan.' },
  { name: 'Discovery Flow', desc: 'Right after you learn something worth keeping. Capture what landed, pull the lesson, choose where it applies — before tomorrow forgets.' },
  { name: 'Irritation Flow', desc: 'When someone or something is getting to you. Surface the story, test it against facts, write a new one that serves you. Defuse the charge.' },
  { name: 'Gratitude Flow', desc: "Don't let a good moment just pass. Story vs. facts, the lesson underneath, one move in 24 hours to honor it." },
  { name: 'Prayer Flow', desc: "When you're carrying something. Name it. Walk out with the lesson and one action that lives it out." },
  { name: 'Bible Flow', desc: 'Anchored to scripture. Start, Stop, and Keep commitments — each measured, each anchored to a belief.' },
];

const PracticeSection = () => (
  <section style={{ background: ink, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, textTransform: 'uppercase', marginBottom: 24, opacity: 0.6,
        }}>
          / The Practice
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(34px, 5.6vw, 84px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          SEVEN FLOWS.<br /><span style={{ color: blue }}>ONE OPERATING SYSTEM FOR THE OWNER.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.4vw, 19px)', fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.8, marginTop: 28, maxWidth: 860,
        }}>
          Boardroom membership unlocks the full daily Flow library inside Agency Brain — seven structured practices, each tuned to a specific reality of running an agency. Strategy, conflict, learning capture, idea pressure-testing, gratitude depth, and the quieter practices that hold the rest. Every Flow ends with an action — so the work in the app becomes the work in the agency by Tuesday morning.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" style={{ marginTop: 56 }}>
        {boardroomFlows.map((f, i) => (
          <Reveal key={f.name} delay={0.05 + i * 0.04}>
            <div style={{ borderTop: `1px solid ${paper}1a`, paddingTop: 18 }}>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1,
                letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
                marginBottom: 10,
              }}>
                {f.name}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: paper, opacity: 0.7, margin: 0,
              }}>
                {f.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <p style={{
          fontFamily: display, fontSize: 'clamp(22px, 2.4vw, 34px)', fontWeight: 400, lineHeight: 1.2,
          color: paper, textTransform: 'uppercase', letterSpacing: '-0.01em', marginTop: 64, marginBottom: 0,
        }}>
          One library. <span style={{ color: blue }}>56 points a week</span> across Core 4 + Flow.
        </p>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.75, marginTop: 12, maxWidth: 680,
        }}>
          Tracked and leaderboard-visible. The system that proves daily practice produces better business decisions — measurable, repeatable, in your team's view if you want it.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   GIANT CTA — JOIN.
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => (
  <section
    onClick={() => window.open(STRIPE_JOIN, '_blank')}
    style={{
      background: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
    }}
    role="button" aria-label="Claim Your Seat at the Boardroom">
    <div className="max-w-[1440px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Your Seat
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
          lineHeight: 0.82, letterSpacing: '-0.03em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          JOIN.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
        }}>
          Click anywhere &nbsp;→&nbsp; Claim Your Seat at $299/mo
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
            style={{ height: 22, marginBottom: 18 }} />
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
            { label: 'Training', href: '/training' },
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
    <a href={STRIPE_BURN} target="_blank" rel="noopener noreferrer"
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase',
        display: 'block', textAlign: 'center', textDecoration: 'none',
      }}>
      Burn The Boats →
    </a>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldBoardroom = () => (
  <div style={{ background: paper, fontFamily: body, color: ink }}>
    <BoldNav />
    <Hero />
    <MarqueeBands />
    <IncludesSection />
    <PricingSection />
    <PillarsSection />
    <PracticeSection />
    <FAQSection />
    <GiantCTA />
    <BoldFooter />
    <ContentMeta lastUpdated="March 2026" />
    <MobileStickyCTA />
  </div>
);

export default BoldBoardroom;
