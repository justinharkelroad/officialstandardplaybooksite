import type { ReactNode } from 'react';
import { AGENCY_BRAIN_PLANS_URL } from '@/config/offers';

/** Agency Brain's three levels, matching the in-app plan comparison. */
const AGENCY_BRAIN_TIERS = [
  {
    name: 'Core',
    price: '$299',
    summary: 'The operating system: scorecards, training, team visibility and core workflows.',
    includes: ['20 AI-scored sales calls a month', 'Scorecards, KPIs and leaderboards', 'Standard Playbook training'],
    featured: false,
  },
  {
    name: 'Plus',
    price: '$449',
    summary: 'Full software access with the AI training tools.',
    includes: ['50 AI-scored sales calls a month', 'AI Training Studio roleplay', 'Training AI Builder and Video Architect'],
    featured: true,
  },
  {
    name: 'Pro',
    price: '$599',
    summary: 'Everything, plus HR and priority support.',
    includes: ['100 AI-scored sales calls a month', 'Everything in Plus', 'HR Suite and priority support'],
    featured: false,
  },
];

export const AGENCY_BRAIN_FEATURES_URL = 'https://myagencybrain.com/info';

/**
 * The branded Agency Brain software box (three tiers + Live Call Coach add-on).
 * Default: a dark card on the paper page (/prep). `flush`: the card dissolves
 * into a full-width black section and `children` (e.g. the demo clips) render
 * inside it, so pricing and features read as one section (/start, Justin 2026-11-14).
 */
export const AgencyBrainBox = ({ id, flush = false, children }: { id?: string; flush?: boolean; children?: ReactNode }) => (
  <section className={flush ? 'fn-section fn-section--ink' : 'fn-section'} id={id}>
    <div className="fn-shell">
      <div className={flush ? 'ab-box ab-box--flush' : 'ab-box'}>
        <div className="ab-box__head">
          <img className="ab-box__logo" src="/ab-white.png" alt="Agency Brain" width={1920} height={500} />
          <p className="ab-box__kicker">The software</p>
          <h2 className="ab-box__title">Run your agency on <span>Agency Brain.</span></h2>
          <p className="ab-box__lede">Scorecards, dashboards, AI call scoring and training for your whole team. Three levels, month to month.</p>
        </div>
        <ul className="ab-tiers">
          {AGENCY_BRAIN_TIERS.map((tier) => (
            <li className={`ab-tier${tier.featured ? ' ab-tier--featured' : ''}`} key={tier.name}>
              <p className="ab-tier__name">{tier.name}</p>
              <p className="ab-tier__price">{tier.price}<span>/mo</span></p>
              <p className="ab-tier__summary">{tier.summary}</p>
              <ul className="ab-tier__list">
                {tier.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <div className="ab-box__foot">
          <p className="ab-box__addon">Add Live Call Coach to any level: $129 per rep a month.</p>
          <a className="ab-box__cta" href={AGENCY_BRAIN_PLANS_URL} target="_blank" rel="noreferrer">See Agency Brain plans</a>
        </div>
        {children}
      </div>
    </div>
  </section>
);

/** The small branded bar that says the Boardroom includes Agency Brain Core. */
export const AgencyBrainIncluded = () => (
  <div className="ab-included">
    <img className="ab-included__logo" src="/ab-white.png" alt="Agency Brain" width={1920} height={500} />
    <span className="ab-included__text">
      <strong>Core included</strong> &middot; a $299/mo software plan, at no extra cost
    </span>
  </div>
);
