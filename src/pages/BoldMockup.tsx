import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import StandardFitModal from '@/components/StandardFitModal';

import standardLogo from '@/assets/standard-word-logo.png';
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
const blue = '#2080FF';    // SP brand blue (already in tailwind)
const blueDark = '#0066CC';

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
   NAVIGATION — minimal newsprint header
   ══════════════════════════════════════════════════════ */
const BoldNav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Programs', href: '#programs' },
    { label: 'Software', href: '#software' },
    { label: '8-Week', to: '/sales-experience' },
    { label: 'Training', to: '/training' },
    { label: 'Nutrition', external: 'https://standardnutrition.app' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: paper,
        borderBottom: `1px solid ${ink}`,
        height: 56,
        fontFamily: body,
      }}
    >
      <div className="h-full px-6 md:px-10 flex items-center justify-between max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center" aria-label="Standard Playbook">
          <img
            src={standardLogo}
            alt="Standard Playbook"
            style={{ height: 22, width: 'auto', filter: 'brightness(0)' }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => {
            const linkStyle = { fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', color: ink, textTransform: 'uppercase' as const };
            if (l.to) {
              return (
                <Link key={l.label} to={l.to} style={linkStyle} className="hover:opacity-60 transition-opacity">
                  {l.label}
                </Link>
              );
            }
            if (l.external) {
              return (
                <a key={l.label} href={l.external} target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-60 transition-opacity">
                  {l.label}
                </a>
              );
            }
            return (
              <a key={l.label} href={l.href} style={linkStyle} className="hover:opacity-60 transition-opacity">
                {l.label}
              </a>
            );
          })}
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
          {links.map((l) => {
            const mobileStyle = { display: 'block', padding: '12px 0', fontSize: 16, fontWeight: 500, letterSpacing: '0.06em', color: ink, textTransform: 'uppercase' as const, borderBottom: `1px solid ${ink}1a` };
            if (l.to) {
              return (
                <Link key={l.label} to={l.to} onClick={() => setOpen(false)} style={mobileStyle}>
                  {l.label}
                </Link>
              );
            }
            if (l.external) {
              return (
                <a key={l.label} href={l.external} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={mobileStyle}>
                  {l.label}
                </a>
              );
            }
            return (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={mobileStyle}>
                {l.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
};

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
          <Reveal className="col-span-12 md:col-span-9 relative z-20">
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
          <Reveal delay={0.15} className="col-span-12 md:col-span-3 relative z-10">
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
        </div>

        {/* Sub-row: tagline + CTA */}
        <div className="grid grid-cols-12 gap-6 mt-12">
          <Reveal delay={0.25} className="col-span-12 md:col-span-6">
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
              Coaching, systems, and software for insurance agency owners who refuse to settle for average.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="col-span-12 md:col-span-6 flex md:justify-end items-center gap-3">
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
              onClick={() => setFitOpen(true)}
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
                color: '#fff', background: ink, textTransform: 'uppercase',
                padding: '15px 28px', border: `1.5px solid ${ink}`, cursor: 'pointer',
                transition: 'all .25s',
              }}
              className="hover:bg-[#2080FF] hover:border-[#2080FF]"
            >
              Book a Call
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
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue }: { rotate?: number; bg?: string; color?: string; dot?: string }) => {
  const phrase = 'STANDARD PLAYBOOK';
  const items = Array.from({ length: 20 });
  return (
    <div
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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 28,
          animation: 'sp-marquee 28s linear infinite',
        }}
      >
        {items.map((_, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
            <span style={{
              fontFamily: editorial,
              fontSize: 'clamp(22px, 3.4vw, 44px)',
              letterSpacing: '0.04em',
              fontWeight: 400,
            }}>{phrase}</span>
            <span aria-hidden style={{
              display: 'inline-block', width: 18, height: 18, borderRadius: 999,
              background: dot, flexShrink: 0,
            }} />
          </span>
        ))}
      </div>
    </div>
  );
};

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
          STANDARD PLAYBOOK'S
          <br />
          <span style={{ paddingLeft: '8vw', display: 'inline-block' }}>OBSESSION IS BUILDING</span>
          <br />
          <span style={{ paddingLeft: '14vw', display: 'inline-block' }}>AGENCIES THAT REFUSE</span>
          <br />
          <span style={{ display: 'inline-block' }}>TO SETTLE FOR AVERAGE</span>
        </h2>
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
   AGENCY BRAIN — black section with tilted screenshot
   (Dom Pérignon bottle moment)
   ══════════════════════════════════════════════════════ */
const AgencyBrainBand = () => (
  <section id="software" style={{ background: ink, padding: '120px 0', overflow: 'hidden', position: 'relative' }}>
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
            Pipeline, training, retention, habits — all in one place. Built so the work happens whether you're in the office or not.
          </p>
          <a
            href="#programs"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, background: paper, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', display: 'inline-block', transition: 'all .25s',
            }}
            className="hover:bg-[#2080FF] hover:text-white"
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
  { img: lqsImg, label: 'Pipeline Intelligence', tilt: 4 },
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
            marginBottom: 64,
          }}
        >
          SEE THE WORK.
        </h3>
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
    description: 'Monthly coaching + accountability for owners who want steady momentum.',
    details: [
      'Live monthly group coaching with Justin',
      'Hot-seat problem solving with other owners',
      'AgencyBrain Core Access',
      'Team training library + scripts',
      'Ongoing accountability between calls',
      'Private Boardroom community access',
    ],
    href: 'https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l',
    cta: 'Join →',
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
  },
  {
    num: '05',
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
    num: '06',
    name: 'Agency Brain Core',
    tier: 'Software-Only Foundation',
    price: '$299/mo',
    description: 'Scorecards, training, team visibility, and the core operating loop.',
    details: [
      '20 AI call scoring credits / month',
      'Real-time scorecards and KPI rings',
      'Team leaderboards and performance visibility',
      'Standard Playbook Training Platform',
      'Limited AI feature set',
    ],
    href: 'https://myagencybrain.com',
    cta: 'Choose Core →',
  },
  {
    num: '07',
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
    href: 'https://myagencybrain.com',
    cta: 'Choose Plus →',
    featured: true,
  },
  {
    num: '08',
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
    href: 'https://myagencybrain.com',
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
        style={{
          padding: '28px 8px',
          display: 'grid',
          gridTemplateColumns: '60px 1fr auto auto auto',
          gap: 20,
          alignItems: 'center',
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
        </div>
        <span style={{
          fontFamily: body, fontSize: 14, fontWeight: 600, color: ink,
          opacity: isSoldOut ? 0.4 : 1, whiteSpace: 'nowrap',
        }} className="hidden sm:inline">
          {p.price}
        </span>
        {isSoldOut ? (
          <span style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            color: '#fff', background: ink, padding: '8px 14px', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Sold Out
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
            className="hover:bg-black hover:text-white"
          >
            {p.cta || 'Apply →'}
          </a>
        )}
        <span
          aria-hidden
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, border: `1.5px solid ${ink}`,
            fontFamily: body, fontSize: 18, fontWeight: 400, color: ink,
            transition: 'transform .35s ease, background .25s, color .25s',
            transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
            background: expanded ? ink : 'transparent',
            color: expanded ? paper : ink,
            flexShrink: 0,
          }}
        >
          +
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div
          style={{
            padding: '8px 8px 36px',
            display: 'grid',
            gridTemplateColumns: '60px 1fr',
            gap: 20,
          }}
        >
          <div /> {/* spacer to align with number column */}
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
            className="hover:bg-[#2080FF] hover:border-[#2080FF]"
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

/* ══════════════════════════════════════════════════════
   GIANT CTA — "CELEBRATE" moment
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => {
  const [open, setOpen] = useState(false);
  return (
    <section
      onClick={() => setOpen(true)}
      style={{
        background: ink,
        padding: '100px 24px 70px',
        cursor: 'pointer',
        borderTop: `1px solid ${ink}`,
      }}
      role="button"
      aria-label="Book your strategy call"
    >
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
            Click anywhere &nbsp;→&nbsp; Book a 20-minute strategy call
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
    <AgencyBrainBand />
    <PolaroidGrid />
    <ProgramsSection />
    <GiantCTA />
    <BoldFooter />
  </div>
);

export default BoldMockup;
