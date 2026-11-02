import type { CheckoutKey } from '@/config/checkout';
import { OFFERS, type CheckoutOption, type Offer } from '@/config/offers';

/*
 * Purchase tracking for the site's own Stripe payment links.
 *
 * Each link redirects to /thanks?offer=<CheckoutKey>&session_id={CHECKOUT_SESSION_ID}
 * after payment (set on the link in Stripe). Stripe fills in the session id,
 * which gives the Purchase a stable event id: a reload, a second tab or the
 * browser pixel plus the server event all collapse to one conversion in Meta.
 */

export const SITE_ORIGIN = 'https://standardplaybook.com';

/** The after-payment redirect to paste on a Stripe payment link. */
export const thanksRedirectUrl = (key: CheckoutKey) =>
  `${SITE_ORIGIN}/thanks?offer=${key}&session_id={CHECKOUT_SESSION_ID}`;

const SESSION_ID_RE = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

/** First dollar amount in a billing line, for Meta's value field. */
export const amountFrom = (billing: string): number | undefined => {
  const match = billing.match(/\$([\d,]+(?:\.\d+)?)/);
  return match ? Number(match[1].replace(/,/g, '')) : undefined;
};

export const isCheckoutSessionId = (value: string | null): value is string =>
  value !== null && SESSION_ID_RE.test(value);

/** The offer and checkout option a checkout key belongs to. */
export function checkoutOptionFor(key: string | null): { offer: Offer; option: CheckoutOption } | null {
  if (!key) return null;
  for (const offer of Object.values(OFFERS)) {
    const option = offer.checkouts.find((o) => o.key === key);
    if (option) return { offer, option };
  }
  return null;
}

/**
 * 32 hex characters derived from the Stripe session id, so the same purchase
 * always gets the same event id (funnel-track only accepts hex ids).
 */
export async function purchaseEventId(sessionId: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`purchase:${sessionId}`));
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('');
}
