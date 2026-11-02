import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import { amountFrom, checkoutOptionFor, isCheckoutSessionId, purchaseEventId } from '@/lib/funnel/purchase';
import { trackFunnel } from '@/lib/funnel/track';
import './Funnel.css';

const DONE_PREFIX = 'sp_purchase_tracked:';

function alreadyTracked(eventId: string): boolean {
  try {
    if (window.localStorage.getItem(DONE_PREFIX + eventId)) return true;
    window.localStorage.setItem(DONE_PREFIX + eventId, '1');
  } catch {
    // Storage blocked: Meta still dedupes on the event id.
  }
  return false;
}

/**
 * /thanks?offer=<CheckoutKey>&session_id=<cs_...>: where the site's Stripe
 * payment links land after payment. Fires one Purchase (pixel + Conversions
 * API) per Stripe session. Without a real session id it's just a thank-you.
 */
const Thanks = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const offerKey = params.get('offer');
  const found = useMemo(() => checkoutOptionFor(offerKey), [offerKey]);

  useEffect(() => {
    if (!found || !isCheckoutSessionId(sessionId)) return;
    let cancelled = false;
    purchaseEventId(sessionId)
      .then((eventId) => {
        if (cancelled || alreadyTracked(eventId)) return;
        trackFunnel('purchase', {
          eventId,
          offer: found.offer.key,
          amount: amountFrom(found.option.billing),
          contentName: found.offer.name,
        });
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [found, sessionId]);

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: "You're In | The Standard Playbook",
          description: 'Payment received.',
          canonical: 'https://standardplaybook.com/thanks',
          noindex: true,
        }}
      />
      <FunnelHeader />

      <section className="fn-hero" style={{ minHeight: "62vh" }}>
        <div className="fn-shell fn-shell--narrow">
          <p className="fn-kicker">/ Payment received</p>
          <h1 className="fn-display fn-h1">You're <span className="fn-accent">in.</span></h1>
          {found && <p className="fn-lede">{found.offer.name} · {found.option.billing}</p>}
          <p className="fn-lede">Your receipt is on its way to your inbox.</p>
          <p className="fn-small">
            Questions? Email <a href="mailto:info@standardplaybook.com">info@standardplaybook.com</a>.
          </p>
        </div>
      </section>

      <FunnelFooter />
    </main>
  );
};

export default Thanks;
