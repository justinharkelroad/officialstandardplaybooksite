import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import DirectiveApplicationModal from '@/components/DirectiveApplicationModal';
import StandardFitModal from '@/components/StandardFitModal';
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
const Hero = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / 1:1 Coaching · Application Only
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 items-start">
        <Reveal className="col-span-12 md:col-span-12 relative z-20">
          <h1 style={{
            fontFamily: display,
            lineHeight: 1, letterSpacing: '-0.02em',
            color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
          }}>
            <span style={{ display: 'block', fontSize: 'clamp(38px, 8vw, 120px)', lineHeight: 0.92 }}>You Know What To Do.</span>
            <span className="block" style={{ color: blue, fontSize: 'clamp(38px, 8vw, 120px)', lineHeight: 0.92 }}>You're Just Not Doing It.</span>
          </h1>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            Private 1:1 coaching for owners who are done circling the same problem. Strategy, accountability, and a hand in the work — so it actually gets installed, not just discussed.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start gap-3 flex-wrap">
          <a href="#pillars"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-black hover:text-white">
            What's Inside
          </a>
          <button onClick={onApply}
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase',
              padding: '15px 28px', border: `1.5px solid ${ink}`, cursor: 'pointer', transition: 'all .25s',
            }}
            className="hover:bg-[#2997FF] hover:border-[#2997FF]">
            Apply Now
          </button>
        </Reveal>
      </div>

      {/* Video */}
      <Reveal delay={0.4}>
        <div className="mt-16">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginBottom: 14,
          }}>
            // The Directive Overview
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
              <VideoPlayer videoId="GWA98sEVrVE" title="The Directive Overview"
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
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'THE DIRECTIVE' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
   PROBLEM — Implementation Gap
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
          fontFamily: display, fontSize: 'clamp(48px, 9vw, 140px)',
          lineHeight: 0.92, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          THE<br />
          <span className="md:pl-[6vw] inline-block">IMPLEMENTATION</span><br />
          <span className="md:pl-[14vw] inline-block">GAP.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 mt-16">
        <Reveal delay={0.15} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85,
          }}>
            You don't have a knowledge problem. You've read the books, watched the calls, bought the course. The strategy is sitting right there. What you have is a gap between knowing and doing — and it's filled with information overload, twelve competing priorities, and the daily grind of running the whole thing largely alone. That's where the good ideas go to die.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="col-span-12 md:col-span-5">
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.65, maxWidth: 440,
          }}>
            You don't need more advice. You need someone in the trenches with you when it's time to execute.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THREE PILLARS — bold list rows, always-on bullets
   ══════════════════════════════════════════════════════ */
const pillars = [
  {
    num: '01',
    label: 'Private 1:1 Coaching',
    headline: "Direct line to Justin.",
    sub: 'Personalized strategy and real-time problem-solving — not a group call where your situation gets a 90-second mention.',
    bullets: [
      'One 2-hour private session every month',
      'Custom strategy, built and deployed',
      'Real-time problem-solving',
      'Performance optimization against your actual numbers',
    ],
  },
  {
    num: '02',
    label: 'Authentic Accountability',
    headline: 'Systematic execution.',
    sub: "Weekly rhythms and monthly course-corrections that keep the work moving when life gets loud.",
    bullets: [
      'Weekly check-in protocol',
      'Monthly mission check-in',
      'Course-correction when you drift',
      'One 2-hour group Boardroom call',
      'Strategy deployed, not filed away',
    ],
  },
  {
    num: '03',
    label: 'Technology & AI',
    headline: <><span style={{ color: blue }}>AI</span> built for your agency.</>,
    sub: <>Custom agents. Custom reporting. Call scoring on the calls you choose to upload. Built 1:1 with the operator who codes the platform — not handed off as a doc and a "good luck."</>,
    bullets: [
      '100 AI-graded calls a month — the calls you pick',
      'Custom AI agent buildouts on your calls',
      'Custom reporting buildouts for your agency',
      'Process optimization end to end',
    ],
  },
];

const PillarsSection = () => (
  <section id="pillars" style={{ background: paper, padding: '40px 24px 120px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16 mt-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / What's Inside
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            INTENSIVE<br />IMPLEMENTATION.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            Three pillars. Built for the owner who already knows the strategy and needs an operator in the room to run it with him.
          </p>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {pillars.map((p, i) => (
          <Reveal key={p.num} delay={i * 0.08}>
            <div style={{ borderBottom: `1px solid ${ink}`, padding: '56px 0' }}>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-5">
                  <span style={{
                    fontFamily: editorial, fontSize: 22, color: ink,
                    opacity: 0.35, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 14,
                  }}>
                    {p.num} / 03
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
                    color: ink, opacity: 0.75, maxWidth: 480,
                  }}>
                    {p.sub}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-7">
                  <ul style={{
                    listStyle: 'none', margin: 0, padding: 0,
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0 32px',
                  }}>
                    {p.bullets.map((b) => (
                      <li key={b} style={{
                        fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
                        color: ink, padding: '14px 0', borderBottom: `1px solid ${ink}1a`,
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                      }}>
                        <span style={{ color: blue, fontSize: 14, lineHeight: '22px', flexShrink: 0, fontWeight: 700 }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THE NUMBERS — bold display stats
   ══════════════════════════════════════════════════════ */
const NumbersSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / The Numbers
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 84px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64,
        }}>
          WHAT YOU GET<br />EVERY MONTH.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${paper}33` }}>
        {[
          { num: '1', unit: 'private', detail: '2-hour 1:1 with Justin' },
          { num: '1', unit: 'group', detail: 'Boardroom session' },
          { num: '100', unit: <><span style={{ color: blue }}>AI</span>-graded</>, detail: 'calls a month, the ones you upload' },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px',
              borderBottom: `1px solid ${paper}33`,
              borderRight: i < 2 ? `1px solid ${paper}33` : 'none',
              display: 'flex', alignItems: 'baseline', gap: 24,
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: display, fontSize: 'clamp(72px, 10vw, 160px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: paper,
              }}>
                {item.num}
              </span>
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(16px, 2.2vw, 24px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper, opacity: 0.85,
                textTransform: 'uppercase', fontWeight: 400,
              }}>
                {item.unit}<br />{item.detail}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   IT'S NOT JUST BUSINESS — values pivot
   ══════════════════════════════════════════════════════ */
const ValuesSection = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, padding: '140px 24px' }}>
    <div className="max-w-[1280px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Truth
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(48px, 9vw, 140px)',
          lineHeight: 0.92, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          IT'S NOT JUST<br />
          <span style={{ color: blue }}>BUSINESS.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.7, marginTop: 32, maxWidth: 640, marginInline: 'auto',
        }}>
          The Directive isn't a coaching program. It's a partnership. The application exists because the work only matters if we're both willing to show up for it — and I don't take on owners who won't.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <button onClick={onApply}
          style={{
            fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em',
            color: '#fff', background: ink, textTransform: 'uppercase',
            padding: '18px 36px', border: `1.5px solid ${ink}`, cursor: 'pointer',
            transition: 'all .25s', marginTop: 36,
          }}
          className="hover:bg-[#2997FF] hover:border-[#2997FF]">
          Apply for The Directive →
        </button>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   GIANT CTA — DIRECT.
   ══════════════════════════════════════════════════════ */
const GiantCTA = ({ onApply }: { onApply: () => void }) => (
  <section onClick={onApply}
    style={{
      background: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
    }}
    role="button" aria-label="Apply for The Directive">
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
          DIRECT.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
        }}>
          Click anywhere &nbsp;→&nbsp; Apply for The Directive
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
            { label: 'Boardroom', href: '/#programs' },
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
const MobileStickyCTA = ({ onApply }: { onApply: () => void }) => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40"
    style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}>
    <button onClick={onApply}
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase',
      }}>
      Apply for The Directive
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldDirective = () => {
  const [applyOpen, setApplyOpen] = useState(false);

  const openApply = () => setApplyOpen(true);

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <BoldNav />
      <Hero onApply={openApply} />
      <MarqueeBands />
      <ProblemSection />
      <PillarsSection />
      <NumbersSection />
      <ValuesSection onApply={openApply} />
      <GiantCTA onApply={openApply} />
      <BoldFooter />
      <ContentMeta lastUpdated="March 2026" />
      <MobileStickyCTA onApply={openApply} />
      <DirectiveApplicationModal open={applyOpen} onOpenChange={setApplyOpen} />
    </div>
  );
};

export default BoldDirective;
