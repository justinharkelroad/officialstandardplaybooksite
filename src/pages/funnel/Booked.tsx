import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import VslPlayer from '@/components/vsl/VslPlayer';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import { OfferActions } from '@/components/funnel/OfferActions';
import { VSL_VIDEOS } from '@/config/vsl';
import { CHECKOUT_LINKS } from '@/config/checkout';
import { isOfferKey, MIRROR_CREDIT_TERMS, OFFERS, RESULTS_DISCLAIMER } from '@/config/offers';
import { once } from '@/lib/funnel/funnelState';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { trackFunnel, trackVslEvent } from '@/lib/funnel/track';
import './Funnel.css';

const video = VSL_VIDEOS['sp-precall'];

/**
 * /booked?offer=<key>: the booking confirmation. Pre-call video, a one-page
 * price sheet for the offer they booked about, and checkout for anyone who
 * is already sure (the team cancels the call when they see the purchase).
 */
const Booked = () => {
  const [params] = useSearchParams();
  const requested = params.get('offer');
  const offer = isOfferKey(requested) ? OFFERS[requested] : null;
  // Only offer checkout when a real link exists; a placeholder would just send them back to booking.
  const canBuyNow = Boolean(offer && (offer.checkouts.some((o) => CHECKOUT_LINKS[o.key]) || offer.external));

  useEffect(() => {
    captureMirrorAttribution();
    if (once(`schedule:${requested ?? 'none'}`)) {
      trackFunnel('schedule', { offer: offer?.key, contentName: offer ? `${offer.name} call` : 'Call booked' });
    }
  }, [offer, requested]);

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: "You're Booked | The Standard Playbook",
          description: 'Watch this before your call.',
          canonical: 'https://standardplaybook.com/booked',
          noindex: true,
        }}
      />
      <FunnelHeader />

      <section className="fn-hero">
        <div className="fn-shell">
          <p className="fn-kicker">/ You're booked</p>
          <h1 className="fn-display fn-h1">Watch this <span className="fn-accent">before the call.</span></h1>
          <p className="fn-lede">It answers the questions most owners bring, so the call goes to your agency.</p>
          <div className="fn-player">
            <VslPlayer video={video} onEvent={trackVslEvent} />
            <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {offer && (
        <section className="fn-section">
          <div className="fn-shell fn-shell--narrow">
            <div className="fn-sheet">
              <div className="fn-sheet__head">
                <h2 className="fn-display fn-h3" style={{ margin: 0 }}>{offer.name}</h2>
                <p className="fn-card__price" style={{ fontSize: 34 }}>
                  {offer.price ?? ''}<small>{offer.cadence}</small>
                </p>
              </div>
              <p className="fn-card__fit" style={{ margin: '16px 0' }}>{offer.summary}</p>
              {offer.includes.length > 0 && (
                <ul className="fn-list">
                  {offer.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {offer.checkouts.length > 0 && (
                <p className="fn-small" style={{ margin: '16px 0 0' }}>
                  {offer.checkouts.map((o) => o.billing).join(' or ')}
                </p>
              )}
              {offer.key === 'mirror' && <p className="fn-credit">{MIRROR_CREDIT_TERMS}</p>}
            </div>

            {canBuyNow && (
              <div className="fn-sure">
                <h2 className="fn-display fn-h3" style={{ margin: 0 }}>Already sure?</h2>
                <p style={{ margin: '10px 0 0' }}>Choose here and we'll cancel the call.</p>
                <div className="fn-sure__actions">
                  <OfferActions offerKey={offer.key} variant="blue" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <FunnelFooter />
    </main>
  );
};

export default Booked;
