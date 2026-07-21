import { ArrowRight, Check, Headphones, Mic2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import standardLogo from '@/assets/standard-word-logo.png';
import SEOHead from '@/components/SEOHead';

import './TheTool.css';

const cascade = [
  { label: 'Quarter', title: 'Quarterly target', copy: 'The 90-day direction you choose in each domain.' },
  { label: 'Month', title: 'Monthly mission', copy: 'The measurable bridge that keeps the quarter close.' },
  { label: 'Week', title: 'Weekly priority', copy: 'The plays and one big thing that make the week count.' },
  { label: 'Today', title: "Today's proof", copy: 'The action you completed and the evidence you recorded.' },
];

const domains = [
  { name: 'Body', copy: 'Training, nutrition, sleep, energy, health, and recovery.' },
  { name: 'Being', copy: 'Faith, study, mindset, journaling, and personal growth.' },
  { name: 'Balance', copy: 'Marriage, family, friendship, gratitude, and connection.' },
  { name: 'Business', copy: 'Revenue work, leadership, team development, and execution.' },
];

const rhythm = [
  {
    cadence: 'Daily',
    title: 'Keep four honest promises.',
    copy: 'Complete your Core 4, add the note that tells the truth, and use Daily Frame to declare one measurable commitment.',
    detail: '0-4 Core 4 points each day',
  },
  {
    cadence: 'Weekly',
    title: 'Turn priorities into plays.',
    copy: 'Move work from the Bench into scheduled Power Plays, choose one big thing, then close the loop in your weekly Debrief.',
    detail: 'Up to 21 Playbook points',
  },
  {
    cadence: 'Monthly',
    title: 'Give the month one job.',
    copy: 'Set one active mission in each domain, attach a weekly measurable, and track the checklist that moves it forward.',
    detail: 'One mission per domain',
  },
  {
    cadence: 'Quarterly',
    title: 'Build the 90-day cascade.',
    copy: 'Brainstorm targets, sharpen measurability, choose the primary outcome, and carry it into missions and daily actions.',
    detail: 'Up to two targets per domain',
  },
];

const appMap = [
  ['Hub', 'See the quarter, month, week, and day in one current operating view.'],
  ['Daily', 'Track Core 4 completion, notes, streaks, and the live weekly score.'],
  ['Weekly', 'Manage the Bench, scheduled Power Plays, and One Big Thing.'],
  ['Monthly', 'Own one active mission per domain for the calendar month.'],
  ['Quarterly', 'Build targets, missions, daily actions, and the full cascade.'],
  ['Flows', 'Run guided coaching sessions by text or voice and search the Library.'],
  ['Reflection', 'Synthesize the week across the Flows you actually completed.'],
  ['Debrief', 'Review the evidence, compare performance, and seal the week.'],
  ['90 Day Audio', 'Turn primary targets into a personalized daily affirmation track.'],
];

const flows = [
  ['Daily Frame', 'Choose today’s lane and declare one measurable commitment.'],
  ['Grateful', 'Sit with what is good and choose an action that honors it.'],
  ['Idea', 'Make an idea specific and turn it into a measurable plan.'],
  ['War', 'Name the challenge, identify obstacles, and build a battle plan.'],
  ['Irritation', 'Separate story from fact and choose a more useful response.'],
  ['Discovery', 'Capture what you learned and decide the next move.'],
  ['Prayer', 'Bring God into the situation and leave with clarity.'],
  ['Bible', 'Work through scripture and decide what to start, stop, or sustain.'],
];

const startingSteps = [
  'Open the Hub and see what matters now.',
  "Complete today's Core 4.",
  'Set one Daily Frame commitment.',
  'Schedule the Power Plays that matter.',
  'Return at week end and tell the truth in the Debrief.',
];

const TheTool = () => {
  return (
    <div className="the-tool-page">
      <SEOHead
        config={{
          title: 'The Standard Playbook App | Turn Quarterly Goals Into Daily Action',
          description:
            'See how the Standard Playbook app connects quarterly targets, monthly missions, weekly priorities, daily Core 4 actions, guided Flows, reflection, and weekly Debriefs.',
          keywords: [
            'Standard Playbook app',
            'daily goal tracker',
            'quarterly planning app',
            'weekly planning system',
            'Core 4',
            'personal operating system',
          ],
          ogImage: 'https://standardplaybook.com/og/thetool.png',
          canonical: 'https://standardplaybook.com/thetool',
          type: 'website',
        }}
      />

      <header className="the-tool-nav">
        <Link to="/" aria-label="Standard Playbook home" className="the-tool-nav__brand">
          <img src={standardLogo} alt="Standard Playbook" />
        </Link>
        <nav aria-label="The Tool page navigation">
          <a href="#system">How it works</a>
          <a href="#flows">Flows</a>
          <Link to="/login" className="the-tool-nav__login">
            Member login <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <main>
        <section className="the-tool-hero" aria-labelledby="the-tool-title">
          <div className="the-tool-shell the-tool-hero__grid">
            <div className="the-tool-hero__copy">
              <p className="the-tool-eyebrow">The Standard Playbook app</p>
              <h1 id="the-tool-title">
                Run your life <span>on purpose.</span>
              </h1>
              <p className="the-tool-hero__lead">
                Turn quarterly goals into daily action across Body, Being, Balance, and Business.
              </p>
              <div className="the-tool-actions">
                <a href="#system" className="the-tool-button the-tool-button--primary">
                  See how it works <ArrowRight aria-hidden="true" />
                </a>
                <Link to="/login" className="the-tool-button the-tool-button--secondary">
                  Open the app
                </Link>
              </div>
            </div>

            <figure className="the-tool-hero__visual">
              <img
                src="/og/thetool.png"
                alt="Standard Playbook turns quarterly goals into daily action through quarter, month, week, and today"
                width="1200"
                height="630"
                loading="eager"
              />
            </figure>
          </div>
        </section>

        <section className="the-tool-cascade" id="system" aria-labelledby="cascade-title">
          <div className="the-tool-shell">
            <p className="the-tool-eyebrow">The operating system</p>
            <h2 id="cascade-title">The long view reaches today.</h2>
            <p className="the-tool-section-lead">
              The app does not give you another place to store goals. It gives every goal a path into the day in front of you.
            </p>

            <div className="the-tool-cascade__track">
              {cascade.map((item, index) => (
                <article className="the-tool-cascade__step" key={item.label}>
                  <span className="the-tool-cascade__time">{item.label}</span>
                  <span className="the-tool-cascade__number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="the-tool-standard" aria-labelledby="standard-title">
          <div className="the-tool-shell the-tool-standard__grid">
            <div className="the-tool-standard__intro">
              <p className="the-tool-eyebrow">The Core Four</p>
              <h2 id="standard-title">One standard. Four domains.</h2>
              <p>
                Every target, mission, play, daily check, and Flow belongs to one part of a whole life. Progress in one area should not require neglect in another.
              </p>
            </div>
            <div className="the-tool-domains">
              {domains.map((domain) => (
                <article key={domain.name}>
                  <h3>{domain.name}</h3>
                  <p>{domain.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="the-tool-score" aria-labelledby="score-title">
          <div className="the-tool-shell the-tool-score__grid">
            <div className="the-tool-score__statement">
              <span className="the-tool-score__number">56</span>
              <div>
                <p className="the-tool-eyebrow">One weekly evidence score</p>
                <h2 id="score-title">Track the work. See the pattern.</h2>
                <p>
                  Your score updates from real activity, then the Debrief freezes the week for honest comparison over time.
                </p>
              </div>
            </div>
            <div className="the-tool-score__math" aria-label="Weekly score formula">
              <div><strong>28</strong><span>Core 4</span></div>
              <b aria-hidden="true">+</b>
              <div><strong>7</strong><span>Flows</span></div>
              <b aria-hidden="true">+</b>
              <div><strong>21</strong><span>Playbook</span></div>
              <b aria-hidden="true">=</b>
              <div className="is-total"><strong>56</strong><span>Total</span></div>
            </div>
            <p className="the-tool-score__note">
              A completed Flow earns one point for that calendar day. Power Plays earn up to 20 weekday points, plus one point for the One Big Thing.
            </p>
          </div>
        </section>

        <section className="the-tool-rhythm" aria-labelledby="rhythm-title">
          <div className="the-tool-shell">
            <p className="the-tool-eyebrow">Your operating rhythm</p>
            <h2 id="rhythm-title">Four cadences. One connected plan.</h2>
            <div className="the-tool-rhythm__list">
              {rhythm.map((item) => (
                <article key={item.cadence}>
                  <span className="the-tool-rhythm__cadence">{item.cadence}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                  <p className="the-tool-rhythm__detail">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="the-tool-map" aria-labelledby="map-title">
          <div className="the-tool-shell the-tool-map__grid">
            <div className="the-tool-map__heading">
              <p className="the-tool-eyebrow">Inside the app</p>
              <h2 id="map-title">Every screen owns one part of the system.</h2>
              <p>
                Start at the Hub. It reads from the work you created elsewhere and points you toward the next useful action.
              </p>
              <Link to="/login" className="the-tool-text-link">
                Go to member login <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <dl className="the-tool-map__list">
              {appMap.map(([name, copy]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{copy}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="the-tool-flows" id="flows" aria-labelledby="flows-title">
          <div className="the-tool-shell">
            <div className="the-tool-flows__header">
              <p className="the-tool-eyebrow">Guided coaching Flows</p>
              <h2 id="flows-title">Use the Flow that fits the moment.</h2>
              <p>
                Each Flow is a deliberate question sequence with an end. Work by text or voice, save your place, and leave with an insight and a declared action.
              </p>
            </div>

            <div className="the-tool-flows__layout">
              <div className="the-tool-flows__index">
                {flows.map(([name, copy]) => (
                  <article key={name}>
                    <h3>{name}</h3>
                    <p>{copy}</p>
                  </article>
                ))}
              </div>

              <aside className="the-tool-flow-output" aria-label="What a Flow produces">
                <Mic2 aria-hidden="true" />
                <h3>Reflect deeply. Leave with a move.</h3>
                <ul>
                  <li><Check aria-hidden="true" /> Personalized coaching from your private profile</li>
                  <li><Check aria-hidden="true" /> Recognition, themes, connections, and a question to consider</li>
                  <li><Check aria-hidden="true" /> Declared actions sent directly to the Weekly Bench</li>
                  <li><Check aria-hidden="true" /> Searchable history and downloadable PDF records</li>
                  <li><Check aria-hidden="true" /> Controls to pause memory or delete recalled insights</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="the-tool-reinforce" aria-labelledby="reinforce-title">
          <div className="the-tool-shell">
            <p className="the-tool-eyebrow">Reflect and reinforce</p>
            <h2 id="reinforce-title">Turn your own evidence into the next move.</h2>
            <div className="the-tool-reinforce__grid">
              <article className="the-tool-reinforce__reflection">
                <span>Weekly Reflection</span>
                <h3>See what your own words are revealing.</h3>
                <p>
                  Synthesize completed Flows into a weekly narrative, recurring signals, grounded I AM statements, and source links you can inspect.
                </p>
              </article>
              <article className="the-tool-reinforce__debrief">
                <span>Weekly Debrief</span>
                <h3>Close the week. Open the next one.</h3>
                <p>
                  Review every score, name gratitude and corrections, move actions to the Bench, choose next week’s One Big Thing, and seal the record.
                </p>
              </article>
              <article className="the-tool-reinforce__audio">
                <div>
                  <Headphones aria-hidden="true" />
                  <span>90 Day Audio</span>
                </div>
                <h3>Turn four primary targets into a 21-minute daily listen.</h3>
                <p>
                  Choose the tone and voice, review every affirmation, then mix narration with theta audio on your device. Download the finished track before you close the session.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="the-tool-start" aria-labelledby="start-title">
          <div className="the-tool-shell the-tool-start__grid">
            <div>
              <p className="the-tool-eyebrow">Start here</p>
              <h2 id="start-title">Do not try to use everything today.</h2>
              <p>
                Start with the next honest action. Add layers as your rhythm grows.
              </p>
              <Link to="/login" className="the-tool-button the-tool-button--primary">
                Open the member app <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <ol>
              {startingSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="the-tool-footer">
        <div className="the-tool-shell">
          <Link to="/" aria-label="Standard Playbook home">
            <img src={standardLogo} alt="Standard Playbook" />
          </Link>
          <p>Raise your standard. Live the playbook.</p>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TheTool;
