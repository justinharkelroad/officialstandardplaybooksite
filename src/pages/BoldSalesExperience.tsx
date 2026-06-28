import { useState, useEffect } from 'react';
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

/*
 * SINGLE CTA DESTINATION.
 * This page has exactly one job: get the right agency owner to book their
 * 8-Week call. Every primary CTA opens the site-native booking flow
 * (StandardFitModal -> BookingOnboardingForm -> Acuity scheduler) and routes
 * to the 8-WEEK scheduler below, NOT the general fit-call link. The modal is
 * named to the program so captured leads are 8-Week leads you can market to.
 * To repoint the scheduler, change BOOK_URL in this one place.
 */
const BOOK_URL = 'https://AGENCYCOACHING.as.me/8week';
const CTA_LABEL = 'Book Your 8-Week Call';
const CTA_MICROCOPY = 'Book a short call. We will make sure the 8-Week fits your agency, then get you started.';
const CTA_SOURCE = '8-week-sales-experience';
const PROGRAM_NAME = '8-Week Sales Management Experience';

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

/* ── Primary CTA (button + 8-Week booking microcopy) ───── */
const PrimaryCTA = ({
  onApply,
  align = 'left',
  onDark = false,
  size = 'md',
}: {
  onApply: () => void;
  align?: 'left' | 'center';
  onDark?: boolean;
  size?: 'md' | 'lg';
}) => {
  const btnFill = onDark ? paper : ink;
  const btnText = onDark ? ink : '#fff';
  const microColor = onDark ? paper : ink;
  const pad = size === 'lg' ? '18px 38px' : '15px 30px';
  const fontSize = size === 'lg' ? 15 : 13;
  return (
    <div style={{ textAlign: align, marginTop: 8 }}>
      <button
        onClick={onApply}
        style={{
          fontFamily: body, fontSize, fontWeight: 700, letterSpacing: '0.12em',
          color: btnText, background: btnFill, textTransform: 'uppercase',
          padding: pad, border: `1.5px solid ${btnFill}`, cursor: 'pointer',
          transition: 'all .25s',
        }}
        className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white"
      >
        {CTA_LABEL}
      </button>
      <p style={{
        fontFamily: body, fontSize: 13, fontWeight: 400, lineHeight: 1.5,
        color: microColor, opacity: 0.65, marginTop: 14, maxWidth: 420,
        marginInline: align === 'center' ? 'auto' : undefined,
      }}>
        {CTA_MICROCOPY}
      </p>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   1 - HERO
   ══════════════════════════════════════════════════════ */
const Hero = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / 8-Week Sales Management Experience
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
            <img src="/8-week-hero.jpg" alt="8-Week Sales Management Experience" loading="eager" fetchPriority="high" decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)' }} />
          </motion.div>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.25} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 17, fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.85, maxWidth: 620,
          }}>
            In eight weeks, your sales manager authors the sales process, the numbers, and the consequences your agency runs on. Written. Signed. Operating. Built by your team, not handed to them.
          </p>
        </Reveal>
        <Reveal delay={0.35} className="col-span-12 md:col-span-5 flex md:justify-end items-start">
          <PrimaryCTA onApply={onApply} align="left" />
        </Reveal>
      </div>
    </div>
  </section>
);

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
   2 - THE GUARANTEE - bold black with seal
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
            RESULTS<br />OR YOU<br />DO NOT PAY.
          </h2>
          {/* TODO: replace with Justin's exact current guarantee terms */}
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: paper, opacity: 0.78, marginTop: 24, maxWidth: 640,
          }}>
            I am not selling you a course to put on a shelf. If you run the system with me and your team does not move, you do not pay.
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
   3 - THE PAIN - staggered editorial
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
          THAT IS NOT A SALES TEAM.<br />THAT IS A COIN FLIP.
        </p>
      </Reveal>
      <Reveal delay={0.28}>
        <p style={{
          fontFamily: body, fontSize: 18, fontWeight: 400, lineHeight: 1.6,
          color: ink, opacity: 0.8, marginTop: 40, maxWidth: 760,
        }}>
          Your production swings because your process lives in one person's head. The top producer just does it. Everyone else guesses. When the standard is not written down, it cannot be taught, coached, or repeated, and every month is a roll of the dice.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   4 - THE PROMISE - black band
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
          IN EIGHT WEEKS,<br />
          <span className="md:pl-[8vw] inline-block">YOU WILL HAVE</span><br />
          <span className="md:pl-[14vw] inline-block" style={{ color: blue }}>CERTAINTY.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: body, fontSize: 18, fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.82, marginTop: 48, maxWidth: 760,
        }}>
          A call your whole team runs the same way every time. Numbers they hit every day. A consequence everyone understands before it ever gets used. All of it written, signed, and operating by week eight.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   5 - HOW IT WORKS (daily access + the loop)
   ══════════════════════════════════════════════════════ */
const howItWorks = [
  {
    label: 'Where it lives',
    body: "A private channel between me and your sales manager. Every weekday a short voice note from me lands there, in my voice, on that week's focus. Not a portal they forget to log into. Their phone, every morning.",
  },
  {
    label: 'The loop',
    body: 'Your manager voices me back the same day: their real numbers, the decision they made, the place they are stuck. I answer. This is daily coaching, not a weekly check-in. Eight weeks of me in the room with the person who runs your floor.',
  },
  {
    label: 'The weekly call',
    body: "Once a week we go deep on a live call and lock that week's piece of the document into place, in your manager's own words.",
  },
];

const HowItWorks = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / How It Works
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 96px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64, maxWidth: 1100,
        }}>
          I AM IN YOUR MANAGER'S POCKET EVERY MORNING.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {howItWorks.map((b, i) => (
          <Reveal key={b.label} delay={i * 0.08}>
            <div style={{
              padding: '40px 28px 48px',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < howItWorks.length - 1 ? `1px solid ${ink}1a` : 'none',
              height: '100%',
            }}>
              <span style={{
                fontFamily: editorial, fontSize: 20, color: ink,
                opacity: 0.3, letterSpacing: '-0.01em', display: 'block', marginBottom: 16,
              }}>
                0{i + 1} / 03
              </span>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: blue, textTransform: 'uppercase', marginBottom: 16,
              }}>
                {b.label}
              </p>
              <p style={{
                fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.8,
              }}>
                {b.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   6 - THE WHOLE TEAM MOVES TOO
   ══════════════════════════════════════════════════════ */
const TeamMoves = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-8 items-center">
        <Reveal className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / Not Just The Manager
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(36px, 6vw, 88px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            YOUR PRODUCERS<br />TRAIN ON THE<br />SAME ARC.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-5">
          <p style={{
            fontFamily: body, fontSize: 18, fontWeight: 400, lineHeight: 1.65,
            color: paper, opacity: 0.82,
          }}>
            This is not manager-only coaching that never reaches the floor. Every Monday your team gets a short video that primes them for the week's focus. Every Wednesday they get a workbook that makes them apply it on real calls. So when your manager rolls out the standard, the team is already moving with it, not braced against it.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7 - THREE SYSTEMS - bold list with side images
   ══════════════════════════════════════════════════════ */
const systems = [
  {
    num: '01',
    label: 'Sales Process',
    headline: 'A documented, repeatable call.',
    sub: 'The opening, the coverage conversation, the close, the follow-up. One way to sell, run by everyone.',
    img: salesProcessCardImg,
  },
  {
    num: '02',
    label: 'Tracking & Scorecards',
    headline: 'Daily tracking and weekly scorecards.',
    sub: 'The activity numbers your team hits every day, and AI-graded calls so coaching is on the process, not on opinions. Agency Brain is bundled in, so the tracking and the grading are built into the program.',
    img: accountabilityCardImg,
  },
  {
    num: '03',
    label: 'Consequence Ladder',
    headline: 'A clear path when standards are not met.',
    sub: 'A written, escalating consequence everyone understands, built on the activity your team controls.',
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
                        <img src={s.img} alt={s.label} loading="lazy"
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
   8 - THE EIGHT WEEKS (the arc)
   ══════════════════════════════════════════════════════ */
const arc = [
  { week: 'Week 1', headline: 'Find the real number.', sub: 'The honest baseline.' },
  { week: 'Weeks 2 to 4', headline: 'Build the talk path.', sub: 'The opening, the gap conversation, the close and follow-up.' },
  { week: 'Weeks 5 to 6', headline: 'Set the numbers.', sub: 'The daily floor and the monthly line.' },
  { week: 'Week 7', headline: 'Write the consequence ladder.', sub: 'The escalation everyone understands before it is used.' },
  { week: 'Week 8', headline: 'Sign it. Stand it up.', sub: 'Signed and operating.' },
];

const ArcSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / The Path
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          FIND IT. BUILD IT.<br />SIGN IT. RUN IT.
        </h2>
      </Reveal>

      <div style={{ borderTop: `1px solid ${paper}26` }}>
        {arc.map((a, i) => (
          <Reveal key={a.week} delay={i * 0.06}>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-baseline" style={{
              borderBottom: `1px solid ${paper}26`, padding: '32px 0',
            }}>
              <div className="col-span-12 md:col-span-3">
                <span style={{
                  fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 30px)',
                  letterSpacing: '-0.01em', color: blue, textTransform: 'uppercase', fontWeight: 400,
                }}>
                  {a.week}
                </span>
              </div>
              <div className="col-span-12 md:col-span-9">
                <h3 style={{
                  fontFamily: display, fontSize: 'clamp(26px, 3.4vw, 48px)',
                  lineHeight: 1, letterSpacing: '-0.01em', color: paper,
                  textTransform: 'uppercase', margin: 0, fontWeight: 400,
                }}>
                  {a.headline}
                </h3>
                <p style={{
                  fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
                  color: paper, opacity: 0.7, marginTop: 10,
                }}>
                  {a.sub}
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
   9 - HERE IS EXACTLY WHAT YOU GET (deliverables grid)
   ══════════════════════════════════════════════════════ */
const deliverables = [
  { num: '40', title: 'Daily Voice Coaching Prompts', sub: 'My voice, Monday to Friday, for eight weeks, straight to your manager.' },
  { num: '8', title: 'Weekly Coaching Calls', sub: 'Live, with me, to lock each piece of the system.' },
  { num: '16', title: 'Team Training Assets', sub: 'Eight Monday videos and eight Wednesday workbooks, so the producers move too.' },
  { num: '1', title: 'Sales Process, Authored and Signed', sub: "Your team's call, in writing, with their names on it." },
  { num: '1', title: 'Live Accountability System', sub: 'The daily floor, the monthly line, and the consequence ladder, running.' },
  { num: 'mark', title: 'The Guarantee', sub: 'Results or you do not pay.' },
];

const WhatYouGet = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / What You Get
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64,
        }}>
          HERE IS EXACTLY<br />WHAT YOU GET.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
        {deliverables.map((d, i) => (
          <Reveal key={d.title} delay={(i % 3) * 0.06}>
            <div style={{
              padding: '36px 28px 40px',
              borderRight: `1px solid ${ink}`,
              borderBottom: `1px solid ${ink}`,
              height: '100%',
              display: 'flex', flexDirection: 'column',
            }}>
              {d.num === 'mark' ? (
                <span aria-hidden style={{
                  display: 'inline-block', width: 44, height: 44, borderRadius: 999,
                  background: blue, marginBottom: 18, alignSelf: 'flex-start',
                }} />
              ) : (
                <span style={{
                  fontFamily: display, fontSize: 'clamp(56px, 7vw, 88px)', fontWeight: 400,
                  lineHeight: 0.85, letterSpacing: '-0.03em',
                  color: ink, marginBottom: 18,
                }}>
                  {d.num}
                </span>
              )}
              <h3 style={{
                fontFamily: editorial, fontSize: 'clamp(18px, 2vw, 24px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 12,
              }}>
                {d.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.75,
              }}>
                {d.sub}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <div style={{ marginTop: 56 }}>
          <PrimaryCTA onApply={onApply} align="left" size="lg" />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   10 - SOFTWARE IS LEVERAGE (Agency Brain)
   ══════════════════════════════════════════════════════ */
const brainFeatures = [
  { label: 'Dashboard', headline: 'Total Visibility.', sub: 'Premium, policies, activity, one view.', img: salesExpDashImg, tilt: -8 },
  { label: 'Team Hub', headline: 'Team & Meeting Hub.', sub: 'Centralized meetings, collaboration, comms.', img: teamMeetingImg, tilt: 7 },
  { label: 'Training', headline: 'Training & Feedback.', sub: 'Modules unlock Monday and Wednesday. Friday feedback to the manager.', img: trainingModulesImg, tilt: -6 },
];

const AgencyBrainBand = () => (
  <section id="software" style={{ background: ink, color: paper, padding: '120px 0', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Software Is Leverage
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <img src={agencyBrainLogo} alt="Agency Brain" loading="lazy"
          style={{ height: 'clamp(40px, 6vw, 72px)', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: 16 }} />
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 17, fontWeight: 400, lineHeight: 1.65,
          color: paper, opacity: 0.82, maxWidth: 680,
        }}>
          The tracking, the scorecards, and the AI call grading run inside Agency Brain, which is bundled into the program, so the system keeps operating long after week eight. The work you build does not leave when I do.
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
                <img src={f.img} alt={f.label} loading="lazy"
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
   11 - PROOF
   ══════════════════════════════════════════════════════ */
const SuccessStory = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px', borderTop: `1px solid ${paper}1a` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-8 items-center">
        <Reveal className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / Proof
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
              preload="none"
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
            quote: "I've learned a lot from this process, a lot about myself as a manager and leader as well. I feel that I can move forward a lot more confidently knowing what questions to ask myself and being a bit more inquisitive rather than jumping into action that may not be the most efficient or produce the best outcome. You've really taught me not just to think but how to think in just 7 hours which is wild.",
            name: 'Mike V.',
          },
          {
            quote: "Creating and enforcing a standard is something every leader needs help with. Working with Justin was a game changer. You don't realize what you're missing until you have someone who truly understands your challenges and helps deliver results that matter. Accountability was something I struggled to implement, but once we established and enforced our own standards, it forced everyone to level up.",
            name: 'Luis S.',
          },
          {
            quote: "Working with Justin over the 8-week training was eye-opening and transformative. He showed me how to become a stronger, more accountable leader for my team and can truly bulletproof your agency, as long as you're able to hold yourself accountable as well.",
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
                {t.name}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {/* TODO: optional second cleared testimonial or a named result with a number. Render nothing until approved content is supplied. */}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   12 - THE INVESTMENT
   ══════════════════════════════════════════════════════ */
const InvestmentSection = ({ onApply }: { onApply: () => void }) => (
  <section id="investment" style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Investment
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 items-start">
        <Reveal className="col-span-12 md:col-span-7">
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(36px, 5.5vw, 84px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 28,
          }}>
            ONE PRICE.<br />THE WHOLE SYSTEM.
          </h2>
          <div style={{ display: 'inline-block' }}>
            <h3 style={{
              fontFamily: display, fontSize: 'clamp(72px, 18vw, 260px)',
              lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
              margin: 0, fontWeight: 400,
            }}>
              $4,500
            </h3>
            <p style={{
              fontFamily: editorial, fontSize: 'clamp(22px, 2.8vw, 40px)',
              lineHeight: 1, letterSpacing: '-0.01em', color: blue,
              margin: 0, marginTop: 16, fontWeight: 400, textTransform: 'uppercase',
            }}>
              one time, or $625 per week
            </p>
          </div>
        </Reveal>

        <div className="col-span-12 md:col-span-5">
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: body, fontSize: 17, fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.82, marginBottom: 32,
            }}>
              Everything above: the daily coaching, the weekly calls, the team training, the documented system, and the guarantee.
            </p>
            <PrimaryCTA onApply={onApply} align="left" size="lg" />
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   13 - WHAT THIS IS, AND WHO IT IS FOR
   ══════════════════════════════════════════════════════ */
const WhoForSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Who It Is For
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 92px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 48, maxWidth: 1100,
        }}>
          WHAT THIS IS, AND WHO IT IS FOR.
        </h2>
      </Reveal>
      <div className="grid grid-cols-12 gap-8">
        <Reveal delay={0.1} className="col-span-12 md:col-span-6">
          <p style={{
            fontFamily: body, fontSize: 18, fontWeight: 400, lineHeight: 1.65,
            color: paper, opacity: 0.85,
          }}>
            This is for the agency owner who is tired of being the only person who can sell, and who is ready to let their sales manager actually run it. It is hands-on. Your manager works every day, your team works every week, and I am in it with them the whole way.
          </p>
        </Reveal>
        <Reveal delay={0.16} className="col-span-12 md:col-span-6">
          <p style={{
            fontFamily: body, fontSize: 18, fontWeight: 400, lineHeight: 1.65,
            color: paper, opacity: 0.85,
          }}>
            It is not for the owner who wants to buy a course, hand it off, and disappear. If you are not going to let your manager lead, this will not work, and I will tell you that on the call.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   14 - QUESTIONS (FAQ)
   ══════════════════════════════════════════════════════ */
const faqs = [
  {
    q: 'What is the daily piece, exactly?',
    a: "A short voice note from me to your sales manager every weekday, on that week's focus. They voice me back; I answer. Daily coaching, on their phone.",
  },
  {
    q: "How much of my manager's time does this take?",
    a: 'A few minutes a day on the voice thread, one weekly call, and the real work of running the week. It is built to fit a working manager, not to add a second job.',
  },
  {
    q: 'What does my team have to do?',
    a: 'Watch one short video on Monday and complete one workbook on Wednesday, each week. About thirty minutes, plus running what they learn on live calls.',
  },
  {
    q: 'What if we fall behind?',
    a: 'The program is paced, but it bends to your agency. We finish with a signed, operating system in eight weeks. That is the promise.',
  },
  {
    q: 'Who is this not for?',
    a: 'Owners who will not let their manager lead, or who want a set-and-forget course. This is a build, and it needs you bought in.',
  },
  {
    q: 'What is the guarantee?',
    /* TODO: match Justin's exact guarantee terms */
    a: 'Results or you do not pay.',
  },
];

const QuestionsSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1080px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 12,
        }}>
          / Questions
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          QUESTIONS.
        </h2>
      </Reveal>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {faqs.map((f, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <details style={{ borderBottom: `1px solid ${ink}`, padding: '28px 0' }}>
              <summary style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 32px)', lineHeight: 1.1,
                letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', fontWeight: 400,
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', gap: 24,
              }}>
                {f.q}
                <span style={{ color: blue, flexShrink: 0, fontFamily: body, fontWeight: 700 }}>+</span>
              </summary>
              <p style={{
                fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.8, marginTop: 20, maxWidth: 760,
              }}>
                {f.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   15 - FINAL CLOSE
   ══════════════════════════════════════════════════════ */
const FinalClose = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: ink, color: paper, padding: '130px 24px 110px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto text-center">
      <Reveal>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          THE SYSTEM<br /><span style={{ color: blue }}>OUTLASTS THE CHAOS.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{
          fontFamily: editorial, fontSize: 'clamp(18px, 2.2vw, 30px)', lineHeight: 1.2,
          letterSpacing: '0.01em', color: paper, opacity: 0.85, textTransform: 'uppercase',
          marginTop: 40, fontWeight: 400,
        }}>
          Sales is the fruit. The standard is the root.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
          <PrimaryCTA onApply={onApply} align="center" onDark size="lg" />
        </div>
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
          {String.fromCharCode(169)} {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
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
      {CTA_LABEL}
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldSalesExperience = ({ autoOpenBooking = false }: { autoOpenBooking?: boolean }) => {
  const [applyOpen, setApplyOpen] = useState(false);

  const openApply = () => {
    // Fire the existing Meta Pixel conversion event on every CTA, matching
    // the site convention used in BoldStandard90 / BookingOnboardingForm.
    try {
      (window as any).fbq?.('track', 'InitiateCheckout', { content_name: `${PROGRAM_NAME} Booking` });
    } catch {
      /* analytics is best-effort; never block the CTA */
    }
    setApplyOpen(true);
  };

  // The /8-week route passes autoOpenBooking so the page opens straight into
  // the 8-Week booking flow (not the general fit call).
  useEffect(() => {
    if (autoOpenBooking) openApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenBooking]);

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <BoldNav />
      <Hero onApply={openApply} />
      <MarqueeBands />
      <GuaranteeBand />
      <ProblemSection />
      <PromiseSection />
      <HowItWorks />
      <TeamMoves />
      <SystemsSection />
      <ArcSection />
      <WhatYouGet onApply={openApply} />
      <AgencyBrainBand />
      <SuccessStory />
      <InvestmentSection onApply={openApply} />
      <WhoForSection />
      <QuestionsSection />
      <FinalClose onApply={openApply} />
      <BoldFooter />
      <ContentMeta lastUpdated="June 2026" />
      <MobileStickyCTA onApply={openApply} />
      <StandardFitModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        source={CTA_SOURCE}
        bookingBaseUrl={BOOK_URL}
        callLengthLabel="8-Week"
        programName={PROGRAM_NAME}
      />
    </div>
  );
};

export default BoldSalesExperience;
