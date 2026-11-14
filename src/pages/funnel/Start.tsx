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
import { DEMO_CLIPS, NOT_FOR, OBJECTIONS, PROOF_FEATURE, PROOF_TESTIMONIALS, START_PRICING_ORDER } from '@/config/startPage';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { trackFunnel, trackVslEvent } from '@/lib/funnel/track';
import { MarketingAdvisor } from '@/components/marketing/MarketingAdvisor';
import { AgencyBrainBox, AgencyBrainIncluded } from '@/components/funnel/AgencyBrain';
import BoldNav from '@/components/BoldNav';
import { BoldFooter } from '@/pages/BoldMockup';
import './Funnel.css';

const video = VSL_VIDEOS['sp-main'];

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Renders an objection punch line; words wrapped in *asterisks* get the accent. */
const Punch = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*[^*]+\*)/).filter(Boolean).map((part, i) =>
      part.startsWith('*')
        ? <span key={i} className="fn-accent">{part.slice(1, -1)}</span>
        : <span key={i}>{part}</span>,
    )}
  </>
);

/** The two prescription cards plus the side links. Same block at the top and bottom of the page. */
const PrescriptionCards = () => {
  const boardroom = OFFERS.boardroom;
  return (
    <div className="fn-cards">
      <article className="fn-card fn-card--primary">
        <span className="fn-card__tag">A · {boardroom.name}</span>
        <p className="fn-card__price">$399<small>/mo</small></p>
        <p className="fn-card__fit">Start in the room this week. Weekly group coaching.</p>
        <AgencyBrainIncluded />
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
            <Link className="fn-btn fn-btn--block" to="/book-call">Book a call</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

const PricingRow = ({ offerKey, index }: { offerKey: OfferKey; index: number }) => {
  const offer = OFFERS[offerKey];
  const option = offer.checkouts[0];
  const link = option ? checkoutLinkProps(offer, option) : null;

  // Headline figure + a small cadence line, with route-specific treatment.
  const amount = offer.price;
  let cadence: string = offer.cadence;
  let badge: { label: string; tone: 'scarce' | 'muted' } | null = null;
  let cta: React.ReactNode;

  if (offer.route === 'waitlist') {
    badge = { label: 'Waitlist Only', tone: 'muted' };
    cadence = offer.cadence.replace(' · Waitlist', '');
    cta = <Link className="fn-btn fn-btn--ghost fn-price-row__cta" to={`${offer.page}?waitlist=1`}>Join waitlist</Link>;
  } else if (offer.route === 'apply') {
    if (offerKey === 'momentum') badge = { label: '1 Seat Left', tone: 'scarce' };
    cta = <Link className="fn-btn fn-price-row__cta" to={bookHref(offer.key)}>Apply</Link>;
  } else if (offer.external) {
    const { external } = offer;
    cta = (
      <a
        className="fn-btn fn-price-row__cta"
        href={external.href}
        onClick={() => trackFunnel('initiate_checkout', { offer: offer.key, amount: amountFrom(external.billing), contentName: offer.name })}
      >
        See plans
      </a>
    );
  } else if (option) {
    cta = link
      ? <a className="fn-btn fn-price-row__cta" href={link.href} onClick={link.onClick}>Buy</a>
      : <Link className="fn-btn fn-price-row__cta" to={offer.page}>Details</Link>;
  }

  return (
    <li className="fn-price-row">
      <span className="fn-price-row__num" aria-hidden="true">{String(index).padStart(2, '0')}</span>
      <div className="fn-price-row__body">
        <div className="fn-price-row__head">
          <h3 className="fn-price-row__name">{offer.name}</h3>
          {badge && <span className={`fn-price-row__badge fn-price-row__badge--${badge.tone}`}>{badge.label}</span>}
        </div>
        <p className="fn-price-row__summary">
          {offer.summary}
          {offerKey === 'directive' && (
            <> Want in now? <Link className="fn-link" to="/momentum">Momentum is open.</Link></>
          )}
        </p>
        {offerKey === 'boardroom' && <AgencyBrainIncluded />}
      </div>
      <p className="fn-price-row__price">
        {amount
          ? (
            <>
              <span className="fn-price-row__amount">{amount}</span>
              <span className="fn-price-row__cadence">{cadence}</span>
            </>
          )
          : <span className="fn-price-row__amount fn-price-row__amount--text">{cadence}</span>}
      </p>
      {cta}
    </li>
  );
};

/**
 * /start (ad traffic) and / (the homepage, Justin 2026-11-14) are the same page.
 * `home` swaps the funnel chrome for the site nav and footer, uses the
 * homepage SEO from seoConfig['/'], and skips the view_content event so
 * homepage visits don't count as VSL-funnel views in ad tracking.
 */
const Start = ({ home = false }: { home?: boolean }) => {
  const [revealed, setRevealed] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    captureMirrorAttribution();
    if (home || viewed.current) return;
    viewed.current = true;
    trackFunnel('view_content', { contentName: 'Standard Playbook VSL', videoId: video.id });
  }, [home]);

  return (
    <main className="funnel-page" style={home ? { paddingTop: 56 } : undefined}>
      {home ? <SEOHead /> : <SEOHead
        config={{
          title: 'Raise Your Standard | The Standard Playbook',
          description: "Your agency doesn't have a sales problem. It has a standard problem. Watch the video, then pick your prescription.",
          canonical: 'https://standardplaybook.com/start',
        }}
      />}
      {home ? <BoldNav /> : <FunnelHeader />}

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
                  <Link className="fn-link" to="/sales-experience">The 8-Week (waitlist only)</Link>
                </p>
                <p style={{ margin: 0 }}>
                  Team that won't follow through when you're not watching?{' '}
                  <Link className="fn-link" to="/team-standard">Team Standard (waitlist only)</Link>
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

      <section className="fn-section" id="programs">
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Every way to work with us</p>
            <h2 className="fn-display fn-h2">The full price list.</h2>
          </div>
          <ul className="fn-pricing">
            {START_PRICING_ORDER.map((key, i) => <PricingRow key={key} offerKey={key} index={i + 1} />)}
          </ul>
          <p className="fn-credit">{MIRROR_CREDIT_TERMS}</p>
        </div>
      </section>

      <AgencyBrainBox id={home ? 'software' : 'agency-brain'} />

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
          <div className="fn-proof-feature">
            <div className="fn-clip__frame">
              <video
                src={PROOF_FEATURE.clip.src}
                poster={PROOF_FEATURE.clip.poster}
                controls
                playsInline
                preload="none"
                aria-label={PROOF_FEATURE.clip.title}
              />
            </div>
            <blockquote className="fn-quote fn-proof-feature__quote">
              <p>"{PROOF_FEATURE.quote}"</p>
              <cite>
                {PROOF_FEATURE.author}
                <span>{PROOF_FEATURE.role}</span>
              </cite>
            </blockquote>
          </div>
          <ul className="fn-testimonials" aria-label="What owners say">
            {PROOF_TESTIMONIALS.map((t) => (
              <li key={t.name} className="fn-testimonial">
                <blockquote>
                  <p>“{t.quote}”</p>
                  <footer>
                    <strong>{t.name}</strong>
                    {t.role && <span>{t.role}</span>}
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
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
        <div className="fn-shell">
          <div className="fn-section-head">
            <p className="fn-kicker">/ Straight answers</p>
            <h2 className="fn-display fn-h2">What owners ask first.</h2>
          </div>
          <div className="fn-objections">
            {OBJECTIONS.map((o, i) => (
              <details key={o.q} className="fn-objection" name="objections">
                <summary>
                  <span className="fn-objection__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="fn-objection__q">{o.q}</span>
                  <span className="fn-objection__icon" aria-hidden="true" />
                </summary>
                <div className="fn-objection__answer">
                  <p className="fn-display fn-objection__punch"><Punch text={o.punch} /></p>
                  <div className="fn-objection__body">
                    {o.body.map((line) => <p key={line}>{line}</p>)}
                  </div>
                  {o.stats && (
                    <dl className="fn-objection__stats">
                      {o.stats.map((s) => (
                        <div key={s.label}>
                          <dt>{s.label}</dt>
                          <dd className="fn-display">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {o.link && <Link className="fn-link fn-objection__link" to={o.link.to}>{o.link.label} →</Link>}
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
          <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
        </div>
      </section>

      {home ? <BoldFooter /> : <FunnelFooter />}
      <MarketingAdvisor brand="standard" surface={home ? undefined : 'start'} />
    </main>
  );
};

export default Start;
