import { useLocation } from 'react-router-dom';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import ContentMeta from '@/components/ContentMeta';
import { getCertifiedStandardHandoff } from '@/data/certifiedStandard';
import './BoldCertifiedStandard.css';

import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

const CHECKOUT_LABEL = 'Choose certification seats';

// The offer is purchased and delivered in Agency Brain. Carry only campaign data.
const PurchaseLink = ({ children, ...props }: Omit<React.ComponentProps<'a'>, 'href'>) => {
  const { search } = useLocation();
  return <a {...props} href={getCertifiedStandardHandoff(search)}>{children}</a>;
};

const Reveal = ({ children, className = '' }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <div className={className}>{children}</div>
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
      display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 12, marginTop: 8,
      justifyContent: align === 'center' ? 'center' : 'flex-start',
    }}>
      <PurchaseLink
        style={{
          fontFamily: body, fontSize, fontWeight: 700, letterSpacing: '0.12em',
          color: fillText, background: fill, textTransform: 'uppercase',
          padding: pad, border: `1.5px solid ${fill}`, cursor: 'pointer',
          transition: 'all .25s', textDecoration: 'none', display: 'inline-block',
        }}
        className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white"
      >
        {CHECKOUT_LABEL} →
      </PurchaseLink>
      <p style={{ fontFamily: body, fontSize: 13, lineHeight: 1.5, color: fill, maxWidth: 420 }}>$399 per learner seat · one time · through Agency Brain</p>
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
        <Eyebrow>/ For agency owners and sales managers developing producers</Eyebrow>
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
            Give your producers a repeatable process from the first hello through coverage, the close, and the follow-up. They rehearse with AI customers and complete scored checks. You get saved work to coach from—and The Confirmation playbook to verify it on real calls.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start">
          <div>
            <CTAGroup align="left" />
            <p style={{
              fontFamily: body, fontSize: 13, fontWeight: 400, lineHeight: 1.5,
              color: ink, opacity: 0.8, marginTop: 16, maxWidth: 420,
            }}>
              Purchase and training are delivered through Agency Brain.
            </p>
            <p className="cs-note" style={{ marginTop: 12 }}>Managing your team uses no seat. Explicitly enroll yourself only if you want to take the course.</p>
            <a href="#guides" className="cs-text-link">See the included guides ↓</a>
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
  <div aria-hidden="true" style={{
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
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="PRACTICE. PROVE. CONFIRM." />
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
   3 - THE PROBLEM (agitate inconsistency)
   ══════════════════════════════════════════════════════ */
const pains = [
  { num: '01', label: '“I didn’t request a quote.”', body: 'The opening is already off-script. Rehearse the hook, handle resistance, and earn the next minute.' },
  { num: '02', label: '“Your price is too high.”', body: 'Give producers a way to explain the protection, find the real concern, and ask for a decision.' },
  { num: '03', label: '“Just email it to me.”', body: 'Work the hesitation, agree on a real next step, and follow through after the quote and the sale.' },
];

const ProblemSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow>/ The Calls You Recognize</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, maxWidth: 1100,
        }}>
          The next tough call is coming. <span style={{ color: blue }}>Give them a process for it.</span>
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
  { name: 'Learn the frame', tag: 'Teaching · unscored', body: 'Learn the purpose, sequence, and language for the conversation.', gate: false },
  { name: 'Rehearse the call', tag: 'Scripted practice · unscored', body: 'Speak with an AI customer while the script is visible. Build the rhythm before working from memory.', gate: false },
  { name: 'Take the script away', tag: 'Off-script practice & skill checks', body: 'The five hook activities are unscored practice. The other 12 off-script activities are scored skill checks. Use the language without reading it.', gate: true },
  { name: 'Explain what you know', tag: '17 scored knowledge checks', body: 'Answer by voice or typing. Review the captured answers, then submit for assessment. Every conversation module has a scored knowledge check.', gate: true },
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
          Learn it. Say it. <span style={{ color: blue }}>Show you can use it.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: paper, opacity: 0.8, marginBottom: 56, maxWidth: 720 }}>
          17 conversation modules and four knowledge commitments. Teaching and practice build the skill; scored checks assess it.
        </p>
      </Reveal>

      <div style={{ borderTop: `1px solid ${paper}33` }}>
        {loop.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <div style={{ borderBottom: `1px solid ${paper}33`, padding: '48px 0' }}>
              <div className="grid grid-cols-12 gap-x-0 gap-y-8 md:gap-8 items-start">
                <div className="col-span-12 md:col-span-4">
                  <span style={{ fontFamily: editorial, fontSize: 18, color: paper, opacity: 0.75, letterSpacing: '0.04em', display: 'inline-block', marginBottom: 14, textTransform: 'uppercase' }}>
                    {s.tag}
                  </span>
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(34px, 5vw, 72px)', lineHeight: 0.9,
                    letterSpacing: '-0.02em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {s.name}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-8 md:pt-2">
                  <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.5vw, 20px)', fontWeight: 400, lineHeight: 1.6, color: paper, opacity: 0.88 }}>
                    {s.body}
                  </p>
                  {s.gate && (
                    <span className="cs-check-label">80% to pass scored checks</span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 24px)', fontWeight: 500, lineHeight: 1.55, color: paper, marginTop: 48, maxWidth: 900 }}>
          A missed knowledge check leads to saved feedback and recovery practice before a retry. After three unsuccessful quiz attempts, <span style={{ color: blue }}>manager coaching and an unlock are required.</span>
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   5 - MANAGER PAYOFF (evidence & visibility - the money section)
   ══════════════════════════════════════════════════════ */
const benefits = [
  { label: 'Know who needs you', body: 'Review required progress, current and next activities, and who has not started, is progressing, needs coaching, or has completed the path.' },
  { label: 'Open the work', body: 'See saved answers, scored results, feedback, and available practice transcripts and roleplay reports. Coach the gap behind the result.' },
  { label: 'Guide the next attempt', body: 'Use the missed concepts to guide recovery practice and manage coaching unlocks when a learner needs help.' },
  { label: 'Manage seats and voice time', body: 'Assign purchased seats and review used and remaining voice time. Managing the team does not enroll you in the course.' },
];

const PayoffSection = () => (
  <section style={{ background: blue, color: ink, padding: '130px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{ fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', color: ink, opacity: 0.9, textTransform: 'uppercase', marginBottom: 24 }}>
          / The Owner’s View
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 8vw, 120px)', lineHeight: 0.92,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          A STANDARD YOU CAN<br /><span style={{ color: ink }}>SEE AND PROVE.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.95, marginTop: 32, maxWidth: 820 }}>
          Stop asking how training is going. Open the submitted work, see where a producer needs coaching, and make the next conversation specific.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-20" style={{ borderTop: `1px solid #0a0a0b55`, borderLeft: `1px solid #0a0a0b55` }}>
        {benefits.map((b, i) => (
          <Reveal key={b.label} delay={(i % 2) * 0.08}>
            <div style={{ borderRight: `1px solid #0a0a0b55`, borderBottom: `1px solid #0a0a0b55`, padding: '40px 32px 48px', height: '100%' }}>
              <span style={{ fontFamily: editorial, fontSize: 18, color: ink, opacity: 0.9, letterSpacing: '0.04em', display: 'inline-block', marginBottom: 16 }}>
                {String(i + 1).padStart(2, '0')} / 04
              </span>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(24px, 2.4vw, 36px)', lineHeight: 0.98, letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14 }}>
                {b.label}
              </h3>
              <p style={{ fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: ink, opacity: 0.9 }}>
                {b.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div style={{ marginTop: 56, background: ink, color: paper, padding: '48px 36px' }}>
          <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.8vw, 26px)', fontWeight: 400, lineHeight: 1.5, color: paper, margin: 0, maxWidth: 920 }}>
            <span style={{ color: blue, fontWeight: 700 }}>Completion means something here.</span> Review the training evidence. Then use The Confirmation to verify the skill in the work.
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
  { name: '3 Buckets = Simplicity', body: 'Organize the producer workflow into Sold, Dashboard, and Prospects.' },
];

const discovery = [
  { name: 'Rapport = Trust (the 4-step)', body: 'A repeatable rapport arc: family, work, home/assets, then transition.' },
  { name: 'The 3-Question Gap', body: 'Build the coverage gap across house, personal property, and financial assets.' },
  { name: 'Umbrella Focus', body: 'Assumptive umbrella positioning and customer-led math.' },
  { name: 'Assuming vs. Asking', body: 'Ask for a real yes/no decision instead of drifting into maybes.' },
  { name: 'Walk the Block', body: 'Present coverage highest-to-lowest with a property-damage floor and daily-cost framing.' },
];

// Curriculum descriptions only; course activities run in Agency Brain.
const closingModules = [
  {
    name: 'Stalls and Maybes',
    body: `Turn "let me think about it" into a clear yes or a real next step, never a maybe.`,
    drill: `"I want to think about it," "just email it to me," and "I want to shop around."`,
    skill: `The close ladder. Name the real fear, assume the sale twice, then ask the direct yes-or-no question and lock a specific time.`,
  },
  {
    name: 'Payment and Start-Date Friction',
    body: `Clear the money-mechanics hangups that stall a prospect who already said yes.`,
    drill: `"I just paid my current insurance," "don't take my card, call me on the start date," and "I'm not comfortable paying over the phone."`,
    skill: `Remove the friction with the right lever, a prorated refund, a future-dated start, or the secure-payment reassurance, then assume and ask.`,
  },
  {
    name: 'Price, Savings, and Coverage Value',
    body: `Beat the price objection without dropping your price.`,
    drill: `"your price is too high," "you're not saving me enough," "you saved me on home but not auto," and "I have a lower deductible now."`,
    skill: `Reframe to the gap, tell one short claim story, walk the block from high coverage down, and hold the property damage floor as your value.`,
  },
  {
    name: 'Decision-Maker and Loyalty Objections',
    body: `Respect the relationship without surrendering the close.`,
    drill: `"I need to talk to my spouse," "I'm loyal to my agent," and "I prefer a local agent."`,
    skill: `Qualify who actually decides, lock the rate risk-free with a future-dated start, and reframe loyalty with better coverage and a better price.`,
  },
];

type ScenarioItem = { name: string; body: string; drill?: string; skill?: string };

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

        </details>
      </Reveal>
    ))}
  </div>
);

const InsideSection = () => (
  <section id="curriculum" style={{ background: paper, padding: '80px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow>/ What&apos;s Inside</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: ink, textTransform: 'uppercase', margin: 0, fontWeight: 400, maxWidth: 1100,
        }}>
          One process. <span style={{ color: blue }}>From hello through follow-up.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55, color: ink, opacity: 0.85, marginTop: 32, maxWidth: 820 }}>
          17 conversation modules plus four knowledge commitments. Orientation gets learners started; the optional resource library supports the work.
        </p>
      </Reveal>

      <details className="cs-curriculum">
        <summary>Explore the full curriculum <span aria-hidden="true">+</span></summary>
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
          Four knowledge commitments (after the conversation track)
        </p>
      </Reveal>
      <ScenarioGrid items={knowledge} />
      </details>
    </div>
  </section>
);

const producerGuides = [
  { name: 'From hello to closed.', image: 'sales-manual.webp', alt: 'Actual cover of From hello to closed, the producer sales manual', text: 'The sales sequence, talk tracks, coverage conversations, the close, and the habits after the sale.' },
  { name: 'The Objection Playbook', image: 'opening-objections.webp', alt: 'Actual cover of The Objection Playbook', text: 'Sixteen opening objections with responses, variations, and the reason behind the language.' },
  { name: 'The Closing Objection Bank', image: 'closing-reference.webp', alt: 'Actual quick-reference page from The Closing Objection Bank, current Draft PDF edition', text: 'Fourteen objection scripts for hesitation, value, payment, timing, and decision-makers.', draft: true },
];

const PagePreview = ({ file, alt, caption }: { file: string; alt: string; caption: string }) => (
  <figure className="cs-preview">
    <a href={`/certified-standard/${file}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${caption.toLowerCase()} at full size (opens a new tab)`}>
      <img src={`/certified-standard/${file}`} alt={alt} loading="lazy" />
    </a>
    <figcaption>{caption} <span aria-hidden="true">↗</span></figcaption>
  </figure>
);

const WorkbookSection = () => (
  <section id="guides" className="cs-section cs-dark">
    <div className="cs-container">
      <Eyebrow onDark>/ The Producer Guides</Eyebrow>
      <h2 className="cs-heading">The process stays <span>at their desk.</span></h2>
      <p className="cs-intro">Three practical PDF guides available in the course. Language to rehearse today. References for the next real call.</p>
      <div className="cs-guide-grid">
        {producerGuides.map(guide => (
          <article key={guide.name}>
            <a href={`/certified-standard/${guide.image}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${guide.name} preview at full size (opens a new tab)`}>
              <img className="cs-guide-image" src={`/certified-standard/${guide.image}`} alt={guide.alt} loading="lazy" width="850" height="1100" />
            </a>
            <h3>{guide.name}</h3>
            <p>{guide.text}</p>
            {guide.draft && <p className="cs-draft">Current PDF edition: Draft</p>}
          </article>
        ))}
      </div>
      <details className="cs-inside-guides">
        <summary>Look inside the producer guides <span aria-hidden="true">+</span></summary>
        <div className="cs-preview-grid">
          <PagePreview file="manual-gap.webp" alt="Sales manual coverage discovery page showing the house, personal property, and financial assets questions" caption="The coverage discovery framework" />
          <PagePreview file="opening-index.webp" alt="The Objection Playbook index listing sixteen opening objections" caption="The opening-objection reference" />
        </div>
      </details>
      <p className="cs-note">The resource-library download acknowledgment is optional. Downloading these references is not a required progression gate.</p>
    </div>
  </section>
);

const confirmationSteps = [
  { when: 'Within 48 hours', title: 'Lead the debrief.', text: 'Use teach-back questions to hear what stuck. Agree on commitments, a baseline, and business targets.' },
  { when: 'Week one', title: 'Watch the live proof.', text: 'Run an owner-led roleplay and review real quoted calls against the same standard.' },
  { when: 'Days 1–30', title: 'Coach it into the work.', text: 'Hold four weekly check-ins: the numbers, one call clip, one re-rep, and one commitment.' },
  { when: 'Day 30', title: 'Make the sign-off mean something.', text: 'Record Confirmed or Not Yet. Name the specific next step: modules to repeat and the next proof window when there is a gap.' },
];

const ConfirmationSection = () => (
  <section id="confirmation" className="cs-section">
    <div className="cs-container">
      <Eyebrow>/ The Owner Handoff · The Confirmation</Eyebrow>
      <h2 className="cs-heading">Course passed.<br /><span>Now prove it on real work.</span></h2>
      <p className="cs-intro">Training evidence gives you a place to start. The Confirmation is your owner playbook for the next 30 days: debrief, live proof, weekly coaching, and a decision you can stand behind.</p>
      <div className="cs-confirmation-grid">
        <div className="cs-owner-materials">
          <figure className="cs-owner-cover">
            <img src="/certified-standard/the-confirmation-cover.webp" alt="The Confirmation, the included owner playbook" loading="lazy" />
            <figcaption>The fourth guide: your included owner PDF. Cover preview.</figcaption>
          </figure>
          <PagePreview file="owner-scoreboard.webp" alt="Actual Confirmation scoreboard with owner-entered baseline, 30-day target, and actual result columns" caption="Inside The Confirmation: the owner scoreboard" />
        </div>
        <ol className="cs-confirmation-steps">
          {confirmationSteps.map(step => (
            <li key={step.when}>
              <p className="cs-when">{step.when}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="cs-evidence-boundary">
        <h3>Training evidence is saved. Business results are yours to verify.</h3>
        <p>Agency Brain tracks submitted training evidence. You set the business targets and record results from your own sources. The Confirmation’s business scoreboard is owner-maintained; the program does not automatically calculate it.</p>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   10 - PRICING (single price, single seat)
   ══════════════════════════════════════════════════════ */
const seatFeatures = [
  '17 conversation modules and four knowledge commitments',
  'AI customer practice, scored skill checks, and scored knowledge checks',
  '80% to pass scored checks',
  'Saved progress, submitted answers, results, and feedback',
  'Three producer PDF guides plus The Confirmation owner playbook',
  'Standard one-time allowance of 750 voice minutes per learner seat',
  'Owner workspace for seat allocation, learner progress, and voice usage',
];

const PricingSection = () => (
  <section id="pricing" style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal><Eyebrow onDark>/ Pricing</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 104px)', lineHeight: 0.95,
          letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          Set the standard. <span style={{ color: blue }}>Choose your learners.</span>
        </h2>
      </Reveal>

      <div className="mx-auto" style={{ maxWidth: 560 }}>
        <Reveal delay={0.08}>
          <div style={{
            border: `1.5px solid ${blue}`, background: '#ffffff08',
            padding: '36px 24px', display: 'flex', flexDirection: 'column',
          }}>
            <h3 style={{ fontFamily: display, fontSize: 'clamp(26px, 2.6vw, 36px)', lineHeight: 1, letterSpacing: '-0.01em', color: paper, textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18 }}>
              One Learner Seat
            </h3>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontFamily: display, fontSize: 'clamp(44px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', color: blue, fontWeight: 400 }}>$399</span>
              <span style={{ fontFamily: body, fontSize: 15, fontWeight: 500, color: paper, opacity: 0.6, marginLeft: 10 }}>per learner seat, one time</span>
              <p style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.6, marginTop: 12, marginBottom: 0 }}>Purchased seats start unassigned. Managing your team uses no seat. Explicit owner self-enrollment consumes one seat.</p>
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 36px', padding: 0, display: 'grid', gap: 13 }}>
              {seatFeatures.map((f) => (
                <li key={f} style={{ fontFamily: body, fontSize: 16, color: paper, opacity: 0.85, paddingLeft: 24, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: blue, fontWeight: 700 }}>+</span>{f}
                </li>
              ))}
            </ul>
            <PurchaseLink
              style={{
                fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', textAlign: 'center', padding: '17px 0', textDecoration: 'none',
                color: ink, background: paper, border: `1.5px solid ${paper}`, transition: 'all .25s', display: 'block',
              }}
              className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white"
            >
              {CHECKOUT_LABEL} →
            </PurchaseLink>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p style={{ fontFamily: body, fontSize: 16, color: paper, opacity: 0.7, marginTop: 28, textAlign: 'center' }}>
            Buy one seat per learner. Purchase and training are delivered through Agency Brain. Available standalone; no full Agency Brain subscription required.
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
  { q: 'Is this for new hires or experienced producers?', a: 'Both. New producers get a defined process and a place to rehearse it. Experienced producers work on the conversations they tend to rush, avoid, or lose. Everyone works through the same required path.' },
  { q: 'Does the owner have to buy a seat?', a: 'Managing your team uses no seat. Buy one seat for each learner taking the course. Purchased seats start unassigned. Assign them to producers or explicitly enroll yourself; owner self-enrollment consumes one seat.' },
  { q: 'What is practice, and what is scored?', a: 'Teaching and guided scripted practice are unscored. The five hook modules also have unscored off-script practice. The other 12 off-script activities are scored skill checks. All 17 conversation modules have scored knowledge checks. Scored checks require 80% to pass. Four knowledge commitments cover protection, post-sale follow-through, follow-up, and the Sold, Dashboard, and Prospects workflow.' },
  { q: 'What if a producer misses a knowledge check?', a: 'Review the saved feedback and complete recovery practice before retrying. After three unsuccessful quiz attempts, manager coaching and an unlock are required. The owner can review the gap and coach the next attempt.' },
  { q: 'How much AI voice time is included?', a: 'Each learner seat includes a standard one-time allowance of 750 voice minutes for certification practice and voice assessments. Voice usage is metered. Used and remaining time are visible in the workspace.' },
  { q: 'What can I review as an owner?', a: 'Required progress, current and next activities, coaching needs, saved answers, results, and feedback. Available practice transcripts and roleplay reports help you review the work. You can also manage recovery coaching unlocks, seat allocation, and voice usage.' },
  { q: 'What guides are included? Are downloads required?', a: 'From hello to closed., The Objection Playbook, and The Closing Objection Bank are the producer references. The current closing-objection PDF is labeled Draft. The Confirmation is the owner playbook. The optional resource-library download acknowledgment does not block required progression.' },
  { q: 'What do I do after the course?', a: 'Use The Confirmation for a debrief within 48 hours, owner-led roleplay and real-call review in week one, four weekly check-ins during the 30-day coaching window, and a day-30 Confirmed / Not Yet sign-off with a specific next step. You set business targets and enter results from your own sources; the training platform does not automatically calculate that scoreboard.' },
  { q: 'Do I need a full Agency Brain subscription?', a: 'No. Certified Standard is available standalone for $399 per learner seat, one time. Purchase and training are delivered through Agency Brain. The program includes the course, practice and assessments, learner management, and the included guides. Other Agency Brain CRM, automation, and call-scoring products are separate.' },
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
          GIVE EVERY PRODUCER<br /><span style={{ color: blue }}>A PROCESS YOU CAN COACH.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p style={{ fontFamily: body, fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: 1.5, color: paper, opacity: 0.85, marginTop: 32, maxWidth: 680, marginInline: 'auto' }}>
          Give them the process to practice. Give yourself the evidence to coach it. $399 per learner seat, one time, through Agency Brain.
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
            { label: 'What’s inside', href: '#curriculum' },
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
                  <a href={it.href} style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.85, textDecoration: 'none' }} className="hover:opacity-100">
                    {it.label}
                  </a>
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
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40" style={{ background: ink, padding: '12px 16px max(12px, env(safe-area-inset-bottom))', borderTop: `1px solid ${paper}33` }}>
    <PurchaseLink
      style={{
        fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase', textAlign: 'center',
        textDecoration: 'none', display: 'block',
      }}
    >
      Choose seats · $399 / learner · one time
    </PurchaseLink>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldCertifiedStandard = () => (
  <div className="cs-page" style={{ background: paper, fontFamily: body, color: ink }}>
    <BoldNav />
    <main id="main-content">
    <Hero />
    <MarqueeBands />
    <ProblemSection />
    <HowSection />
    <PayoffSection />
    <WorkbookSection />
    <ConfirmationSection />
    <InsideSection />
    <PricingSection />
    <QuestionsSection />
    <FinalClose />
    </main>
    <BoldFooter />
    <ContentMeta lastUpdated="November 2026" />
    <MobileStickyCTA />
  </div>
);

export default BoldCertifiedStandard;
