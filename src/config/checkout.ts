import { MIRROR_CHALLENGE_CHECKOUT_URL } from '@/data/offerLinks';
import { CERTIFIED_STANDARD_CHECKOUT_URL } from '@/data/certifiedStandard';

/*
 * Every buy link the funnel uses, in one place.
 *
 * FOR MARY: paste the Stripe payment link for each key. A `null` link shows
 * a "Talk to Mary" button in place of checkout, so the page still works while
 * a link is missing. Don't change Stripe products or prices from here.
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
  // Live Boardroom link used site-wide since the $399 change (2026-10-20).
  boardroom: 'https://buy.stripe.com/cNi6oH2CGeP4aWcbC44Vy0z',
  // PLACEHOLDER: Team Standard is booked by application today; no link exists yet.
  teamStandard2x: null,
  teamStandard4x: null,
  // From /decision as of 2026-10-30 ($4,500 PIF / $625 weekly). Confirm the amounts before launch.
  eightWeekPif: 'https://link.fastpaydirect.com/payment-link/67b9e4c1020837472ed0b709',
  eightWeekWeekly: 'https://link.fastpaydirect.com/payment-link/67b9e53c156a771b286e2ca6',
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
