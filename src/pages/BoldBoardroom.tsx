import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Lock, Check, Flame, Eye, ShieldCheck, ArrowUpRight } from 'lucide-react';
import BoldNav from '@/components/BoldNav';

import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

/* ── Stripe links ──────────────────────────────────────── */
const STRIPE_JOIN = 'https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l';

/* ── Hero video (9:16 vertical Vimeo embed) ───────────── */
const HERO_VIDEO =
  'https://player.vimeo.com/video/1213715494?autoplay=1&muted=1&loop=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1';

/* ── Reveal helper ─────────────────────────────────────── */
const Reveal = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── Hero Interactive Loop Preview Data ────────────────── */
const heroLoopPreview = [
  {
    step: '01',
    time: '5 MIN',
    title: 'Return & Report',
    gate: 'HARD LOCK #1',
    summary:
      'Your prior week’s declared Domino sits at the top of the screen. You must answer Yes, I did it or No, not yet and rate your week 1–10 before this week’s Domino Builder unlocks.',
    promptLabel: 'Prior Domino Verdict',
    promptExample: '"Deliver signed Q3 producer consequence ladder by Friday 5 PM." → [ YES, I DID IT ]',
  },
  {
    step: '02',
    time: '10 MIN',
    title: 'Domino Builder',
    gate: 'HARD LOCK #2',
    summary:
      'Pick one Core Four lane (Body, Being, Balance, or Business) and walk 5 required steps to lock in one binary move you can answer Yes or No to next Monday.',
    promptLabel: '5-Step Declaration',
    promptExample: 'Lane: Business · One Thing · Why It Falls First · Sunday Evening Test · Life Impact',
  },
  {
    step: '03',
    time: '15 MIN',
    title: 'Domino Flow',
    gate: 'SENT TO COACH',
    summary:
      'Complete the 10-step cognitive audit before 1:00 PM ET. Step 08 (The Gap) becomes your exact live breakout prompt on the Monday call.',
    promptLabel: 'Step 08 · The Gap',
    promptExample: '"What is the gap between the fruit I have today and the target I declared?"',
  },
];

/* ══════════════════════════════════════════════════════
   1 · HERO
   ══════════════════════════════════════════════════════ */
const Hero = () => {
  const [activeStage, setActiveStage] = useState(0);
  const currentStage = heroLoopPreview[activeStage];

  return (
    <section
      style={{
        background: paper,
        paddingTop: 56 + 24,
        paddingBottom: 68,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
        <Reveal>
          <p
            style={{
              fontFamily: body,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: ink,
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            The Boardroom / Weekly Owner Accountability + Agency Brain Core / $299 Monthly
          </p>
        </Reveal>

        <Reveal>
          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(42px, 8.2vw, 132px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: ink,
              margin: 0,
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            STOP BEING THE SMARTEST
            <br />
            <span className="inline-block" style={{ color: blue }}>
              ONE IN YOUR OFFICE.
            </span>
          </h1>
        </Reveal>

        <div className="grid grid-cols-12 gap-6 mt-10 items-start">
          <Reveal delay={0.15} className="col-span-12 lg:col-span-7">
            <p
              style={{
                fontFamily: body,
                fontSize: 'clamp(16px, 1.55vw, 20px)',
                fontWeight: 400,
                lineHeight: 1.58,
                color: ink,
                opacity: 0.88,
                maxWidth: 740,
                margin: 0,
              }}
            >
              One live hour every Monday at 1:00 PM Eastern—backed by a gated{' '}
              <strong style={{ fontWeight: 700 }}>30-minute software loop</strong> before you ever join the call.
              Answer for last week&apos;s Domino, work the real gap live, lock in one binary move for next week, and
              run your entire agency on <strong style={{ fontWeight: 700 }}>Agency Brain Core</strong> (included with
              your seat).
            </p>
          </Reveal>

          <Reveal
            delay={0.25}
            className="col-span-12 lg:col-span-5 flex lg:justify-end items-start gap-3 flex-wrap"
          >
            <a
              href="#loop"
              style={{
                fontFamily: body,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: ink,
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 24px',
                border: `1.5px solid ${ink}`,
                transition: 'all .25s',
              }}
              className="hover:bg-black hover:text-white"
            >
              See The 30-Min Loop
            </a>
            <a
              href={STRIPE_JOIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: body,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#fff',
                background: ink,
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '15px 28px',
                border: `1.5px solid ${ink}`,
                transition: 'all .25s',
              }}
              className="hover:bg-[#2997FF] hover:border-[#2997FF]"
            >
              Claim Your Seat — $299/Mo &rarr;
            </a>
          </Reveal>
        </div>

        {/* 2-Column Hero Showcase: 9:16 Vertical Video + Live Software Loop Preview */}
        <div className="grid grid-cols-12 gap-8 lg:gap-10 mt-14 items-center">
          {/* Left: Square 1:1 Vimeo Video (Matches native 1:1 dimensions of 1213715494) */}
          <Reveal delay={0.3} className="col-span-12 lg:col-span-5">
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: ink,
                opacity: 0.55,
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              // Watch: The Boardroom In Two Minutes
            </p>
            <motion.div
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                background: ink,
                padding: 8,
                width: '100%',
                maxWidth: 500,
                marginInline: 'auto',
                boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
                transform: 'rotate(-1.5deg)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#000',
                  overflow: 'hidden',
                }}
              >
                <iframe
                  src={HERO_VIDEO}
                  title="The Boardroom In Two Minutes"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                />
              </div>
            </motion.div>
          </Reveal>

          {/* Right: Interactive Agency Brain Boardroom Loop + Value Anchor */}
          <Reveal delay={0.38} className="col-span-12 lg:col-span-7">
            <div
              style={{
                background: ink,
                color: paper,
                border: `1.5px solid ${ink}`,
                padding: 'clamp(22px, 3vw, 36px)',
                boxShadow: '0 32px 64px -24px rgba(0,0,0,0.45)',
              }}
            >
              {/* Status Strip */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 pb-5"
                style={{ borderBottom: `1px solid ${paper}22` }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      background: blue,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: body,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: paper,
                      textTransform: 'uppercase',
                    }}
                  >
                    Inside Agency Brain &middot; Weekly Boardroom Loop
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: blue,
                    textTransform: 'uppercase',
                  }}
                >
                  Opens Sun 12:00 AM ET &rarr; Live Call Mon 1:00 PM ET
                </span>
              </div>

              <div className="mt-6">
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: paper,
                    opacity: 0.55,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  // 30 Minutes Before Every Monday Call (Click a Stage)
                </p>
                <h2
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(28px, 3.6vw, 46px)',
                    lineHeight: 0.96,
                    letterSpacing: '-0.01em',
                    color: paper,
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  SOFTWARE HOLDS THE LINE{' '}
                  <span style={{ color: blue }}>BEFORE THE ROOM DOES.</span>
                </h2>
              </div>

              {/* Interactive Stage Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-6">
                {heroLoopPreview.map((item, idx) => {
                  const isSelected = activeStage === idx;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setActiveStage(idx)}
                      style={{
                        textAlign: 'left',
                        padding: '14px 14px',
                        background: isSelected ? paper : `${paper}08`,
                        color: isSelected ? ink : paper,
                        border: `1.5px solid ${isSelected ? blue : `${paper}26`}`,
                        cursor: 'pointer',
                        transition: 'all .2s ease',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          style={{
                            fontFamily: editorial,
                            fontSize: 13,
                            color: isSelected ? blue : `${paper}88`,
                          }}
                        >
                          STAGE {item.step}
                        </span>
                        <span
                          style={{
                            fontFamily: body,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            padding: '2px 6px',
                            background: isSelected ? ink : `${paper}14`,
                            color: isSelected ? paper : `${paper}cc`,
                          }}
                        >
                          {item.time}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: display,
                          fontSize: 20,
                          lineHeight: 1.05,
                          textTransform: 'uppercase',
                          margin: '8px 0 0',
                          fontWeight: 400,
                        }}
                      >
                        {item.title}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Stage Detail Panel */}
              <div
                style={{
                  marginTop: 14,
                  padding: '20px 18px',
                  background: `${paper}0c`,
                  border: `1px solid ${paper}22`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span
                    style={{
                      fontFamily: editorial,
                      fontSize: 15,
                      color: paper,
                      textTransform: 'uppercase',
                    }}
                  >
                    {currentStage.step} / {currentStage.title} ({currentStage.time})
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: blue,
                      textTransform: 'uppercase',
                    }}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {currentStage.gate}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 14,
                    lineHeight: 1.58,
                    color: paper,
                    opacity: 0.86,
                    margin: '0 0 14px',
                  }}
                >
                  {currentStage.summary}
                </p>
                <div
                  style={{
                    padding: '10px 12px',
                    background: ink,
                    borderLeft: `3px solid ${blue}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: blue,
                      textTransform: 'uppercase',
                      margin: '0 0 4px',
                    }}
                  >
                    {currentStage.promptLabel}
                  </p>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 13,
                      color: paper,
                      opacity: 0.9,
                      margin: 0,
                    }}
                  >
                    {currentStage.promptExample}
                  </p>
                </div>
              </div>

              {/* Value Anchor Strip inside Hero Card */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5"
                style={{ borderTop: `1px solid ${paper}22` }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: `${paper}88`,
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Weekly Room + Telegram
                  </p>
                  <p
                    style={{
                      fontFamily: editorial,
                      fontSize: 16,
                      color: paper,
                      textTransform: 'uppercase',
                      margin: '4px 0 0',
                    }}
                  >
                    Every Monday 1 PM ET
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: `${paper}88`,
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Agency Brain Core Included
                  </p>
                  <p
                    style={{
                      fontFamily: editorial,
                      fontSize: 16,
                      color: blue,
                      textTransform: 'uppercase',
                      margin: '4px 0 0',
                    }}
                  >
                    $299/Mo Value Built In
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: `${paper}88`,
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Your Total Membership
                  </p>
                  <p
                    style={{
                      fontFamily: editorial,
                      fontSize: 16,
                      color: paper,
                      textTransform: 'uppercase',
                      margin: '4px 0 0',
                    }}
                  >
                    $299/Mo &middot; No Contract
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   2 · OFFER FACTS BAR
   ══════════════════════════════════════════════════════ */
const OfferFacts = () => (
  <section style={{ background: paper, borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${ink}` }}>
    <div className="grid grid-cols-2 md:grid-cols-5 max-w-[1440px] mx-auto px-6 md:px-10">
      {[
        ['Monday 1 PM ET', '60 minutes live every week'],
        ['30-Min Pre-Work', 'Gated software loop before call'],
        ['Streak-Tracked', 'Coach-verified attendance'],
        ['Core Included', 'Full $299/mo Agency Brain OS'],
        ['$299 / Month', 'Month-to-month · No contract'],
      ].map(([value, label], i) => (
        <div
          key={value}
          style={{
            padding: '24px 16px',
            borderLeft: i === 0 ? 'none' : `1px solid ${ink}22`,
          }}
        >
          <p
            style={{
              fontFamily: editorial,
              fontSize: 'clamp(16px, 1.5vw, 21px)',
              lineHeight: 1.05,
              color: i === 3 ? blue : ink,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {value}
          </p>
          <p
            style={{
              fontFamily: body,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              lineHeight: 1.4,
              color: ink,
              opacity: 0.62,
              textTransform: 'uppercase',
              margin: '8px 0 0',
            }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   3 · MARQUEE BANDS
   ══════════════════════════════════════════════════════ */
const Marquee = ({
  rotate = -3,
  bg = ink,
  color = paper,
  phrase = 'RETURN AND REPORT · DECLARE THE DOMINO · WORK THE GAP · THE MIRROR · AGENCY BRAIN CORE',
}: {
  rotate?: number;
  bg?: string;
  color?: string;
  phrase?: string;
}) => (
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
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'sp-marquee 32s linear infinite' }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span
            style={{
              fontFamily: editorial,
              fontSize: 'clamp(22px, 3.4vw, 44px)',
              letterSpacing: '0.04em',
              fontWeight: 400,
            }}
          >
            {phrase}
          </span>
          <span aria-hidden style={{ fontFamily: editorial, fontSize: 'clamp(20px, 3vw, 38px)', color: blue }}>
            /
          </span>
        </span>
      ))}
    </div>
  </div>
);

const MarqueeBands = () => (
  <div style={{ background: paper, padding: '36px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={ink} color={paper} />
    <style>{`
      @keyframes sp-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════════════
   4 · PROBLEM / PROMISE
   ══════════════════════════════════════════════════════ */
const ProblemPromise = () => (
  <section style={{ background: paper, padding: '112px 24px 128px' }}>
    <div className="max-w-[1180px] mx-auto">
      <div className="grid grid-cols-12 gap-10 md:gap-16">
        <Reveal className="col-span-12 md:col-span-6">
          <p
            style={{
              fontFamily: body,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: ink,
              opacity: 0.5,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            / The Isolation Trap
          </p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(38px, 5.4vw, 76px)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: ink,
              textTransform: 'uppercase',
              margin: '0 0 28px',
              fontWeight: 400,
            }}
          >
            Alone, you negotiate with yourself.
          </h2>
          <p
            style={{
              fontFamily: body,
              fontSize: 'clamp(17px, 1.55vw, 20px)',
              lineHeight: 1.6,
              color: ink,
              opacity: 0.82,
              margin: 0,
              maxWidth: 540,
            }}
          >
            You are the smartest person in your agency, and that is the problem. Without a hard stop, you let yourself
            off the hook on Friday for the promise you made on Monday. The same hire, the same confrontation, and the
            same number keep cycling because nobody in the building can challenge your thinking.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 md:col-span-6">
          <p
            style={{
              fontFamily: body,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: blue,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            / The Weekly Mechanism
          </p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(38px, 5.4vw, 76px)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: blue,
              textTransform: 'uppercase',
              margin: '0 0 28px',
              fontWeight: 400,
            }}
          >
            In the room, the software locks the door.
          </h2>
          <p
            style={{
              fontFamily: body,
              fontSize: 'clamp(17px, 1.55vw, 20px)',
              lineHeight: 1.6,
              color: ink,
              opacity: 0.82,
              margin: 0,
              maxWidth: 540,
            }}
          >
            Inside Agency Brain, you cannot even declare this week&apos;s Domino until you answer{' '}
            <strong style={{ fontWeight: 700 }}>Yes</strong> or <strong style={{ fontWeight: 700 }}>No</strong> to last
            week&apos;s commitment. Every Monday, you return and report to owners running the same race, work the real
            gap live, and lock in one specific move you will answer for seven days later.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <p
          style={{
            fontFamily: editorial,
            fontSize: 'clamp(19px, 2.1vw, 28px)',
            lineHeight: 1.25,
            color: ink,
            textTransform: 'uppercase',
            margin: '64px 0 0',
            paddingTop: 28,
            borderTop: `1px solid ${ink}`,
          }}
        >
          Built for insurance agency owners—with unlimited Staff Portal logins for your team and dedicated Boardroom
          grants for the key leaders you bring into the work.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   5 · THE 30-MINUTE PRE-CALL SOFTWARE LOOP
   ══════════════════════════════════════════════════════ */
const dominoBuilderSteps = [
  {
    num: 'STEP 1',
    title: 'Pick Your Core Four Lane',
    desc: 'Choose one domain for this week’s Domino: Body, Being, Balance, or Business.',
  },
  {
    num: 'STEP 2',
    title: 'Your One Thing',
    desc: 'Write the single move specific enough that next Monday you can answer Yes or No without explaining.',
  },
  {
    num: 'STEP 3',
    title: 'Why This Is A Domino',
    desc: 'Name what falls after it if this falls first—so you stop chasing ten tasks and hit the lead pin.',
  },
  {
    num: 'STEP 4',
    title: 'The Sunday Evening Test',
    desc: 'Define what is visibly different by Sunday night that someone else in your agency or home would notice.',
  },
  {
    num: 'STEP 5',
    title: 'Whole-Life Impact',
    desc: 'Anchor how finishing this Domino feeds the other three domains of your life.',
  },
];

const dominoFlowPrompts = [
  { step: '01', name: 'Title', prompt: 'Name the exact bottleneck or decision on the table this week.' },
  { step: '02', name: 'The Issue', prompt: 'State what is actually happening right now without spin.' },
  { step: '03', name: 'Domain', prompt: 'Anchor the issue to Body, Being, Balance, or Business.' },
  { step: '04', name: 'The Target', prompt: 'What does winning look like on this front?' },
  { step: '05', name: 'The Obstacle', prompt: 'What is standing between current reality and the target?' },
  { step: '06', name: 'Past Action', prompt: 'What have you already tried or avoided doing about it?' },
  { step: '07', name: 'The Fruit', prompt: 'What results are your current actions actually producing?' },
  {
    step: '08',
    name: 'The Gap (Breakout Anchor)',
    prompt: 'Where is the exact gap between your fruit and your target? This is the prompt you work in Monday breakouts.',
    highlight: true,
  },
  { step: '09', name: 'The Cost', prompt: 'What does it cost you, your family, and your agency if nothing changes?' },
  { step: '10', name: 'The Action', prompt: 'What is the immediate move you are committing to execute?' },
];

const BoardroomLoopSection = () => (
  <section id="loop" style={{ borderTop: `1px solid ${ink}` }}>
    {/* Dark Title Band */}
    <div style={{ background: ink, color: paper, padding: '96px 24px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p
            style={{
              fontFamily: body,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: paper,
              opacity: 0.6,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            / Inside Agency Brain &middot; The 30-Minute Pre-Call Loop
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(40px, 6.8vw, 98px)',
              lineHeight: 0.94,
              letterSpacing: '-0.01em',
              color: paper,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
            }}
          >
            YOU DO NOT SHOW UP COLD.
            <br />
            <span style={{ color: blue }}>THE SOFTWARE ENFORCES THE ORDER.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: body,
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: 1.6,
              color: paper,
              opacity: 0.8,
              maxWidth: 780,
              marginTop: 28,
              marginBottom: 0,
            }}
          >
            Every Sunday at 12:00 AM Eastern, your weekly Boardroom window opens inside Agency Brain. Before Monday&apos;s
            1:00 PM ET call begins, every member walks through a gated 30-minute sequence. Two hard software locks make
            sure nobody skips last week&apos;s truth to chase a shiny new idea.
          </p>
        </Reveal>
      </div>
    </div>

    {/* 4-Stage Architecture on Paper */}
    <div style={{ background: paper, padding: '88px 24px 120px' }}>
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* STAGE 01: RETURN AND REPORT */}
        <Reveal>
          <div style={{ border: `1.5px solid ${ink}`, background: '#fff', padding: 'clamp(24px, 3.5vw, 44px)' }}>
            <div
              className="flex flex-wrap items-center justify-between gap-4 pb-6"
              style={{ borderBottom: `1px solid ${ink}22` }}
            >
              <div className="flex items-center gap-4">
                <span
                  style={{
                    fontFamily: editorial,
                    fontSize: 15,
                    color: '#fff',
                    background: ink,
                    padding: '6px 12px',
                    letterSpacing: '0.08em',
                  }}
                >
                  STAGE 01 &middot; 5 MIN
                </span>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(26px, 3.4vw, 44px)',
                    lineHeight: 0.98,
                    color: ink,
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  Return And Report
                </h3>
              </div>
              <span
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: blue,
                  background: `${ ink }`,
                  padding: '8px 14px',
                  textTransform: 'uppercase',
                }}
              >
                <Lock className="w-3.5 h-3.5" />
                Hard Lock #1 &middot; Unlocks This Week&apos;s Domino
              </span>
            </div>

            <div className="grid grid-cols-12 gap-8 mt-7 items-center">
              <div className="col-span-12 lg:col-span-6">
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 16,
                    lineHeight: 1.62,
                    color: ink,
                    opacity: 0.85,
                    margin: '0 0 18px',
                  }}
                >
                  When you open <code style={{ fontWeight: 700 }}>/boardroom</code> inside Agency Brain, your prior
                  week&apos;s declared Domino and Core Four lane sit at the top of the screen. You cannot type a single
                  word of this week&apos;s plan until you answer the binary question on the record.
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="space-y-2.5">
                  {[
                    'Binary verdict required: "Yes, I did it" or "No, not yet" (no partial credit)',
                    'Honest reflection prompt: "What happened? Keep it honest. Patterns, not judgment."',
                    '1–10 Weekly Feeling score logged into your rolling 8-week pattern history',
                  ].map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5"
                      style={{ fontFamily: body, fontSize: 14, lineHeight: 1.5, color: ink }}
                    >
                      <span style={{ color: blue, fontWeight: 700 }}>&#10003;</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Simulated UI Card for Stage 01 */}
              <div className="col-span-12 lg:col-span-6">
                <div
                  style={{
                    background: paper,
                    border: `1.5px solid ${ink}`,
                    padding: '22px 20px',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      style={{
                        fontFamily: body,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        color: ink,
                        opacity: 0.55,
                        textTransform: 'uppercase',
                      }}
                    >
                      Your Prior Domino &middot; Business Lane
                    </span>
                    <span
                      style={{
                        fontFamily: body,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: blue,
                        textTransform: 'uppercase',
                      }}
                    >
                      Required To Unlock Step 02
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: editorial,
                      fontSize: 16,
                      lineHeight: 1.35,
                      color: ink,
                      margin: '0 0 16px',
                    }}
                  >
                    &ldquo;Conduct 1-on-1 consequence review with my top two producers and get signed activity standards
                    in Agency Brain before Friday at 4:00 PM.&rdquo;
                  </p>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: ink,
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    Did you complete that Domino?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      style={{
                        background: ink,
                        color: paper,
                        padding: '10px 14px',
                        fontFamily: body,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                      }}
                    >
                      &#10003; Yes, I did it
                    </div>
                    <div
                      style={{
                        background: 'transparent',
                        color: ink,
                        border: `1.5px solid ${ink}44`,
                        padding: '10px 14px',
                        fontFamily: body,
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        opacity: 0.65,
                      }}
                    >
                      No, not yet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* STAGE 02: THE 5-STEP DOMINO BUILDER */}
        <Reveal delay={0.05}>
          <div style={{ border: `1.5px solid ${ink}`, background: '#fff', padding: 'clamp(24px, 3.5vw, 44px)' }}>
            <div
              className="flex flex-wrap items-center justify-between gap-4 pb-6"
              style={{ borderBottom: `1px solid ${ink}22` }}
            >
              <div className="flex items-center gap-4">
                <span
                  style={{
                    fontFamily: editorial,
                    fontSize: 15,
                    color: '#fff',
                    background: ink,
                    padding: '6px 12px',
                    letterSpacing: '0.08em',
                  }}
                >
                  STAGE 02 &middot; 10 MIN
                </span>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(26px, 3.4vw, 44px)',
                    lineHeight: 0.98,
                    color: ink,
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  The 5-Step Domino Builder
                </h3>
              </div>
              <span
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: blue,
                  background: ink,
                  padding: '8px 14px',
                  textTransform: 'uppercase',
                }}
              >
                <Lock className="w-3.5 h-3.5" />
                Hard Lock #2 &middot; Unlocks Domino Flow &amp; The Room
              </span>
            </div>

            <p
              style={{
                fontFamily: body,
                fontSize: 16,
                lineHeight: 1.62,
                color: ink,
                opacity: 0.85,
                margin: '24px 0 24px',
                maxWidth: 840,
              }}
            >
              Once last week is reported, the 5-step Domino Builder opens. You do not bring a 14-item to-do list into
              The Boardroom. You build one lead Domino that knocks the rest down—and when you click{' '}
              <strong style={{ fontWeight: 700 }}>Lock in my Domino</strong>, Agency Brain emails your receipt, unlocks{' '}
              <strong style={{ fontWeight: 700 }}>The Room</strong> reciprocity counter, and opens{' '}
              <strong style={{ fontWeight: 700 }}>Domino Flow</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {dominoBuilderSteps.map((s) => (
                <div
                  key={s.num}
                  style={{
                    background: paper,
                    border: `1px solid ${ink}`,
                    padding: '18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: body,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        color: blue,
                        textTransform: 'uppercase',
                        margin: '0 0 8px',
                      }}
                    >
                      {s.num}
                    </p>
                    <h4
                      style={{
                        fontFamily: display,
                        fontSize: 21,
                        lineHeight: 1.05,
                        color: ink,
                        textTransform: 'uppercase',
                        margin: '0 0 10px',
                        fontWeight: 400,
                      }}
                    >
                      {s.title}
                    </h4>
                  </div>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: ink,
                      opacity: 0.78,
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* STAGE 03: THE 10-STEP DOMINO FLOW */}
        <Reveal delay={0.08}>
          <div style={{ border: `1.5px solid ${ink}`, background: '#fff', padding: 'clamp(24px, 3.5vw, 44px)' }}>
            <div
              className="flex flex-wrap items-center justify-between gap-4 pb-6"
              style={{ borderBottom: `1px solid ${ink}22` }}
            >
              <div className="flex items-center gap-4">
                <span
                  style={{
                    fontFamily: editorial,
                    fontSize: 15,
                    color: '#fff',
                    background: ink,
                    padding: '6px 12px',
                    letterSpacing: '0.08em',
                  }}
                >
                  STAGE 03 &middot; 15 MIN
                </span>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(26px, 3.4vw, 44px)',
                    lineHeight: 0.98,
                    color: ink,
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  The 10-Step Domino Flow
                </h3>
              </div>
              <span
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#fff',
                  background: blue,
                  padding: '8px 14px',
                  textTransform: 'uppercase',
                }}
              >
                Shared With Coach Before Call &middot; Breakout Anchor
              </span>
            </div>

            <p
              style={{
                fontFamily: body,
                fontSize: 16,
                lineHeight: 1.62,
                color: ink,
                opacity: 0.85,
                margin: '24px 0 24px',
                maxWidth: 860,
              }}
            >
              Before the call starts, you run a 10-step cognitive audit on the real issue underneath your Domino. Your
              coach receives your submission ahead of 1:00 PM ET—and{' '}
              <strong style={{ fontWeight: 700 }}>Step 08 (The Gap)</strong> is the exact prompt you bring into the live
              breakout room so zero minutes are wasted on small talk.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {dominoFlowPrompts.map((item) => (
                <div
                  key={item.step}
                  style={{
                    background: item.highlight ? ink : paper,
                    color: item.highlight ? paper : ink,
                    border: `1.5px solid ${item.highlight ? blue : `${ink}33`}`,
                    padding: '16px 14px',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      style={{
                        fontFamily: editorial,
                        fontSize: 13,
                        color: item.highlight ? blue : `${ink}66`,
                      }}
                    >
                      {item.step}
                    </span>
                    {item.highlight && (
                      <span
                        style={{
                          fontFamily: body,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          background: blue,
                          color: '#fff',
                          padding: '2px 6px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Live Breakout
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: display,
                      fontSize: 19,
                      lineHeight: 1.05,
                      textTransform: 'uppercase',
                      margin: '0 0 6px',
                      fontWeight: 400,
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 12,
                      lineHeight: 1.45,
                      opacity: item.highlight ? 0.9 : 0.75,
                      margin: 0,
                    }}
                  >
                    {item.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* STAGE 04: PRIVATE NOTES, CALL RECAPS & RECORDING VAULT */}
        <Reveal delay={0.1}>
          <div
            style={{
              background: ink,
              color: paper,
              padding: 'clamp(24px, 3vw, 38px)',
              border: `1.5px solid ${ink}`,
            }}
          >
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    style={{
                      fontFamily: editorial,
                      fontSize: 13,
                      color: ink,
                      background: blue,
                      padding: '4px 10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    STAGE 04 &middot; DURING &amp; AFTER CALL
                  </span>
                  <span
                    style={{
                      fontFamily: body,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: `${paper}99`,
                      textTransform: 'uppercase',
                    }}
                  >
                    Private Notes + Anonymized Call Recaps + Recording Archive
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(26px, 3.2vw, 40px)',
                    lineHeight: 1,
                    color: paper,
                    textTransform: 'uppercase',
                    margin: '0 0 12px',
                    fontWeight: 400,
                  }}
                >
                  YOUR NOTES STAY PRIVATE. EVERY CALL IS ARCHIVED IN YOUR VAULT.
                </h3>
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: paper,
                    opacity: 0.82,
                    margin: 0,
                    maxWidth: 740,
                  }}
                >
                  Take live notes inside your Boardroom tab knowing they are strictly private to your login—never
                  visible to your coach, admin, or the room. After the call, anonymized{' '}
                  <strong style={{ fontWeight: 700 }}>Call Recaps</strong> and the embedded{' '}
                  <strong style={{ fontWeight: 700 }}>Call Recording</strong> post directly to your Past Calls archive.
                  Even on holiday Mondays when no live Zoom is held, the weekly Domino window stays open so your streak
                  never breaks.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
                <a
                  href="/the-boardroom-loop.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:bg-[#2997FF] hover:text-white hover:border-[#2997FF]"
                  style={{
                    fontFamily: body,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: ink,
                    background: paper,
                    padding: '15px 22px',
                    border: `1.5px solid ${paper}`,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all .25s',
                  }}
                >
                  Read The Loop Guide (PDF) <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   6 · HOW EVERY MONDAY RUNS LIVE (WITH VIDEO EVIDENCE)
   ══════════════════════════════════════════════════════ */
const weeklyMoves = [
  {
    label: 'Return And Report',
    body: 'You enter the call with your numbers and last week’s Domino already answered Yes or No in the software. The truth is on the table before the first minute begins.',
    videos: [
      {
        src: '/video/boardroom-return-report.mp4',
        poster: '/video/boardroom-return-report-poster.jpg',
        title: 'Return And Report',
      },
    ],
  },
  {
    label: 'Get Worked Live',
    body: 'Justin and Corina teach the pattern they are seeing across agencies. Breakouts put Step 08 of your Domino Flow (The Gap) against peers, then real owners bring real bottlenecks to the hot seat.',
    videos: [
      { src: '/video/boardroom-breakout.mp4', poster: '/video/boardroom-breakout-poster.jpg', title: 'The Breakout' },
      { src: '/video/boardroom-hot-seat.mp4', poster: '/video/boardroom-hot-seat-poster.jpg', title: 'The Hot Seat' },
    ],
  },
  {
    label: 'Declare The Domino',
    body: 'You do not leave with a notebook of ideas. You leave with one binary Domino locked in the software and declared in front of the room. Seven days later, you return and answer for it.',
    videos: [
      { src: '/video/boardroom-domino.mp4', poster: '/video/boardroom-domino-poster.jpg', title: 'Declare The Domino' },
    ],
  },
];

const MoveVideo = ({ src, poster, title }: { src: string; poster: string; title: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="metadata"
      title={title}
      className="absolute inset-0 w-full h-full"
      style={{ border: 0, objectFit: 'cover' }}
    />
  );
};

const WeeklyCallSection = () => (
  <section id="weekly" style={{ borderTop: `1px solid ${ink}` }}>
    {/* Dark title band */}
    <div style={{ background: ink, padding: '96px 24px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p
            style={{
              fontFamily: body,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: paper,
              opacity: 0.6,
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            / The Weekly Live Call &middot; Mondays at 1:00 PM ET
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(40px, 7vw, 100px)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: paper,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
            }}
          >
            ONE LIVE HOUR.
            <br />
            <span style={{ color: blue }}>THREE MOVES IN THE ROOM.</span>
          </h2>
        </Reveal>
      </div>
    </div>

    {/* Light steps */}
    <div style={{ background: paper, padding: '80px 24px 120px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p
            style={{
              fontFamily: body,
              fontSize: 'clamp(16px, 1.6vw, 20px)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: ink,
              opacity: 0.85,
              maxWidth: 760,
              marginBottom: 48,
            }}
          >
            Every Monday at 1:00 PM Eastern, the room runs the exact same live cadence: return and report, get worked in
            breakouts and hot seats, and declare the Domino you will answer for next week.
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-8 lg:gap-6">
          {weeklyMoves.map((m, i) => (
            <Reveal
              key={m.label}
              delay={i * 0.08}
              className={`col-span-12 ${m.videos.length > 1 ? 'lg:col-span-6' : 'lg:col-span-3'}`}
            >
              <div style={{ borderTop: `1px solid ${ink}`, paddingTop: 18 }}>
                <div className="flex items-baseline gap-3" style={{ marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: editorial,
                      fontSize: 16,
                      color: ink,
                      opacity: 0.35,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: 'clamp(20px, 1.9vw, 27px)',
                      lineHeight: 0.95,
                      letterSpacing: '-0.01em',
                      color: ink,
                      textTransform: 'uppercase',
                      margin: 0,
                      fontWeight: 400,
                    }}
                  >
                    {m.label}
                  </h3>
                </div>
                <div
                  className={`grid ${m.videos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}
                  style={{ marginBottom: 18 }}
                >
                  {m.videos.map((video) => (
                    <div
                      key={video.src}
                      style={{
                        position: 'relative',
                        background: ink,
                        padding: 6,
                        boxShadow: '0 24px 48px -20px rgba(0,0,0,0.45)',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1 / 1',
                          background: '#000',
                          overflow: 'hidden',
                        }}
                      >
                        <MoveVideo src={video.src} poster={video.poster} title={video.title} />
                      </div>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: ink,
                    opacity: 0.8,
                  }}
                >
                  {m.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Coach-Verified Attendance vs Recording Archive Callout */}
        <Reveal delay={0.12}>
          <div
            style={{
              marginTop: 52,
              padding: '28px 28px',
              border: `1.5px solid ${ink}`,
              background: '#fff',
            }}
          >
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 md:col-span-5">
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: blue,
                    textTransform: 'uppercase',
                    margin: '0 0 8px',
                  }}
                >
                  / Coach-Verified Attendance Streaks
                </p>
                <p
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(22px, 2.5vw, 32px)',
                    lineHeight: 1.02,
                    color: ink,
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  &ldquo;The recording will be there for you either way. Your seat in the room will not.&rdquo;
                </p>
              </div>
              <div className="col-span-12 md:col-span-7">
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: ink,
                    opacity: 0.82,
                    margin: 0,
                  }}
                >
                  Every Monday call is recorded and summarized inside your private Agency Brain vault so you never lose a
                  tactic. But attendance is never self-reported—your coach verifies who was in the live room within 48
                  hours of every call, driving your <strong style={{ fontWeight: 700 }}>Live Attendance Streak</strong>{' '}
                  alongside your <strong style={{ fontWeight: 700 }}>Dominoes Kept Streak</strong>. Because you cannot
                  get worked in a replay.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7 · THE THREE-LAYER MIRROR EXPERIENCE & ACCOUNTABILITY
   ══════════════════════════════════════════════════════ */
const mirrorPillars = [
  { num: '01', name: 'Culture & Team', items: '10 Subcategories · 50 Pts Max', detail: 'Core values, role specialization, recognition, recruiting ritual, onboarding, and consequence standards.' },
  { num: '02', name: 'Systems & Rhythm', items: '6 Subcategories · 30 Pts Max', detail: 'Daily huddles, visible scoreboards, structured 1:1s, weekly rhythm, and monthly agency recaps.' },
  { num: '03', name: 'Training & Scripts', items: '6 Subcategories · 30 Pts Max', detail: 'Written call scripts, AI call scoring cadence, objection playbooks, roleplay, and video vault.' },
  { num: '04', name: 'Marketing & Lead Flow', items: '6 Subcategories · 30 Pts Max', detail: 'CRM discipline, lead source ROI, speed-to-lead, x-date pipelines, and multi-touch follow-up.' },
  { num: '05', name: 'Owner Command', items: '4 Subcategories · 20 Pts Max', detail: 'New business audit, marketing ROI command, commission verification, and cancellation control.' },
];

const mirrorScoringTiers = [
  { range: '32–63', label: 'Time To Build' },
  { range: '64–95', label: 'Getting Traction' },
  { range: '96–127', label: 'Running Smooth' },
  { range: '128–149', label: 'High Performer' },
  { range: '150–160', label: 'The Standard', highlight: true },
];

const MirrorExperienceSection = () => (
  <section id="mirror" style={{ background: ink, color: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: blue,
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          / The Mirror Experience &middot; Three Layers Of Truth
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(40px, 6.8vw, 98px)',
            lineHeight: 0.94,
            letterSpacing: '-0.01em',
            color: paper,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}
        >
          PATTERNS DO NOT LIE.
          <br />
          <span style={{ color: blue }}>THE MIRROR SHOWS YOU ALL THREE.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: body,
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            lineHeight: 1.6,
            color: paper,
            opacity: 0.8,
            maxWidth: 780,
            marginTop: 28,
            marginBottom: 64,
          }}
        >
          Anyone can have one motivated Monday. Inside Agency Brain, Boardroom members are held accountable across three
          connected Mirror systems that track your personal execution, your agency&apos;s operating fundamentals, and
          your 8-week installation sprint.
        </p>
      </Reveal>

      {/* LAYER 01 + LAYER 03 TOP GRID */}
      <div className="grid grid-cols-12 gap-8 mb-10">
        {/* LAYER 01: THE WEEKLY MIRROR + THE ROOM */}
        <Reveal className="col-span-12 lg:col-span-6">
          <div
            style={{
              background: `${paper}08`,
              border: `1.5px solid ${paper}28`,
              padding: 'clamp(24px, 3vw, 36px)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: blue,
                    textTransform: 'uppercase',
                  }}
                >
                  Layer 01 &middot; Every Monday Inside /boardroom
                </span>
                <Eye className="w-4 h-4" style={{ color: blue }} />
              </div>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(28px, 3.2vw, 42px)',
                  lineHeight: 0.98,
                  color: paper,
                  textTransform: 'uppercase',
                  margin: '0 0 14px',
                  fontWeight: 400,
                }}
              >
                The Weekly Mirror &amp; The Room
              </h3>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: paper,
                  opacity: 0.82,
                  margin: '0 0 24px',
                }}
              >
                Pinned to the right rail of your Boardroom workspace, the Weekly Mirror aggregates your last{' '}
                <strong style={{ fontWeight: 700 }}>8 weekly loops</strong> so you cannot hide from your own habits.
                Beside it sits <strong style={{ fontWeight: 700 }}>The Room</strong>—locked behind a reciprocity gate (
                <em>&ldquo;Yours goes in first. That is the deal.&rdquo;</em>) that only reveals how many peers have
                locked in their Domino after you submit yours.
              </p>
            </div>

            {/* Simulated Weekly Mirror Telemetry Card */}
            <div style={{ background: ink, border: `1px solid ${paper}28`, padding: '20px 18px' }}>
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${paper}1a` }}>
                <span
                  style={{
                    fontFamily: body,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: `${paper}88`,
                    textTransform: 'uppercase',
                  }}
                >
                  Weekly Mirror &middot; Last 8 Loops
                </span>
                <span
                  className="inline-flex items-center gap-1"
                  style={{
                    fontFamily: body,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: blue,
                    textTransform: 'uppercase',
                  }}
                >
                  <Flame className="w-3.5 h-3.5" /> 6 Week Streak
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 py-4" style={{ borderBottom: `1px solid ${paper}1a` }}>
                <div>
                  <p style={{ fontFamily: display, fontSize: 28, lineHeight: 1, color: paper, margin: 0 }}>7 OF 8</p>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      color: `${paper}77`,
                      textTransform: 'uppercase',
                      margin: '6px 0 0',
                    }}
                  >
                    Dominoes Kept
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: display, fontSize: 28, lineHeight: 1, color: blue, margin: 0 }}>8.4 / 10</p>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      color: `${paper}77`,
                      textTransform: 'uppercase',
                      margin: '6px 0 0',
                    }}
                  >
                    Avg Feeling
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: display, fontSize: 28, lineHeight: 1, color: paper, margin: 0 }}>BUSINESS</p>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      color: `${paper}77`,
                      textTransform: 'uppercase',
                      margin: '6px 0 0',
                    }}
                  >
                    Top Lane (5x)
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
                <span
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    color: `${paper}88`,
                  }}
                >
                  Last 4 Loops Ledger:
                </span>
                <div className="flex items-center gap-1.5">
                  {['KEPT', 'KEPT', 'KEPT', 'KEPT'].map((status, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: body,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        padding: '3px 8px',
                        background: `${blue}22`,
                        color: blue,
                        border: `1px solid ${blue}55`,
                      }}
                    >
                      &#10003; {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* LAYER 03: THE 8-WEEK / 32-DAY MIRROR CHALLENGE */}
        <Reveal delay={0.08} className="col-span-12 lg:col-span-6">
          <div
            style={{
              background: `${paper}08`,
              border: `1.5px solid ${paper}28`,
              padding: 'clamp(24px, 3vw, 36px)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: blue,
                    textTransform: 'uppercase',
                  }}
                >
                  Layer 03 &middot; Exclusive To Boardroom &amp; 1:1 Owners
                </span>
                <ShieldCheck className="w-4 h-4" style={{ color: blue }} />
              </div>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(28px, 3.2vw, 42px)',
                  lineHeight: 0.98,
                  color: paper,
                  textTransform: 'uppercase',
                  margin: '0 0 14px',
                  fontWeight: 400,
                }}
              >
                The 8-Week / 32-Day Mirror Challenge
              </h3>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: paper,
                  opacity: 0.82,
                  margin: '0 0 24px',
                }}
              >
                Software-only subscribers can score The Mirror, but{' '}
                <strong style={{ fontWeight: 700 }}>only Boardroom and 1:1 Coaching owners</strong> can launch the{' '}
                <strong style={{ fontWeight: 700 }}>32-Day Mirror Challenge</strong>. Instead of trying to fix 32 agency
                fundamentals at once, Agency Brain paces you through 4 fundamentals per week for 8 weeks—paired with a
                private, managed Telegram Challenge Room.
              </p>
            </div>

            {/* Mirror Challenge Cadence Card */}
            <div style={{ background: ink, border: `1px solid ${paper}28`, padding: '20px 18px' }}>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: blue,
                  textTransform: 'uppercase',
                  margin: '0 0 12px',
                }}
              >
                How The 8-Week Sprint Runs Inside Agency Brain
              </p>
              <div className="space-y-3">
                {[
                  [
                    'MON – THU (4 ITEMS / WEEK)',
                    'Rate today’s assigned fundamental 1–5 against its "When at 5" standard and complete all 3 required workbook reflection prompts.',
                  ],
                  [
                    'PRIVATE TELEGRAM ROOM',
                    'Receive automated morning challenge drops, peer accountability, and weekly synthesis inside your dedicated Mirror Challenge channel.',
                  ],
                  [
                    'WEEKLY RETURN & REPORT',
                    'Every week closes with a verified Return & Report checkpoint until all 32 operating fundamentals are audited and installed.',
                  ],
                ].map(([label, desc]) => (
                  <div
                    key={label}
                    style={{
                      paddingBottom: 10,
                      borderBottom: `1px solid ${paper}14`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: editorial,
                        fontSize: 13,
                        color: paper,
                        textTransform: 'uppercase',
                        margin: '0 0 3px',
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontFamily: body,
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: paper,
                        opacity: 0.76,
                        margin: 0,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* LAYER 02: THE 160-POINT AGENCY MIRROR (FULL-WIDTH 5 PILLARS) */}
      <Reveal delay={0.12}>
        <div
          style={{
            background: paper,
            color: ink,
            padding: 'clamp(28px, 4vw, 48px)',
            border: `1.5px solid ${paper}`,
          }}
        >
          <div className="grid grid-cols-12 gap-6 items-end pb-8" style={{ borderBottom: `1px solid ${ink}` }}>
            <div className="col-span-12 lg:col-span-8">
              <p
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: blue,
                  textTransform: 'uppercase',
                  margin: '0 0 10px',
                }}
              >
                Layer 02 &middot; The 160-Point Agency Diagnostic
              </p>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(32px, 4.8vw, 64px)',
                  lineHeight: 0.95,
                  color: ink,
                  textTransform: 'uppercase',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                5 PILLARS. 32 FUNDAMENTALS.{' '}
                <span style={{ color: blue }}>160 POSSIBLE POINTS.</span>
              </h3>
            </div>
            <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
              <Link
                to="/mirror"
                style={{
                  fontFamily: body,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#fff',
                  background: ink,
                  padding: '14px 22px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all .25s',
                }}
                className="hover:bg-[#2997FF]"
              >
                Preview The Mirror Diagnostic &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0" style={{ borderBottom: `1px solid ${ink}` }}>
            {mirrorPillars.map((p, idx) => (
              <div
                key={p.num}
                style={{
                  padding: '24px 16px',
                  borderLeft: idx === 0 ? 'none' : `1px solid ${ink}22`,
                }}
              >
                <p
                  style={{
                    fontFamily: editorial,
                    fontSize: 14,
                    color: blue,
                    margin: '0 0 6px',
                  }}
                >
                  PILLAR {p.num}
                </p>
                <h4
                  style={{
                    fontFamily: display,
                    fontSize: 24,
                    lineHeight: 1.02,
                    color: ink,
                    textTransform: 'uppercase',
                    margin: '0 0 6px',
                    fontWeight: 400,
                  }}
                >
                  {p.name}
                </h4>
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: ink,
                    opacity: 0.55,
                    textTransform: 'uppercase',
                    margin: '0 0 10px',
                  }}
                >
                  {p.items}
                </p>
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: ink,
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  {p.detail}
                </p>
              </div>
            ))}
          </div>

          {/* 5 Scoring Tiers Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <span
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: ink,
                opacity: 0.65,
                textTransform: 'uppercase',
              }}
            >
              Where Does Your Agency Stand Today?
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {mirrorScoringTiers.map((t) => (
                <span
                  key={t.range}
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '6px 12px',
                    background: t.highlight ? ink : 'transparent',
                    color: t.highlight ? paper : ink,
                    border: `1px solid ${ink}`,
                    textTransform: 'uppercase',
                  }}
                >
                  <strong style={{ color: t.highlight ? blue : ink }}>{t.range}</strong> &middot; {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   8 · AGENCY BRAIN CORE ACCESS INCLUDED ($299/MO VALUE)
   ══════════════════════════════════════════════════════ */
type SoftwareCategory = {
  id: string;
  label: string;
  headline: string;
  subcopy: string;
  items: { title: string; detail: string }[];
};

const softwareCategories: SoftwareCategory[] = [
  {
    id: 'coaching',
    label: '01 · Room & Accountability',
    headline: 'Weekly Live Coaching + Daily Direct Access',
    subcopy:
      'The call is one hour on Monday. The room, the direct line to Justin, and the software accountability run all seven days.',
    items: [
      {
        title: 'The Monday Boardroom (1:00 PM ET)',
        detail: 'Sixty minutes live every week with Justin, Corina, and peer agency owners.',
      },
      {
        title: '30-Min Boardroom Loop & Domino Flow',
        detail: 'Gated Return & Report, 5-Step Domino Builder, 10-Step Domino Flow, and private call archive.',
      },
      {
        title: 'Daily Telegram Room',
        detail: 'Voice notes, wins, collisions, and real-time peer pressure between Mondays.',
      },
      {
        title: 'Direct Line To Justin',
        detail: 'Send private Telegram voice or video notes—answered personally in his daily response blocks.',
      },
      {
        title: 'The 160-Point Mirror & 8-Week Challenge',
        detail: 'Full 32-item agency diagnostic, workbook reflections, and the Boardroom-exclusive 32-Day Telegram Challenge.',
      },
      {
        title: 'Key Leader Boardroom Grants',
        detail: 'Grant trusted managers or key leaders access to /staff/boardroom when you bring them into the work.',
      },
    ],
  },
  {
    id: 'sales',
    label: '02 · Scorecards & AI Call Scoring',
    headline: '20 AI Call Scores/Mo + Unlimited Staff Portal Seats',
    subcopy:
      'Every Boardroom seat includes full Agency Brain Core access with unlimited Staff Portal logins for your producers, sales managers, and service team.',
    items: [
      {
        title: '20 AI-Scored Calls Per Month',
        detail: 'Upload sales or service calls for instant AI grading, talk-to-listen ratios, and word-for-word coaching feedback.',
      },
      {
        title: 'Unlimited Team Members (Staff Portal)',
        detail: 'Every producer and team member gets their own login at /staff—no per-user software fees.',
      },
      {
        title: 'Real-Time Scorecards & KPI Rings',
        detail: 'Daily outbound calls, quoted households, talk time, and items tracked against the bar you set.',
      },
      {
        title: 'Team Pulse & Live Leaderboards',
        detail: 'Instant visibility into who is leading the floor and who is slipping before the month is over.',
      },
      {
        title: 'LQS Roadmap (Lead-Quote-Sale)',
        detail: 'Full household pipeline tracking from lead capture to quoted household to bound policy.',
      },
      {
        title: '5 Custom Lead Capture Forms',
        detail: 'Public intake forms that route new leads directly into your LQS pipeline.',
      },
    ],
  },
  {
    id: 'hqs',
    label: '03 · 5 Agency HQs & Training',
    headline: 'Five Operating HQs + The Standard Playbook Library',
    subcopy:
      'Turn retention, renewals, winbacks, cross-selling, and team training into daily repeatable workflows.',
    items: [
      {
        title: 'Renewal HQ & Cancel Audit HQ',
        detail: 'Proactive renewal workflows and cancellation save tracking so retention never runs on memory.',
      },
      {
        title: 'Winback HQ',
        detail: 'Structured termination winback pipelines and x-date follow-up sequences for your team.',
      },
      {
        title: 'Cross-Sale HQ & Life Referral HQ',
        detail: 'Surface mono-line households and life referral opportunities straight from your book.',
      },
      {
        title: 'Standard Playbook Training Platform',
        detail: 'Full on-demand sales, service, management, and AI training tracks with scored comprehension quizzes.',
      },
      {
        title: 'Agency Training & Custom Modules',
        detail: 'Assign lessons and track completion across your entire staff roster with deadline enforcement.',
      },
      {
        title: 'The Process Vault',
        detail: 'Centralized SOP and playbook repository so your agency processes live in one place.',
      },
    ],
  },
  {
    id: 'owner',
    label: '04 · Flows & ROI Forecasters',
    headline: 'Core 4, All 7 Daily Flows & 5 Financial Forecasters',
    subcopy:
      'Keep the owner sharp and the agency math undeniable with daily mindset practices and operator calculators.',
    items: [
      {
        title: 'Core 4 Daily Habit Tracker',
        detail: 'Track daily execution streaks across Body, Being, Balance, and Business.',
      },
      {
        title: 'All 7 Guided Daily Flows',
        detail: 'War Flow, Idea Flow, Discovery Flow, Irritation Flow, Gratitude Flow, Prayer Flow, and Bible Flow.',
      },
      {
        title: 'Quarterly Life Targets Cascade',
        detail: 'Connect 90-day targets to monthly missions, weekly priorities, and daily proof.',
      },
      {
        title: 'Mailer Intelligence & Direct Mail ROI',
        detail: 'Track mail drops, response rates, and cost-per-acquisition across campaigns.',
      },
      {
        title: 'Annual Bonus Tool',
        detail: 'Model carrier annual bonus tiers and see exact production needed to hit the next payout bracket.',
      },
      {
        title: '5 Agency ROI Forecasters',
        detail: 'Vendor Verifier, Live Transfer ROI, Lead Velocity, Staff ROI, and Bundling Multipliers.',
      },
    ],
  },
];

const IncludesSection = () => {
  const [activeTab, setActiveTab] = useState<string>('coaching');
  const currentCat = softwareCategories.find((c) => c.id === activeTab) || softwareCategories[0];

  return (
    <section id="includes" style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p
            style={{
              fontFamily: body,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: ink,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            / What Comes With Your Seat
          </p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(42px, 6.8vw, 98px)',
              lineHeight: 0.94,
              letterSpacing: '-0.01em',
              color: ink,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
            }}
          >
            PAY FOR THE ROOM.
            <br />
            <span style={{ color: blue }}>GET THE $299/MO PLATFORM INCLUDED.</span>
          </h2>
          <p
            style={{
              fontFamily: body,
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: 1.6,
              color: ink,
              opacity: 0.8,
              margin: '28px 0 44px',
              maxWidth: 780,
            }}
          >
            Standalone <strong style={{ fontWeight: 700 }}>Agency Brain Core</strong> costs $299/month on its own. When
            you join The Boardroom for $299/month, your full Agency Brain Core subscription—including unlimited Staff
            Portal seats for your team and 20 AI-scored calls every month—is included at zero extra cost.
          </p>
        </Reveal>

        {/* Category Tabs */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0" style={{ border: `1.5px solid ${ink}` }}>
            {softwareCategories.map((cat, idx) => {
              const isSelected = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    padding: '18px 18px',
                    textAlign: 'left',
                    background: isSelected ? ink : '#fff',
                    color: isSelected ? paper : ink,
                    borderLeft: idx === 0 ? 'none' : `1px solid ${ink}22`,
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: isSelected ? blue : `${ink}77`,
                      textTransform: 'uppercase',
                      margin: '0 0 6px',
                    }}
                  >
                    {cat.label}
                  </p>
                  <p
                    style={{
                      fontFamily: display,
                      fontSize: 21,
                      lineHeight: 1.05,
                      textTransform: 'uppercase',
                      margin: 0,
                      fontWeight: 400,
                    }}
                  >
                    {cat.headline.split('+')[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active Category Feature Grid */}
        <Reveal delay={0.08}>
          <div
            style={{
              background: '#fff',
              borderLeft: `1.5px solid ${ink}`,
              borderRight: `1.5px solid ${ink}`,
              borderBottom: `1.5px solid ${ink}`,
              padding: 'clamp(24px, 3.5vw, 44px)',
            }}
          >
            <div className="mb-8">
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(28px, 3.6vw, 46px)',
                  lineHeight: 0.98,
                  color: ink,
                  textTransform: 'uppercase',
                  margin: '0 0 10px',
                  fontWeight: 400,
                }}
              >
                {currentCat.headline}
              </h3>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: ink,
                  opacity: 0.78,
                  margin: 0,
                  maxWidth: 720,
                }}
              >
                {currentCat.subcopy}
              </p>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0"
              style={{ borderTop: `1px solid ${ink}` }}
            >
              {currentCat.items.map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    padding: '24px 18px',
                    borderBottom: `1px solid ${ink}22`,
                    borderRight: (i + 1) % 3 !== 0 ? `1px solid ${ink}18` : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      style={{
                        color: blue,
                        fontSize: 16,
                        lineHeight: 1.2,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      &#10003;
                    </span>
                    <div>
                      <h4
                        style={{
                          fontFamily: editorial,
                          fontSize: 16,
                          lineHeight: 1.2,
                          color: ink,
                          textTransform: 'uppercase',
                          margin: '0 0 6px',
                          fontWeight: 400,
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: body,
                          fontSize: 13.5,
                          lineHeight: 1.52,
                          color: ink,
                          opacity: 0.76,
                          margin: 0,
                        }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Incremental Software Upgrade Path Strip */}
        <Reveal delay={0.12}>
          <div
            style={{
              marginTop: 32,
              background: ink,
              color: paper,
              padding: '28px 28px',
            }}
          >
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 lg:col-span-5">
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: blue,
                    textTransform: 'uppercase',
                    margin: '0 0 6px',
                  }}
                >
                  / Want More AI Firepower Later?
                </p>
                <h4
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(22px, 2.6vw, 34px)',
                    lineHeight: 1.02,
                    color: paper,
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  PAY ONLY THE SOFTWARE DELTA TO UPGRADE.
                </h4>
              </div>
              <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ['Boardroom + Core', '$299/mo', 'Included · 20 AI Calls/mo + Full Core OS', true],
                  ['Add Plus Tier', '+$150/mo', '50 AI Calls/mo · Training AI Builder · Comp Assistant', false],
                  ['Add Pro Tier', '+$300/mo', '100 AI Calls/mo · AI Roleplay Bot · Full HR Suite', false],
                ].map(([tier, price, desc, active]) => (
                  <div
                    key={String(tier)}
                    style={{
                      padding: '14px 14px',
                      background: active ? `${blue}1c` : `${paper}08`,
                      border: `1px solid ${active ? blue : `${paper}22`}`,
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        style={{
                          fontFamily: editorial,
                          fontSize: 13,
                          color: paper,
                          textTransform: 'uppercase',
                        }}
                      >
                        {tier}
                      </span>
                      <span
                        style={{
                          fontFamily: display,
                          fontSize: 20,
                          color: active ? blue : paper,
                        }}
                      >
                        {price}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: body,
                        fontSize: 11.5,
                        lineHeight: 1.45,
                        color: paper,
                        opacity: 0.75,
                        margin: '6px 0 0',
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   9 · THE OWNER SYSTEM: BODY / BEING / BALANCE / BUSINESS
   ══════════════════════════════════════════════════════ */
const ownerSystem = [
  {
    label: 'Body',
    body: 'Track the physical habits, sleep, and training that determine the energy and presence you bring into the building.',
  },
  {
    label: 'Being',
    body: 'Use the 7 daily Flows (War, Idea, Discovery, Irritation, Gratitude, Prayer, Bible) to make decisions from conviction instead of reaction.',
  },
  {
    label: 'Balance',
    body: 'Keep marriage, family, and personal mission visible on the board while the book of business grows.',
  },
  {
    label: 'Business',
    body: 'Turn what surfaces in the Monday room into a measurable Domino inside the agency—and see which domain you favor or avoid in your Weekly Mirror.',
  },
];

const OwnerSystemSection = () => (
  <section style={{ background: paper, padding: '112px 24px 128px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1180px] mx-auto">
      <Reveal>
        <p
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: ink,
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          / The Core Four Operating System
        </p>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(42px, 7vw, 96px)',
            lineHeight: 0.94,
            letterSpacing: '-0.01em',
            color: ink,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}
        >
          THE BUSINESS IS NOT
          <br />
          <span style={{ color: blue }}>SEPARATE FROM THE OWNER.</span>
        </h2>
        <p
          style={{
            fontFamily: body,
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            lineHeight: 1.6,
            color: ink,
            opacity: 0.8,
            margin: '28px 0 52px',
            maxWidth: 760,
          }}
        >
          Every weekly Domino you declare belongs to one of four lanes: Body, Being, Balance, or Business. Your Weekly
          Mirror tracks which lane you choose most often—so you see immediately when you are winning at the office by
          neglecting your health, faith, or home.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ borderTop: `1px solid ${ink}` }}>
        {ownerSystem.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.05}>
            <div
              style={{
                padding: '28px 20px 8px',
                borderLeft: i === 0 ? 'none' : `1px solid ${ink}22`,
                minHeight: 190,
              }}
            >
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(26px, 2.8vw, 38px)',
                  lineHeight: 1,
                  color: i === 3 ? blue : ink,
                  textTransform: 'uppercase',
                  margin: '0 0 14px',
                  fontWeight: 400,
                }}
              >
                {item.label}
              </h3>
              <p style={{ fontFamily: body, fontSize: 14.5, lineHeight: 1.58, color: ink, opacity: 0.78, margin: 0 }}>
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.12}>
        <p
          style={{
            fontFamily: editorial,
            fontSize: 'clamp(18px, 2vw, 26px)',
            lineHeight: 1.3,
            color: ink,
            textTransform: 'uppercase',
            margin: '52px 0 0',
            paddingTop: 24,
            borderTop: `1px solid ${ink}33`,
          }}
        >
          Daily Core 4 + Seven Guided Flows turn strategy, conflict, learning, gratitude, and faith into one action you
          carry into the agency.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   10 · PRICING SECTION (HIGH-CONTRAST VALUE STACK)
   ══════════════════════════════════════════════════════ */
const PricingSection = () => (
  <section id="pricing" style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <p
        style={{
          fontFamily: body,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.18em',
          color: ink,
          textTransform: 'uppercase',
          marginBottom: 28,
        }}
      >
        / Claim Your Seat
      </p>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-7">
          <p
            style={{
              fontFamily: body,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: ink,
              opacity: 0.65,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Boardroom Membership + Agency Brain Core &middot; Monthly
          </p>
          <div style={{ position: 'relative', display: 'inline-block', paddingBottom: 8 }}>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(72px, 17vw, 240px)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                color: ink,
                margin: 0,
                fontWeight: 400,
              }}
            >
              $299
            </h2>
            <p
              style={{
                fontFamily: editorial,
                fontSize: 'clamp(22px, 2.8vw, 40px)',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                color: blue,
                margin: '14px 0 0',
                fontWeight: 400,
                textTransform: 'uppercase',
              }}
            >
              / month &middot; No Contract
            </p>
          </div>

          <p
            style={{
              fontFamily: body,
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.6,
              color: ink,
              opacity: 0.85,
              marginTop: 24,
              maxWidth: 560,
            }}
          >
            One live hour every Monday at 1:00 PM ET, the 30-minute software accountability loop, daily Telegram access
            to Justin and the room, the 8-Week Mirror Challenge, and your full{' '}
            <strong style={{ fontWeight: 700 }}>Agency Brain Core ($299/mo value)</strong> subscription included. Cancel
            anytime in Stripe.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={STRIPE_JOIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: body,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#fff',
                background: ink,
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '17px 32px',
                border: `1.5px solid ${ink}`,
                transition: 'all .25s',
              }}
              className="hover:bg-[#2997FF] hover:border-[#2997FF]"
            >
              Claim Your Seat &rarr;
            </a>
            <span
              style={{
                fontFamily: body,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: ink,
                opacity: 0.65,
                textTransform: 'uppercase',
              }}
            >
              Instant Agency Brain + Boardroom Provisioning
            </span>
          </div>
        </div>

        {/* Right: Value Stack + The Standard Promise */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          <div
            style={{
              background: '#fff',
              border: `1.5px solid ${ink}`,
              padding: '28px 26px',
            }}
          >
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: blue,
                textTransform: 'uppercase',
                margin: '0 0 14px',
              }}
            >
              Everything Included At $299/Mo
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="space-y-3">
              {[
                ['Weekly Monday Live Coaching Call', '1:00 PM ET · 60 Min'],
                ['30-Min Pre-Call Software Loop', 'Return · Domino · Flow'],
                ['Daily Telegram Room + Direct Line', 'Voice & Video Access'],
                ['Agency Brain Core Platform', '$299/mo Standalone Value'],
                ['Unlimited Staff Portal Logins', 'Whole Team Included'],
                ['20 AI Call Scores Per Month', 'Standard Call Scoring'],
                ['160-Pt Mirror + 8-Week Challenge', 'Boardroom Exclusive'],
              ].map(([item, tag]) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-3 pb-2.5"
                  style={{ borderBottom: `1px solid ${ink}18` }}
                >
                  <span
                    className="flex items-center gap-2"
                    style={{ fontFamily: body, fontSize: 13.5, fontWeight: 600, color: ink }}
                  >
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: blue }} />
                    {item}
                  </span>
                  <span
                    style={{
                      fontFamily: body,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: ink,
                      opacity: 0.6,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: ink,
              color: paper,
              padding: '28px 26px',
            }}
          >
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: blue,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              The Standard Promise
            </p>
            <p
              style={{
                fontFamily: display,
                fontSize: 'clamp(24px, 2.8vw, 32px)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: paper,
                textTransform: 'uppercase',
                margin: '0 0 12px',
                fontWeight: 400,
              }}
            >
              Stop guessing. Start leading.
            </p>
            <p
              style={{
                fontFamily: body,
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.6,
                color: paper,
                opacity: 0.85,
                margin: 0,
              }}
            >
              You will always know the exact Domino you declared, the gap you worked, and the Monday you have to answer
              for it. The software holds the record. The room brings the pressure. You bring the execution.
            </p>
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: body,
          fontSize: 11,
          lineHeight: 1.55,
          color: ink,
          opacity: 0.58,
          margin: '56px 0 0',
          maxWidth: 880,
        }}
      >
        Live Monday attendance is coach-verified and streak-tracked. Call recordings and anonymized recaps are archived
        privately inside Agency Brain for active members. No income or sales results are promised or implied; outcomes
        depend on your market and your execution.
      </p>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   11 · OPERATOR PROOF
   ══════════════════════════════════════════════════════ */
const ProofSection = () => (
  <section style={{ background: ink, color: paper, padding: '112px 24px' }}>
    <div className="max-w-[1180px] mx-auto">
      <Reveal>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(42px, 7vw, 96px)',
            lineHeight: 0.94,
            letterSpacing: '-0.01em',
            color: paper,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}
        >
          OPERATOR PROOF.
          <br />
          <span style={{ color: blue }}>NOT THEORY.</span>
        </h2>
        <p
          style={{
            fontFamily: body,
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            lineHeight: 1.6,
            color: paper,
            opacity: 0.78,
            margin: '28px 0 52px',
            maxWidth: 740,
          }}
        >
          Led by Justin and Corina. Built from the patterns that repeat inside real insurance agencies—and coded
          directly into Agency Brain by the operator who ran the seat.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ borderTop: `1px solid ${paper}44` }}>
        {[
          ['20 years', 'Building & scaling agencies'],
          ['$3.6M', 'Agency exit in 2019'],
          ['234+', 'Coaching sessions analyzed'],
        ].map(([value, label], i) => (
          <Reveal key={value} delay={i * 0.05}>
            <div
              style={{
                padding: '30px 20px 10px',
                borderLeft: i === 0 ? 'none' : `1px solid ${paper}2e`,
                minHeight: 150,
              }}
            >
              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(38px, 5vw, 66px)',
                  lineHeight: 0.9,
                  color: blue,
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  lineHeight: 1.45,
                  color: paper,
                  opacity: 0.68,
                  textTransform: 'uppercase',
                  margin: '14px 0 0',
                  maxWidth: 210,
                }}
              >
                {label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   12 · FAQ: BOLD ACCORDION
   ══════════════════════════════════════════════════════ */
const faq = [
  {
    q: 'Who is The Boardroom for (and how do key leaders work)?',
    a: 'The Boardroom is built for insurance agency owners who want peer pressure, direct access to Justin and Corina, and a weekly execution rhythm. Your $299/mo membership includes unlimited Agency Brain Staff Portal logins for your producers and team, and you can also grant designated key leaders access to the Boardroom loop inside the platform.',
  },
  {
    q: 'How does the 30-minute pre-call software loop work?',
    a: 'Every Sunday at 12:00 AM Eastern, your weekly Boardroom window opens inside Agency Brain. Before Monday’s 1:00 PM ET call, you walk through three gated stages: (1) Return & Report (5 min)—where you must answer Yes or No to last week’s Domino before this week unlocks; (2) The 5-Step Domino Builder (10 min)—where you lock in one binary move in Body, Being, Balance, or Business; and (3) The 10-Step Domino Flow (15 min)—which goes directly to your coach and anchors your live breakout room.',
  },
  {
    q: 'What happens during the 60-minute live call every Monday?',
    a: 'At 1:00 PM Eastern every Monday, the room meets live on Zoom. Everyone enters having already reported on last week’s Domino. Justin and Corina teach the pattern surfacing across agencies, you enter breakout rooms anchored to Step 08 of your Domino Flow (The Gap), real owners work real bottlenecks in the hot seat, and you leave with one declared Domino due next Monday.',
  },
  {
    q: 'Are call recordings and recaps available if I miss a Monday?',
    a: 'Yes—every Monday call is recorded and posted alongside an anonymized Call Recap inside your private Agency Brain archive so you never lose a tactic, and the weekly Domino window stays open even on holiday Mondays. However, live attendance is verified by your coach after every call and tracked as a consecutive streak on your dashboard—because you cannot get worked in a replay.',
  },
  {
    q: 'What is "The Mirror" and the 8-Week Mirror Challenge?',
    a: 'You get three connected Mirror systems: (1) The Weekly Mirror inside your Boardroom tab, tracking your Dominoes Kept ratio, feeling average, and Core Four lane balance across your last 8 loops; (2) The 160-Point Agency Mirror diagnostic across 5 Pillars and 32 subcategories; and (3) The Boardroom-exclusive 8-Week / 32-Day Mirror Challenge, which paces you through 4 agency fundamentals per week inside a private managed Telegram room.',
  },
  {
    q: 'Is the full $299/month Agency Brain Core platform really included?',
    a: 'Yes. Standalone Agency Brain Core is $299/month. Your $299/month Boardroom membership includes full Agency Brain Core access at no extra cost: 20 AI-scored calls per month, unlimited Staff Portal seats, real-time Scorecards and KPI rings, Leaderboards, LQS Roadmap, 5 Agency HQs (Renewal, Cancel Audit, Winback, Cross-Sale, Life Referral), the Standard Playbook Training Platform, Core 4, all 7 Daily Flows, and 5 ROI Forecasters. If you ever want Plus (+$150/mo) or Pro (+$300/mo), you only pay the software difference.',
  },
  {
    q: 'What happens between Monday calls?',
    a: 'The private Boardroom Telegram room stays open all week for voice notes, wins, collisions, and peer accountability. You also have a direct voice and video line to Justin on Telegram, which he answers during his daily morning and evening response blocks.',
  },
  {
    q: 'Is there a contract?',
    a: 'No. Membership is $299 a month, billed month-to-month. You can cancel anytime directly through Stripe.',
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p
            style={{
              fontFamily: body,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: ink,
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            / The Questions
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(40px, 7vw, 100px)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: ink,
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 400,
              marginBottom: 56,
            }}
          >
            THE PRACTICAL
            <br />
            <span style={{ color: blue }}>QUESTIONS.</span>
          </h2>
        </Reveal>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.04}>
                <li
                  style={{
                    borderBottom: `1px solid ${ink}`,
                  }}
                  className="hover:bg-black/[0.03] transition-colors"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`boardroom-faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      padding: '28px 16px',
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr auto',
                      gap: 20,
                      alignItems: 'center',
                      width: '100%',
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: editorial,
                        fontSize: 22,
                        color: ink,
                        opacity: isOpen ? 1 : 0.4,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontFamily: display,
                        fontSize: 'clamp(20px, 2.6vw, 34px)',
                        lineHeight: 1.05,
                        letterSpacing: '-0.01em',
                        color: ink,
                        textTransform: 'uppercase',
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        border: `1.5px solid ${ink}`,
                        fontFamily: body,
                        fontSize: 16,
                        fontWeight: 400,
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        background: isOpen ? ink : 'transparent',
                        color: isOpen ? paper : ink,
                        transition: 'all .35s ease',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <motion.div
                    id={`boardroom-faq-${i}`}
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 36px 96px' }}>
                      <p
                        style={{
                          fontFamily: body,
                          fontSize: 16,
                          fontWeight: 400,
                          lineHeight: 1.6,
                          color: ink,
                          opacity: 0.8,
                          maxWidth: 760,
                        }}
                      >
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
   13 · GIANT CTA: JOIN.
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => (
  <a
    href={STRIPE_JOIN}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      background: ink,
      padding: '100px 24px 70px',
      cursor: 'pointer',
      borderTop: `1px solid ${ink}`,
      display: 'block',
      textDecoration: 'none',
    }}
    aria-label="Claim Your Seat at the Boardroom"
  >
    <div className="max-w-[1440px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: paper,
            opacity: 0.5,
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          / Your Seat In The Room + Agency Brain Core
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(72px, 22vw, 360px)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            color: paper,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}
        >
          JOIN.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p
          style={{
            fontFamily: body,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: blue,
            marginTop: 32,
            textTransform: 'uppercase',
          }}
        >
          Claim Your Seat at $299/mo (Includes Agency Brain Core) &nbsp;&rarr;
        </p>
      </Reveal>
    </div>
  </a>
);

/* ══════════════════════════════════════════════════════
   14 · FOOTER (WITH INVERTED WHITE LOGO & CLEAN BYLINE)
   ══════════════════════════════════════════════════════ */
const BoldFooter = () => (
  <footer style={{ background: ink, color: paper, padding: '60px 24px 40px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: `1px solid ${paper}1a` }}>
        <div className="col-span-2">
          <img
            src={standardLogo}
            alt="Standard Playbook"
            style={{ height: 22, marginBottom: 18, filter: 'brightness(0) invert(1)' }}
          />
          <p
            style={{
              fontFamily: body,
              fontSize: 16,
              lineHeight: 1.5,
              marginBottom: 22,
              maxWidth: 380,
              opacity: 0.85,
            }}
          >
            High-performance coaching for insurance agency owners. Raise your standard and live the playbook.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61560049427918"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }}
              className="hover:opacity-100"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/justinhark/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }}
              className="hover:opacity-100"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {[
          {
            title: 'Programs',
            items: [
              { label: 'Boardroom', href: '/boardroom' },
              { label: 'Directive', href: '/directive' },
              { label: '8-Week', href: '/sales-experience' },
              { label: 'Training', href: '/training' },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About', href: '/about' },
              { label: 'The Mirror', href: '/mirror' },
              { label: 'Contact', href: '/contact' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <p
              style={{
                fontFamily: body,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                opacity: 0.5,
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              {col.title}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {col.items.map((it) => (
                <li key={it.label} style={{ marginBottom: 8 }}>
                  <Link
                    to={it.href}
                    style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.85, textDecoration: 'none' }}
                    className="hover:opacity-100"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p style={{ fontFamily: body, fontSize: 11, opacity: 0.5, letterSpacing: '0.08em', margin: 0 }}>
          &copy; {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
        <p style={{ fontFamily: body, fontSize: 11, opacity: 0.5, letterSpacing: '0.06em', margin: 0 }}>
          By{' '}
          <Link to="/about" style={{ color: blue, textDecoration: 'none' }}>
            Justin Harkelroad, Founder &amp; Head Coach
          </Link>{' '}
          &middot; Updated October 2026
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   15 · MOBILE STICKY CTA
   ══════════════════════════════════════════════════════ */
const MobileStickyCTA = () => (
  <div
    className="fixed bottom-0 left-0 right-0 md:hidden z-40"
    style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}
  >
    <a
      href={STRIPE_JOIN}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: body,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: ink,
        background: paper,
        padding: '14px 0',
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        textTransform: 'uppercase',
        display: 'block',
        textAlign: 'center',
        textDecoration: 'none',
      }}
    >
      Claim Your Seat — $299/Mo &rarr;
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
    <OfferFacts />
    <MarqueeBands />
    <ProblemPromise />
    <BoardroomLoopSection />
    <WeeklyCallSection />
    <MirrorExperienceSection />
    <IncludesSection />
    <OwnerSystemSection />
    <PricingSection />
    <ProofSection />
    <FAQSection />
    <GiantCTA />
    <BoldFooter />
    <MobileStickyCTA />
  </div>
);

export default BoldBoardroom;
