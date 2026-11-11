/*
 * Calendars the booking form routes to. The by-application / capacity-limited
 * offers book a call: Standard 90, Ascension, Team Standard (2X and 4X), and
 * the 8-Week Experience. Momentum and The Directive are waitlist only and do
 * not book a call from the funnel (Justin, 2026-11-11).
 *
 * To land bookers on the confirmation page with the pre-call video, set each
 * calendar's "redirect after booking" in Acuity to
 *   https://standardplaybook.com/booked?offer=<offer key>
 */

/** Justin's calendars for the apply routes. Keys match OfferKey. */
export const JUSTIN_CALENDARS = {
  standard90: 'https://AGENCYCOACHING.as.me/standard90',
  ascension: 'https://AGENCYCOACHING.as.me/standardfit',
  // Team Standard (both tiers) and the 8-Week book their own fit calls, the
  // same calendars the dedicated pages use.
  teamStandard2x: 'https://AGENCYCOACHING.as.me/teamstandard',
  teamStandard4x: 'https://AGENCYCOACHING.as.me/teamstandard',
  eightWeek: 'https://AGENCYCOACHING.as.me/8week',
} as const;
