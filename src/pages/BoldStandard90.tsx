import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import BoldNav from '@/components/BoldNav';
import StandardFitModal from '@/components/StandardFitModal';
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

/*
 * SINGLE CTA DESTINATION.
 * Every primary CTA on this page opens the site-native fit-call flow
 * (StandardFitModal -> BookingOnboardingForm -> Acuity scheduler).
 * This is the one and only action on the page. There is no second goal.
 * This page books through its own scheduler, set via StandardFitModal's
 * bookingBaseUrl prop below (FIT_CALL_URL). To repoint, change that one value.
 */
const FIT_CALL_URL = 'https://AGENCYCOACHING.as.me/standard90';
const CTA_LABEL = 'Apply for a Fit Call';
const CTA_MICROCOPY = 'A 90-minute call to see if your agency is a fit. If it is not, I will tell you.';

/*
  Hero video (square / 1:1). Paste the Vimeo or YouTube EMBED url below, e.g.
    Vimeo:   https://player.vimeo.com/video/123456789?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0
    YouTube: https://www.youtube.com/embed/abcdEFGH?autoplay=1&mute=1&loop=1&playlist=abcdEFGH
  While it is empty the hero shows the static poster image instead of a broken frame.
*/
// Self-hosted first-party native video (was Vimeo 1201628490, which 401'd at Vimeo's edge
// despite public settings). While src is empty the hero shows the static poster instead.
const HERO_VIDEO_SRC = '/video/standard90-hero.mp4';
const HERO_VIDEO_POSTER = '/video/standard90-hero-poster.jpg';

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

/* ── Primary CTA (button + fit-call microcopy) ─────────── */
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
   1 — HERO (recognition)
   ══════════════════════════════════════════════════════ */
const Hero = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, paddingTop: 56 + 28, paddingBottom: 64, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / By Application. Personal And Hands On.
        </p>
      </Reveal>

      <Reveal className="relative z-20">
        <h1 style={{
          fontFamily: display, lineHeight: 0.95, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
          maxWidth: 1200,
        }}>
          <span style={{ display: 'block', fontSize: 'clamp(34px, 4.8vw, 72px)', lineHeight: 0.95 }}>
            Your agency has never done more revenue.
          </span>
          <span className="block" style={{ color: blue, fontSize: 'clamp(34px, 4.8vw, 72px)', lineHeight: 0.95 }}>
            You have never been more tired.
          </span>
        </h1>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 mt-9 items-start">
        <Reveal delay={0.2} className="col-span-12 md:col-span-5">
          <p style={{
            fontFamily: body, fontSize: 'clamp(17px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 620,
          }}>
            A dedicated 90-day build that moves sales out of your head into a standard your team authors and signs.
          </p>
          <div style={{ marginTop: 32 }}>
            <PrimaryCTA onApply={onApply} align="left" />
          </div>
        </Reveal>

        {/* Square (1:1) hero video */}
        <Reveal delay={0.3} className="col-span-12 md:col-span-7">
          <div style={{
            position: 'relative', background: ink, padding: 8,
            width: '100%', maxWidth: 480, marginInline: 'auto',
            boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
          }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#000', overflow: 'hidden' }}>
              {HERO_VIDEO_SRC ? (
                <video
                  src={HERO_VIDEO_SRC}
                  poster={HERO_VIDEO_POSTER}
                  controls
                  playsInline
                  preload="metadata"
                  title="The Standard 90"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={HERO_VIDEO_POSTER}
                  alt="The Standard 90"
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const OfferFacts = () => (
  <section style={{ background: paper, borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${ink}` }}>
    <div className="grid grid-cols-2 md:grid-cols-4 max-w-[1440px] mx-auto px-6 md:px-10">
      {[
        ['One agency', 'A dedicated build'],
        ['Owner + manager + team', 'Built together'],
        ['90 days', 'Author, sign, live'],
        ['By application', 'Personal and hands-on'],
      ].map(([value, label], i) => (
        <div key={value} style={{ padding: '24px 16px', borderLeft: i === 0 ? 'none' : `1px solid ${ink}22` }}>
          <p style={{ fontFamily: editorial, fontSize: 'clamp(16px, 1.5vw, 21px)', lineHeight: 1.05, color: i === 2 ? blue : ink, textTransform: 'uppercase', margin: 0 }}>{value}</p>
          <p style={{ fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', lineHeight: 1.4, color: ink, opacity: 0.58, textTransform: 'uppercase', margin: '8px 0 0' }}>{label}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'THE STANDARD 90' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
  <div style={{ background: paper, padding: '36px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} />
    <style>{`
      @keyframes sp-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════════════
   2 - THE PROBLEM AND THE PROMISE
   ══════════════════════════════════════════════════════ */
const ProblemPromiseSection = () => (
  <section style={{ background: paper, padding: '104px 24px 116px' }}>
    <div className="max-w-[1180px] mx-auto">
      <div className="grid grid-cols-12 gap-10 md:gap-16">
        <Reveal className="col-span-12 md:col-span-6">
          <h2 style={{ fontFamily: display, fontSize: 'clamp(44px, 6vw, 84px)', lineHeight: 0.94, letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: '0 0 28px', fontWeight: 400 }}>
            The process lives in heads.
          </h2>
          <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.58, color: ink, opacity: 0.82, margin: 0, maxWidth: 540 }}>
            Every new producer learns by osmosis. Your sales manager coaches from instinct. You keep stepping back into the sales floor because you are still the system.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-6">
          <h2 style={{ fontFamily: display, fontSize: 'clamp(44px, 6vw, 84px)', lineHeight: 0.94, letterSpacing: '-0.01em', color: blue, textTransform: 'uppercase', margin: '0 0 28px', fontWeight: 400 }}>
            The standard lives on paper.
          </h2>
          <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.58, color: ink, opacity: 0.82, margin: 0, maxWidth: 540 }}>
            In ninety days, your agency authors one Sales Process Framework: the call, the numbers, the consequences, and the referral engine. Then the team signs it and learns to run it.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.15}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 32px)', lineHeight: 1.18, color: ink, textTransform: 'uppercase', margin: '60px 0 0', paddingTop: 28, borderTop: `1px solid ${ink}` }}>
          Built by your team, in their words, so they own it instead of waiting it out.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   3 — THE HONEST MIRROR (three layers)
   ══════════════════════════════════════════════════════ */
const mirror = [
  {
    num: '01',
    label: 'The Owner',
    vimeoId: '1201736974',
    poster: '/mirror-owner.jpg',
    body: 'You run the agency off willpower, carry the whole system in your head, and avoid the hard conversations because you do not want to be the bad guy. Revenue is up. Peace is gone.',
  },
  {
    num: '02',
    label: 'The Sales Manager',
    vimeoId: '1201736971',
    poster: '/mirror-manager.jpg',
    body: 'Coaches on vibes, guesses at what you actually want, and delivers consequences late or never, because nothing is written down.',
  },
  {
    num: '03',
    label: 'The Team',
    vimeoId: '1201736973',
    poster: '/mirror-team.jpg',
    body: 'Leads with price, loses the hard calls, hides the bad weeks and the good ones both, and waits around for leads instead of making their own.',
  },
];

const MirrorSection = () => {
  const [openVideo, setOpenVideo] = useState<string | null>(null);
  return (
  <section style={{ background: paper, padding: '40px 24px 120px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16 mt-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / The Honest Mirror
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            THE HONEST<br />MIRROR.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            Here is the truth for all three layers of your agency.
          </p>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {mirror.map((m, i) => (
          <Reveal key={m.num} delay={i * 0.08}>
            <div style={{ borderBottom: `1px solid ${ink}`, padding: '52px 0' }}>
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-12 md:col-span-4">
                  <span style={{
                    fontFamily: editorial, fontSize: 22, color: ink,
                    opacity: 0.35, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 14,
                  }}>
                    {m.num} / 03
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(30px, 4.4vw, 56px)',
                    lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
                    textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {m.label}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p style={{
                    fontFamily: body, fontSize: 'clamp(17px, 1.5vw, 20px)', fontWeight: 400, lineHeight: 1.6,
                    color: ink, opacity: 0.85, maxWidth: 520,
                  }}>
                    {m.body}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-3 flex md:justify-end">
                  <button
                    onClick={() => setOpenVideo(m.vimeoId)}
                    aria-label={`Watch ${m.label}`}
                    className="group"
                    style={{
                      position: 'relative', display: 'block', width: '100%', maxWidth: 300,
                      padding: 8, border: `1.5px solid ${ink}`, background: ink,
                      cursor: 'pointer', lineHeight: 0, boxShadow: '0 22px 48px -20px rgba(0,0,0,0.55)',
                    }}
                  >
                    <span style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: '#000' }}>
                      <img
                        src={m.poster}
                        alt={m.label}
                        loading="lazy"
                        className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
                        style={{ objectFit: 'cover', display: 'block' }}
                      />
                      <span
                        className="transition-opacity group-hover:opacity-90"
                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,11,0.18)' }}
                      >
                        <span style={{ width: 58, height: 58, borderRadius: 999, background: 'rgba(244,242,238,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={22} color={ink} fill={ink} style={{ marginLeft: 3 }} />
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p style={{
          fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 30px)', lineHeight: 1.2,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', marginTop: 48, fontWeight: 400,
        }}>
          None of that is a people problem.<br />
          <span style={{ color: blue }}>It is a standard problem.</span>
        </p>
      </Reveal>
    </div>

    <Dialog open={openVideo !== null} onOpenChange={(o) => { if (!o) setOpenVideo(null); }}>
      <DialogContent
        className="p-0 border-0"
        style={{ maxWidth: 'min(92vw, 560px)', background: ink, borderRadius: 0, border: `1.5px solid ${ink}`, gap: 0 }}
      >
        <DialogTitle className="sr-only">The Standard 90 video</DialogTitle>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#000' }}>
          {openVideo && (
            <iframe
              key={openVideo}
              src={`https://player.vimeo.com/video/${openVideo}?autoplay=1&title=0&byline=0&portrait=0`}
              title="The Standard 90 video"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              allowFullScreen
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  </section>
  );
};

/* ══════════════════════════════════════════════════════
   6 — WHY THIS IS DIFFERENT (three legs at once)
   ══════════════════════════════════════════════════════ */
const legs = [
  {
    num: '01',
    label: 'The Owner',
    body: 'You set the standard, make the decisions, do the identity work, and walk out with a path out. You do not have to be the best closer in the building. That is not the job. The job is leadership.',
  },
  {
    num: '02',
    label: 'The Sales Manager',
    body: 'Sits in the room when the decisions get made, then carries them, coaches them, and enforces them.',
  },
  {
    num: '03',
    label: 'The Team',
    body: 'Practices the document, signs it, and lives it on a random Tuesday when nobody is watching.',
  },
];

const DifferentSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 12,
        }}>
          / Why This Is Different
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 8vw, 120px)',
          lineHeight: 0.92, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          IT RUNS ON THREE<br /><span style={{ color: blue }}>LEGS AT ONCE.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, marginTop: 32, maxWidth: 820,
        }}>
          The difference is that you, your sales manager, and your team build the same standard together. The people expected to operate it help author it.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-20" style={{ borderTop: `1px solid ${ink}` }}>
        {legs.map((l, i) => (
          <Reveal key={l.num} delay={i * 0.08}>
            <div style={{
              padding: '40px 28px 48px',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
              height: '100%',
            }}>
              <span style={{
                fontFamily: editorial, fontSize: 20, color: ink,
                opacity: 0.35, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 18,
              }}>
                {l.num} / 03
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(26px, 2.6vw, 38px)',
                lineHeight: 0.95, letterSpacing: '-0.01em', color: blue,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18,
              }}>
                {l.label}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.8,
              }}>
                {l.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7 — THE PATH (See, Build, Sign, Live)
   ══════════════════════════════════════════════════════ */
const steps = [
  {
    name: 'Author it',
    week: 'Weeks 1 to 7',
    body: 'The mandate. The first ninety seconds. The gap conversation. The close and follow-up. The Daily 4. The monthly line. The ladder. One piece gets authored and locked every week in your team\'s own words.',
  },
  {
    name: 'Sign it',
    week: 'Week 8',
    body: 'The referral engine goes in. Then you, your sales manager, and every producer sign the standard you built together. Nobody is being handed somebody else\'s playbook.',
  },
  {
    name: 'Live it',
    week: 'Weeks 9 to 12',
    body: 'The scoreboard goes live. Coaching runs to the rubric instead of opinions. Hard cases get worked under pressure, and your sales manager learns to hold the standard without you in the middle.',
  },
];

const PathSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.55, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / The Path
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(32px, 4.6vw, 68px)',
          lineHeight: 0.98, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64, maxWidth: 1000,
        }}>
          Author it. Sign it. Live it.
        </h2>
      </Reveal>

      <div style={{ borderTop: `1px solid ${paper}33` }}>
        {steps.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <div style={{ borderBottom: `1px solid ${paper}33`, padding: '48px 0' }}>
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 md:col-span-4">
                  <span style={{
                    fontFamily: editorial, fontSize: 18, color: paper,
                    opacity: 0.4, letterSpacing: '0.04em', display: 'inline-block', marginBottom: 14,
                    textTransform: 'uppercase',
                  }}>
                    {s.week}
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(48px, 7vw, 96px)',
                    lineHeight: 0.9, letterSpacing: '-0.02em', color: blue,
                    textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {s.name}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-8 md:pt-2">
                  <p style={{
                    fontFamily: body, fontSize: 'clamp(17px, 1.5vw, 20px)', fontWeight: 400, lineHeight: 1.6,
                    color: paper, opacity: 0.88,
                  }}>
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.85, marginTop: 48, maxWidth: 900,
        }}>
          What you walk out holding is a Sales Process Framework, roughly twenty pages, customized to your agency, that you own, signed, and live by.
        </p>
      </Reveal>
    </div>
  </section>
);

const weeklyRhythm = [
  {
    day: 'Monday',
    title: 'The weekly frame',
    body: 'A short video from Justin lands in your private channel and frames the one piece your agency is building that week.',
  },
  {
    day: 'Tuesday to Friday',
    title: 'The daily voice thread',
    body: 'One voice prompt a day. Producers answer in their own voice while your sales manager learns to lead the conversation.',
  },
  {
    day: 'Every week',
    title: 'Two working calls',
    body: 'The owner and sales manager author and lock the standard with Justin. The team gets its own room for drills, wins, and the week\'s focus.',
  },
  {
    day: 'Sunday',
    title: 'The owner reflection',
    body: 'One private question before the next week begins. No form and no performance. Just the truth you need to carry into Monday.',
  },
];

const RhythmSection = () => (
  <section style={{ background: paper, padding: '108px 24px 120px' }}>
    <div className="max-w-[1180px] mx-auto">
      <Reveal>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)', lineHeight: 0.94,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          THE WORK MOVES<br /><span style={{ color: blue }}>EVERY DAY.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 21px)', lineHeight: 1.6, color: ink, opacity: 0.78, margin: '28px 0 56px', maxWidth: 720 }}>
          This is not a weekly call with silence between sessions. Your agency builds, practices, and reports against the same standard all week.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
        {weeklyRhythm.map((item, i) => (
          <Reveal key={item.day} delay={(i % 2) * 0.06}>
            <article style={{ minHeight: 260, padding: '36px 32px 42px', borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}` }}>
              <p style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: blue, textTransform: 'uppercase', margin: '0 0 20px' }}>{item.day}</p>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 0.98, color: ink, textTransform: 'uppercase', margin: '0 0 18px', fontWeight: 400 }}>{item.title}</h3>
              <p style={{ fontFamily: body, fontSize: 16, lineHeight: 1.62, color: ink, opacity: 0.8, margin: 0, maxWidth: 480 }}>{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7.5 — HERE IS EXACTLY WHAT YOU GET (the machine)
   ══════════════════════════════════════════════════════ */
const machineCards = [
  {
    title: 'The private daily room',
    body: 'Your Monday video, weekday voice prompts, and Sunday owner reflection all live in one private agency channel. The conversation stays active between calls.',
  },
  {
    title: 'Two live working calls',
    body: 'One weekly build call for the owner and sales manager. One weekly team call for drills, wins, hard cases, and the standard being built.',
  },
  {
    title: 'The build materials',
    body: 'Three printable workbook editions guide the owner, sales manager, and producers as they author a roughly twenty-page Sales Process Framework in their own words.',
  },
  {
    title: 'The operating system',
    body: 'The Daily 4, monthly production line, referral engine, written consequences, live scoreboard, and coaching rubric become one system the team can actually run.',
  },
];

const MachineSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 12,
        }}>
          / The Machine
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          HERE IS EXACTLY<br /><span style={{ color: blue }}>WHAT YOU GET.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, marginTop: 32, maxWidth: 820,
        }}>
          This is a build, not a course. So here is the machine that runs it, week after week, and what lands in your hands.
        </p>
      </Reveal>

      <div
        className="grid grid-cols-1 md:grid-cols-2 mt-16"
        style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}
      >
        {machineCards.map((c, i) => (
          <Reveal
            key={c.title}
            delay={(i % 2) * 0.06}
          >
            <div style={{
              borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`,
              padding: '40px 28px 48px', height: '100%',
            }}>
              <span style={{
                fontFamily: editorial, fontSize: 18, color: blue,
                opacity: 0.9, letterSpacing: '0.04em', display: 'inline-block', marginBottom: 18,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(23px, 2.1vw, 30px)',
                lineHeight: 1.0, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
              }}>
                {c.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.8, maxWidth: 520,
              }}>
                {c.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 24px)', fontWeight: 500, lineHeight: 1.55,
          color: ink, marginTop: 56, maxWidth: 960,
        }}>
          Everything points at one outcome: a standard your people authored, signed, and know how to operate without you carrying every decision.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   8 — WHAT YOU WALK OUT WITH
   ══════════════════════════════════════════════════════ */
const deliverables = [
  {
    num: '01',
    label: 'A signed framework',
    body: 'Your own Sales Process Framework, roughly twenty pages, customized to your agency and signed by you and every producer.',
  },
  {
    num: '02',
    label: 'A sales manager who leads',
    body: 'Trained to hold the standard, run the daily rhythm, and coach the team without you in the middle of it.',
  },
  {
    num: '03',
    label: 'A path out',
    body: 'A clear way to step back from the daily sales operation, because the system now lives on paper and in your people, not in your head. That is not a business result. That is your life back.',
  },
];

const WalkOutSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 12,
        }}>
          / What You Walk Out With
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          THREE THINGS. BY<br /><span style={{ color: blue }}>STRUCTURE, NOT HYPE.</span>
        </h2>
      </Reveal>

      <div style={{ borderTop: `1px solid ${ink}`, marginTop: 56 }}>
        {deliverables.map((d, i) => (
          <Reveal key={d.num} delay={i * 0.08}>
            <div style={{ borderBottom: `1px solid ${ink}`, padding: '48px 0' }}>
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 md:col-span-5">
                  <span style={{
                    fontFamily: display, fontSize: 'clamp(56px, 7vw, 96px)', color: ink,
                    opacity: 0.18, letterSpacing: '-0.03em', display: 'inline-block', lineHeight: 0.85,
                    marginBottom: 12,
                  }}>
                    {d.num}
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(26px, 3vw, 44px)',
                    lineHeight: 0.98, letterSpacing: '-0.01em', color: ink,
                    textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {d.label}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-7 md:pt-3">
                  <p style={{
                    fontFamily: body, fontSize: 'clamp(17px, 1.5vw, 20px)', fontWeight: 400, lineHeight: 1.6,
                    color: ink, opacity: 0.85, maxWidth: 560,
                  }}>
                    {d.body}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div style={{
          marginTop: 56, background: ink, color: paper, padding: '48px 36px',
        }}>
          <p style={{
            fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 24px)', fontWeight: 400, lineHeight: 1.55,
            color: paper, margin: 0, maxWidth: 920,
          }}>
            One thing the structure cannot sign for you is who you became. The owner who stopped being the operating system. The manager who became a leader. The producer who became a pro. This was never really about a sales process. The document is the vehicle. <span style={{ color: blue }}>The people are the point.</span>
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   9 — WHO I AM
   ══════════════════════════════════════════════════════ */
const WhoSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1080px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 12,
        }}>
          / Who I Am
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          WHY IT IS<br />THIS PERSONAL.
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 gap-10 md:gap-14 items-center">
        <div className="col-span-12 md:col-span-6">
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.88, marginBottom: 28,
            }}>
              I am Justin Harkelroad. Twenty years in insurance, and I still build the systems myself. I work with you, your sales manager, and your team personally, at the same time, for ninety days.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{
              fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6,
              color: ink, opacity: 0.88,
            }}>
              This work is personal and hands on. Undivided attention is the whole point, and it is the only way this actually changes anything.
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-6">
          <Reveal delay={0.2}>
            <img
              src="/s90-justin.png"
              alt="Justin Harkelroad"
              loading="lazy"
              style={{
                display: 'block', width: '100%', height: 'auto',
                maxWidth: 440, marginInline: 'auto',
                filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.28))',
              }}
            />
          </Reveal>
        </div>
      </div>
      <Reveal delay={0.12}>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-14" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
          {[
            ['20 years', 'In insurance'],
            ['Multiple', 'Business exits'],
            ['1,000+', 'Coaching sessions led'],
          ].map(([value, label]) => (
            <div key={value} style={{ padding: '28px 24px 32px', borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}` }}>
              <p style={{ fontFamily: display, fontSize: 'clamp(38px, 5vw, 66px)', lineHeight: 0.95, color: blue, margin: 0, fontWeight: 400 }}>{value}</p>
              <p style={{ fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: ink, opacity: 0.62, textTransform: 'uppercase', margin: '10px 0 0' }}>{label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   10 — THE OFFER AND THE FILTER
   ══════════════════════════════════════════════════════ */
const OfferSection = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1080px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.55, textTransform: 'uppercase', marginBottom: 12,
        }}>
          / The Offer And The Filter
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 96px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 40,
        }}>
          WHAT THIS IS, AND<br /><span style={{ color: blue }}>WHO IT IS FOR.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.9, marginBottom: 24, maxWidth: 820,
        }}>
          Ninety days. By application. I work with you, your sales manager, and your team at the same time.
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6,
          color: paper, opacity: 0.9, marginBottom: 48, maxWidth: 820,
        }}>
          This is not a course. Not a coaching package. Not another playbook to send your team and watch die.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div style={{
          border: `1.5px solid ${blue}`, padding: '40px 36px', marginBottom: 48,
        }}>
          <p style={{
            fontFamily: body, fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: 500, lineHeight: 1.55,
            color: paper, marginBottom: 24,
          }}>
            This is not for owners who want to be told what to do. It is not for owners who cannot be honest about their team. It is not for owners who flinch when a hard conversation needs to happen.
          </p>
          <p style={{
            fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 32px)', lineHeight: 1.15,
            letterSpacing: '-0.01em', color: blue, textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            If you are still reading, that is probably not you.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <PrimaryCTA onApply={onApply} align="left" onDark size="lg" />
      </Reveal>
      <Reveal delay={0.28}>
        <p style={{ fontFamily: body, fontSize: 12, lineHeight: 1.55, color: paper, opacity: 0.5, margin: '28px 0 0', maxWidth: 720 }}>
          Coaching and implementation support do not promise income or sales results. Outcomes depend on your market, your team, and your execution.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   11 — QUESTIONS (objection handling)
   ══════════════════════════════════════════════════════ */
const faqs = [
  {
    q: 'Is this just another playbook?',
    a: 'No. We do not hand you our system. You author yours, in your voice, on your pain, against your gap. You cannot wait out a standard you wrote yourself, and neither can your team.',
  },
  {
    q: 'I do not have the time for this.',
    a: 'It is about two hours a week of your time, one owner call and one team call. The daily rhythm runs without you. The entire point is to give you your time back, not take more of it.',
  },
  {
    q: 'What if my team will not buy in?',
    a: 'They build it and they sign it. People do not tolerate a standard they authored. They own it. That is the difference between this and everything you have tried before.',
  },
  {
    q: 'What do I actually walk away with?',
    a: 'A signed Sales Process Framework customized to your agency, a sales manager trained to run it, and a clear path out of the daily sales operation.',
  },
  {
    q: 'What happens during a normal week?',
    a: 'A Monday video frames the build. Voice prompts keep the team moving Tuesday through Friday. You and your sales manager have one working build call, the team has its own training call, and Sunday closes with one private owner reflection.',
  },
  {
    q: 'Is this a group program?',
    a: 'No. Standard 90 is a dedicated build for one agency. Your calls, private channel, workbooks, and final framework are built around your team and your operation.',
  },
  {
    q: 'What happens after I apply?',
    a: 'The application collects your contact information and then opens the Standard 90 calendar. The fit call is used to understand the agency, the team, and whether this is the right build for you.',
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
   12 — FINAL CLOSE
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
          IT WAS ALWAYS YOU VERSUS YOU.<br />
          <span style={{ color: blue }}>NINETY DAYS FROM NOW, YOU WIN.</span>
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
          <img src={standardLogo} alt="Standard Playbook" style={{ height: 22, marginBottom: 18 }} />
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
      {CTA_LABEL}
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldStandard90 = () => {
  const [applyOpen, setApplyOpen] = useState(false);

  const openApply = () => {
    // Fire the existing Meta Pixel conversion event on every CTA, matching
    // the site convention used in BoldMirrorScore / BookingOnboardingForm.
    try {
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.(
        'track',
        'InitiateCheckout',
        { content_name: 'Standard 90 Fit Call' },
      );
    } catch {
      /* analytics is best-effort; never block the CTA */
    }
    setApplyOpen(true);
  };

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <BoldNav />
      <Hero onApply={openApply} />
      <OfferFacts />
      <MarqueeBands />
      <ProblemPromiseSection />
      <MirrorSection />
      <DifferentSection />
      <PathSection />
      <RhythmSection />
      <MachineSection />
      <WalkOutSection />
      <WhoSection />
      <OfferSection onApply={openApply} />
      <QuestionsSection />
      <FinalClose onApply={openApply} />
      <BoldFooter />
      <ContentMeta lastUpdated="July 2026" />
      <MobileStickyCTA onApply={openApply} />
      <StandardFitModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        source="standard-90"
        bookingBaseUrl={FIT_CALL_URL}
        callLengthLabel="90-min"
      />
    </div>
  );
};

export default BoldStandard90;
