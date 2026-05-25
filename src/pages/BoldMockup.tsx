import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
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
const blue = '#2997FF';    // SP brand blue (already in tailwind)
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
              For insurance agency owners who know there's more to this game than the next big number. Coaching, software, and <span style={{ color: blue }}>AI</span> — built by a 20-year operator who built, scaled, and sold three Allstate agencies, and now coaches from outside the same fight.
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
              className="hover:bg-[#2997FF] hover:border-[#2997FF]"
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
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'STANDARD PLAYBOOK' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => {
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="BODY · BEING · BALANCE · BUSINESS" />
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
    href: 'https://myagencybrain.com/info#pricing',
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
    <BuilderSection />
    <AgencyBrainBand />
    <SoftwareDetail />
    <PolaroidGrid />
    <DailyPracticeSection />
    <ProgramsSection />
    <GiantCTA />
    <BoldFooter />
  </div>
);

export default BoldMockup;
