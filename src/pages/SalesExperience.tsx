import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookingModal from '@/components/BookingModal';
import StandardFitModal from '@/components/StandardFitModal';
import ContentMeta from '@/components/ContentMeta';
import standardLogo from '@/assets/standard-word-logo.png';
import agencyBrainLogo from '@/assets/agency-brain-logo.png';

const STORAGE_BASE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';
const salesExpDashImg = `${STORAGE_BASE}/Sales%20Experience%20Dashboard.png`;
const teamMeetingImg = `${STORAGE_BASE}/Team%20%26%20Meeting%20Hub.png`;
const trainingModulesImg = `${STORAGE_BASE}/Training%20Modules%20w%20Feedback.png`;
const salesProcessCardImg = `${STORAGE_BASE}/Sales%20Process%20Card.png`;
const accountabilityCardImg = `${STORAGE_BASE}/Accountability%20Metrics%20Card.png`;
const consequenceLadderCardImg = `${STORAGE_BASE}/Consequence%20Ladder%20Card.png`;

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════ */
const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Agency Brain', to: '/appinfo' },
    { label: 'Programs', to: '/#programs' },
    { label: 'Training', to: '/sales-experience' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 48,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        fontFamily: sf,
      }}
    >
      <div className="max-w-[980px] mx-auto h-full px-6 flex items-center justify-center">
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-white/80 hover:text-white transition-colors"
              style={{ fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden text-white/80" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'saturate(180%) blur(20px)',
            padding: '20px 24px',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block py-3 text-white/80 hover:text-white transition-colors border-b border-white/5"
              style={{ fontSize: 17, fontWeight: 400, letterSpacing: '-0.374px' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ══════════════════════════════════════════════════════
   HERO — BLACK, CINEMATIC
   ══════════════════════════════════════════════════════ */
const Hero = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      className="relative flex items-center justify-center text-center"
      style={{
        background: '#000',
        minHeight: '100vh',
        paddingTop: 48,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url(/8-week-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-6 max-w-[980px] mx-auto">
        <Reveal>
          <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-40 md:w-56 mb-10 brightness-0 invert opacity-80" />
        </Reveal>
        <Reveal delay={0.1}>
          <h1
            style={{
              fontFamily: sf,
              fontSize: 'clamp(40px, 7vw, 56px)',
              fontWeight: 600,
              lineHeight: 1.07,
              letterSpacing: '-0.28px',
              color: '#fff',
              margin: 0,
            }}
          >
            Stop managing chaos.
            <br />
            Start running a system.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: sf,
              fontSize: 'clamp(18px, 3vw, 21px)',
              fontWeight: 400,
              lineHeight: 1.19,
              letterSpacing: '0.231px',
              color: 'rgba(255,255,255,0.7)',
              marginTop: 16,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            8 weeks. A documented sales process, an accountability framework, and a consequence ladder — installed in your agency.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="flex items-center justify-center gap-4 mt-10">
            <a
              href="#whats-included"
              style={{
                fontFamily: sf,
                fontSize: 17,
                fontWeight: 400,
                color: '#2997ff',
                border: '1px solid #2997ff',
                borderRadius: 980,
                padding: '8px 20px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              className="hover:bg-[#2997ff]/10"
            >
              Learn more
            </a>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                fontFamily: sf,
                fontSize: 17,
                fontWeight: 400,
                color: '#fff',
                background: '#0071e3',
                border: '1px solid transparent',
                borderRadius: 8,
                padding: '8px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              className="hover:brightness-110"
            >
              Book a Strategy Call
            </button>
          </div>
        </Reveal>
        <StandardFitModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   GUARANTEE BANNER — BLACK WITH GOLD SEAL
   ══════════════════════════════════════════════════════ */
const GuaranteeBanner = () => (
  <section style={{ background: '#000', padding: '80px 24px' }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 24,
        }}>
          {/* Gold seal */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%', position: 'relative',
            background: 'linear-gradient(145deg, #d4a843, #f5d673, #c4952a)',
            boxShadow: '0 0 0 4px #000, 0 0 0 6px #c4952a, 0 0 40px rgba(212,168,67,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              border: '2px solid rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: sf, fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', lineHeight: 1,
              }}>Money Back</span>
              <span style={{
                fontFamily: sf, fontSize: 28, fontWeight: 700, color: '#1d1d1f', lineHeight: 1, marginTop: 2,
              }}>100%</span>
              <span style={{
                fontFamily: sf, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
                color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', lineHeight: 1, marginTop: 2,
              }}>Guarantee</span>
            </div>
          </div>

          {/* Copy */}
          <div>
            <h2 style={{
              fontFamily: sf, fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 600,
              lineHeight: 1.1, color: '#fff', marginBottom: 12,
            }}>
              We guarantee results — or you don't pay.
            </h2>
            <p style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47,
              letterSpacing: '-0.374px', color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto',
            }}>
              After 8 weeks you'll walk away with a documented sales process, an accountability framework, and a consequence ladder installed in your agency. If you don't have a clear path forward, you get every dollar back. No questions, no hoops.
            </p>
          </div>

          {/* Three deliverables */}
          <div style={{
            display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {['Sales Process', 'Accountability Framework', 'Consequence Ladder'].map((item) => (
              <div key={item} style={{
                fontFamily: sf, fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px',
                color: '#fff', textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 980, padding: '8px 20px',
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THE PROBLEM — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const Problem = () => (
  <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.224px',
            color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          The Problem
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            color: '#1d1d1f',
          }}
        >
          Great month. Bad month.
          <br />
          Great month. Bad month.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: '#0071e3',
            marginTop: 20,
          }}
        >
          That's not a sales team. That's a coin flip.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THE PROMISE — BLACK
   ══════════════════════════════════════════════════════ */
const Promise = () => (
  <section style={{ background: '#000', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.224px',
            color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          The Promise
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            color: '#fff',
          }}
        >
          In 8 weeks, you'll have certainty.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(21px, 3vw, 28px)',
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: '0.196px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
          }}
        >
          A process. A scorecard. A rhythm. A guarantee.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THREE SYSTEMS — TABBED SHOWCASE ON LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const systems = [
  {
    label: 'Sales Process',
    headline: 'A documented, repeatable call framework.',
    sub: 'Your entire team follows the same playbook — no more winging it. Every call has a structure, every objection has a response.',
    img: salesProcessCardImg,
  },
  {
    label: 'Accountability',
    headline: 'Daily tracking. Weekly scorecards. Graded calls.',
    sub: 'Every producer knows exactly where they stand. Managers have the data to coach, not guess.',
    img: accountabilityCardImg,
  },
  {
    label: 'Consequence Ladder',
    headline: 'A clear path when standards aren\'t met.',
    sub: 'Underperformance is addressed — not ignored. A fair, transparent escalation system your team respects.',
    img: consequenceLadderCardImg,
  },
];

const ThreeSystems = () => {
  const [active, setActive] = useState(0);
  const system = systems[active];

  return (
    <section id="whats-included" style={{ background: '#f5f5f7', padding: '120px 24px' }}>
      <div className="max-w-[980px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <p
              style={{
                fontFamily: sf,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '-0.224px',
                color: 'rgba(0,0,0,0.48)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              What You Walk Away With
            </p>
            <h2
              style={{
                fontFamily: sf,
                fontSize: 'clamp(32px, 5vw, 40px)',
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#1d1d1f',
              }}
            >
              Three systems. Zero guesswork.
            </h2>
          </div>
        </Reveal>

        {/* System selector tabs */}
        <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10" role="tablist">
            {systems.map((s, i) => (
              <button
                key={s.label}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                style={{
                  fontFamily: sf,
                  fontSize: 14,
                  fontWeight: i === active ? 600 : 400,
                  letterSpacing: '-0.224px',
                  color: i === active ? '#1d1d1f' : 'rgba(0,0,0,0.48)',
                  background: i === active ? '#fff' : 'transparent',
                  border: 'none',
                  borderRadius: 980,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: i === active ? 'rgba(0,0,0,0.08) 0 2px 8px' : 'none',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Showcase card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div style={{ padding: '48px 40px' }}>
                <p
                  style={{
                    fontFamily: sf,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.33,
                    letterSpacing: '-0.12px',
                    color: '#0071e3',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  System {active + 1} of 3
                </p>
                <h3
                  style={{
                    fontFamily: sf,
                    fontSize: 'clamp(24px, 3.5vw, 28px)',
                    fontWeight: 600,
                    lineHeight: 1.14,
                    letterSpacing: '0.196px',
                    color: '#1d1d1f',
                    marginBottom: 12,
                  }}
                >
                  {system.headline}
                </h3>
                <p
                  style={{
                    fontFamily: sf,
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: 1.47,
                    letterSpacing: '-0.374px',
                    color: 'rgba(0,0,0,0.48)',
                  }}
                >
                  {system.sub}
                </p>
              </div>
              <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <img
                  src={system.img}
                  alt={system.label}
                  style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: '8px 8px 0 0',
                    boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0px',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   AGENCY BRAIN TOOLS — TABBED SHOWCASE ON BLACK
   ══════════════════════════════════════════════════════ */
const brainFeatures = [
  { label: 'Dashboard', headline: 'Total Visibility.', sub: 'Know exactly where your team stands every single day. Premium, policies, activity — one view.', img: salesExpDashImg },
  { label: 'Team Hub', headline: 'Team & Meeting Hub.', sub: 'Centralized meeting management, team collaboration, and communication all in one place.', img: teamMeetingImg },
  { label: 'Training', headline: 'Training & Feedback.', sub: 'Structured modules unlocked every Monday and Wednesday. Feedback discovery flow fed back to the manager on Friday.', img: trainingModulesImg },
];

const AgencyBrainTools = () => {
  const [active, setActive] = useState(0);
  const feature = brainFeatures[active];

  return (
    <section style={{ background: '#000', padding: '120px 24px' }}>
      <div className="max-w-[980px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <img src={agencyBrainLogo} alt="Agency Brain" className="mx-auto w-48 md:w-64 mb-4" style={{ filter: 'brightness(1.1)' }} />
            <p
              style={{
                fontFamily: sf,
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 1.47,
                letterSpacing: '-0.374px',
                color: 'rgba(255,255,255,0.48)',
              }}
            >
              The tools you'll use every day inside the 8-week program.
            </p>
          </div>
        </Reveal>

        {/* Feature selector */}
        <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10" role="tablist">
            {brainFeatures.map((f, i) => (
              <button
                key={f.label}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                style={{
                  fontFamily: sf,
                  fontSize: 14,
                  fontWeight: i === active ? 600 : 400,
                  letterSpacing: '-0.224px',
                  color: i === active ? '#fff' : 'rgba(255,255,255,0.48)',
                  background: i === active ? '#1d1d1f' : 'transparent',
                  border: i === active ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                  borderRadius: 980,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                className="hover:text-white"
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Showcase */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ background: '#1d1d1f', borderRadius: 12, overflow: 'hidden' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div style={{ padding: '48px 40px' }}>
                <p
                  style={{
                    fontFamily: sf,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.33,
                    letterSpacing: '-0.12px',
                    color: '#0071e3',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  {feature.label}
                </p>
                <h3
                  style={{
                    fontFamily: sf,
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: '#fff',
                    marginBottom: 12,
                  }}
                >
                  {feature.headline}
                </h3>
                <p
                  style={{
                    fontFamily: sf,
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: 1.47,
                    letterSpacing: '-0.374px',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {feature.sub}
                </p>
              </div>
              <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <img
                  src={feature.img}
                  alt={feature.label}
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: '8px 8px 0 0',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   WHAT'S INCLUDED — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const Included = () => (
  <section style={{ background: '#f5f5f7', padding: '100px 24px' }}>
    <div className="max-w-[980px] mx-auto">
      <Reveal>
        <div className="text-center mb-12">
          <p
            style={{
              fontFamily: sf,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.224px',
              color: 'rgba(0,0,0,0.48)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            What's Included
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { num: '8', unit: 'weekly', detail: 'coaching calls' },
          { num: '8', unit: 'weeks of', detail: 'graded calls' },
          { num: '1', unit: 'documented', detail: 'sales process' },
          { num: '1', unit: 'deployed', detail: 'accountability system' },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '32px 28px',
              }}
            >
              <span
                style={{
                  fontFamily: sf,
                  fontSize: 48,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: '-0.28px',
                  color: '#0071e3',
                }}
              >
                {item.num}
              </span>
              <p
                style={{
                  fontFamily: sf,
                  fontSize: 21,
                  fontWeight: 600,
                  lineHeight: 1.19,
                  letterSpacing: '0.231px',
                  color: '#1d1d1f',
                  marginTop: 4,
                }}
              >
                {item.unit} {item.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   SUCCESS STORY — BLACK
   ══════════════════════════════════════════════════════ */
const SuccessStory = () => (
  <section style={{ background: '#000', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.224px',
            color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Success Story
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: '#fff',
            marginBottom: 8,
          }}
        >
          "He paid attention to my culture first."
        </h2>
        <p
          style={{
            fontFamily: sf,
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: '-0.374px',
            color: 'rgba(255,255,255,0.48)',
            marginBottom: 40,
          }}
        >
          Dan Westrick — Allstate Agency Owner
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="max-w-sm mx-auto" style={{ borderRadius: 12, overflow: 'hidden' }}>
          <iframe
            src="https://fast.wistia.net/embed/iframe/p5r3aelfj0?autoPlay=false&fullscreenButton=true&playButton=true&smallPlayButton=true&volumeControl=true&controlsVisibleOnLoad=true"
            title="Dan Westrick Success Story"
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            className="w-full"
            style={{ aspectRatio: '9/16', border: 'none' }}
          />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PURCHASE + GUARANTEE — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const PurchaseSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const programIncludes = [
    'How to Build a Sales Experience E-Book',
    '8 Monday video trainings',
    '8 Wednesday training documents',
    'Sales team call scoring (4 calls/rep/week, unlimited reps)',
    'Fully deployed Sales Process',
    'Accountability Process document',
    'Consequence Process document',
    '8 1:1 Zoom Calls w/ Agency Owner or Manager',
    'Stack Access',
  ];

  return (
    <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
      <div className="max-w-[600px] mx-auto">
        {/* Purchase card */}
        <Reveal>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
              <p style={{
                fontFamily: sf, fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px',
                color: '#0071e3', textTransform: 'uppercase', marginBottom: 8,
              }}>
                8 Week Sales Mgmt Training
              </p>

              {/* Pricing */}
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <p style={{
                  fontFamily: sf, fontSize: 14, fontWeight: 400, letterSpacing: '-0.224px',
                  color: 'rgba(0,0,0,0.48)', marginBottom: 4,
                }}>
                  Pay in full:
                </p>
                <p style={{
                  fontFamily: sf, fontSize: 48, fontWeight: 600, lineHeight: 1.07,
                  letterSpacing: '-0.28px', color: '#1d1d1f',
                }}>
                  $4,500
                </p>
              </div>
              <div style={{
                width: 48, height: 1, background: 'rgba(0,0,0,0.08)',
                margin: '16px auto',
              }} />
              <div>
                <p style={{
                  fontFamily: sf, fontSize: 14, fontWeight: 400, letterSpacing: '-0.224px',
                  color: 'rgba(0,0,0,0.48)', marginBottom: 4,
                }}>
                  Weekly:
                </p>
                <p style={{
                  fontFamily: sf, fontSize: 28, fontWeight: 600, lineHeight: 1.14,
                  letterSpacing: '0.196px', color: '#1d1d1f',
                }}>
                  $625<span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(0,0,0,0.48)' }}>/week</span>
                </p>
              </div>
            </div>

            {/* Program includes */}
            <div style={{ padding: '0 32px 32px' }}>
              <p style={{
                fontFamily: sf, fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px',
                color: 'rgba(0,0,0,0.48)', textTransform: 'uppercase', marginBottom: 12,
              }}>
                Program Includes:
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {programIncludes.map((item) => (
                  <li key={item} style={{
                    fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43,
                    letterSpacing: '-0.224px', color: '#1d1d1f', padding: '6px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: '#0071e3', fontSize: 14, flexShrink: 0 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantee box */}
            <div style={{
              margin: '0 32px 32px', padding: 24, borderRadius: 8,
              border: '1px solid rgba(0,113,227,0.2)', background: 'rgba(0,113,227,0.03)',
            }}>
              <p style={{
                fontFamily: sf, fontSize: 12, fontWeight: 700, letterSpacing: '0.5px',
                color: '#0071e3', textTransform: 'uppercase', marginBottom: 8,
              }}>
                The Only Guarantee That Matters
              </p>
              <p style={{
                fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43,
                letterSpacing: '-0.224px', color: '#1d1d1f',
              }}>
                If you don't see value after 8 weeks, I'll give you your money back... STRAIGHT UP. Not because the system doesn't work. Because if it doesn't work for you, you weren't working. And I only want money from people who implement. Fact?
              </p>
            </div>

            {/* CTA buttons */}
            <div style={{ padding: '0 32px 32px', display: 'flex', gap: 12 }}>
              <a
                href="https://link.fastpaydirect.com/payment-link/67b9e4c1020837472ed0b709"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff',
                  background: '#0071e3', border: '1px solid transparent', borderRadius: 8,
                  padding: '12px 0', flex: 1, textAlign: 'center', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="hover:brightness-110"
              >
                Secure PIF
              </a>
              <a
                href="https://link.fastpaydirect.com/payment-link/67b9e53c156a771b286e2ca6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#0071e3',
                  background: 'transparent', border: '1px solid #0071e3', borderRadius: 8,
                  padding: '12px 0', flex: 1, textAlign: 'center', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="hover:bg-[#0071e3]/5"
              >
                Secure Weekly
              </a>
            </div>
          </div>
        </Reveal>

        {/* Bottom strategy call CTA */}
        <Reveal>
          <div className="text-center" style={{ marginTop: 32 }}>
            <p style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47,
              letterSpacing: '-0.374px', color: 'rgba(0,0,0,0.48)', marginBottom: 16,
            }}>
              Have questions first?
            </p>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                fontFamily: sf, fontSize: 14, fontWeight: 400, color: '#0066cc',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
              className="hover:underline"
            >
              Book a Strategy Call &gt;
            </button>
            <StandardFitModal open={modalOpen} onOpenChange={setModalOpen} />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
const Footer = () => (
  <footer style={{ background: '#f5f5f7', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
    <div className="max-w-[980px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          style={{
            fontFamily: sf,
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.33,
            letterSpacing: '-0.12px',
            color: 'rgba(0,0,0,0.48)',
          }}
        >
          Copyright &copy; {new Date().getFullYear()} Standard Playbook Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: 'Privacy', to: '/privacy' },
            { label: 'Terms', to: '/terms' },
            { label: 'Contact', to: '/contact' },
          ].map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              {i > 0 && <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: 10 }}>|</span>}
              <Link
                to={link.to}
                style={{
                  fontFamily: sf,
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '-0.12px',
                  color: 'rgba(0,0,0,0.48)',
                  textDecoration: 'none',
                }}
                className="hover:text-[#1d1d1f] transition-colors"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   MOBILE STICKY CTA
   ══════════════════════════════════════════════════════ */
const MobileStickyBookCTA = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-40"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <button
          onClick={() => setModalOpen(true)}
          style={{
            fontFamily: sf,
            fontSize: 17,
            fontWeight: 400,
            color: '#fff',
            background: '#0071e3',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            width: '100%',
            cursor: 'pointer',
          }}
          className="hover:brightness-110 transition-all"
        >
          Book a Strategy Call
        </button>
      </div>
      <StandardFitModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const SalesExperience = () => (
  <div style={{ fontFamily: sf, background: '#000' }}>
    <Nav />
    <Hero />
    <GuaranteeBanner />
    <Problem />
    <Promise />
    <ThreeSystems />
    <AgencyBrainTools />
    <Included />
    <SuccessStory />
    <PurchaseSection />
    <Footer />
    <ContentMeta lastUpdated="March 2026" />
    <MobileStickyBookCTA />
  </div>
);

export default SalesExperience;
