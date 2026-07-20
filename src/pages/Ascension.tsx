import { useState } from 'react';
import { Link } from 'react-router-dom';
import StandardFitModal from '@/components/StandardFitModal';
import standardLogo from '@/assets/standard-word-logo.png';
import './Ascension.css';

const domains = [
  { name: 'Body', detail: 'Energy, strength, recovery, and the physical capacity to lead.' },
  { name: 'Being', detail: 'Faith, identity, stillness, and the inner standard behind your decisions.' },
  { name: 'Balance', detail: 'Marriage, family, presence, and the relationships that cannot live on leftovers.' },
  { name: 'Business', detail: 'One measurable target, clear actions, and honest weekly evidence.' },
];

const rhythm = [
  { cadence: 'Daily', title: 'Execute the practice', detail: 'Complete the actions you committed to across Body, Being, Balance, and Business.' },
  { cadence: 'Weekly', title: 'Face the score', detail: 'Review your evidence with Justin, confront drift, and set the next seven days.' },
  { cadence: 'Weeks 4 + 8', title: 'Reset the plan', detail: 'Audit the larger target, adjust what is not working, and protect what is.' },
  { cadence: 'Between calls', title: 'Stay witnessed', detail: 'Direct access keeps the work alive when real life applies pressure.' },
];

const deliverables = [
  'A written 90-day target and operating plan',
  'A personal Core 4 practice built around your real life',
  'A weekly evidence scorecard',
  'Private weekly coaching with Justin',
  'Direct accountability between calls',
  'Formal reviews at weeks four and eight',
  'A final written debrief of the full 90 days',
  'A repeatable standard for the next season',
];

const process = [
  {
    label: 'Prep call',
    title: 'Build the whole thing before day one.',
    detail: 'We define the business target, choose the leading actions, establish your Core 4 commitments, and make the scoreboard unambiguous.',
  },
  {
    label: '90 days',
    title: 'Daily practice. Weekly truth.',
    detail: 'You execute, document the evidence, and meet privately with Justin every week to review the score and confront what is getting in the way.',
  },
  {
    label: 'Review',
    title: 'Leave with proof in writing.',
    detail: 'At the end, we document what changed, what produced the result, and the standard you will carry into the next 90 days.',
  },
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
            Apply now
          </button>
        </div>
      </header>

      <section className="ascension-hero">
        <div className="ascension-shell ascension-hero__grid">
          <div className="ascension-hero__main">
            <p className="ascension-kicker">Private mentorship with Justin Harkelroad</p>
            <h1>The Standard<br />Ascension</h1>
            <p className="ascension-hero__subtitle">One-on-one private mentorship</p>
            <p className="ascension-hero__intro">
              Ninety days. One business target. All four areas of your life on the board. Coached by Justin, personally, every single day.
            </p>
            <button type="button" className="ascension-cta" onClick={openApplication}>
              Apply for Ascension
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <aside className="ascension-hero__facts" aria-label="Program facts">
            <div><strong>90</strong><span>days of private mentorship</span></div>
            <div><strong>1:1</strong><span>with Justin, never a group</span></div>
            <div><strong>4</strong><span>areas measured every week</span></div>
            <p>By application only. Enrollment stays intentionally small.</p>
          </aside>
        </div>
      </section>

      <section className="ascension-statement ascension-section">
        <div className="ascension-shell">
          <p className="ascension-statement__lead">Your agency is a reflection of you.</p>
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
            <h2>You chase the goal while the rest of your life pays for it.</h2>
          </div>
          <div className="ascension-tension__copy">
            <p>You set a business goal and chase it while your body slides, your marriage runs on leftovers, and God gets the last five minutes of your day.</p>
            <p>Then you wonder why the business goal keeps slipping too.</p>
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-promise">
        <div className="ascension-shell ascension-promise__inner">
          <p className="ascension-kicker">The promise</p>
          <blockquote>
            For 90 days, you will do what you said you would do in all four areas. The work is witnessed daily, scored weekly, and confronted with love when you drift.
          </blockquote>
          <p className="ascension-promise__note">No revenue guarantees. We control the standard, then let the evidence stack.</p>
        </div>
      </section>

      <section className="ascension-section ascension-process">
        <div className="ascension-shell">
          <h2>How the 90 days work.</h2>
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
            <h2>The standard stays alive between calls.</h2>
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
            <strong>56</strong>
            <span>points per week</span>
          </div>
          <div className="ascension-score__copy">
            <h2>A scoreboard honest enough to change you.</h2>
            <p>Two daily actions in each of the four areas. Eight possible points per day. Fifty-six per week. No vague wins and no hiding behind intention.</p>
          </div>
        </div>
      </section>

      <section className="ascension-section ascension-deliverables">
        <div className="ascension-shell ascension-deliverables__grid">
          <div>
            <p className="ascension-kicker">What you leave with</p>
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
            <p>Ascension is for the owner who is done negotiating with the promises they make to themselves. Every application is reviewed personally before a conversation is scheduled.</p>
          </div>
          <aside className="ascension-offer__application" aria-label="Ascension application details">
            <p>Application-only mentorship</p>
            <strong>90</strong>
            <span>days · private 1:1 · intentionally small roster</span>
            <ol>
              <li><span>01</span>Submit your application</li>
              <li><span>02</span>We review the fit</li>
              <li><span>03</span>Qualified owners schedule a private call</li>
            </ol>
            <button type="button" className="ascension-cta ascension-cta--dark" onClick={openApplication}>
              Start your application
              <span aria-hidden="true">↗</span>
            </button>
          </aside>
        </div>
      </section>

      <section className="ascension-final">
        <div className="ascension-shell ascension-final__inner">
          <img src={standardLogo} alt="" aria-hidden="true" />
          <h2>You versus you.</h2>
          <p>One-on-one private mentorship for the next 90 days.</p>
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
