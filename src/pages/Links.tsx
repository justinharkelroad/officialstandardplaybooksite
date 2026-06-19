import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';

import standardLogo from '@/assets/standard-word-logo.png';

const profileImage = '/LINK%20PAGE.jpg';

/* ── Type stacks ───────────────────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const formulaOrange = '#FF6A00';

/* ── Reveal helper ─────────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   PROGRAM DATA — edit these arrays to change the links
   ══════════════════════════════════════════════════════ */
type ProgramRow = {
  num: string;
  name: string;
  tier: string;
  price?: string;
  description: string;
  details: string[];
  href?: string;
  cta?: string;
  soldOut?: boolean;
};

const coachingPrograms: ProgramRow[] = [
  {
    num: '01',
    name: 'The Directive',
    tier: '1:1 Coaching',
    description: 'High-touch 1:1 implementation and pressure-tested accountability — the personal coaching tier.',
    details: [
      'Everything included in Boardroom +',
      'Monthly 2-hour private sessions with Justin',
      'Custom Agency Brain buildout for your agency',
      'Direct access between sessions',
      'Custom strategy + accountability plan',
      'Priority support for your entire team',
    ],
    cta: 'Apply →',
    soldOut: true,
  },
  {
    num: '02',
    name: 'Partnership',
    tier: '1:1 Coaching',
    description: 'The highest level — full-access private coaching, custom strategy, and a direct line to Justin.',
    details: [
      'Everything in Directive +',
      'Unlimited private access to Justin',
      'Custom agency growth roadmap',
      'Full Agency Brain Pro buildout',
      'On-call support for your entire team',
      'Priority scheduling, no waitlist',
    ],
    cta: 'Apply →',
    soldOut: true,
  },
  {
    num: '03',
    name: 'The Boardroom',
    tier: 'Membership',
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
    description: 'A 90-day action map for the agency owner who is done being the operating system. Customized and personally coached one-on-one all the way through.',
    details: [
      'A custom 90-day action map for your agency',
      'One-on-one coaching the whole way through',
      'Built for the owner ready to step out of the operating system',
      'Personal accountability and weekly course correction',
    ],
    href: '/standard90',
    cta: 'Learn More →',
  },
  {
    num: '06',
    name: '8 Week Experience',
    tier: 'Sales Management Training',
    price: 'Apply',
    description: 'For teams stuck in "great month / bad month" cycles. A full sales management system install in 8 weeks.',
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
    num: '07',
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
    href: '/the-challenge',
    cta: 'Learn More →',
  },
];

const softwarePrograms: ProgramRow[] = [
  {
    num: '01',
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
    href: '/certified-standard',
    cta: 'Get Certified →',
  },
  {
    num: '02',
    name: 'Agency Brain',
    tier: 'The Insurance-Agency OS',
    description: 'The operating system for the modern insurance agency — scorecards, AI call scoring, training, and full team visibility. Research the platform, features, and plans.',
    details: [
      'Real-time scorecards and KPI rings',
      'AI call scoring + transcripts',
      'Team leaderboards and performance visibility',
      'Standard Playbook training platform built in',
      'Daily Flow library (all 7 Flows)',
      'Core, Plus, and Pro tiers',
    ],
    href: 'https://myagencybrain.com/info',
    cta: 'Explore →',
  },
];

/* ══════════════════════════════════════════════════════
   PROGRAM ROW — expandable, with sold-out stamp
   ══════════════════════════════════════════════════════ */
const ProgramRowItem = ({ p }: { p: ProgramRow }) => {
  const [expanded, setExpanded] = useState(false);
  const isSoldOut = !!p.soldOut;
  const isInternal = p.href?.startsWith('/');

  return (
    <li
      style={{ borderBottom: `1px solid ${ink}`, cursor: 'pointer' }}
      onClick={() => setExpanded((v) => !v)}
      className="group hover:bg-black/[0.03] transition-colors"
    >
      <div
        style={{
          padding: '24px 8px',
          display: 'grid',
          gridTemplateColumns: '48px 1fr auto',
          gap: 16,
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <span style={{ fontFamily: editorial, fontSize: 20, color: ink, opacity: 0.4, letterSpacing: '-0.01em' }}>
          {p.num}
        </span>

        <div>
          <h4 style={{
            fontFamily: display,
            fontSize: 'clamp(22px, 3.2vw, 38px)',
            lineHeight: 1, letterSpacing: '-0.01em',
            color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            {p.name}
          </h4>
        </div>

        {isSoldOut ? (
          <span style={{
            fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
            color: ink, textTransform: 'uppercase', padding: '10px 18px',
            border: `1.5px solid ${ink}`, whiteSpace: 'nowrap', opacity: 0.3,
          }}>
            {p.cta || 'Apply →'}
          </span>
        ) : isInternal ? (
          <Link
            to={p.href!}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '10px 18px', border: `1.5px solid ${ink}`, transition: 'all .25s',
              whiteSpace: 'nowrap',
            }}
            className="hover:bg-black hover:text-white"
          >
            {p.cta || 'Learn More →'}
          </Link>
        ) : (
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '10px 18px', border: `1.5px solid ${ink}`, transition: 'all .25s',
              whiteSpace: 'nowrap',
            }}
            className="hover:bg-black hover:text-white"
          >
            {p.cta || 'Learn More →'}
          </a>
        )}

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
              fontFamily: display, fontSize: 'clamp(24px, 4.5vw, 42px)',
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
        <div style={{ padding: '4px 8px 32px', display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16 }}>
          <div />
          <div>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.7, maxWidth: 640, marginBottom: 18,
            }}>
              {p.description}
            </p>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '6px 28px',
            }}>
              {p.details.map((d) => (
                <li key={d} style={{
                  fontFamily: body, fontSize: 13.5, lineHeight: 1.5, color: ink, opacity: 0.78,
                  paddingLeft: 16, position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0, color: blue }}>—</span>
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

/* ── Section header (COACHING / SOFTWARE-AI) ───────────── */
const SectionHeader = ({ label }: { label: string }) => (
  <Reveal>
    <h2 style={{
      fontFamily: display,
      fontSize: 'clamp(40px, 8vw, 80px)',
      lineHeight: 1, letterSpacing: '-0.01em',
      color: ink, textTransform: 'uppercase', textAlign: 'center',
      margin: '0 0 8px', fontWeight: 400,
    }}>
      {label}
    </h2>
  </Reveal>
);

/* ── Rotated marquee band ──────────────────────────────── */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'STANDARD PLAYBOOK' }) => (
  <div style={{
    background: bg, color, transform: `rotate(${rotate}deg)`,
    padding: '12px 0', whiteSpace: 'nowrap', overflow: 'hidden',
    width: '120%', marginLeft: '-10%',
    borderTop: `1px solid ${color}33`, borderBottom: `1px solid ${color}33`,
  }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'sp-marquee 28s linear infinite' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: editorial, fontSize: 'clamp(20px, 3vw, 38px)', letterSpacing: '0.04em', fontWeight: 400 }}>{phrase}</span>
          <span aria-hidden style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 999, background: dot, flexShrink: 0 }} />
        </span>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   LINKS — editorial program hub in the bold house style
   ══════════════════════════════════════════════════════ */
const Links = () => {
  return (
    <div style={{ background: paper, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="px-6 md:px-10 max-w-[920px] mx-auto" style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 60 }}>

        {/* Eyebrow / logo */}
        <Reveal className="flex items-center justify-between">
          <Link to="/" style={{ display: 'inline-block' }}>
            <img src={standardLogo} alt="Standard Playbook" style={{ height: 26, width: 'auto', filter: 'brightness(0)' }} />
          </Link>
          <span style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            color: `${ink}99`, textTransform: 'uppercase',
          }}>
            Justin Harkelroad
          </span>
        </Reveal>

        {/* Header: headline + tilted profile */}
        <div className="grid grid-cols-12 gap-6 items-center" style={{ marginTop: 'clamp(36px, 6vw, 64px)' }}>
          <Reveal className="col-span-12 md:col-span-8">
            <h1 style={{
              fontFamily: display,
              fontSize: 'clamp(52px, 11vw, 116px)',
              lineHeight: 0.86,
              letterSpacing: '-0.02em',
              color: ink,
              margin: 0,
              textTransform: 'uppercase',
              fontWeight: 400,
            }}>
              Pick Your
              <br />
              <span style={{ color: blue }}>Next Move</span>
            </h1>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em',
              color: ink, textTransform: 'uppercase', lineHeight: 1.6,
              maxWidth: 420, marginTop: 24,
            }}>
              Coaching, software, and AI for insurance agency owners who know there's more to this game than the next big number. Start where it counts.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="col-span-12 md:col-span-4 flex md:justify-end">
            <motion.div
              initial={{ rotate: -6 }}
              animate={{ rotate: -6 }}
              style={{
                position: 'relative',
                width: 'clamp(150px, 42vw, 230px)',
                aspectRatio: '3 / 4',
                background: ink,
                overflow: 'hidden',
                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
              }}
            >
              <img
                src={profileImage}
                alt="Justin Harkelroad — Insurance Agency Coach"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            </motion.div>
          </Reveal>
        </div>

        {/* COACHING */}
        <div style={{ marginTop: 'clamp(48px, 8vw, 88px)' }}>
          <SectionHeader label="Coaching" />
          <Reveal delay={0.05}>
            <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0, borderTop: `1px solid ${ink}` }}>
              {coachingPrograms.map((p) => (
                <ProgramRowItem key={p.name} p={p} />
              ))}
            </ul>
          </Reveal>
        </div>

        {/* SOFTWARE / AI */}
        <div style={{ marginTop: 'clamp(56px, 9vw, 96px)' }}>
          <SectionHeader label="Software / AI" />
          <Reveal delay={0.05}>
            <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0, borderTop: `1px solid ${ink}` }}>
              {softwarePrograms.map((p) => (
                <ProgramRowItem key={p.name} p={p} />
              ))}
            </ul>
          </Reveal>
        </div>

        {/* LIVE EVENT FOR FORMULA */}
        <Reveal delay={0.05} style={{ marginTop: 'clamp(48px, 8vw, 80px)' }}>
          <a
            href="https://theformulaforum.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              background: formulaOrange, color: '#fff', textDecoration: 'none',
              padding: 'clamp(22px, 4vw, 34px) clamp(20px, 4vw, 40px)',
              boxShadow: '0 18px 40px -16px rgba(255,106,0,0.6)',
              transition: 'transform .25s ease, box-shadow .25s ease',
            }}
            className="hover:-translate-y-0.5"
          >
            <span>
              <span style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', opacity: 0.85, display: 'block', marginBottom: 6,
              }}>
                The Live Event
              </span>
              <span style={{
                fontFamily: display, fontSize: 'clamp(28px, 5.4vw, 52px)',
                lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase',
              }}>
                Formula Forum
              </span>
            </span>
            <span aria-hidden style={{ fontFamily: body, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, flexShrink: 0 }}>
              ↗
            </span>
          </a>
        </Reveal>
      </div>

      {/* Marquee flourish */}
      <div style={{ padding: '36px 0', overflow: 'hidden' }}>
        <Marquee rotate={-2.5} bg={ink} color={paper} dot={blue} />
      </div>

      {/* Footer */}
      <footer style={{ background: ink, color: paper, padding: '44px 24px 32px' }}>
        <div className="max-w-[920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <span style={{
            fontFamily: editorial, fontSize: 18, letterSpacing: '0.02em',
            textTransform: 'uppercase', color: paper,
          }}>
            Standard Playbook
          </span>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560049427918" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: paper, opacity: 0.8 }}>
              <Facebook size={20} />
            </a>
            <a href="https://www.linkedin.com/in/justinhark/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: paper, opacity: 0.8 }}>
              <Linkedin size={20} />
            </a>
          </div>
          <span style={{
            fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            color: `${paper}80`, textTransform: 'uppercase',
          }}>
            © {new Date().getFullYear()} HFI Agencies
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes sp-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Links;
