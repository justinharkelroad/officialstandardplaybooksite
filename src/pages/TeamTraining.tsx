import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const FONT_STACK = "Inter, -apple-system, 'SF Pro Display', system-ui, sans-serif";

type Track = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
};

const TRACKS: Track[] = [
  {
    number: 'TRACK 01',
    title: 'Standard Sequence Sales',
    description: "The 6-step call system that runs every quoted-household conversation in Justin's agency.",
    bullets: [
      'Hooks by lead type — auto, home, win-back, x-date, cross-sell',
      'Rapport and trust-building question banks',
      'The coverage conversation: 3-question gap method, umbrella focus',
      'Closing the call with a clean yes or no',
      'Follow-up cadence built into the sequence',
    ],
  },
  {
    number: 'TRACK 02',
    title: 'Objection Library',
    description:
      'A full library of word tracks for the five objections that kill most calls. Multiple rebuttal options per objection so producers can pick the one that fits their voice.',
    bullets: [
      '"It\'s too expensive" — 5 rebuttals',
      '"Just email it to me" — 5 rebuttals',
      '"I need to talk to my spouse" — 5 rebuttals',
      '"Coverage is great, price isn\'t" — 4 rebuttals',
      '"I just paid my insurance" — 4 rebuttals',
    ],
  },
  {
    number: 'TRACK 03',
    title: 'Sales Mastery',
    description:
      'The skills layer underneath the sequence. How producers actually communicate, prepare, and close.',
    bullets: [
      'The 10-minute Communication Exercise (sound, vision, text)',
      'Tone, Tempo, Timing — the TTT framework',
      'The 3-Question Approach for liability conversations',
      'Loom e-proposals that hold the frame',
      '45-day follow-up cadence with selfie-video email touchpoints',
    ],
  },
  {
    number: 'TRACK 04',
    title: 'The Standard Discovery Method',
    description:
      'A 5-stage discovery framework that makes the close easy because the prospect closes themselves.',
    bullets: [
      'Connection — disarm and earn the right to ask',
      'Engagement — situation, problem awareness, consequence, solution awareness',
      'Transition — bridge from discovery to quote',
      'Presentation — quote in their words, three options',
      'Commitment — soft confirmation, not pressure',
      'Includes a downloadable Standard Discovery Question Bank PDF',
    ],
  },
  {
    number: 'TRACK 05',
    title: 'Service Process',
    description: "Service isn't order-taking. It's where retention is won or lost.",
    bullets: [
      'Mini reviews that uncover money and protection gaps',
      'The 8-step review framework — appreciate, position, educate, recommend',
      'Bringing up life insurance without it feeling like a pitch',
      'Communication exercise adapted for service roles',
    ],
  },
  {
    number: 'TRACK 06',
    title: 'Agency Management',
    description: 'For owners and managers. The systems that hold the team accountable.',
    bullets: [
      'Lead Manager — the binary "Sold or Requote" workflow',
      'Daily Recruiting Ritual — the 15-minute prospecting habit',
      'Documented Sales Process, Requote Process, Winback Process',
      'Coaching vs. Compliance — why 99% of "coaching problems" are compliance problems',
      '3 Pillars of Sales Culture — daily activity targets, talk path, assumptive close',
      'Running team meetings with the Learning Cycle (Teach → Takeaway → Discuss → Teach-Back)',
      'Knowing the Numbers — marketing ROI benchmarks, contact rate, conversion rate, close rate',
    ],
  },
  {
    number: 'TRACK 07',
    title: 'AI & Technology',
    description: 'How to deploy AI inside the agency — without touching customer PII or carrier systems.',
    bullets: [
      'Building a custom AI Sales Roleplay bot in ElevenLabs',
      'Prompting with Advanced Voice Mode',
      'AI Tips & Tricks — ChatGPT, NotebookLM, Lovable',
      'Prompting 101 — the role-first framework',
      'NotebookLM as a 24/7 internal trainer',
      'Build Your AI Brain — the 8-phase Cowork setup guide for owners',
    ],
  },
  {
    number: 'TRACK 08',
    title: 'Agency Brain Product Training (Management Access)',
    description: 'Owner and manager training inside the platform itself.',
    bullets: [
      'Sequencing — building and applying customer workflows',
      'The Weekly Debrief — the 6-step Sunday reflection wizard',
    ],
  },
  {
    number: 'TRACK 09',
    title: 'Agency Brain Product Training (Staff Access)',
    description: 'Producer and service training on the tools they use every day.',
    bullets: [
      'The LQS Roadmap — open leads, quoted households, sold households',
      'AI Sales Roleplay Trainer — state-specific practice with instant grading',
      'Sequencing — applying workflows to clients',
      'Core Four habit tracking — Body, Being, Balance, Business',
      'The Power of Flowing — daily reflection practice',
    ],
  },
  {
    number: 'TRACK 10',
    title: 'Boardroom Recordings',
    description:
      'A growing library of real coaching session recaps from monthly Boardroom calls — actual client struggles, actual tactics, actual frameworks deployed.',
    bullets: [
      'Onboarding systems for prospects, customers, and team members',
      'Modern marketing and personal branding for agents',
      'Marketing ROI breakdowns and break-even formulas',
      'Mortgage referral partnership playbooks',
      'Sales incentive models — Efficiency Score and Pre-Paid Bonus',
      'Quarterly planning frameworks across Body, Being, Balance, Business',
    ],
  },
];

type SampleLesson = {
  trackLabel: string;
  title: string;
  quote: string;
};

const SAMPLE_LESSONS: SampleLesson[] = [
  {
    trackLabel: 'TRACK 01 / STANDARD SEQUENCE SALES',
    title: 'The 3-Question Approach',
    quote:
      'How much do you think your house is worth? If you flipped your house upside down and shook it, what is all the stuff that falls out worth? If you had to wrap a number around all your financial assets — IRA, 401k, savings — what would that number be?',
  },
  {
    trackLabel: 'TRACK 02 / OBJECTION LIBRARY',
    title: '"It\'s too expensive" — Option 3',
    quote:
      "I hear you on the price, and I don't want to keep you if you're busy. But before we hang up — do you have just one minute for me to show you how we might reduce that cost or uncover any hidden discounts? If it's still not a fit, I completely understand.",
  },
  {
    trackLabel: 'TRACK 03 / SALES MASTERY',
    title: 'Tone, Tempo, Timing',
    quote:
      "The pause is where the decision happens. The reason decisions don't happen for you is because you don't give them space to pause and think and respond.",
  },
];

function Kicker({ children, tone = 'dark' }: { children: React.ReactNode; tone?: 'dark' | 'light' | 'blue' }) {
  const color =
    tone === 'dark'
      ? 'text-white/60'
      : tone === 'blue'
        ? 'text-[#2997FF]'
        : 'text-[#6B7280]';
  return (
    <span
      className={`inline-block text-[13px] font-medium uppercase ${color}`}
      style={{ letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

const TeamTraining = () => {
  useEffect(() => {
    document.title = 'Team Training — The Standard Playbook';
  }, []);

  return (
    <div className="min-h-screen antialiased" style={{ fontFamily: FONT_STACK, color: '#020817' }}>
      <Navigation />

      {/* SECTION 1 — HERO (black) */}
      <section className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-32 md:pt-44 md:pb-48 text-center">
          <Kicker tone="dark">Team Training</Kicker>
          <h1
            className="mt-6 font-semibold text-white"
            style={{ fontSize: 'clamp(36px, 6vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Train your whole team. Without leaving the platform.
          </h1>
          <p
            className="mt-8 mx-auto text-white/75"
            style={{ fontSize: '21px', lineHeight: 1.55, maxWidth: '760px' }}
          >
            A complete on-demand training library — sales, service, management, AI, and the Agency Brain product itself. Plus the only platform that lets you build your own training from any video. All built into every Agency Brain account.
          </p>
        </div>
      </section>

      {/* SECTION 2 — DIFFERENTIATOR (light) */}
      <section className="bg-[#F5F5F7]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                heading: '10 Tracks + Yours',
                body: '10 structured tracks out of the box — plus the ability to build your own.',
              },
              {
                heading: 'Built by an operator',
                body: 'Justin Harkelroad — 20 years in the agency seat. Built and sold three.',
              },
              {
                heading: 'Real word tracks',
                body: 'Scripts, rebuttals, and full call sequences. Not theory.',
              },
            ].map((card) => (
              <div key={card.heading} className="bg-white rounded-xl p-8">
                <h3
                  className="font-semibold text-[#1D1D1F]"
                  style={{ fontSize: '28px', letterSpacing: '-0.015em', lineHeight: 1.15 }}
                >
                  {card.heading}
                </h3>
                <p className="mt-4 text-[#020817]" style={{ fontSize: '17px', lineHeight: 1.55 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
          <p
            className="mx-auto text-center mt-16 text-[#020817]"
            style={{ fontSize: '21px', lineHeight: 1.55, maxWidth: '760px' }}
          >
            Most "training libraries" are recycled motivation. This one was built inside a working Allstate agency by the operator who runs it. Every lesson is something his own team uses on Monday morning.
          </p>
        </div>
      </section>

      {/* SECTION 3 — THE 10 TRACKS (dark) */}
      <section className="bg-[#0B0B0C] text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-48">
          <div className="max-w-3xl">
            <Kicker tone="dark">What's inside</Kicker>
            <h2
              className="mt-6 font-semibold"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Ten tracks. One library.
            </h2>
            <p className="mt-6 text-white/75" style={{ fontSize: '21px', lineHeight: 1.55 }}>
              Each track is a structured path — not a video dump. Producers, service reps, and managers can each find their lane on day one.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRACKS.map((track) => (
              <article
                key={track.number}
                className="rounded-xl p-8"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <Kicker tone="blue">{track.number}</Kicker>
                <h3
                  className="mt-4 font-semibold text-white"
                  style={{ fontSize: '28px', letterSpacing: '-0.015em', lineHeight: 1.15 }}
                >
                  {track.title}
                </h3>
                <p className="mt-3 text-white/75" style={{ fontSize: '17px', lineHeight: 1.55 }}>
                  {track.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {track.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-white/85"
                      style={{ fontSize: '15px', lineHeight: 1.5 }}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[10px] inline-block flex-shrink-0"
                        style={{ width: '6px', height: '6px', backgroundColor: '#0071E3', borderRadius: '1px' }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3.5 — BUILD YOUR OWN (light) */}
      <section className="bg-[#F5F5F7]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-48">
          <div className="max-w-3xl">
            <Kicker tone="light">Build your own</Kicker>
            <h2
              className="mt-6 font-semibold text-[#1D1D1F]"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Take any video. Turn it into a team training in seconds.
            </h2>
            <p
              className="mt-6 text-[#020817]"
              style={{ fontSize: '21px', lineHeight: 1.55, maxWidth: '720px' }}
            >
              The Video Training Architect lets you drop in any video — a sales trainer you found, a leadership clip, a 30-second social post, a screen recording — and instantly convert it into a structured, insurance-specific training session. Discussion prompts. Application exercises. Stand-and-deliver execution. All generated for you.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload',
                body: 'Drop in any MP4, link, or screen recording. Sales content, leadership clip, social post — anything.',
              },
              {
                step: '02',
                title: 'The system structures it',
                body: 'The Video Training Architect analyzes the content through an insurance-specific lens and extracts the teaching points, frameworks, and selling principles.',
              },
              {
                step: '03',
                title: 'Deliver it',
                body: 'Your team gets a clean meeting structure: training focus, discussion prompts, application exercises, and stand-and-deliver execution. Use it on Zoom or in person. No more scrambling for meeting topics.',
              },
            ].map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-xl p-8"
                style={{ border: '1px solid #E2E8F0' }}
              >
                <span
                  className="font-semibold text-[#0071E3]"
                  style={{ fontSize: '15px', letterSpacing: '0.02em' }}
                >
                  {step.step}
                </span>
                <h4
                  className="mt-3 font-semibold text-[#1D1D1F]"
                  style={{ fontSize: '22px', letterSpacing: '-0.015em', lineHeight: 1.2 }}
                >
                  {step.title}
                </h4>
                <p className="mt-3 text-[#020817]" style={{ fontSize: '17px', lineHeight: 1.55 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mx-auto text-center mt-16 text-[#020817]"
            style={{ fontSize: '17px', lineHeight: 1.55, maxWidth: '720px' }}
          >
            Stop consuming. Start building. Any video, any topic, instantly converted into a repeatable learning cycle your team can run in person or on Zoom.
          </p>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS (light) */}
      <section className="bg-[#F5F5F7]" style={{ borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-48">
          <div className="max-w-3xl">
            <Kicker tone="light">How it works</Kicker>
            <h2
              className="mt-6 font-semibold text-[#1D1D1F]"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Built for the way agencies actually train.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="#0071E3" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="10" cy="11" r="4" />
                    <circle cx="22" cy="11" r="4" />
                    <path d="M3 26c0-3.5 3-6 7-6s7 2.5 7 6" />
                    <path d="M15 26c0-3.5 3-6 7-6s7 2.5 7 6" />
                  </svg>
                ),
                title: 'Role-based access',
                body: "Producers see producer training. Service reps see service training. Owners and managers unlock the management layer. Nobody gets buried in content that isn't theirs.",
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="#0071E3" strokeWidth="1.5" aria-hidden="true">
                    <rect x="4" y="6" width="24" height="16" rx="1.5" />
                    <path d="M12 26h8" />
                    <path d="M16 22v4" />
                  </svg>
                ),
                title: 'Watch on demand. Every device.',
                body: 'Stream from the dashboard, on the desk, on a phone between calls. Nothing to install. No separate login.',
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="#0071E3" strokeWidth="1.5" aria-hidden="true">
                    <rect x="5" y="5" width="10" height="10" rx="1.5" />
                    <rect x="17" y="5" width="10" height="10" rx="1.5" />
                    <rect x="5" y="17" width="10" height="10" rx="1.5" />
                    <rect x="17" y="17" width="10" height="10" rx="1.5" />
                  </svg>
                ),
                title: 'Built into the platform you already use',
                body: 'Training lives next to the workflows, the call scoring, the sequences, and the LQS Roadmap. Watch a lesson on Mini Reviews — then run one in the same window.',
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl p-8">
                <div className="w-10 h-10 mb-6">{card.icon}</div>
                <h3
                  className="font-semibold text-[#1D1D1F]"
                  style={{ fontSize: '22px', letterSpacing: '-0.015em', lineHeight: 1.2 }}
                >
                  {card.title}
                </h3>
                <p className="mt-3 text-[#020817]" style={{ fontSize: '17px', lineHeight: 1.55 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — SAMPLE LESSONS (dark) */}
      <section className="bg-[#0B0B0C] text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-48">
          <div className="max-w-3xl">
            <Kicker tone="dark">Sample lessons</Kicker>
            <h2
              className="mt-6 font-semibold"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              What an actual lesson looks like.
            </h2>
            <p className="mt-6 text-white/75" style={{ fontSize: '21px', lineHeight: 1.55 }}>
              Not summaries. The real language a producer hears on Monday morning.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_LESSONS.map((lesson) => (
              <article
                key={lesson.title}
                className="rounded-xl p-8"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <Kicker tone="blue">{lesson.trackLabel}</Kicker>
                <h4
                  className="mt-4 font-semibold text-white"
                  style={{ fontSize: '22px', letterSpacing: '-0.015em', lineHeight: 1.2 }}
                >
                  {lesson.title}
                </h4>
                <blockquote
                  className="mt-5 italic text-white/80"
                  style={{ fontSize: '17px', lineHeight: 1.6 }}
                >
                  "{lesson.quote}"
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — ALWAYS GROWING (light) */}
      <section className="bg-[#F5F5F7]">
        <div className="max-w-3xl mx-auto px-6 py-28 md:py-48">
          <Kicker tone="light">Still building</Kicker>
          <h2
            className="mt-6 font-semibold text-[#1D1D1F]"
            style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
          >
            New lessons added on the regular.
          </h2>
          <p className="mt-6 text-[#020817]" style={{ fontSize: '21px', lineHeight: 1.55 }}>
            The library grows from real coaching work — every Boardroom session, every objection that surfaces in a 1:1, every product update inside Agency Brain. When the field changes, the training catches up.
          </p>
          <p className="mt-6 text-[#6B7280]" style={{ fontSize: '14px' }}>
            Latest additions are flagged inside the platform.
          </p>
        </div>
      </section>

      {/* SECTION 7 — CLOSING STRIP (black) */}
      <section className="bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 py-28 md:py-48 text-center">
          <h2
            className="font-semibold"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.025em', lineHeight: 1.15 }}
          >
            Training that ships with the product.
          </h2>
          <p className="mt-6 text-white/75" style={{ fontSize: '21px', lineHeight: 1.55 }}>
            Every Agency Brain account includes the full training library. No add-on fee. No separate platform. Train the team where they already work.
          </p>
          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full transition-colors"
              style={{
                border: '1px solid #2997FF',
                color: '#2997FF',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              Back to The Standard Playbook
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamTraining;
