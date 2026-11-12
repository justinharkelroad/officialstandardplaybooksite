import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import VslPlayer from '@/components/vsl/VslPlayer';
import BookingOnboardingForm from '@/components/BookingOnboardingForm';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import { VSL_VIDEOS } from '@/config/vsl';
import { AGENCY_BRAIN_PLANS_URL, OFFERS, RESULTS_DISCLAIMER } from '@/config/offers';
import { START_PRICING_ORDER } from '@/config/startPage';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { trackVslEvent } from '@/lib/funnel/track';
import './Funnel.css';

const video = VSL_VIDEOS['sp-precall'];

/** Coaching list: everything on /start except the Agency Brain software rows. */
const COACHING_ORDER = START_PRICING_ORDER.filter((key) => !key.startsWith('agencyBrain'));

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

/** Booking source for leads from this page, so they're distinguishable from the /fit modal. */
const PREP_SOURCE = 'standard-fit-prep';

/**
 * /prep: the link Justin sends to anyone who booked a StandardFit call
 * straight from the calendar and skipped the background form. Pre-call video,
 * the same onboarding form (saved to booking_leads with its own source, no
 * redirect to the calendar since they already booked), then the program list.
 */
const FitPrep = () => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    captureMirrorAttribution();
  }, []);

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: 'Prep For Your Call | The Standard Playbook',
          description: 'Watch the video and fill out your background form before your call.',
          canonical: 'https://standardplaybook.com/prep',
          noindex: true,
        }}
      />
      <FunnelHeader />

      <section className="fn-hero">
        <div className="fn-shell">
          <p className="fn-kicker">/ Before your call</p>
          <h1 className="fn-display fn-h1">Two things <span className="fn-accent">before we talk.</span></h1>
          <p className="fn-lede">Watch the video. Then fill out the form below so the call goes to your agency, not background questions.</p>
          <div className="fn-player">
            <VslPlayer video={video} onEvent={trackVslEvent} />
            <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
          </div>
          <a className="ab-note" href="#agency-brain">
            <span className="ab-note__q">Only interested in the software?</span>
            <span className="ab-note__a">That's okay too. Fill out the form, then see Agency Brain below. &darr;</span>
          </a>
        </div>
      </section>

      <section className="fn-section" id="form">
        <div className="fn-shell fn-shell--narrow">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Required</p>
            <h2 className="fn-display fn-h2">Your background form.</h2>
            <p className="fn-small" style={{ margin: '8px 0 0' }}>Required before your call. Two steps, about three minutes.</p>
          </div>
          <div style={{ border: '1.5px solid #0A0A0B', maxWidth: 560 }}>
            {submitted ? (
              <div style={{ background: '#F4F2EE', padding: '40px 28px' }}>
                <p className="fn-kicker">/ Received</p>
                <h3 className="fn-display fn-h3" style={{ margin: 0 }}>You're all set.</h3>
                <p style={{ margin: '12px 0 0' }}>
                  Justin will review this before your call. Keep the calendar invite, and come ready to decide.
                </p>
              </div>
            ) : (
              <BookingOnboardingForm source={PREP_SOURCE} onComplete={() => setSubmitted(true)} />
            )}
          </div>
        </div>
      </section>

      <section className="fn-section" id="agency-brain">
        <div className="fn-shell">
          <div className="ab-box">
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
          </div>
        </div>
      </section>

      <section className="fn-section">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Coaching</p>
            <h2 className="fn-display fn-h2">The coaching programs.</h2>
            <p className="fn-small" style={{ margin: '8px 0 0' }}>Look these over before the call so we can talk about the one that fits.</p>
          </div>
          <ul className="fn-pricing">
            {COACHING_ORDER.map((key, i) => {
              const offer = OFFERS[key];
              const external = /^https?:\/\//.test(offer.page);
              return (
                <li className="fn-price-row" key={key}>
                  <span className="fn-price-row__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="fn-price-row__body">
                    <div className="fn-price-row__head">
                      <h3 className="fn-price-row__name">{offer.name}</h3>
                      {offer.route === 'waitlist' && (
                        <span className="fn-price-row__badge fn-price-row__badge--muted">Waitlist Only</span>
                      )}
                    </div>
                    <p className="fn-price-row__summary">{offer.summary}</p>
                  </div>
                  <p className="fn-price-row__price">
                    {offer.price ? (
                      <>
                        <span className="fn-price-row__amount">{offer.price}</span>
                        <span className="fn-price-row__cadence">{offer.cadence}</span>
                      </>
                    ) : (
                      <span className="fn-price-row__amount fn-price-row__amount--text">{offer.cadence}</span>
                    )}
                  </p>
                  {external ? (
                    <a className="fn-btn fn-btn--ghost fn-price-row__cta" href={offer.page} target="_blank" rel="noreferrer">Details</a>
                  ) : (
                    <Link className="fn-btn fn-btn--ghost fn-price-row__cta" to={offer.page} target="_blank">Details</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <FunnelFooter />
    </main>
  );
};

export default FitPrep;
