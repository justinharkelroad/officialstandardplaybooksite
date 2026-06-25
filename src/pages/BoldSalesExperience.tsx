import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
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

/* ── Type stacks ───────────────────────────────────────── */
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
const Hero = ({ autoOpenBooking = false }: { autoOpenBooking?: boolean }) => {
  const [open, setOpen] = useState(autoOpenBooking);

  return (
    <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / 8-Week Experience
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-6 md:gap-6 items-start relative">
          <Reveal className="col-span-12 md:col-span-9 relative z-20">
            <h1 style={{
              fontFamily: display,
              fontSize: 'clamp(40px, 10vw, 180px)',
              lineHeight: 0.9, letterSpacing: '-0.02em',
              color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
            }}>
              STOP MANAGING<br />
              <span className="md:pl-[4vw] inline-block">CHAOS. START</span><br />
              <span className="md:pl-[12vw] inline-block">RUNNING A SYSTEM.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15} className="col-span-12 md:col-span-3 relative z-10 mt-12 md:mt-0 max-w-[70%] md:max-w-none mx-auto md:mx-0">
            <motion.div
              initial={{ rotate: 6, y: 20 }}
              animate={{ rotate: 6 }}
              className="md:[transform:rotate(11deg)]"
              style={{
                position: 'relative', aspectRatio: '3 / 4',
                background: ink, overflow: 'hidden',
                boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
              }}>
              <img src="/8-week-hero.jpg" alt="8 Week Experience"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)' }} />
            </motion.div>
          </Reveal>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-12">
          <Reveal delay={0.25} className="col-span-12 md:col-span-6">
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, textTransform: 'uppercase', lineHeight: 1.6, maxWidth: 460,
            }}>
              8 weeks. A documented sales process, an accountability framework, and a consequence ladder — installed in your agency. The framework, the software, and the <span style={{ color: blue }}>AI</span> that grades the calls you upload. Built by the operator who runs it.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="col-span-12 md:col-span-6 flex md:justify-end items-center gap-3">
            <a href="#whats-included"
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
                color: ink, textTransform: 'uppercase', textDecoration: 'none',
                padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
              }}
              className="hover:bg-black hover:text-white">
              Learn More
            </a>
            <button onClick={() => setOpen(true)}
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
                color: '#fff', background: ink, textTransform: 'uppercase',
                padding: '15px 28px', border: `1.5px solid ${ink}`, cursor: 'pointer', transition: 'all .25s',
              }}
              className="hover:bg-[#2997FF] hover:border-[#2997FF]">
              Book a Strategy Call
            </button>
          </Reveal>
        </div>

        <StandardFitModal open={open} onOpenChange={setOpen} />
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'STANDARD PLAYBOOK' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="8 WEEK EXPERIENCE" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="8 WEEK EXPERIENCE" />
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
   GUARANTEE BAND — bold black with seal
   ══════════════════════════════════════════════════════ */
const GuaranteeBand = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-center">
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
            RESULTS<br />OR YOU<br />DON'T PAY.
          </h2>
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: paper, opacity: 0.75, marginTop: 24, maxWidth: 640,
          }}>
            After 8 weeks you walk away with a documented sales process, an accountability framework, and a consequence ladder installed in your agency. If you don't have a clear path forward, you get every dollar back. No questions, no hoops.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {['Sales Process', 'Accountability Framework', 'Consequence Ladder'].map((item) => (
              <span key={item} style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                color: paper, textTransform: 'uppercase',
                border: `1px solid ${paper}40`, padding: '10px 16px',
              }}>
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PROBLEM — staggered editorial
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
          textTransform: 'uppercase', marginTop: 48, fontWeight: 400,
          maxWidth: 900,
        }}>
          THAT'S NOT A SALES TEAM.<br />THAT'S A COIN FLIP.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PROMISE — black band
   ══════════════════════════════════════════════════════ */
const PromiseSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto text-left">
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
          fontFamily: display, fontSize: 'clamp(40px, 9vw, 140px)',
          lineHeight: 0.9, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          IN 8 WEEKS,<br />
          <span className="md:pl-[8vw] inline-block">YOU'LL HAVE</span><br />
          <span className="md:pl-[14vw] inline-block" style={{ color: blue }}>CERTAINTY.</span>
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
   THREE SYSTEMS — bold list with side images
   ══════════════════════════════════════════════════════ */
const systems = [
  {
    num: '01',
    label: 'Sales Process',
    headline: 'A documented, repeatable call framework.',
    sub: 'Your whole team runs the same playbook — no more winging it. Every call has a structure, every objection has a response.',
    img: salesProcessCardImg,
  },
  {
    num: '02',
    label: 'Accountability',
    headline: <>Daily tracking. Weekly scorecards. <span style={{ color: blue }}>AI</span>-graded calls.</>,
    sub: 'Every producer knows exactly where they stand. Managers coach off data, not a gut feeling.',
    img: accountabilityCardImg,
  },
  {
    num: '03',
    label: 'Consequence Ladder',
    headline: "A clear path when standards aren't met.",
    sub: 'Underperformance gets addressed, not ignored — a fair, transparent escalation your team actually respects.',
    img: consequenceLadderCardImg,
  },
];

const SystemsSection = () => (
  <section id="whats-included" style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
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
            THREE SYSTEMS.<br />ZERO GUESSWORK.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            The three things installed inside your agency by the end of week eight.
          </p>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {systems.map((s, i) => {
          const tilts = [-7, 6, -5];
          const reverse = i % 2 === 1;
          return (
            <Reveal key={s.num} delay={i * 0.08}>
              <div style={{
                borderBottom: `1px solid ${ink}`,
                padding: '64px 0',
              }}>
                <div className={`grid grid-cols-12 gap-8 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
                  <div className={`col-span-12 md:col-span-7 ${reverse ? 'md:[direction:ltr]' : ''}`}>
                    <span style={{
                      fontFamily: editorial, fontSize: 22, color: ink,
                      opacity: 0.35, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 14,
                    }}>
                      {s.num} / 03
                    </span>
                    <p style={{
                      fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                      color: blue, textTransform: 'uppercase', marginBottom: 14,
                    }}>
                      {s.label}
                    </p>
                    <h3 style={{
                      fontFamily: display, fontSize: 'clamp(32px, 4.6vw, 64px)',
                      lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
                      textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18,
                    }}>
                      {s.headline}
                    </h3>
                    <p style={{
                      fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                      color: ink, opacity: 0.75, maxWidth: 560,
                    }}>
                      {s.sub}
                    </p>
                  </div>

                  <div className={`col-span-12 md:col-span-5 ${reverse ? 'md:[direction:ltr]' : ''}`}>
                    <motion.div
                      whileHover={{ rotate: 0, scale: 1.03 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: '#fff', padding: '14px 14px 22px',
                        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35)',
                        transform: `rotate(${tilts[i]}deg)`,
                        maxWidth: 460, marginInline: 'auto',
                      }}
                    >
                      <div style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: '#eee' }}>
                        <img src={s.img} alt={s.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <p style={{
                        fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                        color: ink, textTransform: 'uppercase', marginTop: 14, textAlign: 'center',
                      }}>
                        {s.label}
                      </p>
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
   AGENCY BRAIN BAND — 3 tilted polaroids on black
   ══════════════════════════════════════════════════════ */
const brainFeatures = [
  { label: 'Dashboard', headline: 'Total Visibility.', sub: 'Premium, policies, activity — one view.', img: salesExpDashImg, tilt: -8 },
  { label: 'Team Hub', headline: 'Team & Meeting Hub.', sub: 'Centralized meetings, collaboration, comms.', img: teamMeetingImg, tilt: 7 },
  { label: 'Training', headline: 'Training & Feedback.', sub: 'Modules unlock Mon/Wed. Friday discovery feedback to the manager.', img: trainingModulesImg, tilt: -6 },
];

const AgencyBrainBand = () => (
  <section style={{ background: ink, color: paper, padding: '120px 0', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Tools You'll Use Daily
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <img src={agencyBrainLogo} alt="Agency Brain"
          style={{ height: 'clamp(40px, 6vw, 72px)', width: 'auto', filter: 'invert(1)', marginBottom: 16 }} />
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.65,
          color: paper, opacity: 0.75, maxWidth: 620,
        }}>
          Agency Brain isn't a third-party tool I bolted on. I build it. Pick the calls that matter, upload them, and the <span style={{ color: blue }}>AI</span> scores them against your team's standard. The gaps become impossible to ignore.
        </p>
      </Reveal>
    </div>

    <div style={{ marginTop: 64 }}>
      <Reveal>
        <div style={{
          color: paper, whiteSpace: 'nowrap', overflow: 'hidden',
          transform: 'rotate(-2deg)', width: '120%', marginLeft: '-10%',
          borderTop: `1px solid ${paper}1a`, borderBottom: `1px solid ${paper}1a`,
          padding: '24px 0', background: ink,
        }}>
          <div style={{
            display: 'inline-block', animation: 'sp-marquee 38s linear infinite',
            fontFamily: display, fontSize: 'clamp(48px, 10vw, 140px)', fontWeight: 400,
            letterSpacing: '-0.01em', lineHeight: 1, textTransform: 'uppercase',
          }}>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
            <span style={{ paddingRight: 80 }}>SOFTWARE IS LEVERAGE</span>
          </div>
        </div>
      </Reveal>
    </div>

    <div className="px-6 md:px-10 max-w-[1280px] mx-auto" style={{ marginTop: 80 }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {brainFeatures.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.08}>
            <motion.div
              whileHover={{ rotate: 0, scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#fff', padding: '14px 14px 22px',
                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
                transform: `rotate(${f.tilt}deg)`,
              }}
            >
              <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: '#eee' }}>
                <img src={f.img} alt={f.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: 16 }}>
                <p style={{
                  fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                  color: blue, textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {f.label}
                </p>
                <h4 style={{
                  fontFamily: display, fontSize: 22, lineHeight: 1.05, letterSpacing: '-0.01em',
                  color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
                }}>
                  {f.headline}
                </h4>
                <p style={{
                  fontFamily: body, fontSize: 13, fontWeight: 400, lineHeight: 1.55,
                  color: ink, opacity: 0.7, marginTop: 8,
                }}>
                  {f.sub}
                </p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   INCLUDED — 4 giant numbers
   ══════════════════════════════════════════════════════ */
const Included = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / What's Included
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 84px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64,
        }}>
          THE NUMBERS.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {[
          { num: '8', unit: 'weekly', detail: 'coaching calls' },
          { num: '8', unit: 'weeks of', detail: 'graded calls' },
          { num: '1', unit: 'documented', detail: 'sales process' },
          { num: '1', unit: 'deployed', detail: 'accountability system' },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div style={{
              padding: '40px 24px',
              borderBottom: `1px solid ${ink}`,
              borderRight: i % 2 === 0 ? `1px solid ${ink}` : 'none',
              display: 'flex', alignItems: 'baseline', gap: 24,
            }}>
              <span style={{
                fontFamily: display, fontSize: 'clamp(80px, 12vw, 180px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
              }}>
                {item.num}
              </span>
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(18px, 2.6vw, 28px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
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
   SUCCESS STORY
   ══════════════════════════════════════════════════════ */
const SuccessStory = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-8 items-center">
        <Reveal className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / Success Story
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 6.5vw, 92px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            "HE PAID ATTENTION<br />TO MY CULTURE<br />FIRST."
          </h2>
          <p style={{
            fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.16em',
            color: paper, opacity: 0.7, textTransform: 'uppercase', marginTop: 28,
          }}>
Dan Westrick, Allstate Agency Owner
          </p>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 md:col-span-5">
          <div style={{
            background: '#000', padding: 12, transform: 'rotate(5deg)',
            boxShadow: '0 36px 70px -18px rgba(0,0,0,0.65)',
            maxWidth: 360, marginLeft: 'auto',
          }}>
            <video
              src="/video/westrick-testimonial.mp4"
              poster="/video/westrick-testimonial-poster.jpg"
              controls
              playsInline
              preload="metadata"
              title="Dan Westrick Success Story"
              className="w-full"
              style={{ aspectRatio: '9/16', border: 'none', display: 'block', background: '#000' }}
            />
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-8" style={{ marginTop: 96 }}>
        {[
          {
            quote: "I've learned a lot from this process — a lot about myself as a manager and leader as well. I feel that I can move forward a lot more confidently knowing what questions to ask myself and being a bit more inquisitive rather than jumping into action that may not be the most efficient or produce the best outcome. You've really taught me not just to think but how to think in just 7 hours which is wild.",
            name: 'Mike V.',
          },
          {
            quote: "Creating and enforcing a standard is something every leader needs help with. Working with Justin was a game changer — you don't realize what you're missing until you have someone who truly understands your challenges and helps deliver results that matter. Accountability was something I struggled to implement, but once we established and enforced our own standards, it forced everyone to level up.",
            name: 'Luis S.',
          },
          {
            quote: "Working with Justin over the 8-week training was eye-opening and transformative — he showed me how to become a stronger, more accountable leader for my team and can truly bulletproof your agency, as long as you're able to hold yourself accountable as well.",
            name: 'Jonas B.',
          },
        ].map((t, i) => (
          <Reveal key={t.name} delay={0.1 + i * 0.1} className="col-span-12 md:col-span-4">
            <figure style={{
              height: '100%',
              background: 'rgba(255,255,255,0.04)',
              borderTop: `2px solid ${blue}`,
              padding: '32px 28px',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <blockquote style={{
                fontFamily: body, fontSize: 16, lineHeight: 1.6,
                color: paper, opacity: 0.92, margin: 0, flex: 1,
              }}>
                "{t.quote}"
              </blockquote>
              <figcaption style={{
                fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em',
                color: paper, opacity: 0.7, textTransform: 'uppercase', marginTop: 24,
              }}>
                — {t.name}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PURCHASE SECTION — bold pricing block
   ══════════════════════════════════════════════════════ */
const PurchaseSection = () => {
  const [open, setOpen] = useState(false);

  const programIncludes = [
    'How to Build a Sales Experience e-book',
    '8 Monday video trainings',
    '8 Wednesday training documents',
    'Sales-team call scoring (4 calls/rep/week, unlimited reps)',
    'Fully deployed Sales Process',
    'Accountability Process document',
    'Consequence Process document',
    '8 1:1 Zoom calls with agency owner or manager',
    'Stack access',
  ];

  return (
    <section id="purchase" style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 28,
          }}>
            / Lock It In
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-8">
          {/* Left: massive price */}
          <Reveal className="col-span-12 md:col-span-7">
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, opacity: 0.6, textTransform: 'uppercase', marginBottom: 12,
            }}>
              8-Week Sales Mgmt Training · Pay In Full
            </p>
            <div style={{ position: 'relative', display: 'inline-block', paddingBottom: 8 }}>
              <h2 style={{
                fontFamily: display, fontSize: 'clamp(72px, 18vw, 260px)',
                lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
                margin: 0, fontWeight: 400, position: 'relative', zIndex: 1,
              }}>
                $4,500
              </h2>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(22px, 2.8vw, 40px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: blue,
                margin: 0, marginTop: 16,
                fontWeight: 400, textTransform: 'uppercase',
                position: 'relative', zIndex: 2,
              }}>
                or $625 / week
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="https://link.fastpaydirect.com/payment-link/67b9e4c1020837472ed0b709"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#fff', background: ink, textTransform: 'uppercase',
                  padding: '16px 30px', textDecoration: 'none', transition: 'all .25s',
                }}
                className="hover:bg-[#2997FF]"
              >
                Secure PIF →
              </a>
              <a
                href="https://link.fastpaydirect.com/payment-link/67b9e53c156a771b286e2ca6"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                  color: ink, background: 'transparent', textTransform: 'uppercase',
                  padding: '15px 28px', border: `1.5px solid ${ink}`, textDecoration: 'none', transition: 'all .25s',
                }}
                className="hover:bg-black hover:text-white"
              >
                Secure Weekly →
              </a>
            </div>

            <button
              onClick={() => setOpen(true)}
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.14em',
                color: ink, opacity: 0.7, background: 'none', border: 'none', cursor: 'pointer',
                padding: '24px 0 0', textTransform: 'uppercase', textDecoration: 'underline',
              }}
              className="hover:opacity-100"
            >
              Questions first? Book a strategy call →
            </button>
            <StandardFitModal open={open} onOpenChange={setOpen} />
          </Reveal>

          {/* Right: includes + guarantee */}
          <div className="col-span-12 md:col-span-5">
            <Reveal>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: ink, textTransform: 'uppercase', marginBottom: 14,
              }}>
                // Program Includes
              </p>
              <ul style={{
                listStyle: 'none', margin: 0, padding: 0,
                borderTop: `1px solid ${ink}`,
              }}>
                {programIncludes.map((item) => (
                  <li key={item} style={{
                    fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.5,
                    color: ink, padding: '12px 0', borderBottom: `1px solid ${ink}1a`,
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <span style={{ color: blue, fontSize: 14, lineHeight: '21px', flexShrink: 0, fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{
                marginTop: 28,
                background: ink,
                color: paper,
                padding: '28px 24px',
              }}>
                <p style={{
                  fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                  color: blue, textTransform: 'uppercase', marginBottom: 12,
                }}>
                  ★ The Only Guarantee That Matters
                </p>
                <p style={{
                  fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                  color: paper, opacity: 0.85,
                }}>
                  If you don't see value after 8 weeks, I'll give you your money back. Straight up. Not because the system doesn't work — because if it didn't work for you, you weren't working. I only want money from people who implement. Fact?
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

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
const MobileStickyCTA = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40"
        style={{
          background: ink, padding: '12px 16px',
          borderTop: `1px solid ${paper}33`,
        }}>
        <button onClick={() => setOpen(true)}
          style={{
            fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
            color: ink, background: paper, padding: '14px 0', width: '100%',
            border: 'none', cursor: 'pointer', textTransform: 'uppercase',
          }}>
          Book a Strategy Call
        </button>
      </div>
      <StandardFitModal open={open} onOpenChange={setOpen} />
    </>
  );
};

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldSalesExperience = ({ autoOpenBooking = false }: { autoOpenBooking?: boolean }) => (
  <div style={{ background: paper, fontFamily: body, color: ink }}>
    <BoldNav />
    <Hero autoOpenBooking={autoOpenBooking} />
    <MarqueeBands />
    <GuaranteeBand />
    <ProblemSection />
    <PromiseSection />
    <SystemsSection />
    <AgencyBrainBand />
    <Included />
    <SuccessStory />
    <PurchaseSection />
    <BoldFooter />
    <ContentMeta lastUpdated="March 2026" />
    <MobileStickyCTA />
  </div>
);

export default BoldSalesExperience;
