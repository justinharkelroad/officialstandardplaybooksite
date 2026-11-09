import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import VslPlayer from '@/components/vsl/VslPlayer';
import ClipFrame from '@/components/funnel/ClipFrame';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import { bookHref, checkoutLinkProps, CheckoutButton } from '@/components/funnel/OfferActions';
import { amountFrom } from '@/lib/funnel/purchase';
import { VSL_VIDEOS } from '@/config/vsl';
import { GUARANTEES, MIRROR_CREDIT_TERMS, OFFERS, RESULTS_DISCLAIMER, type OfferKey } from '@/config/offers';
import { DEMO_CLIPS, NOT_FOR, OBJECTION_CLIPS, PROOF_CLIPS, PROOF_QUOTE, START_PRICING_ORDER } from '@/config/startPage';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { trackFunnel, trackVslEvent } from '@/lib/funnel/track';
import { MarketingAdvisor } from '@/components/marketing/MarketingAdvisor';
import './Funnel.css';

const video = VSL_VIDEOS['sp-main'];

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** The two prescription cards plus the side links. Same block at the top and bottom of the page. */
const PrescriptionCards = () => {
  const boardroom = OFFERS.boardroom;
  return (
    <div className="fn-cards">
      <article className="fn-card fn-card--primary">
        <span className="fn-card__tag">A · {boardroom.name}</span>
        <p className="fn-card__price">$399<small>/mo</small></p>
        <p className="fn-card__fit">Start in the room this week. Weekly group coaching, Agency Brain Core included.</p>
        <p className="fn-small" style={{ margin: 0 }}>Monday 1pm EST.</p>
        <div className="fn-card__actions">
          <CheckoutButton offer={boardroom} option={boardroom.checkouts[0]} variant="blue" label="Join the Boardroom" />
        </div>
      </article>
      <article className="fn-card">
        <span className="fn-card__tag">B · Book a call</span>
        <p className="fn-card__price" style={{ fontSize: 38 }}>1:1<small> · 45 min</small></p>
        <p className="fn-card__fit">For owners ready for a bigger move, and the commitment it takes.</p>
        <p className="fn-small" style={{ margin: 0 }}>Come ready to decide. Justin will ask if you are.</p>
        <div className="fn-card__actions">
          <div className="fn-checkout">
            <p className="fn-checkout__billing">A conversation with Justin</p>
            <Link className="fn-btn fn-btn--block" to="/book">Book a call</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

const PricingRow = ({ offerKey }: { offerKey: OfferKey }) => {
  const offer = OFFERS[offerKey];
  const option = offer.checkouts[0];
  const link = option ? checkoutLinkProps(offer, option) : null;

  let price: string = offer.price ? `${offer.price} ${offer.cadence}` : offer.cadence;
  let cta: React.ReactNode;
  if (offer.route === 'waitlist') {
    price = 'Waitlist';
    cta = <Link className="fn-btn fn-btn--ghost fn-pricing__cta" to={offer.page}>Join waitlist</Link>;
  } else if (offer.route === 'apply') {
    cta = <Link className="fn-btn fn-pricing__cta" to={bookHref(offer.key)}>Apply</Link>;
  } else if (offer.external) {
    const { external } = offer;
    price = external.billing;
    cta = (
      <a
        className="fn-btn fn-pricing__cta"
        href={external.href}
        onClick={() => trackFunnel('initiate_checkout', { offer: offer.key, amount: amountFrom(external.billing), contentName: offer.name })}
      >
        See plans
      </a>
    );
  } else if (option) {
    price = offer.checkouts.map((o) => o.billing).join(' or ');
    cta = link
      ? <a className="fn-btn fn-pricing__cta" href={link.href} onClick={link.onClick}>Buy</a>
      : <Link className="fn-btn fn-pricing__cta" to={offer.page}>Details</Link>;
  }

  return (
    <li>
      <div>
        <p className="fn-pricing__name">{offer.name}</p>
        <p className="fn-pricing__summary">
          {offer.summary}
          {offerKey === 'directive' && (
            <> Want in now? <Link className="fn-link" to="/momentum">Momentum is open.</Link></>
          )}
        </p>
      </div>
      <p className="fn-pricing__price">{price}</p>
      {cta}
    </li>
  );
};

const Start = () => {
  const [revealed, setRevealed] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    captureMirrorAttribution();
    if (viewed.current) return;
    viewed.current = true;
    trackFunnel('view_content', { contentName: 'Standard Playbook VSL', videoId: video.id });
  }, []);

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: 'Raise Your Standard | The Standard Playbook',
          description: "Your agency doesn't have a sales problem. It has a standard problem. Watch the video, then pick your prescription.",
          canonical: 'https://standardplaybook.com/start',
        }}
      />
      <FunnelHeader />

      <section className="fn-hero">
        <div className="fn-shell">
          <p className="fn-kicker">/ For insurance agency owners</p>
          <h1 className="fn-display fn-h1">
            Your agency doesn't have a sales problem. <span className="fn-accent">It has a standard problem.</span>
          </h1>
          <p className="fn-lede">Raise your standard.</p>

          <div className="fn-player">
            <VslPlayer video={video} onEvent={trackVslEvent} onReveal={() => setRevealed(true)} />
            <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
          </div>

          {revealed ? (
            <div className="fn-menu" id="menu" style={{ marginTop: 40 }}>
              <p className="fn-kicker">/ Your prescription</p>
              <h2 className="fn-display fn-h2" style={{ marginBottom: 24 }}>Pick the one that fits.</h2>
              <PrescriptionCards />
              <div className="fn-menu-links">
                <p style={{ margin: 0 }}>
                  Sales manager problem instead?{' '}
                  <Link className="fn-link" to="/sales-experience">The 8-Week, $4,500 or $625/week</Link>
                </p>
                <p style={{ margin: 0 }}>
                  Team that won't follow through when you're not watching?{' '}
                  <Link className="fn-link" to="/team-standard">Team Standard, $2,500/mo</Link>
                </p>
                <p style={{ margin: 0 }}>
                  Not sure? <Link className="fn-link" to="/decision">Take the 2-minute quiz</Link>
                </p>
              </div>
              <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
            </div>
          ) : (
            <p className="fn-menu-wait">Your two ways in appear here at {formatTime(video.revealAt)} in the video.</p>
          )}
        </div>
      </section>

      <section className="fn-section">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Every way to work with us</p>
            <h2 className="fn-display fn-h2">The full price list.</h2>
          </div>
          <ul className="fn-pricing">
            {START_PRICING_ORDER.map((key) => <PricingRow key={key} offerKey={key} />)}
          </ul>
          <p className="fn-credit">{MIRROR_CREDIT_TERMS}</p>
        </div>
      </section>

      <section className="fn-section fn-section--ink">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Inside Agency Brain</p>
            <h2 className="fn-display fn-h2">See it working.</h2>
          </div>
          <div className="fn-clips">
            {DEMO_CLIPS.map((clip) => <ClipFrame key={clip.title} clip={clip} loop />)}
          </div>
        </div>
      </section>

      <section className="fn-section">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Proof</p>
            <h2 className="fn-display fn-h2">Owners who raised it.</h2>
          </div>
          <div className="fn-clips">
            {PROOF_CLIPS.map((clip) => <ClipFrame key={clip.title} clip={clip} />)}
          </div>
          <blockquote className="fn-quote">
            <p>"{PROOF_QUOTE.text}"</p>
            <cite>{PROOF_QUOTE.author}</cite>
          </blockquote>
        </div>
      </section>

      <section className="fn-section fn-section--ink">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Guarantees</p>
            <h2 className="fn-display fn-h2">We carry the risk.</h2>
          </div>
          <div className="fn-guarantees">
            <div className="fn-guarantee">
              <h3>8-Week</h3>
              <p>{GUARANTEES.eightWeek}</p>
            </div>
            <div className="fn-guarantee">
              <h3>Standard 90</h3>
              <p>{GUARANTEES.standard90}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fn-section">
        <div className="fn-shell fn-shell--narrow">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Straight answers</p>
            <h2 className="fn-display fn-h2">What owners ask first.</h2>
          </div>
          <div className="fn-accordion">
            {OBJECTION_CLIPS.map((clip) => (
              <details key={clip.title}>
                <summary>{clip.title}</summary>
                <div className="fn-accordion__body">
                  <ClipFrame clip={{ ...clip, title: '' }} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="fn-section">
        <div className="fn-shell fn-shell--narrow">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Who this isn't for</p>
            <h2 className="fn-display fn-h2">Not for everyone.</h2>
          </div>
          <ul className="fn-notfor">
            {NOT_FOR.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </section>

      <section className="fn-section">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Your move</p>
            <h2 className="fn-display fn-h2">Raise your standard.</h2>
          </div>
          <PrescriptionCards />
          <div className="fn-final-actions">
            <Link className="fn-btn fn-btn--ghost" to={bookHref('standard90')}>Apply</Link>
          </div>
          <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
        </div>
      </section>

      <FunnelFooter />
      <MarketingAdvisor brand="standard" surface="start" />
    </main>
  );
};

export default Start;
