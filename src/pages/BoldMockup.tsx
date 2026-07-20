import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import CertifiedStandardBand from '@/components/CertifiedStandardBand';
import StandardFitModal from '@/components/StandardFitModal';

import standardLogo from '@/assets/standard-word-logo.png';
import spIconWhite from '@/assets/sp-icon-white.png';
import spIconBlue from '@/assets/sp-icon-blue.png';
import salesDashImg from '@/assets/sales-dashboard.png';
import salesAnalyticsImg from '@/assets/sales-analytics.png';
import lqsImg from '@/assets/lqs.png';
import callScoringImg from '@/assets/call-scoring.png';
import aiRoleplayImg from '@/assets/ai-roleplay-bot.png';
import teamTrainingImg from '@/assets/team-training.png';

/* ── Type stacks ───────────────────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';     // near-black
const paper = '#F4F2EE';   // warm off-white (newsprint)
const blue = '#2997FF';    // SP brand blue (already in tailwind)
const blueDark = '#0066CC';

type AnalyticsPayload = Record<string, string>;

const trackHomepageEvent = (event: string, payload: AnalyticsPayload = {}) => {
  if (typeof window === 'undefined') return;

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, string>>;
    fbq?: (command: 'trackCustom', eventName: string, parameters?: AnalyticsPayload) => void;
  };

  try {
    (analyticsWindow.dataLayer ??= []).push({ event, ...payload });
  } catch {
    // Analytics must never block the visitor's navigation or interaction.
  }

  try {
    analyticsWindow.fbq?.('trackCustom', event, payload);
  } catch {
    // Meta may be unavailable when tracking permissions are disabled.
  }

  window.dispatchEvent(new CustomEvent(event, { detail: payload }));
};

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

/* ── Icon watermark — opaque SP monogram bleeding off a corner ── */
const IconWatermark = ({
  corner = 'right',
  size = 'clamp(260px, 34vw, 560px)',
  opacity = 0.05,
}: { corner?: 'left' | 'right'; size?: string; opacity?: number }) => (
  <img
    aria-hidden
    src={spIconWhite}
    alt=""
    style={{
      position: 'absolute',
      bottom: 'clamp(-80px, -6vw, -40px)',
      [corner]: 'clamp(-80px, -6vw, -40px)',
      width: size,
      height: 'auto',
      opacity,
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: -1,
    } as React.CSSProperties}
  />
);


/* ══════════════════════════════════════════════════════
   HERO — editorial display headline + tilted image
   ══════════════════════════════════════════════════════ */
const HeroSection = () => {
  const [fitOpen, setFitOpen] = useState(false);

  return (
    <section
      style={{
        background: paper,
        paddingTop: 56 + 24,
        paddingBottom: 60,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
        <div className="grid grid-cols-12 gap-6 items-start relative">
          {/* Massive headline — wraps across the grid like an editorial cover */}
          <Reveal className="order-1 col-span-12 md:col-span-9 relative z-20">
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(64px, 13vw, 200px)',
                lineHeight: 0.86,
                letterSpacing: '-0.02em',
                color: ink,
                margin: 0,
                textTransform: 'uppercase',
                fontWeight: 400,
              }}
            >
              RAISE
              <br />
              <span style={{ paddingLeft: '10vw', display: 'inline-block' }}>YOUR STANDARD</span>
            </h1>
          </Reveal>

          {/* Tilted image card — bursting into the headline like the Dom Pérignon bottle */}
          <Reveal delay={0.15} className="order-4 md:order-2 col-span-12 md:col-span-3 relative z-10">
            <motion.div
              initial={{ rotate: -8, y: 20 }}
              animate={{ rotate: -8 }}
              style={{
                position: 'relative',
                marginTop: '-2vw',
                aspectRatio: '3 / 4',
                background: ink,
                overflow: 'hidden',
                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
              }}
            >
              <img
                src="/hero.jpg"
                alt="Coaching"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          </Reveal>

          {/* On mobile, the promise and application CTA appear before the portrait. */}
          <Reveal delay={0.25} className="order-2 md:order-3 col-span-12 md:col-span-6 md:mt-6">
            <p
              style={{
                fontFamily: body,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: ink,
                textTransform: 'uppercase',
                lineHeight: 1.6,
                maxWidth: 380,
              }}
            >
              For insurance agency owners who know there's more to this game than the next big number. Coaching, software, and <span style={{ color: blue }}>AI</span> — built by a 20-year operator who built, scaled, and sold three Allstate agencies, and now coaches from outside the same fight.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="order-3 md:order-4 col-span-12 md:col-span-6 flex flex-wrap md:justify-end items-center gap-3 md:mt-6">
            <a
              href="#mission"
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
                color: ink, textTransform: 'uppercase', textDecoration: 'none',
                padding: '14px 26px', border: `1.5px solid ${ink}`, background: 'transparent',
                transition: 'all .25s',
              }}
              className="hover:bg-black hover:text-white"
            >
              Learn More
            </a>
            <button
              onClick={() => {
                trackHomepageEvent('strategy_application_started', { source: 'home_hero' });
                setFitOpen(true);
              }}
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
                color: '#fff', background: ink, textTransform: 'uppercase',
                padding: '15px 28px', border: `1.5px solid ${ink}`, cursor: 'pointer',
                transition: 'all .25s',
              }}
              className="hover:bg-[#2997FF] hover:border-[#2997FF]"
            >
              Apply for a Strategy Call
            </button>
          </Reveal>
        </div>

        <StandardFitModal open={fitOpen} onOpenChange={setFitOpen} />
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   MARQUEE — dual rotated brand bands
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, icon, phrase = 'STANDARD PLAYBOOK' }: { rotate?: number; bg?: string; color?: string; dot?: string; icon?: string; phrase?: string }) => {
  const items = Array.from({ length: 20 });
  return (
    <div
      className="home-marquee"
      style={{
        background: bg,
        color,
        transform: `rotate(${rotate}deg)`,
        padding: '14px 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '120%',
        marginLeft: '-10%',
        borderTop: `1px solid ${color}33`,
        borderBottom: `1px solid ${color}33`,
      }}
    >
      <div
        className="home-marquee-track"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 28,
          animation: 'sp-marquee 28s linear infinite',
        }}
      >
        {items.map((_, i) => (
          <span key={i} className="home-marquee-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
            <span style={{
              fontFamily: editorial,
              fontSize: 'clamp(22px, 3.4vw, 44px)',
              letterSpacing: '0.04em',
              fontWeight: 400,
            }}>{phrase}</span>
            {icon ? (
              <img aria-hidden src={icon} alt="" className="home-marquee-dot" style={{
                width: 34, height: 34, objectFit: 'contain', flexShrink: 0,
                transform: `rotate(${-rotate}deg)`,
              }} />
            ) : (
              <span aria-hidden className="home-marquee-dot" style={{
                display: 'inline-block', width: 18, height: 18, borderRadius: 999,
                background: dot, flexShrink: 0,
              }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

const MarqueeBands = () => (
  <div style={{ background: paper, padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={ink} color={paper} icon={spIconWhite} phrase="BODY · BEING · BALANCE · BUSINESS" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} icon={spIconBlue} />
    </div>
    <style>{`
      @keyframes sp-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @media (max-width: 639px) {
        .home-marquee {
          width: 100% !important;
          margin-left: 0 !important;
          transform: none !important;
          padding-block: 10px !important;
        }
        .home-marquee-track,
        .home-marquee-item {
          gap: 18px !important;
        }
        span.home-marquee-dot {
          width: 12px !important;
          height: 12px !important;
        }
        img.home-marquee-dot {
          width: 22px !important;
          height: 22px !important;
        }
      }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════════════
   MISSION — staggered display statement
   ══════════════════════════════════════════════════════ */
const MissionSection = () => (
  <section id="mission" style={{ background: paper, padding: '120px 24px 100px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Mission
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(40px, 8vw, 120px)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            color: ink,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}
        >
          WE BUILD
          <br />
          <span style={{ paddingLeft: '8vw', display: 'inline-block' }}>AGENCIES THAT REFUSE</span>
          <br />
          <span style={{ paddingLeft: '14vw', display: 'inline-block' }}>TO SETTLE FOR AVERAGE</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(17px, 1.8vw, 24px)', fontWeight: 400, lineHeight: 1.5,
          color: ink, opacity: 0.8, marginTop: 40, maxWidth: 760,
        }}>
          Average is a choice. So is everything that comes after it — including how long you keep playing a game you've already won and still feel hollow inside of.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FOUNDATION — process / B&W image + caption (Dom Pérignon
   "PROCESS FACES CONSTRAINTS" block)
   ══════════════════════════════════════════════════════ */
const FoundationSection = () => (
  <section style={{ background: paper, padding: '40px 24px 120px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end">
        <Reveal className="col-span-12 md:col-span-7">
          <img
            src="/bottom-home.png"
            alt="Justin Harkelroad"
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              clipPath: 'circle(50% at 50% 50%)',
              display: 'block',
            }}
          />
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 md:col-span-5">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em',
            color: ink, lineHeight: 1.6, marginBottom: 24, maxWidth: 320,
          }}>
            BUILT BY A 20-YEAR ALLSTATE OPERATOR. EVERY FRAMEWORK PRESSURE-TESTED INSIDE A REAL AGENCY BEFORE IT SHIPS TO YOURS.
          </p>
          <h3
            style={{
              fontFamily: display,
              fontSize: 'clamp(36px, 5vw, 72px)',
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
              color: ink,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
            }}
          >
            PROCESS<br />BUILDS<br />PROFITS
          </h3>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THE BUILDER — operator-as-developer positioning
   ══════════════════════════════════════════════════════ */
const BuilderSection = () => (
  <section style={{ background: paper, padding: '120px 24px 100px', borderTop: `1px solid ${ink}1a` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Builder
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: display,
          fontSize: 'clamp(40px, 8vw, 120px)',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          color: ink,
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 400,
        }}>
          I WRITE THE CODE.
          <br />
          <span style={{ color: blue }}>I COACH THE PLAYBOOK.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 mt-16">
        <Reveal delay={0.15} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, marginBottom: 24,
          }}>
            20 years inside Allstate. Three agencies built, scaled, and sold. Agency Brain — the platform every program runs on — I build in code, week after week. Every <span style={{ color: blue }}>AI</span> tool inside it (Call Scoring, the Roleplay Bot, the Voice Trainer, Discovery Coach) is mine to ship.
          </p>
          <p style={{
            fontFamily: display, fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 400, lineHeight: 1.2,
            color: ink, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 24,
          }}>
            Not bought. Not licensed. Built.
          </p>
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.75, maxWidth: 620,
          }}>
            That's not a marketing angle. It's the reason the system actually works in your office on Monday — and the reason I can change it the week your agency needs it to.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   AGENCY BRAIN — black section with tilted screenshot
   (Dom Pérignon bottle moment)
   ══════════════════════════════════════════════════════ */
const AgencyBrainBand = () => (
  <section id="software" style={{ background: ink, padding: '120px 0', overflow: 'hidden', position: 'relative', isolation: 'isolate' }}>
    <IconWatermark corner="left" />
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, textTransform: 'uppercase', marginBottom: 24, opacity: 0.6,
        }}>
          / Introducing
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <img
          src="/ab-white.png"
          alt="Agency Brain"
          style={{ height: 'clamp(40px, 6vw, 72px)', width: 'auto', marginBottom: 32 }}
        />
      </Reveal>
    </div>

    {/* Wide marquee headline strip with overlapping screenshot */}
    <div style={{ position: 'relative', marginTop: 40 }}>
      <Reveal>
        <div
          style={{
            color: paper,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            transform: 'rotate(-2deg)',
            width: '120%',
            marginLeft: '-10%',
            borderTop: `1px solid ${paper}1a`,
            borderBottom: `1px solid ${paper}1a`,
            padding: '24px 0',
            background: ink,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              animation: 'sp-marquee 38s linear infinite',
              fontFamily: display,
              fontSize: 'clamp(48px, 10vw, 140px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
          </div>
        </div>
      </Reveal>

      {/* Tilted dashboard "bottle" */}
      <Reveal delay={0.2}>
        <div
          style={{
            position: 'absolute',
            right: '4vw',
            top: '-10%',
            width: 'min(38vw, 480px)',
            transform: 'rotate(8deg)',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)',
            background: '#fff',
            border: `1px solid ${paper}33`,
            zIndex: 5,
          }}
        >
          <img
            src={salesDashImg}
            alt="Agency Brain Dashboard"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </Reveal>
    </div>

    <div className="px-6 md:px-10 max-w-[1280px] mx-auto" style={{ marginTop: 100, position: 'relative', zIndex: 10 }}>
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 md:col-span-7">
          <h3
            style={{
              fontFamily: display,
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: paper,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
              marginBottom: 24,
            }}
          >
            THE OPERATING SYSTEM<br />FOR YOUR AGENCY.
          </h3>
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.65,
            color: paper, opacity: 0.85, marginBottom: 24, maxWidth: 520,
          }}>
            Pipeline, training, retention, daily habits — out of your head and into one place. Built so the work still happens whether you're in the office or not.
          </p>
          <a
            href="#programs"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, background: paper, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', display: 'inline-block', transition: 'all .25s',
            }}
            className="hover:bg-[#2997FF] hover:text-white"
          >
            See the Plans →
          </a>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   POLAROID GRID — feature evidence (Dom Pérignon
   "TASTE THE EMBODIMENT OF FRUIT" moment)
   ══════════════════════════════════════════════════════ */
const polaroids = [
  { img: salesAnalyticsImg, label: 'Sales Analytics', tilt: -6 },
  { img: lqsImg, label: 'AI Pipeline Intelligence', tilt: 4 },
  { img: callScoringImg, label: 'AI Call Scoring', tilt: -3 },
  { img: aiRoleplayImg, label: 'AI Roleplay Bot', tilt: 5 },
  { img: teamTrainingImg, label: 'Team Training', tilt: -4 },
];

const PolaroidGrid = () => (
  <section style={{ background: paper, padding: '120px 24px 60px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 16,
        }}>
          / The Evidence
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h3
          style={{
            fontFamily: display,
            fontSize: 'clamp(36px, 6vw, 84px)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            color: ink,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          SEE THE WORK.
        </h3>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 500, letterSpacing: '0.06em',
          color: ink, opacity: 0.7, textTransform: 'uppercase',
          textAlign: 'center', maxWidth: 720, marginInline: 'auto', marginBottom: 56,
        }}>
          Five <span style={{ color: blue }}>AI</span>-powered tools. One platform. Built by the operator who coaches you.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
        {polaroids.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.06}>
            <motion.figure
              whileHover={{ rotate: 0, scale: 1.04 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#fff',
                padding: '12px 12px 18px',
                boxShadow: '0 18px 40px -12px rgba(0,0,0,0.25)',
                transform: `rotate(${p.tilt}deg)`,
                margin: 0,
              }}
            >
              <div style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: '#eee' }}>
                <img
                  src={p.img}
                  alt={p.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)' }}
                />
              </div>
              <figcaption style={{
                fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                color: ink, textTransform: 'uppercase', marginTop: 12, textAlign: 'center',
              }}>
                {p.label}
              </figcaption>
            </motion.figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PROGRAMS — bold list / index format with expandable
   feature bullets per row
   ══════════════════════════════════════════════════════ */
type ProgramRow = {
  num: string;
  name: string;
  tier: string;
  price: string;
  description: string;
  details: string[];
  href?: string;
  cta?: string;
  soldOut?: boolean;
  featured?: boolean;
};

const coachingPrograms: ProgramRow[] = [
  {
    num: '01',
    name: 'The Boardroom',
    tier: 'Membership',
    price: '$299/mo',
    description: 'The room for owners who want steady momentum and real accountability between calls.',
    details: [
      'Live monthly group coaching with Justin & Corina',
      'Hot-seat problem-solving with other owners',
      'Agency Brain Core access',
      'Team training library + scripts',
      'Daily Flow library + leaderboards',
      'Private Boardroom community',
    ],
    href: '/boardroom',
    cta: 'Learn More →',
  },
  {
    num: '02',
    name: '8 Week Experience',
    tier: 'Manager Training',
    price: 'Apply',
    description: 'For teams stuck in "great month / bad month" cycles.',
    details: [
      '8 live coaching calls over 8 weeks',
      'Complete sales management system install',
      'Accountability + consequence ladder framework',
      'Full Agency Brain access for your team',
      'Team training library + scripts',
      'Manager playbook + scripts',
      'Post-program strategy session',
    ],
    href: '/sales-experience',
    cta: 'Learn More →',
  },
  {
    num: '03',
    name: '6 Week Producer Challenge',
    tier: 'Team Sprint',
    price: '$299/producer',
    description: 'For owners who need producers executing now, not "eventually."',
    details: [
      '30 Training Modules',
      '7 Sunday Target Setting Modules',
      'Direct Reflection & Action Item Takeaways',
      'Agency Owner/Mgr have full view of takeaways',
      'Sales Process Training',
      'Daily Habit Training',
    ],
    href: 'https://myagencybrain.com/six-week-challenge',
    cta: 'Start →',
  },
  {
    num: '04',
    name: 'The Team Standard',
    tier: 'Sales Team Accountability · By Application',
    price: 'From $2,500/mo',
    description: 'An accountability system for your sales team, run personally by Justin, with you out of the room. Weekly or biweekly.',
    details: [
      'A private channel for your team, voice notes with Justin',
      'Owner-free 50 minute accountability calls',
      'Three drops a week: Monday declare, Wednesday check, Friday verdict',
      'The scoreboard: every number in front of each other',
      'Your report every cycle: who moved, who slipped, who is pulling weight',
      'You set the bar. They own the chase.',
    ],
    href: '/team-standard',
    cta: 'See The Standard →',
  },
  {
    num: '05',
    name: 'Standard 90',
    tier: '90-Day 1:1 Coaching · By Application',
    price: 'Fit Call',
    description: 'A 90 day action map for the agency owner who is done being the operating system. Customized and personally coached one on one all the way through.',
    details: [
      'A custom 90 day action map for your agency',
      'One on one coaching the whole way through',
      'Built for the owner ready to step out of the operating system',
      'Personal accountability and weekly course correction',
    ],
    href: '/standard90',
    cta: 'Learn More →',
  },
  {
    num: '06',
    name: 'The Standard Ascension',
    tier: '90-Day Private Mentorship · By Application',
    price: 'Apply',
    description: 'Private one-on-one mentorship for the owner ready to put one business target—and all four areas of life—on the board for 90 days.',
    details: [
      'A written 90-day target and operating plan',
      'Private weekly coaching with Justin',
      'Daily accountability across Body, Being, Balance, and Business',
      'A weekly 56-point evidence scorecard',
      'Direct accountability between calls',
      'Formal reviews at weeks four and eight',
    ],
    href: '/ascension',
    cta: 'Explore Ascension →',
  },
  {
    num: '07',
    name: 'The Directive',
    tier: '1:1 Coaching',
    price: 'Application Only',
    description: 'High-touch 1:1 implementation and pressure-tested accountability.',
    details: [
      'Everything included in Boardroom +',
      'Monthly 2-hour private sessions with Justin',
      'Custom Agency Brain buildout for your agency',
      'Direct access between sessions',
      'Custom strategy + accountability plan',
      'Priority support for your entire team',
    ],
    href: '/directive',
    cta: 'Apply →',
    soldOut: true,
  },
  {
    num: '08',
    name: 'Partnership',
    tier: '1:1 Coaching',
    price: '—',
    description: 'The highest level — full-access private coaching, custom strategy, and direct line to Justin.',
    details: [
      'Everything in Directive +',
      'Unlimited private access to Justin',
      'Custom agency growth roadmap',
      'Full Agency Brain Pro buildout',
      'On-call support for your entire team',
      'Priority scheduling, no waitlist',
    ],
    soldOut: true,
  },
];

const softwarePlans: ProgramRow[] = [
  {
    num: '09',
    name: 'Certified Standard',
    tier: 'AI Training · One-Time',
    price: '$399/seat',
    description: 'Certify your producers on the full Hello-to-Bind sales call. One-off purchase, no coaching commitment.',
    details: [
      '24 training modules across the whole call',
      '18 live AI voice-roleplay scenarios',
      '85 AI quiz prompts · 17 scored quizzes',
      '80% certification threshold per module',
      'Saved transcripts + scores for every producer',
      'Hello-to-Bind script + Closers Playbook included',
    ],
    href: '/certified-standard?src=home-programs',
    cta: 'Get Certified →',
  },
  {
    num: '10',
    name: 'Agency Brain Core',
    tier: 'Software-Only Foundation',
    price: '$299/mo',
    description: 'Scorecards, training, team visibility, daily Flow library, and the core operating loop.',
    details: [
      '20 AI call scoring credits / month',
      'Real-time scorecards and KPI rings',
      'Team leaderboards and performance visibility',
      'Standard Playbook Training Platform',
      'Daily Flow library (all 7 Flows)',
      'Limited AI feature set',
    ],
    href: 'https://myagencybrain.com/info#pricing',
    cta: 'Choose Core →',
  },
  {
    num: '11',
    name: 'Agency Brain Plus',
    tier: 'Full Software Access',
    price: '$449/mo',
    description: 'Everything in Core plus the full AI tool set. No Roleplay Bot or HR Suite.',
    details: [
      '50 AI call scoring credits / month',
      'Full AI tool set',
      'Growth Center and The Mirror analysis',
      'Comp Plan Assistant',
      'Training AI Builder and Theta Audio',
      'Standard Playbook Training Platform',
      'Standard support',
    ],
    href: 'https://myagencybrain.com/info#pricing',
    cta: 'Choose Plus →',
    featured: true,
  },
  {
    num: '12',
    name: 'Agency Brain Pro',
    tier: 'Top Tier',
    price: '$599/mo',
    description: 'Plus, with AI Sales Roleplay, the HR Suite, and priority support.',
    details: [
      '100 AI call scoring credits / month',
      'AI Sales Roleplay Bot',
      'HR Suite',
      'Priority support',
      'Standard Playbook Training Platform',
      'Everything in Plus',
    ],
    href: 'https://myagencybrain.com/info#pricing',
    cta: 'Choose Pro →',
  },
];

const ProgramRowItem = ({ p, expanded, onToggle }: { p: ProgramRow; expanded: boolean; onToggle: () => void }) => {
  const isSoldOut = !!p.soldOut;
  return (
    <li
      style={{
        borderBottom: `1px solid ${ink}`,
        cursor: 'pointer',
      }}
      onClick={onToggle}
      className="group hover:bg-black/[0.03] transition-colors"
    >
      <div
        className="grid grid-cols-[36px_minmax(0,1fr)_36px] gap-x-3 gap-y-4 px-1 py-6 sm:grid-cols-[60px_minmax(0,1fr)_auto_auto_auto] sm:gap-5 sm:px-2 sm:py-7"
        style={{
          alignItems: 'center',
          position: 'relative',
          overflow: 'clip',
        }}
      >
        <span style={{
          fontFamily: editorial, fontSize: 22, color: ink, opacity: 0.4, letterSpacing: '-0.01em',
        }}>
          {p.num}
        </span>
        <div>
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 4 }}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
              color: ink, opacity: 0.5, textTransform: 'uppercase',
            }}>
              {p.tier}
            </p>
            {p.featured && (
              <span style={{
                fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
                color: '#fff', background: blue, textTransform: 'uppercase',
                padding: '3px 8px', lineHeight: 1.4,
              }}>
                Most Popular
              </span>
            )}
          </div>
          <h4 style={{
            fontFamily: display,
            fontSize: 'clamp(24px, 3.2vw, 42px)',
            lineHeight: 1, letterSpacing: '-0.01em',
            color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            {p.name}
          </h4>
          <p style={{
            fontFamily: body, fontSize: 13, fontWeight: 600, color: ink,
            opacity: isSoldOut ? 0.4 : 1, marginTop: 6, marginBottom: 0,
          }} className="sm:hidden">
            {p.price}
          </p>
        </div>
        <span style={{
          fontFamily: body, fontSize: 14, fontWeight: 600, color: ink,
          opacity: isSoldOut ? 0.4 : 1, whiteSpace: 'nowrap',
        }} className="hidden sm:inline">
          {p.price}
        </span>
        {isSoldOut ? (
          <span className="col-start-2 row-start-2 justify-self-start sm:col-auto sm:row-auto" style={{
            fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
            color: ink, textTransform: 'uppercase', padding: '10px 18px',
            border: `1.5px solid ${ink}`, whiteSpace: 'nowrap', opacity: 0.3,
          }}>
            {p.cta || 'Apply →'}
          </span>
        ) : (
          <a
            href={p.href}
            onClick={(e) => e.stopPropagation()}
            {...(p.href?.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            style={{
              fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '10px 18px', border: `1.5px solid ${ink}`, transition: 'all .25s',
              whiteSpace: 'nowrap',
            }}
            className="col-start-2 row-start-2 justify-self-start hover:bg-black hover:text-white sm:col-auto sm:row-auto"
          >
            {p.cta || 'Apply →'}
          </a>
        )}
        <span
          aria-hidden
          className="col-start-3 row-start-1 sm:col-auto sm:row-auto"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, border: `1.5px solid ${ink}`,
            fontFamily: body, fontSize: 18, fontWeight: 400,
            transition: 'transform .35s ease, background .25s, color .25s',
            transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
            background: expanded ? ink : 'transparent',
            color: expanded ? paper : ink,
            flexShrink: 0,
          }}
        >
          +
        </span>

        {isSoldOut && (
          <motion.div
            aria-hidden
            initial={{ scale: 3.4, opacity: 0, rotate: -16 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -7 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 13, mass: 0.9, delay: 0.1 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{
              fontFamily: display, fontSize: 'clamp(26px, 4.5vw, 46px)',
              color: '#D4332A', letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '4px 22px', lineHeight: 1, whiteSpace: 'nowrap',
              border: '4px solid #D4332A', outline: '2px solid #D4332A', outlineOffset: '4px',
              borderRadius: 6, background: 'rgba(212,51,42,0.06)',
              boxShadow: '0 8px 22px rgba(0,0,0,0.22)', opacity: 0.95,
            }}>
              Sold Out
            </span>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div
          className="grid grid-cols-1 gap-5 px-1 pb-9 pt-2 sm:grid-cols-[60px_1fr] sm:px-2"
        >
          <div className="hidden sm:block" /> {/* spacer to align with number column */}
          <div>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.7, maxWidth: 640, marginBottom: 20,
            }}>
              {p.description}
            </p>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '8px 32px',
            }}>
              {p.details.map((d) => (
                <li
                  key={d}
                  style={{
                    fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.5,
                    color: ink, padding: '6px 0', display: 'flex', alignItems: 'flex-start', gap: 10,
                    borderBottom: `1px solid ${ink}1a`,
                  }}
                >
                  <span style={{
                    color: blue, fontSize: 14, lineHeight: '21px', flexShrink: 0, fontWeight: 700,
                  }}>
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

const ProgramsSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (num: string) => setExpanded((cur) => (cur === num ? null : num));

  return (
    <section id="programs" style={{ background: paper, padding: '80px 24px 120px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-12 gap-6 items-end mb-12">
          <Reveal className="col-span-12 md:col-span-8">
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, textTransform: 'uppercase', marginBottom: 12,
            }}>
              / Programs
            </p>
            <h2 style={{
              fontFamily: display,
              fontSize: 'clamp(44px, 7vw, 100px)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: ink,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
            }}>
              PICK YOUR PATH.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 md:col-span-4">
            <p style={{
              fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
              color: ink, opacity: 0.7, marginBottom: 8,
            }}>
              Every program ships with a level of Agency Brain access. Tap any row to see exactly what's inside.
            </p>
          </Reveal>
        </div>

        {/* COACHING */}
        <div className="flex items-baseline justify-between mb-3">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase',
          }}>
            // Coaching Programs
          </p>
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
            color: ink, opacity: 0.45, textTransform: 'uppercase',
          }}>
            Tap a row to expand
          </p>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {coachingPrograms.map((p) => (
            <ProgramRowItem
              key={p.num}
              p={p}
              expanded={expanded === p.num}
              onToggle={() => toggle(p.num)}
            />
          ))}
        </ul>

        {/* Inter-section CTA — AgencyBrain Info */}
        <div className="flex justify-center" style={{ marginTop: 48 }}>
          <a
            href="https://myagencybrain.com/info"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
              color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '16px 32px', border: `1.5px solid ${ink}`, transition: 'all .25s',
              display: 'inline-block',
            }}
            className="hover:bg-[#2997FF] hover:border-[#2997FF]"
          >
            AgencyBrain Info →
          </a>
        </div>

        {/* SOFTWARE */}
        <div className="flex items-baseline justify-between mt-16 mb-3">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase',
          }}>
            // Software Only
          </p>
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
            color: ink, opacity: 0.45, textTransform: 'uppercase',
          }}>
            Just the platform
          </p>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {softwarePlans.map((p) => (
            <ProgramRowItem
              key={p.num}
              p={p}
              expanded={expanded === p.num}
              onToggle={() => toggle(p.num)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

type DecisionPathId = 'owner_coaching' | 'team_programs' | 'agency_brain';

type DecisionPath = {
  id: DecisionPathId;
  index: string;
  label: string;
  description: string;
  cta: string;
};

const decisionPaths: DecisionPath[] = [
  {
    id: 'owner_coaching',
    index: '01',
    label: "I'M THE BOTTLENECK.",
    description: 'Get the agency out of your head with coaching, accountability, and a plan you can execute.',
    cta: 'See owner coaching',
  },
  {
    id: 'team_programs',
    index: '02',
    label: 'MY TEAM NEEDS A STANDARD.',
    description: 'Train producers, install accountability, and turn inconsistent execution into a repeatable system.',
    cta: 'See team programs',
  },
  {
    id: 'agency_brain',
    index: '03',
    label: 'I NEED THE OPERATING SYSTEM.',
    description: 'Put scorecards, pipeline, training, retention, and daily execution into one system.',
    cta: 'See Agency Brain',
  },
];

type DecisionOfferProps = {
  eyebrow: string;
  name: string;
  price?: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
};

const DecisionOffer = ({ eyebrow, name, price, description, href, cta, external }: DecisionOfferProps) => (
  <article className="decision-offer">
    <div>
      <p className="decision-offer-eyebrow">{eyebrow}</p>
      <h4>{name}</h4>
    </div>
    {price && <p className="decision-offer-price">{price}</p>}
    <p className="decision-offer-copy">{description}</p>
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={() => trackHomepageEvent('program_cta_clicked', { program: name, destination: href })}
    >
      {cta}<span aria-hidden> →</span>
    </a>
  </article>
);

const PathDetails = ({ path }: { path: DecisionPathId }) => {
  if (path === 'owner_coaching') {
    return (
      <div className="decision-details-grid decision-details-grid--two">
        <DecisionOffer
          eyebrow="Recurring group coaching"
          name="The Boardroom"
          price="$299/month"
          description="Monthly coaching, operator accountability, and a room of owners committed to moving the work forward."
          href="/boardroom"
          cta="See The Boardroom"
        />
        <DecisionOffer
          eyebrow="Focused 90-day one-on-one path"
          name="Standard 90"
          price="Fit Call"
          description="A custom 90-day action map with personal coaching, accountability, and weekly course correction."
          href="/standard90"
          cta="See Standard 90"
        />
        <DecisionOffer
          eyebrow="Private 90-day mentorship · By application"
          name="The Standard Ascension"
          price="Apply"
          description="One business target and all four areas of life on the board, with private weekly coaching and daily accountability from Justin."
          href="/ascension"
          cta="Explore Ascension"
        />
        <section className="decision-sold-out" aria-labelledby="private-coaching-heading">
          <p id="private-coaching-heading">Private long-term coaching</p>
          <div className="decision-sold-out-list">
            <article>
              <div>
                <span>Private 1:1 coaching</span>
                <h5>The Directive</h5>
              </div>
              <span className="decision-sold-out-stamp" aria-label="Sold out">Sold Out</span>
            </article>
            <article>
              <div>
                <span>Highest-access coaching</span>
                <h5>Partnership</h5>
              </div>
              <span className="decision-sold-out-stamp" aria-label="Sold out">Sold Out</span>
            </article>
          </div>
        </section>
      </div>
    );
  }

  if (path === 'team_programs') {
    return (
      <div className="decision-team-groups">
        <section aria-labelledby="train-the-team">
          <h4 id="train-the-team">Train the team</h4>
          <div className="decision-details-grid decision-details-grid--two">
            <DecisionOffer
              eyebrow="AI sales certification · One-time"
              name="Certified Standard"
              price="$399/seat"
              description="Certify producers on the full Hello-to-Bind sales call with training, roleplay, quizzes, and scored certification."
              href="/certified-standard?src=home-programs"
              cta="Get Certified"
            />
            <DecisionOffer
              eyebrow="Team sprint"
              name="6 Week Producer Challenge"
              price="$299/producer"
              description="Six weeks of sales-process training, daily habits, action takeaways, and owner visibility."
              href="https://myagencybrain.com/six-week-challenge"
              cta="Start the Challenge"
              external
            />
          </div>
        </section>
        <section aria-labelledby="lead-the-team">
          <h4 id="lead-the-team">Lead the team</h4>
          <div className="decision-details-grid decision-details-grid--two">
            <DecisionOffer
              eyebrow="Manager training"
              name="8 Week Experience"
              price="Apply"
              description="Install a complete sales-management system through eight live coaching calls and a manager playbook."
              href="/sales-experience"
              cta="See the Experience"
            />
            <DecisionOffer
              eyebrow="Sales team accountability · By application"
              name="The Team Standard"
              price="From $2,500/mo"
              description="Owner-free team accountability calls, weekly scoreboard rhythms, and direct reporting to the owner."
              href="/team-standard"
              cta="See The Standard"
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="decision-agency-brain">
      <p className="decision-offer-eyebrow">The agency operating system</p>
      <h4>Agency Brain</h4>
      <p>
        Bring scorecards, pipeline, team visibility, training, retention, and daily execution into one operating loop.
      </p>
      <a
        href="https://myagencybrain.com/info#pricing"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackHomepageEvent('program_cta_clicked', { program: 'Agency Brain', destination: 'https://myagencybrain.com/info#pricing' })}
      >
        See Agency Brain <span aria-hidden>→</span>
      </a>
      <p className="decision-agency-brain-secondary">Compare Core, Plus, and Pro on Agency Brain.</p>
    </div>
  );
};

const DecisionProgramsSection = () => {
  const [expanded, setExpanded] = useState<DecisionPathId | null>(null);
  const reduceMotion = useReducedMotion();

  const selectPath = (id: DecisionPathId) => {
    const next = expanded === id ? null : id;
    setExpanded(next);
    if (next) trackHomepageEvent('path_selected', { path: id });
  };

  return (
    <section id="programs" className="decision-board">
      <div className="decision-board-layout">
        <header className="decision-board-intro">
          <p>/ Programs</p>
          <h2>What needs to change first?</h2>
          <div className="decision-board-intro-rule" aria-hidden />
          <p>Choose the problem you need solved. We’ll show you the shortest path.</p>
        </header>

        <div className="decision-paths">
          {decisionPaths.map((path) => {
            const isExpanded = expanded === path.id;
            const panelId = `decision-panel-${path.id}`;
            const triggerId = `decision-trigger-${path.id}`;

            return (
              <article key={path.id} className={`decision-path ${isExpanded ? 'is-expanded' : ''}`}>
                <button
                  id={triggerId}
                  type="button"
                  className="decision-path-trigger"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => selectPath(path.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      selectPath(path.id);
                    }
                  }}
                >
                  <span className="decision-path-index">{path.index}</span>
                  <span className="decision-path-copy">
                    <span className="decision-path-label">{path.label}</span>
                    <span className="decision-path-description">{path.description}</span>
                  </span>
                  <span className="decision-path-action">
                    <span>{path.cta}</span>
                    <span className="decision-path-plus" aria-hidden>{isExpanded ? '−' : '+'}</span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="decision-path-panel"
                      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <PathDetails path={path.id} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .decision-board {
          background: ${paper};
          border-top: 1px solid ${ink};
          color: ${ink};
          padding: clamp(72px, 8vw, 120px) 24px clamp(96px, 10vw, 150px);
          overflow: clip;
        }
        .decision-board-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 2.05fr);
          gap: clamp(40px, 6vw, 96px);
          max-width: 1280px;
          margin: 0 auto;
          align-items: start;
        }
        .decision-board-intro {
          position: sticky;
          top: 100px;
        }
        .decision-board-intro > p:first-child,
        .decision-offer-eyebrow {
          font: 700 11px/1.4 ${body};
          letter-spacing: .18em;
          text-transform: uppercase;
          margin: 0 0 18px;
        }
        .decision-board-intro h2 {
          font: 400 clamp(50px, 6.1vw, 94px)/.89 ${display};
          letter-spacing: -.02em;
          text-transform: uppercase;
          text-wrap: balance;
          margin: 0;
        }
        .decision-board-intro-rule {
          width: 44px;
          height: 4px;
          background: ${blue};
          margin: 30px 0 24px;
        }
        .decision-board-intro > p:last-child {
          font: 500 15px/1.6 ${body};
          max-width: 30ch;
          margin: 0;
        }
        .decision-paths {
          border-top: 1px solid ${ink};
        }
        .decision-path {
          border-bottom: 1px solid ${ink};
          background: ${paper};
          color: ${ink};
        }
        .decision-path.is-expanded {
          background: ${ink};
          color: ${paper};
        }
        .decision-path-trigger {
          appearance: none;
          width: 100%;
          min-height: 176px;
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          color: inherit;
          background: transparent;
          border: 0;
          border-radius: 0;
          padding: 30px 24px;
          text-align: left;
          cursor: pointer;
          transition: transform .22s ease;
        }
        .decision-path:not(.is-expanded) .decision-path-trigger:hover {
          transform: translateX(4px);
        }
        .decision-path-trigger:focus-visible,
        .decision-offer a:focus-visible,
        .decision-agency-brain a:focus-visible {
          outline: 3px solid ${blue};
          outline-offset: -3px;
        }
        .decision-path-index {
          align-self: start;
          font: 400 18px/1 ${editorial};
          opacity: .45;
          padding-top: 5px;
        }
        .decision-path-copy { display: block; min-width: 0; }
        .decision-path-label {
          display: block;
          font: 400 clamp(34px, 4vw, 60px)/.95 ${display};
          letter-spacing: -.015em;
          text-transform: uppercase;
          text-wrap: balance;
        }
        .decision-path-description {
          display: block;
          max-width: 59ch;
          margin-top: 14px;
          font: 400 14px/1.55 ${body};
          opacity: .72;
        }
        .decision-path-action {
          min-width: 132px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 18px;
          font: 700 10px/1 ${body};
          letter-spacing: .13em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .decision-path-plus {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid currentColor;
          color: inherit;
          font: 400 22px/1 ${body};
        }
        .is-expanded .decision-path-plus {
          border-color: ${blue};
          background: ${blue};
          color: ${ink};
        }
        .decision-path-panel {
          padding: 0 24px 36px 88px;
          transform-origin: top;
        }
        .decision-details-grid {
          display: grid;
          gap: 0;
          border-top: 1px solid rgba(244,242,238,.38);
        }
        .decision-details-grid--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .decision-offer {
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          gap: 15px;
          min-width: 0;
          padding: 26px 28px 2px 0;
        }
        .decision-offer + .decision-offer {
          border-left: 1px solid rgba(244,242,238,.25);
          padding-left: 28px;
        }
        .decision-details-grid--two > .decision-offer:nth-of-type(3) {
          grid-column: 1 / -1;
          border-top: 1px solid rgba(244,242,238,.25);
          border-left: 0;
          margin-top: 26px;
          padding-left: 0;
        }
        .decision-offer-eyebrow {
          color: ${blue};
          margin-bottom: 8px;
        }
        .decision-offer h4,
        .decision-agency-brain h4 {
          font: 400 clamp(28px, 3vw, 44px)/1 ${display};
          text-transform: uppercase;
          margin: 0;
        }
        .decision-offer-price {
          font: 700 14px/1 ${body};
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .decision-offer-copy,
        .decision-agency-brain > p:not(.decision-offer-eyebrow):not(.decision-agency-brain-secondary) {
          font: 400 13px/1.6 ${body};
          opacity: .72;
          margin: 0;
          max-width: 44ch;
        }
        .decision-offer a,
        .decision-agency-brain > a {
          justify-self: start;
          color: ${paper};
          border-bottom: 2px solid ${blue};
          font: 700 11px/1.2 ${body};
          letter-spacing: .12em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          padding: 8px 0;
        }
        .decision-sold-out {
          grid-column: 1 / -1;
          border-top: 1px solid rgba(244,242,238,.25);
          margin: 26px 0 0;
          padding: 22px 0 0;
        }
        .decision-sold-out > p {
          font: 700 10px/1.4 ${body};
          letter-spacing: .18em;
          text-transform: uppercase;
          opacity: .5;
          margin: 0 0 14px;
        }
        .decision-sold-out-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }
        .decision-sold-out-list article {
          min-width: 0;
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-top: 1px solid rgba(244,242,238,.16);
          padding: 16px 4px 4px 0;
        }
        .decision-sold-out-list article > div > span {
          display: block;
          font: 600 9px/1.3 ${body};
          letter-spacing: .14em;
          text-transform: uppercase;
          opacity: .45;
          margin-bottom: 5px;
        }
        .decision-sold-out-list h5 {
          font: 400 clamp(24px, 2.3vw, 34px)/1 ${display};
          text-transform: uppercase;
          margin: 0;
        }
        .decision-sold-out-stamp {
          display: inline-block;
          flex-shrink: 0;
          color: #D4332A;
          border: 3px solid #D4332A;
          outline: 1px solid #D4332A;
          outline-offset: 3px;
          font: 400 clamp(18px, 2vw, 25px)/.9 ${display};
          letter-spacing: .05em;
          text-transform: uppercase;
          white-space: nowrap;
          padding: 5px 10px 4px;
          transform: rotate(-5deg);
        }
        .decision-sold-out-list article:nth-child(2) .decision-sold-out-stamp {
          transform: rotate(4deg);
        }
        .decision-team-groups { display: grid; gap: 40px; }
        .decision-team-groups > section > h4 {
          font: 700 11px/1.4 ${body};
          letter-spacing: .18em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .decision-agency-brain {
          border-top: 1px solid rgba(244,242,238,.38);
          padding-top: 28px;
        }
        .decision-agency-brain h4 { margin-bottom: 16px; }
        .decision-agency-brain > a { display: inline-block; margin-top: 22px; }
        .decision-agency-brain-secondary {
          font: 500 12px/1.5 ${body};
          opacity: .55;
          margin: 18px 0 0;
        }
        @media (max-width: 767px) {
          .decision-board { padding-inline: 16px; }
          .decision-board-layout { grid-template-columns: minmax(0, 1fr); gap: 54px; }
          .decision-board-intro { position: static; }
          .decision-board-intro h2 { font-size: clamp(48px, 14vw, 70px); }
          .decision-board-intro > p:last-child { max-width: 36ch; }
          .decision-path-trigger {
            min-height: 0;
            grid-template-columns: 28px minmax(0, 1fr) 38px;
            gap: 10px;
            padding: 24px 4px;
          }
          .decision-path-label { font-size: clamp(30px, 9vw, 42px); }
          .decision-path-description { font-size: 13px; margin-top: 10px; }
          .decision-path-action { min-width: 0; gap: 14px; }
          .decision-path-action { display: contents; }
          .decision-path-action > span:first-child {
            grid-column: 2 / 3;
            grid-row: 2;
            justify-self: start;
            padding-top: 6px;
            font-size: 10px;
            letter-spacing: .12em;
            white-space: nowrap;
          }
          .decision-path-plus {
            grid-column: 3;
            grid-row: 1;
            align-self: start;
            width: 38px;
            height: 48px;
          }
          .decision-path-panel { padding: 0 4px 30px 42px; }
          .decision-details-grid--two { grid-template-columns: minmax(0, 1fr); }
          .decision-offer { padding: 24px 0; }
          .decision-offer + .decision-offer {
            border-left: 0;
            border-top: 1px solid rgba(244,242,238,.25);
            padding-left: 0;
          }
          .decision-sold-out { margin-top: 0; }
          .decision-sold-out-list { grid-template-columns: minmax(0, 1fr); gap: 8px; }
          .decision-sold-out-list article { min-height: 68px; padding-right: 6px; }
          .decision-sold-out-list h5 { font-size: 26px; }
          .decision-sold-out-stamp { font-size: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .decision-path,
          .decision-path-trigger { transition: none !important; }
          .decision-path:not(.is-expanded) .decision-path-trigger:hover { transform: none; }
        }
      `}</style>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   SOFTWARE DETAIL — what it is + the feature surface (§6)
   ══════════════════════════════════════════════════════ */
const featureGroups = [
  {
    group: 'Run the day',
    items: [
      { name: 'Sales Dashboard', line: 'Total visibility — know exactly where your team stands, every single day.' },
      { name: 'Sales Analytics', line: 'The breakdown — premium, items, policies, points, by date, source, or bundle.' },
      { name: 'Pipeline Intelligence', line: 'Stop guessing — every lead, every stage, every dollar, in real time.' },
      { name: 'Marketing ROI', line: 'What each channel actually produces — leads, quotes, premium, commission.' },
    ],
  },
  {
    group: 'Protect the book',
    items: [
      { name: 'Call Scoring', line: 'AI call audits with execution checklists and talk-to-listen ratios. Also sold standalone as Standard Call Scoring.' },
      { name: 'Renewal Tracking', line: 'Stay ahead — manage renewals proactively so nothing slips.' },
      { name: 'Cancel Audit', line: 'Cancellations, at-risk premium, and saved dollars, week by week.' },
      { name: 'Winback HQ', line: 'Catch cancellations before they cost you.' },
    ],
  },
  {
    group: 'Sharpen the team',
    items: [
      { name: 'Team Training', line: 'A full library with structured tracks, right inside the app.' },
      { name: 'AI Roleplay Trainer', line: 'Producers sharpen the pitch anytime, against an AI that talks back.' },
      { name: 'Habit Tracking', line: 'Core 4 + Flow — daily practice gamified, 56 points a week, team leaderboards.' },
      { name: 'Target Setting', line: 'A 90-day action map — quarterly goals broken into daily habits.' },
    ],
  },
];

const SoftwareDetail = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}1a` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Inside Agency Brain
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(34px, 5.6vw, 80px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          EVERYTHING YOUR AGENCY NEEDS.<br /><span style={{ color: blue }}>NOTHING IT DOESN'T.</span>
        </h2>
      </Reveal>
      <div className="grid grid-cols-12 gap-8 mt-10">
        <Reveal delay={0.1} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.4vw, 19px)', fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.8, maxWidth: 680,
          }}>
            Most agencies run on duct tape and gut feelings. Pipeline in one tab, training in a folder nobody opens, retention tracked in somebody's head. Agency Brain pulls it into one place — pipeline, team, training, retention, daily habits — so the work happens on a system instead of on you.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 md:col-span-5">
          <div style={{ background: ink, color: paper, padding: '28px 26px' }}>
            <p style={{
              fontFamily: display, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.05,
              letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 12,
            }}>
              Built, not bought.
            </p>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: paper, opacity: 0.82, margin: 0,
            }}>
              I write the code. Every <span style={{ color: blue }}>AI</span> feature inside it is mine to ship — which means it does what an agency actually needs, and it changes the week the work changes.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12" style={{ marginTop: 72 }}>
        {featureGroups.map((g, gi) => (
          <Reveal key={g.group} delay={0.05 + gi * 0.06}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              color: blue, textTransform: 'uppercase', marginBottom: 20,
              paddingBottom: 12, borderBottom: `1px solid ${ink}`,
            }}>
              {g.group}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {g.items.map((it) => (
                <li key={it.name} style={{ marginBottom: 18 }}>
                  <span style={{
                    fontFamily: editorial, fontSize: 'clamp(15px, 1.3vw, 17px)', letterSpacing: '-0.01em',
                    color: ink, textTransform: 'uppercase', display: 'block', marginBottom: 4,
                  }}>
                    {it.name}
                  </span>
                  <span style={{
                    fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.5, color: ink, opacity: 0.7,
                  }}>
                    {it.line}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THE DAILY PRACTICE — the seven Flows (daily practice in-app)
   ══════════════════════════════════════════════════════ */
const flows = [
  { name: 'War Flow', desc: "When it's not just an idea, it's a fight. Name the enemy, define what winning looks like, map four fronts with their obstacle, the move to beat it, and who's in the foxhole with you. Walk out with a campaign." },
  { name: 'Idea Flow', desc: 'When something lit up and you want to take it seriously before it fades. Force it specific. Four measurable facts. Weigh execute-vs-cost-of-not. Walk out with a real plan.' },
  { name: 'Discovery Flow', desc: 'Right after you learn something worth keeping — a book, training, podcast, conversation. Capture what landed, pull the one lesson, choose where it applies before tomorrow forgets.' },
  { name: 'Irritation Flow', desc: "When someone or something is getting to you. Surface the story you're telling yourself, test it against the facts, write a new story that actually serves you. Defuse the charge instead of stewing or reacting." },
  { name: 'Gratitude Flow', desc: "Don't let a good moment just pass. Break it down — story vs. facts, the lesson underneath — and land on one move in the next 24 hours to honor it." },
  { name: 'Prayer Flow', desc: "When you're carrying something — a person, a situation, a weight. Name it. Walk out with the lesson and one action that lives it out." },
  { name: 'Bible Flow', desc: 'Anchored to scripture. Turn what you read into Start, Stop, and Keep commitments — each with a measurement and the belief that holds it.' },
];

const DailyPracticeSection = () => (
  <section style={{ background: ink, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, textTransform: 'uppercase', marginBottom: 24, opacity: 0.6,
        }}>
          / The Daily Practice
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 84px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          SEVEN FLOWS.<br /><span style={{ color: blue }}>EVERY REALITY THE DAY BRINGS.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.4vw, 19px)', fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.8, marginTop: 28, maxWidth: 820,
        }}>
          The agency operator's day doesn't fit in one frame. A strategy you have to pressure-test before it fades. A win you want to honor before it slips. A team member you can't stop being irritated at. A customer insight you don't want to lose by Tuesday. Agency Brain ships with seven structured Flows — each one a defined daily practice for a specific reality of running the business. Every Flow ends with an action. That's the bridge.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" style={{ marginTop: 56 }}>
        {flows.map((f, i) => (
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
          <span style={{ color: blue }}>56 points a week</span> across Core 4 + Flow.
        </p>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.75, marginTop: 12, maxWidth: 640,
        }}>
          Tracked. Leaderboard-visible. The system that turns daily practice into a number you can actually see.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   GIANT CTA — "CELEBRATE" moment
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => {
  const [open, setOpen] = useState(false);
  const startApplication = () => {
    trackHomepageEvent('strategy_application_started', { source: 'home_closing_cta' });
    setOpen(true);
  };

  return (
    <section
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('[role="dialog"]')) return;
        startApplication();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          startApplication();
        }
      }}
      style={{
        background: ink,
        padding: '100px 24px 70px',
        cursor: 'pointer',
        borderTop: `1px solid ${ink}`,
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
      role="button"
      tabIndex={0}
      aria-label="Apply for a strategy call"
    >
      <IconWatermark corner="right" opacity={0.06} />
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
            fontFamily: display,
            fontSize: 'clamp(80px, 22vw, 360px)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            color: paper,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}>
            RAISE.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
            color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
          }}>
            Click anywhere &nbsp;→&nbsp; Apply for a strategy call
          </p>
        </Reveal>
      </div>
      <StandardFitModal open={open} onOpenChange={setOpen} />
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   FOOTER — newsprint multi-column
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
            { label: 'Boardroom', href: '#programs' },
            { label: 'Directive', to: '/directive' },
            { label: '8-Week', to: '/sales-experience' },
            { label: 'Training', to: '/training' },
          ]},
          { title: 'Company', items: [
            { label: 'About', to: '/about' },
            { label: 'Contact', to: '/contact' },
            { label: 'Privacy', to: '/privacy' },
            { label: 'Terms', to: '/terms' },
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
                  {it.to ? (
                    <Link to={it.to} style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.85, textDecoration: 'none' }} className="hover:opacity-100">
                      {it.label}
                    </Link>
                  ) : (
                    <a href={it.href} style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.85, textDecoration: 'none' }} className="hover:opacity-100">
                      {it.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p style={{
          fontFamily: body, fontSize: 11, opacity: 0.5, letterSpacing: '0.08em',
        }}>
          © {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldMockup = () => (
  <div style={{ background: paper, fontFamily: body, color: ink }}>
    <BoldNav />
    <HeroSection />
    <MarqueeBands />
    <MissionSection />
    <FoundationSection />
    <CertifiedStandardBand />
    <BuilderSection />
    <AgencyBrainBand />
    <SoftwareDetail />
    <PolaroidGrid />
    <DailyPracticeSection />
    <DecisionProgramsSection />
    <GiantCTA />
    <BoldFooter />
  </div>
);

export default BoldMockup;
