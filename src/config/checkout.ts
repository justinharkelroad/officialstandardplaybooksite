import { MIRROR_CHALLENGE_CHECKOUT_URL } from '@/data/offerLinks';
import { CERTIFIED_STANDARD_CHECKOUT_URL } from '@/data/certifiedStandard';

/*
 * Every buy link the funnel uses, in one place.
 *
 * Paste the Stripe payment link for each key. A `null` link sends the button
 * to the offer's own page instead, so nothing breaks while a link is missing.
 * Don't change Stripe products or prices from here.
 */
export type CheckoutKey =
  | 'boardroom'
  | 'teamStandard2x'
  | 'teamStandard4x'
  | 'eightWeekPif'
  | 'eightWeekWeekly'
  | 'mirror'
  | 'certifiedStandard'
  | 'producerChallenge';

export const CHECKOUT_LINKS: Record<CheckoutKey, string | null> = {
  // Public plan choices own all new Boardroom checkouts and existing-customer guidance.
  boardroom: '/boardroom#pricing',
  // Stripe payment links from Justin, checked 2026-11-01 (product and amount on each page).
  teamStandard2x: 'https://buy.stripe.com/14AbJ14KO7mC6FWay04Vy0t', // TEAMSTANDARD 2X, $2,500/month
  teamStandard4x: 'https://buy.stripe.com/8x2dR9dhk8qG8O4dKc4Vy0s', // TEAMSTANDARD 4X, $4,000/month
  eightWeekPif: 'https://buy.stripe.com/5kQ6oHcdggXc6FWfSk4Vy0E', // 8 Week Sales Experience, $4,500 once
  eightWeekWeekly: 'https://buy.stripe.com/00w6oH3GKgXcd4k5dG4Vy0F', // 8 Week Sales Experience, $625/week subscription
  // Agency Brain's challenge page owns email capture, Stripe and provisioning (2026-11-01).
  mirror: MIRROR_CHALLENGE_CHECKOUT_URL,
  certifiedStandard: CERTIFIED_STANDARD_CHECKOUT_URL,
  producerChallenge: 'https://myagencybrain.com/six-week-challenge',
};

/**
 * The checkout URL for a key, or null while the link is a placeholder.
 * Stripe payment links get the buyer's email prefilled so the Mirror Credit
 * and the GHL contact line up with the same address.
 */
export function checkoutUrl(key: CheckoutKey, options: { email?: string | null; clientReference?: string } = {}): string | null {
  const link = CHECKOUT_LINKS[key];
  if (!link) return null;
  try {
    const url = new URL(link);
    if (url.hostname === 'buy.stripe.com') {
      if (options.email) url.searchParams.set('prefilled_email', options.email);
      if (options.clientReference) url.searchParams.set('client_reference_id', options.clientReference);
    }
    return url.toString();
  } catch {
    return link;
  }
}
