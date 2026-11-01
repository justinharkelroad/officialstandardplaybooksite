/*
 * Calendars the booking form routes to. Only the by-application offers
 * (Standard 90, Ascension, Momentum) book a call; everything else checks
 * out directly. There are no sales calls with Mary (Justin, 2026-11-01).
 *
 * To land bookers on the confirmation page with the pre-call video, set each
 * calendar's "redirect after booking" in Acuity to
 *   https://standardplaybook.com/booked?offer=<offer key>
 */

/** Justin's calendars for the apply routes (already live). */
export const JUSTIN_CALENDARS = {
  standard90: 'https://AGENCYCOACHING.as.me/standard90',
  ascension: 'https://AGENCYCOACHING.as.me/standardfit',
  momentum: 'https://AGENCYCOACHING.as.me/standardfit',
} as const;
