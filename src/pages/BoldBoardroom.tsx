import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
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
const blue = '#2080FF';

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
   NAV
   ══════════════════════════════════════════════════════ */
const BoldNav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Home', to: '/' },
    { label: 'Programs', to: '/#programs' },
    { label: 'Directive', to: '/directive' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: paper, borderBottom: `1px solid ${ink}`, height: 56, fontFamily: body }}>
      <div className="h-full px-6 md:px-10 flex items-center justify-between max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center" aria-label="Standard Playbook">
          <img src={standardLogo} alt="Standard Playbook"
            style={{ height: 22, width: 'auto', filter: 'brightness(0)' }} />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link key={l.label} to={l.to}
              style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', color: ink, textTransform: 'uppercase' }}
              className="hover:opacity-60 transition-opacity">
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" style={{ color: ink }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden" style={{ background: paper, borderTop: `1px solid ${ink}`, padding: '16px 24px' }}>
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '12px 0', fontSize: 16, fontWeight: 500, letterSpacing: '0.06em', color: ink, textTransform: 'uppercase', borderBottom: `1px solid ${ink}1a` }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

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
          fontSize: 'clamp(48px, 11vw, 200px)',
          lineHeight: 0.86, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
        }}>
          THE<br />
          <span className="md:pl-[4vw] inline-block" style={{ color: blue }}>BOARDROOM.</span>
        </h1>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            The elite mastermind for insurance agency owners. Where owners stop guessing and start leading — direct access to proven operators who've built what you're trying to build.
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
            className="hover:bg-[#2080FF] hover:border-[#2080FF]">
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
const includedItems = [
  '2 Hour Group Boardroom Call',
  'Boardroom Level Access To Standard App',
  'AgencyBrain Access',
  'Access to The Mirror Self-Assessment',
  'I AM THE STANDARD T-Shirt',
  'I AM THE STANDARD Wristband',
  'Standard Playbook Pen',
  '1v1 Video Coaching 24/7 w/ Justin',
  '20 AI Calls Scored Per Month In Standard Call Scoring',
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
            Nine deliverables. Built so the room stays high-signal and the work compounds month over month.
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
          <Reveal key={item} delay={i * 0.04}>
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
              Join fellow agency owners. Make face-to-face contacts. Build a mastermind so extreme no one else can.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <a href={STRIPE_JOIN} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
                  padding: '16px 30px', transition: 'all .25s',
                }}
                className="hover:bg-[#2080FF]">
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
                Direct access to proven operators. The hardcover, the apparel, the call scoring credits, and the room. Cancel anytime in Stripe.
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
    sub: "Lead with clarity alongside God and your purpose. Daily stacks, meditation, and scripture reflections inside the app lock in purpose before the workday starts.",
    videoId: 'jFDqWyLuwHI',
    tilt: -3,
  },
  {
    label: 'Body',
    headline: 'Weaponize your health.',
    sub: 'Body fuels everything else. Simple workout templates, macro goals, and a habit tracker record every rep and meal — making high energy your new baseline.',
    videoId: 'qUWOzQF1Xrg',
    tilt: 3,
  },
  {
    label: 'Balance',
    headline: 'Marriage. Kids. Mission.',
    sub: 'Balance keeps marriage and kids at the center. We schedule date nights, one-on-one time with each child, and fast family check-ins so home life shows measurable progress too.',
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
            Running a thriving agency isn't just about numbers. The Boardroom helps owners stay spiritually grounded, physically strong, and relationally at rest.
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
  { q: '"Is this right for someone at my level?"', a: "If you're asking, you already know. The question is: How much longer will you let \"your level\" be your ceiling?" },
  { q: '"What if I\'m not ready?"', a: "Nobody's ready for chemotherapy either. But cancer doesn't care about your timeline." },
  { q: '"How fast will I see results?"', a: 'Wrong question. Ask instead: "How much has playing small already cost me?"' },
  { q: '"What if I join and realize I\'m the smallest one there?"', a: "Then you're finally in a room that can change your life. Being the smartest person in the room is expensive. Being the dumbest? That's profitable." },
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
    <FAQSection />
    <GiantCTA />
    <BoldFooter />
    <ContentMeta lastUpdated="March 2026" />
    <MobileStickyCTA />
  </div>
);

export default BoldBoardroom;
