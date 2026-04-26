import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Plus, Minus } from 'lucide-react';
import StandardFitModal from '@/components/StandardFitModal';
import SEOHead from '@/components/SEOHead';
import standardLogo from '@/assets/standard-word-logo.png';

const STORAGE_BASE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';
const salesExpDashImg = `${STORAGE_BASE}/Sales%20Experience%20Dashboard.png`;
const teamMeetingImg = `${STORAGE_BASE}/Team%20%26%20Meeting%20Hub.png`;
const trainingModulesImg = `${STORAGE_BASE}/Training%20Modules%20w%20Feedback.png`;

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const VIMEO_ID = '1184535551';

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
   BUTTONS
   ══════════════════════════════════════════════════════ */
const BookCallButton = ({
  label = 'Book Your Strategy Call',
  onClick,
  size = 'default',
}: {
  label?: string;
  onClick: () => void;
  size?: 'default' | 'large';
}) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: sf,
      fontSize: size === 'large' ? 19 : 17,
      fontWeight: 500,
      color: '#fff',
      background: '#0071e3',
      border: '1px solid transparent',
      borderRadius: 980,
      padding: size === 'large' ? '14px 32px' : '10px 24px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      letterSpacing: '-0.01em',
    }}
    className="hover:brightness-110"
  >
    {label}
  </button>
);

/* ══════════════════════════════════════════════════════
   1. HEADER — LOGO ONLY
   ══════════════════════════════════════════════════════ */
const LogoHeader = () => (
  <header
    style={{
      background: '#000',
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}
    className="flex items-center justify-center"
  >
    <img
      src={standardLogo}
      alt="Standard Playbook"
      style={{ height: 24, width: 'auto' }}
      className="brightness-0 invert opacity-90"
    />
  </header>
);

/* ══════════════════════════════════════════════════════
   2. HERO — BLACK, VSL, SINGLE CTA
   ══════════════════════════════════════════════════════ */
const HeroSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section
    style={{
      background: '#000',
      padding: '60px 24px 100px',
    }}
  >
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <h1
          style={{
            fontFamily: sf,
            fontSize: 'clamp(36px, 6.5vw, 56px)',
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

      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(17px, 2.4vw, 21px)',
            fontWeight: 400,
            lineHeight: 1.38,
            letterSpacing: '0.011em',
            color: 'rgba(255,255,255,0.72)',
            marginTop: 20,
            maxWidth: 720,
            marginInline: 'auto',
          }}
        >
          The 8-Week Sales Management Experience — built for Allstate, Farmers,
          and State Farm agency owners who are tired of being their own sales manager.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div
          style={{
            marginTop: 40,
            borderRadius: 18,
            overflow: 'hidden',
            background: '#111',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            maxWidth: 860,
            marginInline: 'auto',
            aspectRatio: '16 / 9',
          }}
        >
          <iframe
            src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&muted=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="8-Week Sales Management Experience"
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-10">
          <BookCallButton onClick={onBookCall} size="large" />
        </div>
      </Reveal>

      <Reveal delay={0.4}>
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8"
          style={{
            fontFamily: sf,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '-0.01em',
          }}
        >
          <span className="flex items-center gap-2">
            <Check size={16} color="#2997ff" /> 45-minute call with Justin
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} color="#2997ff" /> No pitch deck
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} color="#2997ff" /> Money-back guarantee
          </span>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   3. THE PROBLEM — BLACK
   ══════════════════════════════════════════════════════ */
const ProblemSection = () => (
  <section style={{ background: '#000', padding: '120px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase', marginBottom: 16,
          }}
        >
          The Problem
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(32px, 5.5vw, 48px)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#fff',
            margin: 0,
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
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 500,
            lineHeight: 1.25,
            color: '#2997ff',
            marginTop: 24,
          }}
        >
          That's not a sales team. That's a coin flip.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   4. THE PROMISE — WHITE
   ══════════════════════════════════════════════════════ */
const PromiseSection = () => (
  <section style={{ background: '#fff', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase', marginBottom: 16,
          }}
        >
          The Promise
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(32px, 5.5vw, 48px)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#1d1d1f',
            margin: 0,
          }}
        >
          In 8 weeks, the framework is installed. The rhythm is running. Your team is operating from it.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(18px, 2.6vw, 22px)',
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'rgba(0,0,0,0.65)',
            marginTop: 20,
          }}
        >
          A process. A scorecard. A rhythm. A guarantee.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   5. THREE SYSTEMS — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const systems = [
  {
    title: 'Sales Process',
    body: 'A documented, repeatable call framework. Your entire team follows the same playbook.',
  },
  {
    title: 'Accountability Framework',
    body: 'Weekly rhythm, scorecards, clear expectations. No more winging it.',
  },
  {
    title: 'Consequence Ladder',
    body: "A clear progression for when someone misses the standard — built by you, for your culture. No templates forced on your team.",
  },
];

const SystemsSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
    <div className="max-w-[1100px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            What You Walk Away With
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1d1d1f', margin: 0,
          }}>
            Three systems. Installed.
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systems.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div
              style={{
                background: '#fff',
                borderRadius: 18,
                padding: 36,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'transform 0.3s ease',
              }}
              className="hover:-translate-y-1"
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(0,113,227,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: sf, fontSize: 16, fontWeight: 600, color: '#0071e3',
              }}>
                {i + 1}
              </div>
              <h3 style={{
                fontFamily: sf, fontSize: 22, fontWeight: 600,
                letterSpacing: '-0.01em', color: '#1d1d1f', margin: 0,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: sf, fontSize: 16, fontWeight: 400,
                lineHeight: 1.5, color: 'rgba(0,0,0,0.65)', margin: 0,
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
   6. HOW IT WORKS — BLACK
   ══════════════════════════════════════════════════════ */
const weekly = [
  { when: 'Every Monday', body: 'A training video drops. Short, tactical, watchable in 20 minutes.' },
  { when: 'Every Wednesday', body: 'A training document lands. Scripts, frameworks, and the exact words to use.' },
  { when: 'Every Friday', body: "Your sales team runs a discovery flow and declares the week's takeaways." },
  { when: 'Every week', body: 'A 1:1 Zoom call with Justin — for you, or for your sales manager.' },
  { when: 'Every week', body: "We grade 4 of your team's calls. Each rep. Every week. Unlimited reps." },
  { when: 'By week 8', body: 'Your sales process is documented. Your consequence ladder is installed. Your team is on the system.' },
];

const HowItWorksSection = () => (
  <section style={{ background: '#000', padding: '120px 24px' }}>
    <div className="max-w-[1100px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            How It Works
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: 0,
          }}>
            Here's what 8 weeks inside Standard looks like.
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekly.map((w, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 24,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <p style={{
                fontFamily: sf, fontSize: 12, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#2997ff', margin: 0,
              }}>
                {w.when}
              </p>
              <p style={{
                fontFamily: sf, fontSize: 15, fontWeight: 400,
                lineHeight: 1.45, color: 'rgba(255,255,255,0.85)', margin: 0,
              }}>
                {w.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   6b. WHAT'S INCLUDED — WHITE
   ══════════════════════════════════════════════════════ */
const deliverables = [
  { qty: '8', label: 'Monday training videos', sub: 'Short, tactical, watchable in 20 minutes.' },
  { qty: '8', label: 'Wednesday playbook documents', sub: 'Scripts, frameworks, and the exact words to use.' },
  { qty: '8', label: 'Friday team discovery flows', sub: "Run by your team to declare the week's takeaways." },
  { qty: '8', label: '1:1 coaching calls with Justin', sub: 'For you, or for your sales manager. 45 minutes.' },
  { qty: '32+', label: 'Graded calls per rep', sub: '4 per rep, every week. Unlimited reps.' },
  { qty: '40+', label: 'Full access to Agency Brain', sub: 'Sequencing, weekly debriefs, Core Four tracking, and unlimited trainings.' },
];

const WhatsIncludedSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: '#fff', padding: '120px 24px' }}>
    <div className="max-w-[1100px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            What's Included
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1d1d1f', margin: 0,
          }}>
            Every deliverable. In writing.
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliverables.map((d, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06}>
            <div
              style={{
                background: '#f5f5f7',
                borderRadius: 18,
                padding: 28,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <span style={{
                fontFamily: sf, fontSize: 44, fontWeight: 600,
                lineHeight: 1, letterSpacing: '-0.03em',
                color: '#0071e3',
              }}>
                {d.qty}
              </span>
              <p style={{
                fontFamily: sf, fontSize: 18, fontWeight: 600,
                color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em',
              }}>
                {d.label}
              </p>
              <p style={{
                fontFamily: sf, fontSize: 14, fontWeight: 400,
                lineHeight: 1.5, color: 'rgba(0,0,0,0.6)', margin: 0,
              }}>
                {d.sub}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div
          style={{
            marginTop: 40,
            padding: '28px 32px',
            borderRadius: 18,
            background: '#000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: sf, fontSize: 13, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#2997ff', margin: 0, marginBottom: 6,
            }}>
              By Week 8
            </p>
            <p style={{
              fontFamily: sf, fontSize: 17, fontWeight: 500,
              lineHeight: 1.4, color: '#fff', margin: 0,
            }}>
              Your sales process, accountability framework, and consequence
              ladder &mdash; documented, installed, and running.
            </p>
          </div>
          <BookCallButton onClick={onBookCall} />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7. TOOLS PREVIEW — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const tools = [
  { label: 'Dashboard', title: 'See the whole agency at a glance.', img: salesExpDashImg },
  { label: 'Team Hub', title: 'Run your weekly rhythm in one place.', img: teamMeetingImg },
  { label: 'Training', title: 'Graded calls, feedback, and reps.', img: trainingModulesImg },
];

const ToolsSection = () => (
  <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
    <div className="max-w-[1100px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            The Platform
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1d1d1f', margin: 0,
          }}>
            Built to run the system.
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.08}>
            <div
              style={{
                background: '#fff',
                borderRadius: 18,
                padding: 24,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                overflow: 'hidden',
              }}
            >
              <div>
                <p style={{
                  fontFamily: sf, fontSize: 12, fontWeight: 600,
                  letterSpacing: '-0.12px', color: '#0071e3',
                  textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {t.label}
                </p>
                <h3 style={{
                  fontFamily: sf, fontSize: 20, fontWeight: 600,
                  letterSpacing: '-0.01em', color: '#1d1d1f', margin: 0,
                }}>
                  {t.title}
                </h3>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#f5f5f7',
                  aspectRatio: '16 / 10',
                }}
              >
                <img
                  src={t.img}
                  alt={t.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   8. TESTIMONIALS — BLACK, VIDEO + TEXT GRID
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
  <section style={{ background: '#000', padding: '120px 24px' }}>
    <div className="max-w-[1100px] mx-auto">
      <div className="max-w-[980px] mx-auto text-center">
        <Reveal>
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase', marginBottom: 16,
          }}>
            Testimonials
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: 0,
          }}>
            What owners are saying.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="max-w-sm mx-auto" style={{ borderRadius: 12, overflow: 'hidden', marginTop: 48 }}>
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
        <Reveal delay={0.3}>
          <p style={{
            fontFamily: sf, fontSize: 19, fontWeight: 600,
            lineHeight: 1.3, letterSpacing: '-0.022em',
            color: '#fff', marginTop: 24, marginBottom: 4,
          }}>
            "He paid attention to my culture first."
          </p>
          <p style={{
            fontFamily: sf, fontSize: 15, fontWeight: 400,
            lineHeight: 1.47, letterSpacing: '-0.224px',
            color: 'rgba(255,255,255,0.48)', margin: 0,
          }}>
            Dan Westrick &mdash; Allstate Agency Owner
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" style={{ marginTop: 80 }}>
        {textTestimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 32,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p style={{
                fontFamily: sf, fontSize: 16, fontWeight: 400,
                lineHeight: 1.55, letterSpacing: '-0.022em',
                color: 'rgba(255,255,255,0.85)',
                margin: 0, flex: 1,
              }}>
                "{t.quote}"
              </p>
              <div style={{ marginTop: 24 }}>
                <p style={{
                  fontFamily: sf, fontSize: 15, fontWeight: 600,
                  letterSpacing: '-0.022em', color: '#fff', margin: 0,
                }}>
                  {t.name}
                </p>
                <p style={{
                  fontFamily: sf, fontSize: 14, fontWeight: 400,
                  letterSpacing: '-0.022em', color: 'rgba(255,255,255,0.48)',
                  margin: 0, marginTop: 2,
                }}>
                  {t.location}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   9. WHO THIS IS / IS NOT FOR — BLACK
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
  <section style={{ background: '#000', padding: '120px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="max-w-[1100px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            Fit Check
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: 0,
          }}>
            Is this for you?
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 36,
              height: '100%',
            }}
          >
            <h3 style={{
              fontFamily: sf, fontSize: 22, fontWeight: 600,
              color: '#fff', margin: 0, marginBottom: 20,
            }}>
              This is NOT for you if:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {notFor.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: sf, fontSize: 16, lineHeight: 1.45,
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}
                >
                  <X size={20} color="#ff453a" style={{ flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            style={{
              background: 'rgba(0,113,227,0.08)',
              border: '1px solid rgba(0,113,227,0.3)',
              borderRadius: 18,
              padding: 36,
              height: '100%',
            }}
          >
            <h3 style={{
              fontFamily: sf, fontSize: 22, fontWeight: 600,
              color: '#fff', margin: 0, marginBottom: 20,
            }}>
              This IS for you if:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {forYou.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: sf, fontSize: 16, lineHeight: 1.45,
                    color: 'rgba(255,255,255,0.9)',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}
                >
                  <Check size={20} color="#2997ff" style={{ flexShrink: 0, marginTop: 2 }} />
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
   10. GUARANTEE — LIGHT GRAY WITH GOLD SEAL
   ══════════════════════════════════════════════════════ */
const GuaranteeSection = () => (
  <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 28,
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%', position: 'relative',
            background: 'linear-gradient(145deg, #d4a843, #f5d673, #c4952a)',
            boxShadow: '0 0 0 4px #f5f5f7, 0 0 0 6px #c4952a, 0 0 40px rgba(212,168,67,0.25)',
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

          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1d1d1f', margin: 0,
          }}>
            The only guarantee that matters.
          </h2>

          <div style={{
            fontFamily: sf, fontSize: 'clamp(17px, 2.4vw, 20px)', fontWeight: 400,
            lineHeight: 1.55, color: 'rgba(0,0,0,0.7)', maxWidth: 640,
          }}>
            <p style={{ margin: 0 }}>
              The program is backed by a full money-back guarantee. Stay in the 8 weeks,
              do the work, and if you want your money back &mdash; ask. You'll get it.
            </p>
            <p style={{ marginTop: 14 }}>
              The guarantee isn't there because this is a silver bullet. It's there because
              what you do inside the 8 weeks determines what you get out of it. The refund
              is yours either way.
            </p>
            <p style={{ marginTop: 14, color: '#1d1d1f', fontWeight: 500 }}>
              I only want money from people who implement.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   11. FAQ — WHITE
   ══════════════════════════════════════════════════════ */
const faqs = [
  {
    q: 'How much time per week does this take?',
    a: "The owner or sales manager commits about 2 hours per week — one 45-minute coaching call, plus time reviewing your team's graded calls, walking through the week's processes, and making sure the training content is being adhered to.",
  },
  {
    q: 'Do I run the 1:1 calls or does my sales manager?',
    a: 'Either one. You pick who needs the coaching more — the owner or the manager. Many agencies do both and split the weekly call.',
  },
  {
    q: "What if I don't have a sales manager yet?",
    a: 'Then this will help you hire one correctly and install the system before you promote someone. I can tell you on the strategy call if the 8-Week is the right fit for where you are, or if something else makes more sense first.',
  },
  {
    q: 'What size agency does this work for?',
    a: 'Anywhere from 2-person agencies to 20+ person operations. Bigger teams tend to get more leverage from the weekly accountability rhythm — more producers to grade, more pressure points to work on.',
  },
  {
    q: 'What if my sales manager quits halfway through?',
    a: 'You keep every document, every process, every training. The system lives inside your agency, not inside one person. If they quit, you onboard the next person onto a process that already exists.',
  },
  {
    q: 'Does this work for State Farm, Farmers, or independent agencies — or just Allstate?',
    a: "The sales process, accountability framework, and consequence ladder work across any captive or independent. The training examples lean Allstate because that's where I spent 20 years — but the mechanics are the same across carriers. Most of my current clients are Allstate; I'm also actively coaching Farmers and State Farm owners.",
  },
  {
    q: 'What does "graded calls" actually mean?',
    a: 'Four calls per rep per week get scored by Standard against a rubric. Your rep sees exactly where they scored, what they missed, and what to do differently. Unlimited reps — if you have 3 producers or 13, every one of them gets graded calls every week.',
  },
];

const FAQItem = ({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) => (
  <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '28px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        textAlign: 'left',
        fontFamily: sf,
      }}
    >
      <span style={{
        fontSize: 'clamp(17px, 2.2vw, 20px)', fontWeight: 500,
        color: '#1d1d1f', letterSpacing: '-0.01em',
      }}>
        {faq.q}
      </span>
      <span style={{ flexShrink: 0, color: '#0071e3' }}>
        {isOpen ? <Minus size={22} /> : <Plus size={22} />}
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ overflow: 'hidden' }}
        >
          <p style={{
            fontFamily: sf, fontSize: 17, fontWeight: 400,
            lineHeight: 1.5, color: 'rgba(0,0,0,0.65)',
            margin: 0, paddingBottom: 28, maxWidth: 760,
          }}>
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section style={{ background: '#fff', padding: '120px 24px' }}>
      <div className="max-w-[880px] mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <p style={{
              fontFamily: sf, fontSize: 14, fontWeight: 600,
              letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Questions
            </p>
            <h2 style={{
              fontFamily: sf, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600,
              lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1d1d1f', margin: 0,
            }}>
              Answers.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   12. FINAL CTA — BLACK
   ══════════════════════════════════════════════════════ */
const FinalCTASection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section style={{ background: '#000', padding: '140px 24px' }}>
    <div className="max-w-[880px] mx-auto text-center">
      <Reveal>
        <h2 style={{
          fontFamily: sf, fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 600,
          lineHeight: 1.07, letterSpacing: '-0.02em', color: '#fff', margin: 0,
        }}>
          Ready to stop being the sales manager?
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: sf, fontSize: 'clamp(18px, 2.6vw, 22px)', fontWeight: 400,
          lineHeight: 1.4, color: 'rgba(255,255,255,0.7)', marginTop: 20,
        }}>
          Book a 45-minute strategy call with Justin.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: sf, fontSize: 17, fontWeight: 400,
          lineHeight: 1.5, color: 'rgba(255,255,255,0.55)',
          marginTop: 24, maxWidth: 620, marginInline: 'auto',
        }}>
          No pitch deck. No pressure. We'll figure out together if this is the
          right fit for your agency.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="mt-10">
          <BookCallButton onClick={onBookCall} size="large" />
        </div>
      </Reveal>
      <Reveal delay={0.4}>
        <p style={{
          fontFamily: sf, fontSize: 14, fontWeight: 400,
          color: 'rgba(255,255,255,0.45)', marginTop: 24,
        }}>
          Money-back guarantee. Built for Allstate, Farmers, and State Farm agency owners.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   13. MINIMAL FOOTER
   ══════════════════════════════════════════════════════ */
const MinimalFooter = () => (
  <footer style={{
    background: '#f5f5f7', borderTop: '1px solid rgba(0,0,0,0.08)',
    padding: '24px',
  }}>
    <div className="max-w-[980px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <p style={{
        fontFamily: sf, fontSize: 12, fontWeight: 400, lineHeight: 1.33,
        letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)', margin: 0,
      }}>
        A Standard Playbook program. Copyright &copy; {new Date().getFullYear()} Standard Playbook Inc. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        <Link
          to="/privacy"
          style={{
            fontFamily: sf, fontSize: 12, fontWeight: 400,
            letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)', textDecoration: 'none',
          }}
          className="hover:text-[#1d1d1f] transition-colors"
        >
          Privacy
        </Link>
        <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: 10 }}>|</span>
        <Link
          to="/terms"
          style={{
            fontFamily: sf, fontSize: 12, fontWeight: 400,
            letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)', textDecoration: 'none',
          }}
          className="hover:text-[#1d1d1f] transition-colors"
        >
          Terms
        </Link>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const EightWeekApply = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);

  return (
    <div style={{ fontFamily: sf, background: '#000' }}>
      <SEOHead />
      <LogoHeader />
      <HeroSection onBookCall={openBooking} />
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

export default EightWeekApply;
