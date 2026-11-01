/*
 * Calendars the booking form routes to.
 *
 * FOR MARY: set MARY_15_MIN_CALENDAR_URL to your 15-minute Acuity link.
 * Until it is set, Mary routes fall back to the shared standardfit calendar.
 *
 * To land bookers on the confirmation page with the pre-call video, set each
 * calendar's "redirect after booking" in Acuity to
 *   https://standardplaybook.com/booked?offer=<offer key>
 * (for example ?offer=teamStandard2x). The booking page also shows a
 * "Booked? Continue" button, so the page works without the redirect.
 */

export const MARY_15_MIN_CALENDAR_URL: string | null = null;

const FALLBACK_CALENDAR_URL = 'https://AGENCYCOACHING.as.me/standardfit';

export const maryCalendarUrl = () => MARY_15_MIN_CALENDAR_URL ?? FALLBACK_CALENDAR_URL;

/** Justin's calendars for the apply routes (already live). */
export const JUSTIN_CALENDARS = {
  standard90: 'https://AGENCYCOACHING.as.me/standard90',
  ascension: 'https://AGENCYCOACHING.as.me/standardfit',
  momentum: 'https://AGENCYCOACHING.as.me/standardfit',
} as const;
