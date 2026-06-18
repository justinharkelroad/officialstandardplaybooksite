import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
  CTA destination: the single action is "Apply for a Fit Call".
  Clicking opens a name-only intake, then redirects straight to
  the booking calendar (see ApplyModal / BOOKING_URL below).
  To change the calendar, edit BOOKING_URL in one place.
*/
const BOOKING_URL = 'https://AGENCYCOACHING.as.me/?appointmentType=94542884';

const CTA_MICROCOPY = 'A short call to see if your team is a fit. If it is not, I will tell you.';

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

/* ── Primary CTA (single action, repeated) ─────────────── */
const PrimaryCTA = ({
  onApply,
  dark = false,
  align = 'left',
}: { onApply: () => void; dark?: boolean; align?: 'left' | 'center' }) => (
  <div style={{ textAlign: align, marginTop: 8 }}>
    <button
      onClick={onApply}
      style={{
        fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em',
        color: dark ? ink : '#fff', background: dark ? paper : ink,
        textTransform: 'uppercase', padding: '17px 34px',
        border: `1.5px solid ${dark ? paper : ink}`, cursor: 'pointer', transition: 'all .25s',
      }}
      className={dark ? 'hover:bg-[#2997FF] hover:text-white hover:border-[#2997FF]' : 'hover:bg-[#2997FF] hover:border-[#2997FF]'}
    >
      Apply for a Fit Call
    </button>
    <p style={{
      fontFamily: body, fontSize: 13, fontWeight: 400, lineHeight: 1.5,
      color: dark ? paper : ink, opacity: 0.6, marginTop: 14,
      maxWidth: 420, marginInline: align === 'center' ? 'auto' : undefined,
    }}>
      {CTA_MICROCOPY}
    </p>
  </div>
);

/* ══════════════════════════════════════════════════════
   1 - HERO (recognition)
   ══════════════════════════════════════════════════════ */
const Hero = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 72, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          Weekly or Biweekly. One Team, One Standard. By Application.
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 items-start">
        <Reveal className="col-span-12 relative z-20">
          <h1 style={{
            fontFamily: display, lineHeight: 0.92, letterSpacing: '-0.02em',
            color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
          }}>
            <span style={{ display: 'block', fontSize: 'clamp(38px, 8vw, 120px)', lineHeight: 0.92 }}>The pain does not live</span>
            <span style={{ display: 'block', fontSize: 'clamp(38px, 8vw, 120px)', lineHeight: 0.92 }}>in your numbers.</span>
            <span className="block" style={{ color: blue, fontSize: 'clamp(38px, 8vw, 120px)', lineHeight: 0.92 }}>It lives in your team.</span>
          </h1>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            The Team Standard is an accountability system for the people your agency runs on. I become the teammate they did not know they were missing, and everything I see comes straight back to you.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start">
          <PrimaryCTA onApply={onApply} />
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'THE TEAM STANDARD' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="ONE TEAM, ONE STANDARD" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="A MAN ON THE INSIDE" />
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
   2 - WHY YOU NEVER GET THE TRUTH
   ══════════════════════════════════════════════════════ */
const WhyNeverTruth = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[900px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Why You Never Get The Truth
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 28 }}>
          You have tried to be the accountability. You are tired. And here is the part nobody says out loud: they were never going to tell you the real story anyway.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 28 }}>
          You sign their checks. People do not get honest with the person who signs their checks.
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 28 }}>
          Here is what is actually happening inside of your team. They lead with price, because price is easy and the truth is hard. They wait for leads instead of making their own. They hide the bad weeks, and plenty of them hide the good ones too. And when you walk over to hold somebody accountable, you get the version of the story they want you to hear.
        </p>
      </Reveal>
      <Reveal delay={0.14}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 48 }}>
          Your sales manager coaches on vibes, because nothing is on the board and nobody is holding the line.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <p style={{
          fontFamily: display, fontSize: 'clamp(28px, 4.4vw, 60px)', lineHeight: 1.02,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', fontWeight: 400, margin: 0,
        }}>
          It is not a skills problem. It is not a leads problem. It is an <span style={{ color: blue }}>accountability</span> problem, and it is a <span style={{ color: blue }}>truth</span> problem.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   3 - THE COST OF STAYING (contrasting band)
   ══════════════════════════════════════════════════════ */
const CostOfStaying = () => (
  <section style={{ background: ink, color: paper, padding: '110px 24px' }}>
    <div className="max-w-[1000px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Cost Of Staying
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 400, lineHeight: 1.5, color: paper, opacity: 0.92, marginBottom: 28 }}>
          The quotes that never got worked. The hard call they led with price on. The bad week nobody told you about until it was a bad month.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 400, lineHeight: 1.5, color: paper, opacity: 0.92, margin: 0 }}>
          Every week it stays hidden is a week you pay for it twice. Once in the lost business, and once in carrying the whole thing on your own back.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   4 - THIRTY DAYS IN (the possibility, emotional peak)
   ══════════════════════════════════════════════════════ */
const ThirtyDaysIn = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: blue, color: ink, padding: '130px 24px' }}>
    <div className="max-w-[1000px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, opacity: 0.65, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / The Possibility
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(48px, 9vw, 140px)', lineHeight: 0.92,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 48,
        }}>
          Thirty days in.
        </h2>
      </Reveal>

      {[
        'Picture your team thirty days from now.',
        'Every person reports against the numbers you set. Outbound calls. Quoted households. Talk time. Items. That bar is yours. On top of it, each person owns the one domino they are chasing that week, and their own personal goals.',
        'Before every call with me, those numbers hit the board. They earn the call by doing the work first.',
        'Then we get on, without you, and we put the board up, and we talk straight about what is really going on behind those numbers. The things they would never say with you in the room finally come out. That is where the miscommunication has been hiding the whole time.',
        'And you get the report every cycle. Who moved. Who slipped. Who is pulling weight and who is not.',
      ].map((p, i) => (
        <Reveal key={i} delay={0.08 + i * 0.04}>
          <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.92, marginBottom: 26 }}>
            {p}
          </p>
        </Reveal>
      ))}

      <Reveal delay={0.34}>
        <p style={{
          fontFamily: display, fontSize: 'clamp(26px, 4vw, 54px)', lineHeight: 1.04,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', fontWeight: 400, margin: '20px 0 48px',
        }}>
          You finally see the truth, without being the bad guy standing over them.
        </p>
      </Reveal>
      <Reveal delay={0.4}>
        <PrimaryCTA onApply={onApply} />
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   5 - WHY THIS IS DIFFERENT
   ══════════════════════════════════════════════════════ */
const WhyDifferent = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-8">
        <Reveal className="col-span-12 md:col-span-5">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 18,
          }}>
            / The Difference
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 6vw, 92px)', lineHeight: 0.95,
            letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            Why this is different.
          </h2>
        </Reveal>
        <div className="col-span-12 md:col-span-7">
          <Reveal delay={0.1}>
            <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 28 }}>
              Nobody, not one coach you have ever hired, has sat your team in a room without you in it and gotten them to say the real thing out loud.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, margin: 0 }}>
              The report your sales manager hands me is leadership&apos;s version of reality. The floor, with you out of the room, is the team&apos;s version. The gap between those two is where the miscommunication has been living the whole time. I work both in the same session. That is the part no one else does.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   6 - HOW IT WORKS
   ══════════════════════════════════════════════════════ */
const howBlocks = [
  {
    label: 'Where it lives',
    body: [
      'A private channel for your team, just them and me. We run on voice notes, not text, because a voice note carries tone and conviction a typed message never will.',
      'Your sales manager may sit in that channel, and on the calls, if I decide it serves the team. That is my call to make.',
      'You step back from this room on purpose. A team that tells the truth without the boss watching is the strongest team you can build, and the day you are in the room is the day the truth leaves it. You are not shut out. I am your man on the inside, and everything I see comes straight back to you.',
    ],
  },
  {
    label: 'The weekly rhythm',
    body: 'Three drops a week. Monday, they declare where their head is, the one domino they are chasing, and their own goals. Wednesday, where are you at. Friday, on track or off track. In between, they bring me questions whenever they need to, and I answer in the morning and at night, never in the noise of the business day.',
  },
  {
    label: 'The report',
    body: 'The day before every call, your sales manager sends the team\'s snapshot. The numbers you set. I never chase data. No snapshot, no call.',
  },
  {
    label: 'The call',
    body: 'Fifty minutes, owner-free, and it runs the same way every time. The board goes up. We read it. We open the floor on the gaps. Everyone owns their week. I send them off with the one thing to carry.',
  },
];

const HowItWorks = () => (
  <section style={{ background: paper, padding: '40px 24px 120px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="mt-16 mb-12">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / How It Works
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)', lineHeight: 0.95,
            letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            How it works.
          </h2>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {howBlocks.map((b, i) => (
          <Reveal key={b.label} delay={i * 0.06}>
            <div style={{ borderBottom: `1px solid ${ink}`, padding: '40px 0' }}>
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 md:col-span-4">
                  <span style={{
                    fontFamily: editorial, fontSize: 18, color: ink, opacity: 0.35,
                    letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 12,
                  }}>
                    {`0${i + 1}`} / 04
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(26px, 3.2vw, 44px)', lineHeight: 0.98,
                    letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {b.label}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-8">
                  {(Array.isArray(b.body) ? b.body : [b.body]).map((para, j, arr) => (
                    <p key={j} style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.85, margin: 0, marginBottom: j < arr.length - 1 ? 18 : 0 }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p style={{
          fontFamily: display, fontSize: 'clamp(28px, 4.4vw, 60px)', lineHeight: 1.02,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', fontWeight: 400, marginTop: 56,
        }}>
          You put a man on the <span style={{ color: blue }}>inside</span>. Everything that happens in that room comes back to you.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7 - HERE IS EXACTLY WHAT YOU GET (card grid, no price)
   ══════════════════════════════════════════════════════ */
const getCards = [
  { title: 'A private channel for your team', body: 'A private space inside a simple messaging app, just your team and me. The heartbeat between calls.' },
  { title: 'Me in their pocket', body: 'They send a voice note when they are stuck. I answer before the day starts and after it ends, so it never becomes noise in the middle of their day.' },
  { title: 'Three drops a week', body: 'Monday declare, Wednesday check, Friday verdict. A standing rhythm that keeps the standard in front of them.' },
  { title: 'The accountability call', body: 'A fifty minute owner-free call, built on the scoreboard, run the same way every time.' },
  { title: 'The scoreboard', body: 'Every person\'s numbers, against the bar you set, in front of each other, every cycle. Nowhere to hide.' },
  { title: 'Your report, every cycle', body: 'Who moved, who slipped, who is pulling weight. The truth in your hands, so you lead with better information than you have ever had.' },
  { title: 'A sales manager who holds the line', body: 'Week by week, your manager learns to run the rhythm and hold the standard.' },
];

const WhatYouGet = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / What You Get
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64,
        }}>
          Here is exactly<br />what you get.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ borderTop: `1px solid ${paper}33`, borderLeft: `1px solid ${paper}33` }}>
        {getCards.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.06}>
            <div style={{
              padding: '36px 28px', borderBottom: `1px solid ${paper}33`, borderRight: `1px solid ${paper}33`,
              height: '100%',
            }}>
              <h3 style={{
                fontFamily: editorial, fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.1,
                letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: '0 0 14px', fontWeight: 400,
              }}>
                {c.title}
              </h3>
              <p style={{ fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55, color: paper, opacity: 0.78, margin: 0 }}>
                {c.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   8 - YOUR TWO WAYS IN (the ONLY section with prices)
   ══════════════════════════════════════════════════════ */
const TwoWaysIn = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 18,
        }}>
          / Two Ways In
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 20,
        }}>
          Your two ways in.
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.8, maxWidth: 680, marginBottom: 56 }}>
          You choose your level of access, and your report comes on that same rhythm.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: `1px solid ${ink}` }}>
        {/* Weekly */}
        <Reveal>
          <div style={{ padding: '48px 36px', borderBottom: `1px solid ${ink}`, height: '100%' }} className="md:!border-b-0 md:!border-r border-b" >
            <p style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: blue, textTransform: 'uppercase', marginBottom: 18 }}>
              Weekly
            </p>
            <p style={{ fontFamily: body, fontSize: 17, fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.85, marginBottom: 28 }}>
              Four fifty-minute calls a month. A report every week. Full intensity, for the team that needs the heat turned all the way up.
            </p>
            <p style={{
              fontFamily: display, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.9,
              letterSpacing: '-0.02em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
            }}>
              $4,000<span style={{ fontFamily: editorial, fontSize: 'clamp(16px, 2vw, 22px)', opacity: 0.6, marginLeft: 10 }}>a month</span>
            </p>
          </div>
        </Reveal>
        {/* Biweekly */}
        <Reveal delay={0.08}>
          <div style={{ padding: '48px 36px', height: '100%' }}>
            <p style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: blue, textTransform: 'uppercase', marginBottom: 18 }}>
              Biweekly
            </p>
            <p style={{ fontFamily: body, fontSize: 17, fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.85, marginBottom: 28 }}>
              Two fifty-minute calls a month. A report every two weeks. The standard rhythm.
            </p>
            <p style={{
              fontFamily: display, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.9,
              letterSpacing: '-0.02em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
            }}>
              $2,500<span style={{ fontFamily: editorial, fontSize: 'clamp(16px, 2vw, 22px)', opacity: 0.6, marginLeft: 10 }}>a month</span>
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.8, maxWidth: 820, margin: '48px 0 40px' }}>
          Both run the same daily engine inside the channel. Both are dedicated to your team alone, nothing shared, nothing recycled. By application, and I cap it to a handful of teams, because it is me in there, not a bench of junior coaches.
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.8, maxWidth: 820, margin: '0 0 40px' }}>
          No contract. Month to month. You can walk any time, and so can I. I do not trap a team into accountability, and I do not coach one that does not want to be there. The only thing holding this together is that it works.
        </p>
      </Reveal>
      <Reveal delay={0.14}>
        <PrimaryCTA onApply={onApply} />
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   9 - WHAT I DO NOT MOVE OFF OF (principles)
   ══════════════════════════════════════════════════════ */
const principles = [
  { lead: 'The truth lives in the team.', rest: 'So that is where I go. Person first, producer second.' },
  { lead: 'You set the bar. They own the chase.', rest: 'You set the numbers they are held to. They bring their own weekly domino and their own personal goals on top. The bar is yours. The ownership is theirs.' },
  { lead: 'They report to earn the call.', rest: 'The work comes first. The call is the reward, not the obligation.' },
  { lead: 'The floor is theirs.', rest: 'No owner in the room, and no owner in the channel. You cannot get the truth out of people who are performing for the boss.' },
  { lead: 'Protect the words, report the work.', rest: 'What gets said on the floor stays on the floor. What gets done, the numbers, the misses, the wins, goes straight to you.' },
  { lead: 'The consequence is yours.', rest: 'They are not my employees. I bring the truth and the standard. You bring the teeth. Truth without a consequence is just a conversation.' },
];

const Principles = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1100px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 18,
        }}>
          / Non-Negotiables
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 48,
        }}>
          What I do not move off of.
        </h2>
      </Reveal>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {principles.map((p, i) => (
          <Reveal key={p.lead} delay={i * 0.05}>
            <div style={{ borderBottom: `1px solid ${ink}`, padding: '32px 0' }}>
              <p style={{ margin: 0, fontFamily: body, fontSize: 'clamp(17px, 1.7vw, 22px)', lineHeight: 1.5, color: ink }}>
                <span style={{ fontWeight: 700 }}>{p.lead}</span>{' '}
                <span style={{ opacity: 0.8 }}>{p.rest}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   10 - WHY THIS IS ME, NOT A COURSE (bio)
   ══════════════════════════════════════════════════════ */
const WhyMe = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1000px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Me, Not A Course
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <p style={{ fontFamily: body, fontSize: 'clamp(20px, 2.4vw, 32px)', fontWeight: 400, lineHeight: 1.45, color: paper, opacity: 0.92, margin: 0 }}>
          I am Justin Harkelroad. Twenty years in insurance, and I still build the systems myself. I do not hand your team off to a junior coach. I embed in your team personally and I run the standard myself. That is why I only take a handful of teams.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   11 - WHAT THIS IS, AND WHO IT IS FOR (offer + filter)
   ══════════════════════════════════════════════════════ */
const OfferAndFilter = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1000px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 18,
        }}>
          / Who It Is For
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(38px, 6vw, 92px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 40,
        }}>
          What this is,<br />and who it is for.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 26 }}>
          I embed in your team, and I become the accountability system you have never had.
        </p>
      </Reveal>
      <Reveal delay={0.14}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.9, marginBottom: 48 }}>
          This is not a course. Not training calls. Not somebody teaching your people how to sell. You set the numbers they are held to, I run the standard, I hold them to it in front of each other, and I give them a floor to finally tell the truth. You stay out so they get honest. You get the report so you can lead.
        </p>
      </Reveal>

      {/* Disqualifier - distinct, confident treatment */}
      <Reveal delay={0.18}>
        <div style={{ background: ink, color: paper, padding: '48px 36px', marginBottom: 48 }}>
          <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.7vw, 23px)', fontWeight: 400, lineHeight: 1.5, color: paper, opacity: 0.92, marginBottom: 24 }}>
            This is not for the owner who wants to sit in the room and run it. It is not for the owner who cannot let their team be told the truth without them. And it is not for the owner who will not enforce what the report shows.
          </p>
          <p style={{
            fontFamily: display, fontSize: 'clamp(22px, 3vw, 40px)', lineHeight: 1.05,
            letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', fontWeight: 400, margin: 0,
          }}>
            If you are still reading, that is probably not you.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.22}>
        <PrimaryCTA onApply={onApply} />
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   12 - QUESTIONS (accordion)
   ══════════════════════════════════════════════════════ */
const faq = [
  {
    q: 'Why am I not in the room?',
    a: 'Because the day you are in it is the day they go back to performing. This is a leadership move, not a demotion. You put a man on the inside, and you see more than you ever did from inside the room: who moved, who slipped, who is pulling weight, all of it comes straight back to you.',
  },
  {
    q: 'Will bringing in a third party undermine me with my team?',
    a: 'No. This runs back to you, not around you. You set the targets, you hold the consequences, and I coach them toward your standard, not mine. You are the one who built the accountability, so you come out with more authority, not less. I am on your side of the table, always.',
  },
  {
    q: 'How is this different from coaching my team, or sales training?',
    a: 'Training fixes a skill gap. This fixes a truth and accountability gap. You set the numbers, I run the standard and hold them to it. I am not teaching them to sell.',
  },
  {
    q: 'Who sets the numbers?',
    a: 'You do, or your manager does. The four you care about, outbound calls, quoted households, talk time, items, or whatever you choose. The team does not get to set their own bar. They report against yours, and they bring their own weekly domino and personal goals on top of it.',
  },
  {
    q: 'Why is it more than other coaching I have seen?',
    a: 'Because it is me in your team, not a video library and not a junior coach. It is also less than a sales manager with benefits, and you are not managing me. I cap it to a handful of teams on purpose.',
  },
  {
    q: 'My team will not be honest.',
    a: 'That is the whole reason the call is owner-free. With you out of the room, the real story finally comes out. The board does the rest.',
  },
  {
    q: 'Can you guarantee a number?',
    a: 'No, and I would not trust anyone who did. We drive the activity and surface the truth. The numbers follow. I will not sell you a promise I cannot keep.',
  },
  {
    q: 'Is there a contract?',
    a: 'No. Month to month, cancel any time. And I will end it too if the work is not getting done. Neither of us hides behind a contract. The only thing holding this together is that it works.',
  },
];

const Questions = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
      <div className="max-w-[1000px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 18,
          }}>
            / Questions
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 0.95,
            letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 48,
          }}>
            Questions.
          </h2>
        </Reveal>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={i}
                style={{ borderBottom: `1px solid ${ink}`, cursor: 'pointer' }}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div style={{ padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 600, lineHeight: 1.45, color: ink, margin: 0, maxWidth: 720 }}>
                    {item.q}
                  </p>
                  <span aria-hidden style={{ color: blue, fontSize: 24, fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>
                    {isOpen ? <>&minus;</> : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p style={{ fontFamily: body, fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.78, margin: 0, paddingBottom: 24, maxWidth: 800 }}>
                    {item.a}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   13 - FINAL CLOSE
   ══════════════════════════════════════════════════════ */
const FinalClose = ({ onApply }: { onApply: () => void }) => (
  <section style={{ background: ink, color: paper, padding: '130px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto text-center">
      <Reveal>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(48px, 11vw, 180px)', lineHeight: 0.86,
          letterSpacing: '-0.02em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          The truth lives<br />in the <span style={{ color: blue }}>team</span>.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 500, letterSpacing: '0.04em',
          color: paper, opacity: 0.8, textTransform: 'uppercase', margin: '36px 0 44px',
        }}>
          You build the team that tells it. I make sure the truth gets to you.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <PrimaryCTA onApply={onApply} dark align="center" />
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
const BoldFooter = () => (
  <footer style={{ background: ink, color: paper, padding: '60px 24px 30px', borderTop: `1px solid ${paper}1a` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: `1px solid ${paper}1a` }}>
        <div className="col-span-2">
          <img src={standardLogo} alt="Standard Playbook" style={{ height: 22, marginBottom: 18 }} />
          <p style={{ fontFamily: body, fontSize: 16, lineHeight: 1.5, marginBottom: 22, maxWidth: 380, opacity: 0.85 }}>
            High-performance coaching for insurance agency owners. Raise your standard and live the playbook.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560049427918" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }} className="hover:opacity-100">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/justinhark/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }} className="hover:opacity-100">
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
            <p style={{ fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', opacity: 0.5, textTransform: 'uppercase', marginBottom: 14 }}>
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
const MobileStickyCTA = ({ onApply }: { onApply: () => void }) => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40"
    style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}>
    <button onClick={onApply}
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase',
      }}>
      Apply for a Fit Call
    </button>
  </div>
);

{/* TODO: optional testimonial slot, awaiting approved content */}

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
/* ── Apply modal: name only, then straight to the booking calendar ── */
const ApplyModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const ready = first.trim().length > 0 && last.trim().length > 0 && emailOk && phone.trim().length >= 7;

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    const url = new URL(BOOKING_URL);
    url.searchParams.set('firstName', first.trim());
    url.searchParams.set('lastName', last.trim());
    url.searchParams.set('email', email.trim());
    url.searchParams.set('phone', phone.trim());
    window.location.href = url.toString();
  };

  const field: React.CSSProperties = {
    fontFamily: body, fontSize: 15, color: ink, background: paper,
    border: `1.5px solid ${ink}`, padding: '13px 14px', width: '100%',
    outline: 'none', borderRadius: 0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[460px] p-0"
        style={{
          background: paper, color: ink, borderRadius: 0,
          border: `1.5px solid ${ink}`, boxShadow: '0 30px 80px -10px rgba(0,0,0,0.5)',
          fontFamily: body, gap: 0,
        }}
      >
        <DialogTitle className="sr-only">Apply for a Fit Call</DialogTitle>
        <form onSubmit={go} style={{ padding: '40px 36px' }}>
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: blue, textTransform: 'uppercase', marginBottom: 14,
          }}>
            The Team Standard
          </p>
          <h3 style={{
            fontFamily: display, fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 0.98,
            letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 400,
          }}>
            Apply for a Fit Call
          </h3>
          <p style={{ fontFamily: body, fontSize: 14, lineHeight: 1.5, color: ink, opacity: 0.7, margin: '0 0 26px' }}>
            Your details, then I will take you straight to my calendar to book the call.
          </p>

          <div style={{ display: 'grid', gap: 14 }}>
            <input style={field} type="text" placeholder="First name" value={first}
              onChange={(e) => setFirst(e.target.value)} autoFocus required aria-label="First name" />
            <input style={field} type="text" placeholder="Last name" value={last}
              onChange={(e) => setLast(e.target.value)} required aria-label="Last name" />
            <input style={field} type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required aria-label="Email" />
            <input style={field} type="tel" placeholder="Phone" value={phone}
              onChange={(e) => setPhone(e.target.value)} required aria-label="Phone" />
          </div>

          <button type="submit" disabled={!ready}
            style={{
              fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase',
              padding: '16px 0', width: '100%', marginTop: 22,
              border: `1.5px solid ${ink}`, cursor: ready ? 'pointer' : 'not-allowed',
              opacity: ready ? 1 : 0.45, transition: 'all .25s',
            }}
            className={ready ? 'hover:bg-[#2997FF] hover:border-[#2997FF]' : ''}
          >
            Continue to Booking
          </button>
          <p style={{ fontFamily: body, fontSize: 12, lineHeight: 1.5, color: ink, opacity: 0.55, margin: '14px 0 0', textAlign: 'center' }}>
            {CTA_MICROCOPY}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BoldTeamStandard = () => {
  const [applyOpen, setApplyOpen] = useState(false);

  const openApply = () => setApplyOpen(true);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'The Team Standard';
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? null;
    const desc = 'An accountability system for your sales team, run personally, with you out of the room. By application.';
    if (meta) meta.setAttribute('content', desc);
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <BoldNav />
      <Hero onApply={openApply} />
      <MarqueeBands />
      <WhyNeverTruth />
      <CostOfStaying />
      <ThirtyDaysIn onApply={openApply} />
      <WhyDifferent />
      <HowItWorks />
      <WhatYouGet />
      <TwoWaysIn onApply={openApply} />
      <Principles />
      <WhyMe />
      <OfferAndFilter onApply={openApply} />
      <Questions />
      <FinalClose onApply={openApply} />
      <BoldFooter />
      <ContentMeta lastUpdated="June 2026" />
      <MobileStickyCTA onApply={openApply} />
      <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} />
    </div>
  );
};

export default BoldTeamStandard;
