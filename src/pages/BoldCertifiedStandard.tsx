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

/*
 * CTA DESTINATION.
 * Certified Standard is a single $399 offer, sold one seat per person.
 * One action: purchase. Placeholder until checkout is wired.
 */
const CHECKOUT_URL = 'https://myagencybrain.com/certifiedstandard';
const CHECKOUT_LABEL = 'Get Certified';

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

/* ── Eyebrow ───────────────────────────────────────────── */
const Eyebrow = ({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) => (
  <p style={{
    fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
    color: onDark ? paper : ink, opacity: onDark ? 0.55 : 1, textTransform: 'uppercase', marginBottom: 24,
  }}>
    {children}
  </p>
);

/* ── Purchase CTA (single button) ──────────────────────── */
const CTAGroup = ({
  align = 'left',
  onDark = false,
  size = 'md',
}: { align?: 'left' | 'center'; onDark?: boolean; size?: 'md' | 'lg' }) => {
  const fill = onDark ? paper : ink;
  const fillText = onDark ? ink : '#fff';
  const pad = size === 'lg' ? '18px 38px' : '15px 30px';
  const fontSize = size === 'lg' ? 15 : 13;
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8,
      justifyContent: align === 'center' ? 'center' : 'flex-start',
    }}>
      {/* TODO: wire to checkout */}
      <a
        href={CHECKOUT_URL}
        style={{
          fontFamily: body, fontSize, fontWeight: 700, letterSpacing: '0.12em',
          color: fillText, background: fill, textTransform: 'uppercase',
          padding: pad, border: `1.5px solid ${fill}`, cursor: 'pointer',
          transition: 'all .25s', textDecoration: 'none', display: 'inline-block',
        }}
        className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white"
      >
        {CHECKOUT_LABEL} · $399
      </a>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   1 - HERO
   ══════════════════════════════════════════════════════ */
const Hero = () => (
  <section style={{ background: paper, paddingTop: 56 + 36, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <Eyebrow>/ This Is For Sales Producers And Team Members</Eyebrow>
      </Reveal>

      <Reveal className="relative z-20">
        <h1 style={{
          fontFamily: display, lineHeight: 0.95, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400, maxWidth: 1200,
        }}>
          <span style={{ display: 'block', fontSize: 'clamp(34px, 6.4vw, 104px)', lineHeight: 0.95 }}>
            Stop hoping every producer runs the call right.
          </span>
          <span className="block" style={{ color: blue, fontSize: 'clamp(34px, 6.4vw, 104px)', lineHeight: 0.95 }}>
            Certify it.
          </span>
        </h1>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(17px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            Certified Standard trains your producers on the full Hello-to-Bind sales conversation with live AI customer roleplay, memory reps, and quiz gates, then hands you the transcripts, scores, and completion data to coach from.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start">
          <div>
            <CTAGroup align="left" />
            <p style={{
              fontFamily: body, fontSize: 13, fontWeight: 400, lineHeight: 1.5,
              color: ink, opacity: 0.6, marginTop: 16, maxWidth: 420,
            }}>
              Practice-first, not video-only. Built specifically for the Hello-to-Bind producer call.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'CERTIFIED STANDARD' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
  <div style={{
    background: bg, color, transform: `rotate(${rotate}deg)`,
    padding: '14px 0', whiteSpace: 'nowrap', overflow: 'hidden',
    width: '120%', marginLeft: '-10%',
    borderTop: `1px solid ${color}33`, borderBottom: `1px solid ${color}33`,
  }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'cs-marquee 28s linear infinite' }}>
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="CERTIFIED STANDARD" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="HELLO TO BIND" />
    </div>
    <style>{`
      @keyframes cs-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════════════
   2 - BY THE NUMBERS (product facts only - no social proof)
   ══════════════════════════════════════════════════════ */
const heroStats = [
  { n: '24', label: 'active modules' },
  { n: '18', label: 'live AI voice-roleplay scenarios' },
  { n: '85', label: 'AI quiz prompts across 17 scored quizzes' },
  { n: '80%', label: 'default certification threshold' },
];

const StatStrip = () => (
  <section style={{ background: ink, color: paper, padding: '64px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8" style={{ borderTop: `1px solid ${paper}1a` }}>
        {heroStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div style={{ paddingTop: 36 }}>
              <div style={{
                fontFamily: display, fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 0.9,
                letterSpacing: '-0.02em', color: blue, fontWeight: 400,
              }}>
                {s.n}
              </div>
              <p style={{ fontFamily: body, fontSize: 15, lineHeight: 1.45, color: paper, opacity: 0.7, marginTop: 14, maxWidth: 220 }}>
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 13, color: paper, opacity: 0.4, marginTop: 40, letterSpacing: '0.02em' }}>
          Product facts about what is in the course, not claims of results.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   3 - THE PROBLEM (agitate inconsistency)
   ══════════════════════════════════════════════════════ */
const pains = [
  {
    num: '01',
    label: 'Inconsistent calls',
    body: 'Every rep improvises the hook, the discovery, the coverage walk, and the close. Prospects get a different experience depending on who picks up.',
  },
  {
    num: '02',
    label: 'Slow, expensive ramp',
    body: 'New hires learn by listening and burn real leads while they figure out what to say in the moments that decide the sale.',
  },
  {
    num: '03',
    label: 'Coaching with no evidence',
    body: 'You cannot be on every call. Feedback is from memory, one-off, and impossible to repeat across the team.',
  },
];

const ProblemSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow>/ The Problem</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, maxWidth: 1100,
        }}>
          Your best producer&apos;s call and your newest hire&apos;s call are <span style={{ color: blue }}>two different products.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-20" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
        {pains.map((p, i) => (
          <Reveal key={p.num} delay={i * 0.08}>
            <div style={{ borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`, padding: '40px 28px 48px', height: '100%' }}>
              <span style={{ fontFamily: editorial, fontSize: 20, color: ink, opacity: 0.35, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 18 }}>
                {p.num} / 03
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(26px, 2.6vw, 38px)', lineHeight: 0.95,
                letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18,
              }}>
                {p.label}
              </h3>
              <p style={{ fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.8 }}>
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   4 - HOW IT WORKS (the 4-activity loop)
   ══════════════════════════════════════════════════════ */
const loop = [
  { name: 'Teach', tag: 'Step 1', body: 'Learn the standard and the frame for the call moment.', saved: false, gate: false },
  { name: 'Scripted Practice', tag: 'Step 2', body: 'Run a live AI customer roleplay with the full script visible. Build cadence, order, and confidence.', saved: true, gate: false },
  { name: 'Off-Script Practice', tag: 'Step 3', body: 'Run the same call again with the script hidden. Perform from memory, not by reading.', saved: true, gate: false },
  { name: 'AI Quiz', tag: 'Step 4', body: 'The scored gate, set to an 80% default. Pass it to advance.', saved: false, gate: true },
];

const HowSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow onDark>/ How It Works</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(32px, 4.6vw, 68px)', lineHeight: 0.98,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24, maxWidth: 1100,
        }}>
          A repeatable loop that ends in a real certification, <span style={{ color: blue }}>earned through practice and a scored gate.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: paper, opacity: 0.8, marginBottom: 56, maxWidth: 720 }}>
          For each skill, producers run the full loop:
        </p>
      </Reveal>

      <div style={{ borderTop: `1px solid ${paper}33` }}>
        {loop.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <div style={{ borderBottom: `1px solid ${paper}33`, padding: '48px 0' }}>
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 md:col-span-4">
                  <span style={{ fontFamily: editorial, fontSize: 18, color: paper, opacity: 0.4, letterSpacing: '0.04em', display: 'inline-block', marginBottom: 14, textTransform: 'uppercase' }}>
                    {s.tag}
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(34px, 5vw, 72px)', lineHeight: 0.9,
                    letterSpacing: '-0.02em', color: s.gate ? blue : paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {s.name}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-8 md:pt-2">
                  <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.5vw, 20px)', fontWeight: 400, lineHeight: 1.6, color: paper, opacity: 0.88 }}>
                    {s.body}
                  </p>
                  {s.saved && (
                    <span style={{ display: 'inline-block', marginTop: 16, fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: blue, border: `1px solid ${blue}`, padding: '6px 12px' }}>
                      The call is saved
                    </span>
                  )}
                  {s.gate && (
                    <span style={{ display: 'inline-block', marginTop: 16, fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, background: blue, padding: '6px 12px' }}>
                      This is the gate
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 24px)', fontWeight: 500, lineHeight: 1.55, color: paper, marginTop: 48, maxWidth: 900 }}>
          Producers move from scripts to memory, so they can perform live, <span style={{ color: blue }}>before they ever take the call with a real prospect.</span>
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   5 - MANAGER PAYOFF (evidence & visibility - the money section)
   ══════════════════════════════════════════════════════ */
const benefits = [
  { label: 'Saved transcripts', body: 'Every scripted and off-script practice call is recorded as coaching evidence.' },
  { label: 'Quiz scores per producer', body: 'See exactly which standards each producer has actually passed, not just attempted.' },
  { label: 'Completion and stall tracking', body: "Track who's certified, who's mid-path, and who's stalled." },
  { label: 'One consistent standard', body: 'Every rep certifies on the same talk tracks and the same scenarios.' },
];

const PayoffSection = () => (
  <section style={{ background: `linear-gradient(180deg, ${blue} 0%, #1F7FE0 100%)`, color: '#fff', padding: '130px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{ fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', color: '#fff', opacity: 0.8, textTransform: 'uppercase', marginBottom: 24 }}>
          / For The Buyer
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 8vw, 120px)', lineHeight: 0.92,
          letterSpacing: '-0.01em', color: '#fff', textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          A STANDARD YOU CAN<br /><span style={{ color: ink }}>SEE AND PROVE.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6, color: '#fff', opacity: 0.95, marginTop: 32, maxWidth: 820 }}>
          Every practice call and quiz is saved as certification evidence. Instead of one-off coaching notes, you get a consistent record across every producer.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-20" style={{ borderTop: `1px solid #ffffff33`, borderLeft: `1px solid #ffffff33` }}>
        {benefits.map((b, i) => (
          <Reveal key={b.label} delay={(i % 2) * 0.08}>
            <div style={{ borderRight: `1px solid #ffffff33`, borderBottom: `1px solid #ffffff33`, padding: '40px 32px 48px', height: '100%' }}>
              <span style={{ fontFamily: editorial, fontSize: 18, color: '#fff', opacity: 0.6, letterSpacing: '0.04em', display: 'inline-block', marginBottom: 16 }}>
                {String(i + 1).padStart(2, '0')} / 04
              </span>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(24px, 2.4vw, 36px)', lineHeight: 0.98, letterSpacing: '-0.01em', color: '#fff', textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14 }}>
                {b.label}
              </h3>
              <p style={{ fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: '#fff', opacity: 0.9 }}>
                {b.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div style={{ marginTop: 56, background: ink, color: paper, padding: '48px 36px' }}>
          <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.8vw, 26px)', fontWeight: 400, lineHeight: 1.5, color: paper, margin: 0, maxWidth: 920 }}>
            <span style={{ color: blue, fontWeight: 700 }}>Completion means something here.</span> A certified producer has practiced the call, run it from memory, and passed the gate.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div style={{ marginTop: 48 }}>
          <CTAGroup align="left" />
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   6 - WHAT'S INSIDE (the real call modules)
   ══════════════════════════════════════════════════════ */
const hooks = [
  { name: 'Auto Data Lead Hook', body: 'Keep the prospect on the phone, confirm details, build cascading yeses, don’t fold to "just email it."' },
  { name: 'Home Data Lead Hook', body: 'Confirm the property and use pride of ownership before underwriting.' },
  { name: 'Win-Back Hook', body: 'Rebuild trust with shared history before quoting.' },
  { name: 'X-Date / Requote Hook', body: 'Treat it as warm and remembered, not a cold price pitch.' },
  { name: 'Cross-Sell Hook', body: 'Lead with discount/value and assertive commitment language.' },
];

const objections = [
  { name: '"I didn’t request a quote"', body: 'Acknowledge, apologize, explain, move to confirmation.' },
  { name: '"I don’t have time"', body: 'Lock a specific appointment, refuse vague callbacks.' },
  { name: '"I’m not interested"', body: 'Stay in emotional control and continue into verification.' },
];

const knowledge = [
  { name: 'Why Coverage Conversations Matter', body: 'The case for leading with protection over price, and how it reframes the whole call.' },
  { name: 'The Follow-Through: Post-Sale', body: 'What happens after the bind to keep the policy and the relationship intact.' },
  { name: 'Follow-Up Is Your Lifeblood', body: 'The discipline of working every quote so none of them die in an inbox.' },
  { name: '3 Buckets = Simplicity', body: 'The three buckets that make coverage simple to explain and easy to say yes to.' },
  { name: 'The Closers Playbook / Objection Sheet', body: 'Optional reference for closing language and the objections producers hear most.' },
];

const discovery = [
  { name: 'Rapport = Trust (the 4-step)', body: 'A repeatable rapport arc: family, work, home/assets, then transition.' },
  { name: 'The 3-Question Gap', body: 'Build the coverage gap across house, personal property, and financial assets.' },
  { name: 'Umbrella Focus', body: 'Assumptive umbrella positioning and customer-led math.' },
  { name: 'Assuming vs. Asking', body: 'Ask for a real yes/no decision instead of drifting into maybes.' },
  { name: 'Walk the Block', body: 'Present coverage highest-to-lowest with a property-damage floor and daily-cost framing.' },
];

// Closing-objection modules on the producer-launch-hello-to-bind path.
// Rendered as expandable cards inside the What's Inside grid.
// TODO: wire each `slug` to its real module route once module routing exists.
const closingModules = [
  {
    name: 'Stalls and Maybes',
    body: `Turn "let me think about it" into a clear yes or a real next step, never a maybe.`,
    drill: `"I want to think about it," "just email it to me," and "I want to shop around."`,
    skill: `The close ladder. Name the real fear, assume the sale twice, then ask the direct yes-or-no question and lock a specific time.`,
    slug: 'stalls-and-maybes',
  },
  {
    name: 'Payment and Start-Date Friction',
    body: `Clear the money-mechanics hangups that stall a prospect who already said yes.`,
    drill: `"I just paid my current insurance," "don't take my card, call me on the start date," and "I'm not comfortable paying over the phone."`,
    skill: `Remove the friction with the right lever, a prorated refund, a future-dated start, or the secure-payment reassurance, then assume and ask.`,
    slug: 'payment-start-date-friction',
  },
  {
    name: 'Price, Savings, and Coverage Value',
    body: `Beat the price objection without dropping your price.`,
    drill: `"your price is too high," "you're not saving me enough," "you saved me on home but not auto," and "I have a lower deductible now."`,
    skill: `Reframe to the gap, tell one short claim story, walk the block from high coverage down, and hold the property damage floor as your value.`,
    slug: 'price-savings-coverage-value',
  },
  {
    name: 'Decision-Maker and Loyalty Objections',
    body: `Respect the relationship without surrendering the close.`,
    drill: `"I need to talk to my spouse," "I'm loyal to my agent," and "I prefer a local agent."`,
    skill: `Qualify who actually decides, lock the rate risk-free with a future-dated start, and reframe loyalty with better coverage and a better price.`,
    slug: 'decision-maker-loyalty',
  },
];

type ScenarioItem = { name: string; body: string; drill?: string; skill?: string; slug?: string };

const ScenarioGrid = ({ items }: { items: ScenarioItem[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
    {items.map((s, i) => (
      <Reveal key={s.name} delay={(i % 3) * 0.05}>
        <details style={{ borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`, padding: '24px 24px', height: '100%' }}>
          <summary style={{
            fontFamily: display, fontSize: 'clamp(18px, 1.7vw, 23px)', lineHeight: 1.05,
            letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', fontWeight: 400,
            cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16,
          }}>
            {s.name}
            <span style={{ color: blue, flexShrink: 0, fontFamily: body, fontWeight: 700, fontSize: 22 }}>+</span>
          </summary>
          <p style={{ fontFamily: body, fontSize: 15, fontWeight: s.drill ? 500 : 400, lineHeight: 1.55, color: ink, opacity: s.drill ? 1 : 0.8, marginTop: 16 }}>
            {s.body}
          </p>
          {s.drill && (
            <p style={{ fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.8, marginTop: 12 }}>
              <span style={{ fontWeight: 700 }}>You will drill: </span>{s.drill}
            </p>
          )}
          {s.skill && (
            <p style={{ fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.8, marginTop: 12 }}>
              <span style={{ fontWeight: 700 }}>The skill: </span>{s.skill}
            </p>
          )}
          {s.slug && (
            // TODO: route to the producer-launch-hello-to-bind module for this slug once module routing exists
            <a
              href={`#${s.slug}`}
              style={{ display: 'inline-block', marginTop: 16, fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: blue, textDecoration: 'none' }}
              className="hover:underline"
            >
              Open module →
            </a>
          )}
        </details>
      </Reveal>
    ))}
  </div>
);

const InsideSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow>/ What&apos;s Inside</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, maxWidth: 1100,
        }}>
          Built around the exact calls your producers <span style={{ color: blue }}>actually make.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.85, marginTop: 32, maxWidth: 820 }}>
          Live voice-roleplay scenarios covering every moment that decides whether a prospect stays on the phone, or hangs up.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(16px, 1.6vw, 22px)', letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', marginTop: 64, marginBottom: 20, fontWeight: 400 }}>
          Hooks (the first close)
        </p>
      </Reveal>
      <ScenarioGrid items={hooks} />

      <Reveal delay={0.1}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(16px, 1.6vw, 22px)', letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', marginTop: 56, marginBottom: 20, fontWeight: 400 }}>
          Opening Objections
        </p>
      </Reveal>
      <ScenarioGrid items={objections} />

      <Reveal delay={0.1}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(16px, 1.6vw, 22px)', letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', marginTop: 56, marginBottom: 20, fontWeight: 400 }}>
          Discovery, Coverage &amp; Close
        </p>
      </Reveal>
      <ScenarioGrid items={discovery} />

      <Reveal delay={0.1}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(16px, 1.6vw, 22px)', letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', marginTop: 56, marginBottom: 20, fontWeight: 400 }}>
          Closing the Call
        </p>
      </Reveal>
      <ScenarioGrid items={closingModules} />

      <Reveal delay={0.1}>
        <p style={{ fontFamily: editorial, fontSize: 'clamp(16px, 1.6vw, 22px)', letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', marginTop: 56, marginBottom: 20, fontWeight: 400 }}>
          Knowledge Modules (after the roleplay track)
        </p>
      </Reveal>
      <ScenarioGrid items={knowledge} />
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   6.5 - THE DOWNLOADS (in-course materials)
   ══════════════════════════════════════════════════════ */
const downloadItems = [
  'The Hello-to-Bind script',
  'The playbook materials',
  'The Closers Playbook and Objection Sheet',
];

const WorkbookSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="col-span-12 md:col-span-7">
          <Reveal><Eyebrow onDark>/ The Downloads</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 style={{
              fontFamily: display, fontSize: 'clamp(40px, 6vw, 92px)', lineHeight: 0.95,
              letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 32,
            }}>
              Download the script. <span style={{ color: blue }}>Keep the playbook.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6, color: paper, opacity: 0.9, marginBottom: 24, maxWidth: 620 }}>
              Inside the course, producers download the Hello-to-Bind script and the playbook materials, including the Closers Playbook and the Objection Sheet.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6, color: paper, opacity: 0.9, maxWidth: 620 }}>
              The required downloads are gated. A producer cannot advance past a module until they have grabbed the materials. Once they have them, the team keeps them.
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Reveal delay={0.1}>
            <div style={{ border: `1px solid ${paper}33` }}>
              <p style={{ fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: paper, opacity: 0.55, padding: '20px 24px 0', margin: 0 }}>
                What they download
              </p>
              <ul style={{ listStyle: 'none', margin: '12px 0 8px', padding: 0 }}>
                {downloadItems.map((d) => (
                  <li key={d} style={{ fontFamily: display, fontSize: 'clamp(18px, 1.8vw, 24px)', letterSpacing: '-0.01em', textTransform: 'uppercase', color: paper, fontWeight: 400, padding: '14px 24px', borderTop: `1px solid ${paper}1a`, display: 'flex', alignItems: 'baseline', gap: 14 }}>
                    <span style={{ color: blue, fontFamily: body, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>+</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   7 - PROOF POINTS (course structure)
   ══════════════════════════════════════════════════════ */
const proofStats = [
  { n: '24', label: 'active modules' },
  { n: '75', label: 'active steps' },
  { n: '18', label: 'live voice-roleplay skill modules' },
  { n: '85', label: 'AI quiz prompts across 17 scored quizzes' },
  { n: '4', label: 'required knowledge attestations' },
  { n: '80%', label: 'default certification threshold' },
];

const ProofSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow>/ By The Numbers</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 88px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, maxWidth: 1000,
        }}>
          Depth and rigor, by the <span style={{ color: blue }}>actual course structure.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-16" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
        {proofStats.map((s, i) => (
          <Reveal key={s.label} delay={(i % 6) * 0.05}>
            <div style={{ borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`, padding: '32px 20px 36px', height: '100%' }}>
              <div style={{ fontFamily: display, fontSize: 'clamp(40px, 4vw, 60px)', lineHeight: 0.9, letterSpacing: '-0.02em', color: ink, fontWeight: 400 }}>
                {s.n}
              </div>
              <p style={{ fontFamily: body, fontSize: 13, lineHeight: 1.4, color: ink, opacity: 0.65, marginTop: 12 }}>
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   8 - THE CERTIFICATION GATE
   ══════════════════════════════════════════════════════ */
const GateSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1080px] mx-auto">
      <Reveal><Eyebrow onDark>/ The Certification Gate</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 92px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 40,
        }}>
          &ldquo;Completed&rdquo; should mean they can <span style={{ color: blue }}>actually do it.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 24px)', fontWeight: 400, lineHeight: 1.6, color: paper, opacity: 0.9, maxWidth: 880 }}>
          Completion here is earned, not assumed. Certified Standard scores each module with an AI quiz gate set to an 80% threshold by default. A producer doesn&apos;t advance by sitting through content. They advance by proving they remember the standard. When the path is done, you have a producer who has practiced the call, run it from memory, and passed every gate.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   9 - WHO IT'S FOR
   ══════════════════════════════════════════════════════ */
const audiences = [
  { num: '01', label: 'Growing agencies', body: 'Ramping new producers and tired of inconsistent calls.' },
  { num: '02', label: 'Sales managers', body: "Who can't be on every call but need every call run right." },
  { num: '03', label: 'Owners', body: 'Who want a repeatable standard and the evidence to coach and hold the line.' },
];

const WhoSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow>/ Who It&apos;s For</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 92px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, maxWidth: 1000,
        }}>
          For the team that has to run the call right, <span style={{ color: blue }}>every time.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-20" style={{ borderTop: `1px solid ${ink}`, borderLeft: `1px solid ${ink}` }}>
        {audiences.map((a, i) => (
          <Reveal key={a.num} delay={i * 0.08}>
            <div style={{ borderRight: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`, padding: '40px 28px 48px', height: '100%' }}>
              <span style={{ fontFamily: editorial, fontSize: 20, color: blue, opacity: 0.9, letterSpacing: '-0.01em', display: 'inline-block', marginBottom: 18 }}>
                {a.num} / 03
              </span>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(26px, 2.6vw, 38px)', lineHeight: 0.95, letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16 }}>
                {a.label}
              </h3>
              <p style={{ fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.8 }}>
                {a.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   10 - PRICING (single price, single seat)
   ══════════════════════════════════════════════════════ */
const seatFeatures = [
  'Full certification path',
  'Live AI roleplay (scripted and off-script)',
  'Scored AI quiz gates at the 80% default threshold',
  'Saved practice transcripts',
  'Quiz scores and completion status',
  'The 18 voice-roleplay scenarios plus knowledge modules',
  'Gated script and playbook downloads the team keeps',
];

const PricingSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow onDark>/ Pricing</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          One price. <span style={{ color: blue }}>One seat.</span>
        </h2>
      </Reveal>

      <div className="mx-auto" style={{ maxWidth: 560 }}>
        <Reveal delay={0.08}>
          <div style={{
            border: `1.5px solid ${blue}`, background: '#ffffff08',
            padding: '44px 40px', display: 'flex', flexDirection: 'column',
          }}>
            <h3 style={{ fontFamily: display, fontSize: 'clamp(26px, 2.6vw, 36px)', lineHeight: 1, letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18 }}>
              One Producer Seat
            </h3>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontFamily: display, fontSize: 'clamp(44px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', color: blue, fontWeight: 400 }}>$399</span>
              <span style={{ fontFamily: body, fontSize: 15, fontWeight: 500, color: paper, opacity: 0.6, marginLeft: 10 }}>per seat, one-time</span>
              <p style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.6, marginTop: 12, marginBottom: 0 }}>One seat certifies one producer, including the owner.</p>
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 36px', padding: 0, display: 'grid', gap: 13 }}>
              {seatFeatures.map((f) => (
                <li key={f} style={{ fontFamily: body, fontSize: 16, color: paper, opacity: 0.85, paddingLeft: 24, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: blue, fontWeight: 700 }}>+</span>{f}
                </li>
              ))}
            </ul>
            <a
              href={CHECKOUT_URL}
              style={{
                fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', textAlign: 'center', padding: '17px 0', textDecoration: 'none',
                color: ink, background: paper, border: `1.5px solid ${paper}`, transition: 'all .25s', display: 'block',
              }}
              className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white"
            >
              {CHECKOUT_LABEL} · $399
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p style={{ fontFamily: body, fontSize: 16, color: paper, opacity: 0.7, marginTop: 28, textAlign: 'center' }}>
            Certifying a team? Buy one seat for each producer.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   11 - QUESTIONS (objection handling)
   ══════════════════════════════════════════════════════ */
const faqs = [
  { q: 'Is this just content my team will click through?', a: 'No. The model is practice-first: teach, scripted AI roleplay, off-script roleplay from memory, then a scored AI quiz gate. Completion means the producer passed, not just watched.' },
  { q: 'How do I know a producer actually learned it?', a: 'Each voice module ends with an AI quiz scored to an 80% default threshold. Practice calls are saved as transcripts so you can review and coach from real evidence.' },
  { q: 'Will this work for new hires with no experience?', a: "Yes. It's built for producers learning the Hello-to-Bind process. They rehearse live conversations with an AI customer before taking them with real prospects." },
  { q: 'Is this a generic sales course?', a: 'No. Every scenario is built around real insurance producer calls: auto and home lead hooks, win-backs, X-date requotes, cross-sell, objections, rapport, coverage gaps, umbrella, and the coverage presentation.' },
  { q: 'What does a producer practice, exactly?', a: '18 live voice-roleplay scenarios covering hooks, objections, discovery, coverage gaps, umbrella positioning, the close, and closing objections, plus required knowledge modules on post-sale follow-through and follow-up discipline.' },
  { q: 'What do I see as a manager?', a: 'Saved practice transcripts, quiz answers and scores, and completion status across your team.' },
];

const QuestionsSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1080px] mx-auto">
      <Reveal><Eyebrow>/ Questions</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          QUESTIONS.
        </h2>
      </Reveal>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {faqs.map((f, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <details style={{ borderBottom: `1px solid ${ink}`, padding: '28px 0' }}>
              <summary style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 32px)', lineHeight: 1.1,
                letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', fontWeight: 400,
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24,
              }}>
                {f.q}
                <span style={{ color: blue, flexShrink: 0, fontFamily: body, fontWeight: 700 }}>+</span>
              </summary>
              <p style={{ fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.8, marginTop: 20, maxWidth: 820 }}>
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
   12 - FINAL CLOSE
   ══════════════════════════════════════════════════════ */
const FinalClose = () => (
  <section style={{ background: ink, color: paper, padding: '130px 24px 110px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto text-center">
      <Reveal>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          GIVE EVERY PRODUCER<br /><span style={{ color: blue }}>THE SAME WINNING CALL.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: 1.5, color: paper, opacity: 0.85, marginTop: 32, maxWidth: 680, marginInline: 'auto' }}>
          Start certifying your team on the Hello-to-Bind standard today.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
          <CTAGroup align="center" onDark size="lg" />
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
          <p style={{ fontFamily: body, fontSize: 16, lineHeight: 1.5, marginBottom: 22, maxWidth: 380, opacity: 0.85 }}>
            Certified Standard. The Hello-to-Bind certification course for insurance producers.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560049427918" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }} className="hover:opacity-100">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/justinhark/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }} className="hover:opacity-100">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {[
          { title: 'Product', items: [
            { label: 'What’s inside', href: '/training' },
            { label: 'Programs', href: '/#programs' },
            { label: 'Software', href: '/#software' },
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
          © {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   MOBILE STICKY CTA
   ══════════════════════════════════════════════════════ */
const MobileStickyCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40" style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}>
    {/* TODO: wire to checkout/demo */}
    <a
      href={CHECKOUT_URL}
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase', textAlign: 'center',
        textDecoration: 'none', display: 'block',
      }}
    >
      {CHECKOUT_LABEL}
    </a>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldCertifiedStandard = () => (
  <div style={{ background: paper, fontFamily: body, color: ink }}>
    <BoldNav />
    <Hero />
    <MarqueeBands />
    <StatStrip />
    <ProblemSection />
    <HowSection />
    <PayoffSection />
    <InsideSection />
    <WorkbookSection />
    <ProofSection />
    <GateSection />
    <WhoSection />
    <PricingSection />
    <QuestionsSection />
    <FinalClose />
    <BoldFooter />
    <ContentMeta lastUpdated="June 2026" />
    <MobileStickyCTA />
  </div>
);

export default BoldCertifiedStandard;
