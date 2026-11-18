import { useState } from 'react';
import { Link } from 'react-router-dom';
import StandardFitModal from '@/components/StandardFitModal';
import standardLogo from '@/assets/standard-word-logo.png';
import './Ascension.css';

const domains = [
  {
    name: 'Body',
    detail: 'A physical event or standard on the calendar, daily training, and the energy to walk through your front door whole instead of wrecked by 9 PM.',
  },
  {
    name: 'Being',
    detail: 'Daily stillness with God, guided Flow AI sessions that separate story from fact, and Brain Dump notes that train your AI coach on who you are.',
  },
  {
    name: 'Balance',
    detail: 'Hard office cutoffs, morning presence, a Love, Honor & Appreciate text before your spouse wakes up, and zero late-night office heroics.',
  },
  {
    name: 'Business',
    detail: 'One stretch 12-week target, a three-month Mission Cycle ramp, and your own operating DNA extracted into guardrails your team actually follows.',
  },
];

const process = [
  {
    label: 'Call 01 · The Build',
    title: 'Scrap the safe plan. Lock the 12-Week Game.',
    detail: 'Your 12 weeks start on Call 1. Even if you pre-fill targets ahead of time, we tear down comfortable numbers and ten-item wishlists live inside Agency Brain, set one stretch business target, lock non-negotiable home boundaries first, and map your three 4-week Mission Cycles.',
  },
  {
    label: 'Extraction',
    title: 'Pull the standard out of your head.',
    detail: 'No generic scripts that sound nothing like you. We record your A-to-Z standard, compare it against voice memos and call recordings from your team to expose what they actually hear, kill the "every call is different" excuse, and build clear guardrails one bottleneck at a time.',
  },
  {
    label: 'Every Week',
    title: 'Four Weekly Drives. Sixty minutes 1:1.',
    detail: 'Each week in Personal Growth, we lock up to four winnable Weekly Drives. On your private 60-minute call with Justin, you read your Weekly Flow Reflection aloud, audit real evidence on last week’s Drives, confront drift and negative self-talk, and set the next four.',
  },
  {
    label: 'Sunday + Week 12',
    title: 'Seal every week. Leave unrecognizable.',
    detail: 'Every Sunday, you close the loop in your Weekly Debrief, reinforce your targets with your 90-Day Audio track, and set next week’s Playbook. By Week 12, your processes live on paper instead of on your back.',
  },
];

const rhythm = [
  {
    cadence: 'All 7 days',
    title: 'Core 4 + Flow AI every single day',
    detail: 'No weekends off from who you are. Every day—Saturday and Sunday included—you keep your Core 4 across Body, Being, Balance, and Business, send your Love, Honor & Appreciate text, and complete a guided Flow in Agency Brain.',
  },
  {
    cadence: 'Daily in Telegram',
    title: 'Share the Flow + raw voice drop',
    detail: 'Post your completed Flow and send Justin an unfiltered daily audio covering yesterday’s execution, today’s plan, and what is actually weighing on you. Tactical side fires get solved right in Telegram.',
  },
  {
    cadence: 'Mon – Fri',
    title: 'Four weekday Power Plays',
    detail: 'Execute four stretch Power Plays each business day inside Agency Brain to move your Weekly Drives forward. There are no Power Plays on the weekend—only your daily Core 4 and Flow.',
  },
  {
    cadence: 'Daily audit',
    title: 'Automated Telegram check-ins',
    detail: 'Automated feedback in Telegram tracks every voice drop, every Flow, and your live points toward 60—calling out drift immediately before your weekly 1:1 call.',
  },
];

const scoreBreakdown = [
  {
    points: '28',
    name: 'Core 4',
    detail: 'One daily commitment kept across Body, Being, Balance, and Business—all seven days of the week, weekends included (4/day).',
  },
  {
    points: '07',
    name: 'Flow AI',
    detail: 'One completed guided Flow every single day—Monday through Sunday.',
  },
  {
    points: '25',
    name: 'Weekly Playbook',
    detail: '20 weekday Power Plays (4/day Mon–Fri; no Power Plays on weekends) + up to 4 Weekly Drives + 1 Sweep Bonus when all 20 Plays and every declared Drive are complete.',
  },
];

const deliverables = [
  'Deep-dive Call 1 build to lock your 12-Week Game and 3-month Mission Cycle ramp',
  'Weekly 60-minute private 1:1 coaching calls with Justin (never a group)',
  'Required daily Flow shares and raw voice-memo coaching with Justin in Telegram',
  'Automated daily Telegram audits on your voice drops, Flows, and 60-point pace',
  'Up to four Weekly Drives per week extracting your sales and coaching standards into writing',
  'Full Agency Brain + Personal Growth access (Core 4, Power Plays, Flow AI, Brain Dump)',
  'Weekly Flow Reflections, 90-Day Audio theta affirmation tracks, and Sunday Debriefs',
  'Boardroom membership included as soon as your account is set up',
  'Mission Cycle resets at weeks four and eight to pressure-test the ramp and protect boundaries',
  'A sealed 12-week record of proof and a repeatable standard for your next quarter',
];

const Ascension = () => {
  const [applicationOpen, setApplicationOpen] = useState(false);

  const openApplication = () => {
    try {
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'Lead', {
        content_name: 'The Standard Ascension Application',
      });
    } catch {
      // Analytics is best-effort and must never block the application.
    }
    setApplicationOpen(true);
  };

  return (
    <main className="ascension-page">
      <header className="ascension-nav" aria-label="Primary navigation">
        <div className="ascension-shell ascension-nav__inner">
          <Link to="/" aria-label="The Standard Playbook home" className="ascension-nav__brand">
            <img src={standardLogo} alt="The Standard Playbook" />
          </Link>
          <button type="button" className="ascension-nav__apply" onClick={openApplication}>
            Apply for Ascension
          </button>
        </div>
      </header>

      <section className="ascension-hero">
        <div className="ascension-shell ascension-hero__grid">
          <div className="ascension-hero__main">
            <p className="ascension-kicker">Private mentorship with Justin Harkelroad</p>
            <h1><span>The Standard</span><span>Ascension</span></h1>
            <p className="ascension-hero__intro">
              Twelve weeks. One stretch business target. All four areas of life locked inside Agency Brain, with daily Flows and voice drops in Telegram plus a private 1:1 call every week.
            </p>
            <button type="button" className="ascension-cta" onClick={openApplication}>
              Apply for Ascension
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="ascension-hero__media">
            <div className="ascension-hero__video">
              <iframe
                src="https://player.vimeo.com/video/1211845550?h=03ca2ffa0c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;dnt=1&amp;title=0&amp;byline=0&amp;portrait=0"
                title="Watch The Standard Ascension"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ascension-facts" aria-label="Program facts">
        <div className="ascension-shell ascension-facts__grid">
          <div>
            <strong>12</strong>
            <span>weeks starting on Call 1</span>
          </div>
          <div>
            <strong>1:1</strong>
            <span>weekly call + daily Telegram</span>
          </div>
          <div>
            <strong>60</strong>
            <span>points scored every week</span>
          </div>
          <p>By application only. Includes Agency Brain + Boardroom.</p>
        </div>
      </section>

      <section className="ascension-statement ascension-section">
        <div className="ascension-shell">
          <p className="ascension-statement__lead">Your agency only goes as far as you are willing to go personally.</p>
          <h2>One business target.<br />All of you on the board.</h2>
          <div className="ascension-domains">
            {domains.map((domain) => (
              <article key={domain.name}>
                <h3>{domain.name}</h3>
                <p>{domain.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-tension">
        <div className="ascension-shell ascension-tension__grid">
          <div>
            <p className="ascension-kicker">The pattern</p>
            <h2>You tell yourself life comes after the business is fixed.</h2>
          </div>
          <div className="ascension-tension__copy">
            <p>You keep every process in your head, step back in to write policies yourself when the month slows down, and come home fried—telling yourself workouts, marriage, and stillness will happen once the agency settles down.</p>
            <p>In Ascension, home and health are not the reward at the end. They are the non-negotiable guardrails we lock before we chase the number.</p>
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-promise">
        <div className="ascension-shell ascension-promise__inner">
          <p className="ascension-kicker">The promise</p>
          <blockquote>
            For 12 weeks, you keep your word in all four areas.
          </blockquote>
          <p className="ascension-promise__body">
            Your Flows and voice drops are witnessed daily in Telegram, your 60-point week is scored inside Agency Brain, and drift is confronted with love on the spot.
          </p>
          <p className="ascension-promise__note">No revenue guarantees. We lock your boundaries, extract your standard onto paper, and let the weekly evidence stack.</p>
        </div>
      </section>

      <section className="ascension-section ascension-process">
        <div className="ascension-shell">
          <h2>How we run the 12 weeks.</h2>
          <div className="ascension-process__list">
            {process.map((item) => (
              <article key={item.label}>
                <p>{item.label}</p>
                <h3>{item.title}</h3>
                <span>{item.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-rhythm">
        <div className="ascension-shell ascension-rhythm__grid">
          <div className="ascension-rhythm__heading">
            <p className="ascension-kicker">Operating rhythm</p>
            <h2>The work happens between calls.</h2>
          </div>
          <div className="ascension-rhythm__list">
            {rhythm.map((item) => (
              <article key={item.cadence}>
                <p>{item.cadence}</p>
                <div>
                  <h3>{item.title}</h3>
                  <span>{item.detail}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-score">
        <div className="ascension-shell ascension-score__grid">
          <div className="ascension-score__number">
            <strong>60</strong>
            <span>points per week</span>
          </div>
          <div className="ascension-score__copy">
            <h2>A scoreboard honest enough to change you.</h2>
            <p>Tracked live inside the Personal Growth hub in Agency Brain. Core 4 and Flow AI are hit all seven days—weekends included—while Power Plays run Monday through Friday only. No vague wins and no hiding behind intention.</p>
            <div className="ascension-score__breakdown" aria-label="60-point weekly breakdown">
              {scoreBreakdown.map((row) => (
                <div key={row.name} className="ascension-score__row">
                  <strong>{row.points}</strong>
                  <div>
                    <h3>{row.name}</h3>
                    <p>{row.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-deliverables">
        <div className="ascension-shell ascension-deliverables__grid">
          <div>
            <p className="ascension-kicker">What is included</p>
            <h2>Not motivation. A personal operating standard.</h2>
          </div>
          <ol>
            {deliverables.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ascension-section ascension-offer">
        <div className="ascension-shell ascension-offer__grid">
          <div className="ascension-offer__copy">
            <p className="ascension-kicker">Private enrollment</p>
            <h2>The work starts<br />with the right fit.</h2>
            <p>Ascension is for the owner who is done negotiating with the promises they make to themselves. Agency Brain and Boardroom open as soon as you enroll, and your 12-week clock begins on Call 1.</p>
          </div>
          <aside className="ascension-offer__application" aria-label="Ascension application details">
            <p>Application-only mentorship</p>
            <strong>12</strong>
            <span>weeks &middot; private 1:1 &middot; intentionally small roster</span>
            <p className="ascension-offer__investment">Apply to see the investment.</p>
            <ol>
              <li><span>01</span>Submit your application</li>
              <li><span>02</span>We review the fit</li>
              <li><span>03</span>Qualified owners schedule a private call</li>
            </ol>
            <button type="button" className="ascension-cta ascension-cta--dark" onClick={openApplication}>
              Apply for Ascension
              <span aria-hidden="true">↗</span>
            </button>
          </aside>
        </div>
      </section>

      <section className="ascension-final">
        <div className="ascension-shell ascension-final__inner">
          <img src={standardLogo} alt="" aria-hidden="true" />
          <h2>You versus you.</h2>
          <p>One-on-one private mentorship for the next 12 weeks.</p>
          <button type="button" className="ascension-cta" onClick={openApplication}>
            Apply for Ascension
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <footer className="ascension-footer">
        <div className="ascension-shell">
          <p>Results vary. The Ascension is coaching and accountability, not a guarantee of financial performance.</p>
          <p>© {new Date().getFullYear()} The Standard Playbook</p>
        </div>
      </footer>

      <StandardFitModal
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
        source="ascension"
        callLengthLabel="45-min"
        programName="The Standard Ascension"
      />
    </main>
  );
};

export default Ascension;
