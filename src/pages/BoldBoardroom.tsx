import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
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

/* ── Stripe links ──────────────────────────────────────── */
const STRIPE_JOIN = 'https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l';

/* ── Self-hosted square (1:1) videos (Vimeo embeds black out, so served native from /public/video) ── */
const SUMMARY_VIDEO = '/video/boardroom-summary.mp4';
const SUMMARY_POSTER = '/video/boardroom-summary-poster.jpg';

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
const Hero = () => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          The Boardroom / Weekly Group Coaching / $299 Monthly
        </p>
      </Reveal>

      <Reveal>
        <h1 style={{
          fontFamily: display,
          fontSize: 'clamp(40px, 8vw, 132px)',
          lineHeight: 0.9, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
        }}>
          STOP BEING THE SMARTEST<br />
          <span className="inline-block" style={{ color: blue }}>ONE IN YOUR OFFICE.</span>
        </h1>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            One hour every Monday. Real numbers, real problems worked live, and one declared move you answer for next week.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start gap-3 flex-wrap">
          <a href="#weekly"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-black hover:text-white">
            See How Monday Runs
          </a>
          <a href={STRIPE_JOIN} target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '15px 28px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-[#2997FF] hover:border-[#2997FF]">
            Claim Your Seat &rarr;
          </a>
        </Reveal>
      </div>

      {/* Hero video (square 1:1 summary, self-hosted native) */}
      <Reveal delay={0.4}>
        <div className="mt-16">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginBottom: 14,
          }}>
            // The Boardroom In Two Minutes
          </p>
          <motion.div
            whileHover={{ rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', background: ink, padding: 8,
              width: '100%', maxWidth: 620, marginInline: 'auto',
              boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
              transform: 'rotate(-1.5deg)',
            }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#000', overflow: 'hidden' }}>
              <MoveVideo src={SUMMARY_VIDEO} poster={SUMMARY_POSTER} title="The Boardroom In Two Minutes" />
            </div>
          </motion.div>
        </div>
      </Reveal>
    </div>
  </section>
);

const OfferFacts = () => (
  <section style={{ background: paper, borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${ink}` }}>
    <div className="grid grid-cols-2 md:grid-cols-5 max-w-[1440px] mx-auto px-6 md:px-10">
      {[
        ['Monday', '1pm Eastern'],
        ['60 minutes', 'Live every week'],
        ['No replays', 'Participation matters'],
        ['$299', 'Month to month'],
        ['July 27', 'New format begins'],
      ].map(([value, label], i) => (
        <div key={value} style={{ padding: '24px 16px', borderLeft: i === 0 ? 'none' : `1px solid ${ink}22` }}>
          <p style={{ fontFamily: editorial, fontSize: 'clamp(17px, 1.6vw, 22px)', lineHeight: 1, color: i === 4 ? blue : ink, textTransform: 'uppercase', margin: 0 }}>{value}</p>
          <p style={{ fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', lineHeight: 1.4, color: ink, opacity: 0.58, textTransform: 'uppercase', margin: '8px 0 0' }}>{label}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, phrase = 'THE BOARDROOM' }: { rotate?: number; bg?: string; color?: string; phrase?: string }) => (
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
          <span aria-hidden style={{ fontFamily: editorial, fontSize: 'clamp(20px, 3vw, 38px)', color: blue }}>/</span>
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

const ProblemPromise = () => (
  <section style={{ background: paper, padding: '112px 24px 128px' }}>
    <div className="max-w-[1180px] mx-auto">
      <div className="grid grid-cols-12 gap-10 md:gap-16">
        <Reveal className="col-span-12 md:col-span-6">
          <h2 style={{ fontFamily: display, fontSize: 'clamp(38px, 5.4vw, 76px)', lineHeight: 0.95, letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: '0 0 28px', fontWeight: 400 }}>
            Alone, you negotiate with yourself.
          </h2>
          <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.58, color: ink, opacity: 0.8, margin: 0, maxWidth: 540 }}>
            You are the smartest person in your agency, and that is the problem. The same hire, confrontation, and number keep cycling because nobody in the building can challenge your thinking.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-6">
          <h2 style={{ fontFamily: display, fontSize: 'clamp(38px, 5.4vw, 76px)', lineHeight: 0.95, letterSpacing: '-0.01em', color: blue, textTransform: 'uppercase', margin: '0 0 28px', fontWeight: 400 }}>
            In the room, you answer for it.
          </h2>
          <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.58, color: ink, opacity: 0.8, margin: 0, maxWidth: 540 }}>
            Every Monday, you return and report to owners running the same race. Your numbers go on the table, your situation gets worked live, and you declare the move you will answer for next week.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.15}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(20px, 2.2vw, 30px)', lineHeight: 1.2, color: ink, textTransform: 'uppercase', margin: '64px 0 0', paddingTop: 28, borderTop: `1px solid ${ink}` }}>
          Built for insurance agency owners and the key leaders they bring into the work.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   INCLUDES
   ══════════════════════════════════════════════════════ */
const includedItems: React.ReactNode[] = [
  <>The Monday Room<span style={{ display: 'block', fontFamily: body, textTransform: 'none', fontSize: 13, fontWeight: 400, letterSpacing: 0, lineHeight: 1.4, opacity: 0.6, marginTop: 6 }}>Sixty minutes live, every Monday at 1pm Eastern</span></>,
  <>Daily Telegram Room<span style={{ display: 'block', fontFamily: body, textTransform: 'none', fontSize: 13, fontWeight: 400, letterSpacing: 0, lineHeight: 1.4, opacity: 0.6, marginTop: 6 }}>Voice notes, reflections, and accountability with Justin and the room</span></>,
  <>Direct Line To Justin<span style={{ display: 'block', fontFamily: body, textTransform: 'none', fontSize: 13, fontWeight: 400, letterSpacing: 0, lineHeight: 1.4, opacity: 0.6, marginTop: 6 }}>Telegram voice or video, answered in his daily blocks</span></>,
  <>Agency Brain Core Access<span style={{ display: 'block', fontFamily: body, textTransform: 'none', fontSize: 13, fontWeight: 400, letterSpacing: 0, lineHeight: 1.4, opacity: 0.6, marginTop: 6 }}><span style={{ color: blue }}>AI</span> tools, Core 4 tracking, and the daily Flow library</span></>,
  <>The Mirror<span style={{ display: 'block', fontFamily: body, textTransform: 'none', fontSize: 13, fontWeight: 400, letterSpacing: 0, lineHeight: 1.4, opacity: 0.6, marginTop: 6 }}>The self-assessment that shows where the business actually stands</span></>,
  <>20 <span style={{ color: blue }}>AI</span> Calls Scored Per Month<span style={{ display: 'block', fontFamily: body, textTransform: 'none', fontSize: 13, fontWeight: 400, letterSpacing: 0, lineHeight: 1.4, opacity: 0.6, marginTop: 6 }}>Standard Call Scoring included with membership</span></>,
];

const IncludesSection = () => (
  <section id="includes" style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          THE ROOM STAYS OPEN<br />
          <span style={{ color: blue }}>BETWEEN MONDAYS.</span>
        </h2>
        <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.6, color: ink, opacity: 0.75, margin: '28px 0 56px', maxWidth: 720 }}>
          The call is one hour. The accountability runs all week through the room, direct access, daily practices, and the operating tools included with membership.
        </p>
      </Reveal>

      <ul style={{
        listStyle: 'none', margin: 0, padding: 0,
        borderTop: `1px solid ${ink}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      }}>
        {includedItems.map((item, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li style={{
              borderBottom: `1px solid ${ink}`,
              padding: '24px 16px',
              display: 'flex', alignItems: 'center', gap: 16,
              minHeight: 80,
            }}
              className="hover:bg-black/[0.03] transition-colors"
            >
              <span style={{
                fontFamily: editorial, fontSize: 16, color: ink,
                opacity: 0.4, letterSpacing: '-0.01em', minWidth: 32,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ color: blue, fontSize: 18, lineHeight: 1, flexShrink: 0, fontWeight: 700 }}>&#10003;</span>
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(15px, 1.3vw, 18px)',
                lineHeight: 1.2, letterSpacing: '-0.01em',
                color: ink, textTransform: 'uppercase', fontWeight: 400,
              }}>
                {item}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   HOW EVERY MONDAY RUNS
   ══════════════════════════════════════════════════════ */
const weeklyMoves = [
  {
    label: 'Return And Report',
    body: "You come in with your numbers and last week's declaration. Did you do what you said you would do? The truth is on the table before the call starts.",
    videos: [{ src: '/video/boardroom-return-report.mp4', poster: '/video/boardroom-return-report-poster.jpg', title: 'Return And Report' }],
  },
  {
    label: 'Get Worked Live',
    body: 'Justin and Corina teach the pattern they are seeing across agencies. Breakouts put it against your business, then real owners bring real situations to the hot seat and work them all the way through.',
    videos: [
      { src: '/video/boardroom-breakout.mp4', poster: '/video/boardroom-breakout-poster.jpg', title: 'The Breakout' },
      { src: '/video/boardroom-hot-seat.mp4', poster: '/video/boardroom-hot-seat-poster.jpg', title: 'The Hot Seat' },
    ],
  },
  {
    label: 'Declare The Domino',
    body: 'You do not leave with notes. You leave with one move, declared on the record in front of the room. Seven days later, you return and answer for it.',
    videos: [{ src: '/video/boardroom-domino.mp4', poster: '/video/boardroom-domino-poster.jpg', title: 'Declare The Domino' }],
  },
];

/* Square move video: autoplays muted + loops while in view, native controls let you unmute */
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
    {/* dark title band */}
    <div style={{ background: ink, padding: '96px 24px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / The Weekly Call
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            ONE HOUR.<br /><span style={{ color: blue }}>THREE MOVES.</span>
          </h2>
        </Reveal>
      </div>
    </div>

    {/* light steps */}
    <div style={{ background: paper, padding: '80px 24px 120px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 720, marginBottom: 48,
          }}>
            Every Monday at 1pm Eastern, the same live rhythm: return and report, get worked in the room, and declare the move you will answer for next week.
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-8 lg:gap-6">
          {weeklyMoves.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} className={`col-span-12 ${m.videos.length > 1 ? 'lg:col-span-6' : 'lg:col-span-3'}`}>
              <div style={{ borderTop: `1px solid ${ink}`, paddingTop: 18 }}>
                <div className="flex items-baseline gap-3" style={{ marginBottom: 16 }}>
                  <span style={{
                    fontFamily: editorial, fontSize: 16, color: ink,
                    opacity: 0.35, letterSpacing: '-0.01em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(20px, 1.9vw, 27px)',
                    lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
                    textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {m.label}
                  </h3>
                </div>
                <div className={`grid ${m.videos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`} style={{ marginBottom: 18 }}>
                  {m.videos.map((video) => (
                    <div key={video.src} style={{ position: 'relative', background: ink, padding: 6, boxShadow: '0 24px 48px -20px rgba(0,0,0,0.45)' }}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#000', overflow: 'hidden' }}>
                        <MoveVideo src={video.src} poster={video.poster} title={video.title} />
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                  color: ink, opacity: 0.75,
                }}>
                  {m.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.75, marginTop: 44, maxWidth: 760,
          }}>
            No replays, on purpose. The value lives in the room, and the room only works when you show up ready to give value, get worked, and answer for what you declared.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PRICING: bold pricing block
   ══════════════════════════════════════════════════════ */
const PricingSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Claim Your Seat
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-7">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, opacity: 0.6, textTransform: 'uppercase', marginBottom: 12,
            }}>
              Boardroom Membership &middot; Monthly
            </p>
            <div style={{ position: 'relative', display: 'inline-block', paddingBottom: 8 }}>
              <h2 style={{
                fontFamily: display, fontSize: 'clamp(72px, 18vw, 260px)',
                lineHeight: 0.85, letterSpacing: '-0.04em', color: ink,
                margin: 0, fontWeight: 400, position: 'relative', zIndex: 1,
              }}>
                $299
              </h2>
              <p style={{
                fontFamily: editorial, fontSize: 'clamp(22px, 2.8vw, 40px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: blue,
                margin: 0, marginTop: 16,
                fontWeight: 400, textTransform: 'uppercase',
                position: 'relative', zIndex: 2,
              }}>
                / month
              </p>
            </div>

            <p style={{
              fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
              color: ink, opacity: 0.75, marginTop: 28, maxWidth: 520,
            }}>
              One live hour every Monday, the room between calls, and the operating tools that keep the work moving. No contract. Cancel anytime in Stripe.
            </p>

            <div className="mt-10">
              <a href={STRIPE_JOIN} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
                  padding: '16px 30px', transition: 'all .25s',
                }}
                className="hover:bg-[#2997FF]">
                Claim Your Seat &rarr;
              </a>
            </div>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Reveal delay={0.1}>
            <div style={{
              background: ink, color: paper, padding: '32px 28px',
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                color: blue, textTransform: 'uppercase', marginBottom: 14,
              }}>
                The Standard Promise
              </p>
              <p style={{
                fontFamily: display, fontSize: 'clamp(24px, 2.8vw, 32px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14,
              }}>
                Stop guessing.<br />Start leading.
              </p>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                color: paper, opacity: 0.8,
              }}>
                You will always know the next move you declared and the date you have to answer for it. The room brings the pressure. You bring the execution.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal delay={0.15}>
        <p style={{ fontFamily: body, fontSize: 11, lineHeight: 1.55, color: ink, opacity: 0.5, margin: '56px 0 0', maxWidth: 860 }}>
          Live only. Recordings are not posted. No income or sales results are promised or implied; outcomes depend on your market and your execution.
        </p>
      </Reveal>
    </div>
  </section>
);

const ProofSection = () => (
  <section style={{ background: ink, color: paper, padding: '112px 24px' }}>
    <div className="max-w-[1180px] mx-auto">
      <Reveal>
        <h2 style={{ fontFamily: display, fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.94, letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400 }}>
          OPERATOR PROOF.<br /><span style={{ color: blue }}>NOT THEORY.</span>
        </h2>
        <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.6, color: paper, opacity: 0.76, margin: '28px 0 52px', maxWidth: 720 }}>
          Led by Justin and Corina. Built from the patterns that repeat inside real insurance agencies, not from a generic coaching curriculum.
        </p>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: `1px solid ${paper}44` }}>
        {[
          ['20 years', 'In insurance'],
          ['$3.6M', 'Agency exit in 2019'],
          ['234', 'Coaching sessions analyzed'],
          ['73%', 'Of 8-Week graduates continue into Boardroom or Directive'],
        ].map(([value, label], i) => (
          <Reveal key={value} delay={i * 0.05}>
            <div style={{ padding: '30px 20px 10px', borderLeft: i === 0 ? 'none' : `1px solid ${paper}2e`, minHeight: 150 }}>
              <p style={{ fontFamily: display, fontSize: 'clamp(38px, 5vw, 66px)', lineHeight: 0.9, color: blue, textTransform: 'uppercase', margin: 0 }}>{value}</p>
              <p style={{ fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', lineHeight: 1.45, color: paper, opacity: 0.62, textTransform: 'uppercase', margin: '14px 0 0', maxWidth: 210 }}>{label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   IT'S NOT JUST BUSINESS: Being / Body / Balance
   ══════════════════════════════════════════════════════ */
const ownerSystem = [
  { label: 'Body', body: 'Track the habits and health that determine the energy you bring into the agency.' },
  { label: 'Being', body: 'Use daily practices to make decisions from conviction instead of reaction.' },
  { label: 'Balance', body: 'Keep marriage, family, and mission visible while the business grows.' },
  { label: 'Business', body: 'Turn what surfaces in the room into a measurable move inside the agency.' },
];

const OwnerSystemSection = () => (
  <section style={{ background: paper, padding: '112px 24px 128px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1180px] mx-auto">
      <Reveal>
        <h2 style={{ fontFamily: display, fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.94, letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400 }}>
          THE BUSINESS IS NOT<br /><span style={{ color: blue }}>SEPARATE FROM THE OWNER.</span>
        </h2>
        <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.6, color: ink, opacity: 0.76, margin: '28px 0 52px', maxWidth: 760 }}>
          Boardroom members get Agency Brain Core access so the work continues across Body, Being, Balance, and Business between live sessions.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ borderTop: `1px solid ${ink}` }}>
        {ownerSystem.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.05}>
            <div style={{ padding: '28px 20px 8px', borderLeft: i === 0 ? 'none' : `1px solid ${ink}22`, minHeight: 180 }}>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(24px, 2.6vw, 36px)', lineHeight: 1, color: i === 3 ? blue : ink, textTransform: 'uppercase', margin: '0 0 14px', fontWeight: 400 }}>{item.label}</h3>
              <p style={{ fontFamily: body, fontSize: 14, lineHeight: 1.55, color: ink, opacity: 0.7, margin: 0 }}>{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(18px, 2vw, 26px)', lineHeight: 1.3, color: ink, textTransform: 'uppercase', margin: '52px 0 0', paddingTop: 24, borderTop: `1px solid ${ink}33` }}>
          Daily Flows turn strategy, conflict, learning, gratitude, and faith into one action you can carry into the agency.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FAQ: bold accordion
   ══════════════════════════════════════════════════════ */
const faq = [
  { q: 'Who is The Boardroom for?', a: 'Insurance agency owners who want peer pressure, direct access, and a weekly execution rhythm. Owners may also bring the key leaders they choose to put into the work.' },
  { q: 'What happens every Monday?', a: 'At 1pm Eastern, the room meets live for sixty minutes. You return and report, work real situations through breakouts and hot seats, then declare the one move you will answer for next week.' },
  { q: 'Are recordings available?', a: 'No. Recordings are not posted on purpose. The value comes from showing up prepared, contributing to the room, and being witnessed when you declare the next move.' },
  { q: 'What happens between calls?', a: 'The Telegram room stays active all week. Members share voice notes and reflections, and Justin answers direct voice or video messages in his daily response blocks.' },
  { q: 'What Agency Brain access is included?', a: 'Boardroom includes Agency Brain Core access, the daily Flow library, Core 4 tracking, The Mirror self-assessment, and twenty AI-scored calls per month.' },
  { q: 'Is there a contract?', a: 'No. Membership is $299 a month, billed monthly. You can cancel anytime through Stripe.' },
  { q: 'What if I miss a Monday?', a: 'There is no replay. Stay connected through the Telegram room, keep working your declaration, and return ready to report the following Monday.' },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 28,
          }}>
            / The Questions
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
          }}>
            THE PRACTICAL<br /><span style={{ color: blue }}>QUESTIONS.</span>
          </h2>
        </Reveal>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <li style={{
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
                    width: '100%', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
                  }}>
                    <span style={{
                      fontFamily: editorial, fontSize: 22, color: ink,
                      opacity: isOpen ? 1 : 0.4, letterSpacing: '-0.01em',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontFamily: display, fontSize: 'clamp(20px, 2.6vw, 34px)',
                      lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                      textTransform: 'uppercase', margin: 0, fontWeight: 400,
                    }}>
                      {item.q}
                    </span>
                    <span aria-hidden style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, border: `1.5px solid ${ink}`,
                      fontFamily: body, fontSize: 16, fontWeight: 400,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      background: isOpen ? ink : 'transparent',
                      color: isOpen ? paper : ink,
                      transition: 'all .35s ease',
                    }}>
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
                      <p style={{
                        fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                        color: ink, opacity: 0.75, maxWidth: 720,
                      }}>
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
   GIANT CTA: JOIN.
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => (
  <a
    href={STRIPE_JOIN}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      background: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
      display: 'block', textDecoration: 'none',
    }}
    aria-label="Claim Your Seat at the Boardroom">
    <div className="max-w-[1440px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Your Seat
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
          lineHeight: 0.82, letterSpacing: '-0.03em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          JOIN.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
        }}>
          Claim Your Seat at $299/mo &nbsp;&rarr;
        </p>
      </Reveal>
    </div>
  </a>
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
            { label: 'Boardroom', href: '/boardroom' },
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
          &copy; {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   MOBILE STICKY CTA
   ══════════════════════════════════════════════════════ */
const MobileStickyCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40"
    style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}>
    <a href={STRIPE_JOIN} target="_blank" rel="noopener noreferrer"
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase',
        display: 'block', textAlign: 'center', textDecoration: 'none',
      }}>
      Claim Your Seat &rarr;
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
    <WeeklyCallSection />
    <IncludesSection />
    <OwnerSystemSection />
    <PricingSection />
    <ProofSection />
    <FAQSection />
    <GiantCTA />
    <BoldFooter />
    <ContentMeta lastUpdated="July 2026" />
    <MobileStickyCTA />
  </div>
);

export default BoldBoardroom;
