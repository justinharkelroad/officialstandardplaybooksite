export const CERTIFIED_STANDARD_CHECKOUT_URL = 'https://myagencybrain.com/certifiedstandard';
export const CERTIFIED_STANDARD_PATH = '/certified-standard';

// Carry campaign context only. This preserves the referral handoff; it does not
// establish checkout attribution or conversion tracking in Agency Brain.
export function getCertifiedStandardHandoff(search = '', destination: 'pricing' | 'program' = 'pricing'): string {
  const incoming = new URLSearchParams(search);
  const url = new URL(CERTIFIED_STANDARD_CHECKOUT_URL);
  const defaults: Record<string, string> = {
    src: 'coaching-site',
    utm_source: 'standardplaybook',
    utm_medium: 'referral',
    utm_campaign: 'certified-standard',
  };
  for (const key of ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = incoming.get(key) || defaults[key];
    if (value) url.searchParams.set(key, value);
  }
  if (destination === 'pricing') url.hash = 'pricing';
  return url.toString();
}
