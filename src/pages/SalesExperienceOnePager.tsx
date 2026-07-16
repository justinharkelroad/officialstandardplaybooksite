import { useState } from 'react';
import { Link } from 'react-router-dom';
import StandardFitModal from '@/components/StandardFitModal';
import standardLogo from '@/assets/standard-word-logo.png';
import './SalesExperienceOnePager.css';

const BOOK_URL = 'https://AGENCYCOACHING.as.me/8week';
const PROGRAM_NAME = 'The 8-Week Sales Management Experience';
const STORAGE_BASE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';
const dashboardImage = `${STORAGE_BASE}/Sales%20Experience%20Dashboard.png`;
const trainingImage = `${STORAGE_BASE}/Training%20Modules%20w%20Feedback.png`;

const faqs = [
  {
    question: 'What is the daily coaching piece?',
    answer: "Justin sends your sales manager a short voice note every weekday around that week's focus. They respond with the real situation, and Justin coaches the decision.",
  },
  {
    question: "How much of my manager's time does this take?",
    answer: 'A few minutes each day on the voice thread, one live call each week, and the work of running the system with the team. It is built for a working manager.',
  },
  {
    question: 'What does the sales team do?',
    answer: 'The team receives a short training video every Monday and applies a workbook to real calls every Wednesday. The work becomes part of the operating week.',
  },
  {
    question: 'What if we fall behind?',
    answer: 'The pace can bend to the agency, but the finish line stays fixed: a signed sales process, clear numbers, and a consequence ladder the team is actively running.',
  },
  {
    question: 'Who is this not for?',
    answer: 'Owners who want to buy a course, hand it off, and disappear. Your manager needs room to lead, and the agency needs to participate in the build.',
  },
];

const testimonials = [
  {
    quote: `I've learned a lot from this process, a lot about myself as a manager and leader as well. I feel that I can move forward a lot more confidently knowing what questions to ask myself and being a bit more inquisitive rather than jumping into action that may not be the most efficient or produce the best outcome. You've really taught me not just to think but how to think in just 7 hours which is wild.`,
    name: 'Mike V.',
  },
  {
    quote: `Creating and enforcing a standard is something every leader needs help with. Working with Justin was a game changer. You don't realize what you're missing until you have someone who truly understands your challenges and helps deliver results that matter. Accountability was something I struggled to implement, but once we established and enforced our own standards, it forced everyone to level up.`,
    name: 'Luis S.',
  },
  {
    quote: `Working with Justin over the 8-week training was eye-opening and transformative. He showed me how to become a stronger, more accountable leader for my team and can truly bulletproof your agency, as long as you're able to hold yourself accountable as well.`,
    name: 'Jonas B.',
  },
];

const build = [
  {
    label: 'Find it',
    timing: 'Week 1',
    title: 'Start with the real number.',
    body: 'Your manager finds the true starting line with no story attached. It becomes the honest baseline everything gets measured against.',
  },
  {
    label: 'Build it',
    timing: 'Weeks 2-7',
    title: 'Author the system.',
    body: 'The team writes the talk path, daily activity floor, monthly production line, follow-up standard, and consequence ladder in their own words.',
  },
  {
    label: 'Sign it',
    timing: 'Week 8',
    title: 'Put names on the standard.',
    body: 'Your team signs the system they built. It is live on a random Tuesday, not perfect and waiting in a drawer.',
  },
];

const rhythm = [
  {
    cadence: 'Daily',
    title: 'Justin coaches the manager.',
    body: 'A short voice note lands in Telegram every weekday. Your manager responds with real numbers, decisions, and sticking points. Justin answers.',
  },
  {
    cadence: 'Weekly',
    title: 'The document gets locked.',
    body: 'One live call with Justin turns that week’s decisions into a finished piece of the operating system.',
  },
  {
    cadence: 'The team',
    title: 'Producers move with the build.',
    body: 'Every Monday they receive a short training video. Every Wednesday they apply a workbook to real calls.',
  },
  {
    cadence: 'After week 8',
    title: 'The system keeps running.',
    body: 'Tracking, scorecards, and AI call grading continue inside Agency Brain, bundled with the experience.',
  },
];

const deliverables = [
  ['40 daily coaching prompts', 'Justin’s voice, Monday through Friday, straight to your manager.'],
  ['8 live coaching calls', 'One per week with Justin to lock each part of the system.'],
  ['16 team training assets', 'Eight Monday videos and eight Wednesday workbooks.'],
  ['Your signed sales process', 'The team’s call structure, written in their own words.'],
  ['The numbers', 'A daily activity floor and monthly production line.'],
  ['The consequence ladder', 'A written, escalating path understood before it is used.'],
  ['Agency Brain', 'Daily tracking, weekly scorecards, and AI-graded calls.'],
  ['The guarantee', 'Run the system with Justin. If the team does not move, you do not pay.'],
];

const SalesExperienceOnePager = () => {
  const [applicationOpen, setApplicationOpen] = useState(false);

  const openApplication = () => {
    try {
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'InitiateCheckout', {
        content_name: `${PROGRAM_NAME} Application`,
      });
    } catch {
      // Analytics is best-effort and must never block the application.
    }
    setApplicationOpen(true);
  };

  return (
    <main className="eightweek-page">
      <header className="eightweek-nav" aria-label="Primary navigation">
        <div className="eightweek-shell eightweek-nav__inner">
          <Link to="/" className="eightweek-nav__brand" aria-label="The Standard Playbook home">
            <img src={standardLogo} alt="The Standard Playbook" />
          </Link>
          <button type="button" className="eightweek-nav__apply" onClick={openApplication}>
            Apply now
          </button>
        </div>
      </header>

      <section className="eightweek-hero">
        <div className="eightweek-shell eightweek-hero__grid">
          <div className="eightweek-hero__main">
            <p className="eightweek-kicker">Stop managing chaos. Start running a system.</p>
            <h1>
              The 8-Week
              <span>Sales Management Experience</span>
            </h1>
            <p className="eightweek-hero__intro">
              Your sales manager authors the process, numbers, and consequences your agency runs on. Signed and operating by week eight.
            </p>
            <button type="button" className="eightweek-cta" onClick={openApplication}>
              Apply for the 8-Week
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <aside className="eightweek-hero__aside" aria-label="Program overview">
            <div className="eightweek-hero__visual">
              <img src="/8-week-hero.jpg" alt="The 8-Week Sales Management Experience in action" loading="eager" />
            </div>
            <div className="eightweek-hero__facts" aria-label="Program facts">
              <div><strong>8</strong><span>weeks, fixed sprint</span></div>
              <div><strong>1:1</strong><span>daily coaching with Justin</span></div>
              <div><strong>1</strong><span>signed operating system</span></div>
              <p>Built for your sales manager and the team they lead.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="eightweek-section eightweek-coinflip">
        <div className="eightweek-shell">
          <p className="eightweek-coinflip__line">Great month. Bad month.</p>
          <h2>That is not a sales team.<br />That is a coin flip.</h2>
          <div className="eightweek-coinflip__copy">
            <p>Your production swings because the process lives in one person’s head. The top producer just does it. Everyone else guesses.</p>
            <p>A standard that is not written down cannot be taught, coached, or repeated.</p>
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-promise">
        <div className="eightweek-shell eightweek-promise__grid">
          <div>
            <h2>Certainty, in writing.</h2>
          </div>
          <blockquote>
            One call the whole team runs. Numbers they hit every day. A consequence everyone understands before it is ever used.
          </blockquote>
          <p>Built by your team, not handed to them. You do not adopt a standard. You author one.</p>
        </div>
      </section>

      <section className="eightweek-section eightweek-build">
        <div className="eightweek-shell">
          <h2>Find it. Build it. Sign it.</h2>
          <div className="eightweek-build__list">
            {build.map((item) => (
              <article key={item.label}>
                <div>
                  <p>{item.label}</p>
                  <span>{item.timing}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-rhythm">
        <div className="eightweek-shell eightweek-rhythm__grid">
          <div className="eightweek-rhythm__heading">
            <p className="eightweek-kicker">The operating rhythm</p>
            <h2>The work moves every day.</h2>
          </div>
          <div className="eightweek-rhythm__list">
            {rhythm.map((item) => (
              <article key={item.cadence}>
                <p>{item.cadence}</p>
                <div>
                  <h3>{item.title}</h3>
                  <span>{item.body}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-system">
        <div className="eightweek-shell eightweek-system__grid">
          <div className="eightweek-system__number">
            <strong>1</strong>
            <span>signed system</span>
          </div>
          <div>
            <h2>Authored. Signed. Operating.</h2>
            <p>The talk path, activity floor, production line, follow-up standard, and consequence ladder. One repeatable process with the team’s names on it.</p>
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-included">
        <div className="eightweek-shell eightweek-included__grid">
          <div>
            <p className="eightweek-kicker">What is included</p>
            <h2>Everything required to make the standard real.</h2>
          </div>
          <ol>
            {deliverables.map(([title, body], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{title}</strong><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="eightweek-section eightweek-after">
        <div className="eightweek-shell">
          <div className="eightweek-after__copy">
            <h2>Week eight is not the end of the system.</h2>
            <p>Agency Brain keeps the tracking, weekly scorecards, training, and AI call grading in one operating environment after the sprint ends.</p>
          </div>
          <div className="eightweek-after__media">
            <figure>
              <img src={dashboardImage} alt="Agency Brain sales experience dashboard" loading="lazy" />
              <figcaption>Daily numbers and weekly scorecards</figcaption>
            </figure>
            <figure>
              <img src={trainingImage} alt="Agency Brain training modules with team feedback" loading="lazy" />
              <figcaption>Training with manager feedback</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-proof">
        <div className="eightweek-shell eightweek-proof__grid">
          <div className="eightweek-proof__copy">
            <p className="eightweek-kicker">Proof from an agency owner</p>
            <blockquote>“He paid attention to my culture first.”</blockquote>
            <p className="eightweek-proof__name">Dan Westrick, Allstate Agency Owner</p>
            <p className="eightweek-proof__body">The system has to fit the people expected to run it. That is why the work starts inside your agency instead of arriving as a generic script.</p>
          </div>
          <div className="eightweek-proof__media">
            <video
              src="/video/westrick-testimonial.mp4"
              poster="/video/westrick-testimonial-poster.jpg"
              controls
              playsInline
              preload="none"
              title="Dan Westrick success story"
            />
          </div>
        </div>
        <div className="eightweek-shell eightweek-proof__quotes" aria-label="Participant testimonials">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name}>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>8-Week participant</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="eightweek-section eightweek-fit">
        <div className="eightweek-shell">
          <h2>Built for the owner ready to let a manager lead.</h2>
          <div className="eightweek-fit__grid">
            <article>
              <h3>This is for you if</h3>
              <p>You are tired of being the only person who can sell, ready to put the process in writing, and willing to let your sales manager own the standard.</p>
            </article>
            <article>
              <h3>This is not for you if</h3>
              <p>You want a course to hand off, plan to disappear from the build, or will not give your manager the authority to lead the team.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-offer">
        <div className="eightweek-shell eightweek-offer__grid">
          <div className="eightweek-offer__copy">
            <h2>A build, not a course.</h2>
            <p>Your manager works every day, your team works every week, and Justin stays in the build the whole way.</p>
          </div>
          <div className="eightweek-offer__price">
            <p>Eight-week experience</p>
            <strong>$4,500</strong>
            <span>or $625 per week</span>
            <button type="button" className="eightweek-cta" onClick={openApplication}>
              Apply for the 8-Week
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      <section className="eightweek-section eightweek-faq">
        <div className="eightweek-shell eightweek-faq__grid">
          <div>
            <p className="eightweek-kicker">Before you apply</p>
            <h2>Questions, answered.</h2>
          </div>
          <div className="eightweek-faq__list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="eightweek-guarantee">
        <div className="eightweek-shell eightweek-guarantee__inner">
          <p className="eightweek-kicker">The guarantee</p>
          <h2>Run the system with Justin. If the team does not move, you do not pay.</h2>
        </div>
      </section>

      <section className="eightweek-final">
        <div className="eightweek-shell eightweek-final__inner">
          <img src={standardLogo} alt="" aria-hidden="true" />
          <h2>Stop managing a coin flip.</h2>
          <p>Build the system your sales manager and team can run without guessing.</p>
          <button type="button" className="eightweek-cta eightweek-cta--light" onClick={openApplication}>
            Apply for the 8-Week
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <footer className="eightweek-footer">
        <div className="eightweek-shell">
          <p>Not for owners who will not let their manager lead. No income or sales results are promised or implied. Outcomes depend on your market and execution.</p>
          <p>© {new Date().getFullYear()} The Standard Playbook</p>
        </div>
      </footer>

      <StandardFitModal
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
        source="8-week-sales-experience"
        bookingBaseUrl={BOOK_URL}
        callLengthLabel="strategy"
        programName={PROGRAM_NAME}
      />
    </main>
  );
};

export default SalesExperienceOnePager;
