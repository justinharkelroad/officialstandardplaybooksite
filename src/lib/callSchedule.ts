/**
 * Computes the next occurrence of an Nth-Wednesday-of-the-month recurring call,
 * with support for one-off date/time overrides per call per month.
 *
 * Edit OVERRIDES below to change a specific month's date/time. Once that
 * overridden date passes, the standard Nth-Wednesday cadence resumes
 * automatically.
 */

export type CallId = 'boardroom' | 'agencybrain' | 'ai';

interface Override {
  date: string;    // YYYY-MM-DD in America/New_York
  start: string;   // HH:mm 24h, America/New_York
  end: string;     // HH:mm 24h, America/New_York
  /** When true, the UI shows a "· Special" badge. Defaults to false. */
  special?: boolean;
}

// Key: `${callId}:${YYYY-MM}` — edit any month here.
export const OVERRIDES: Record<string, Override> = {
  'boardroom:2026-05':   { date: '2026-05-20', start: '13:00', end: '15:00', special: true },
  // First AgencyBrain + AI calls don't kick off until June. Not "special" — just the start date.
  'agencybrain:2026-05': { date: '2026-06-17', start: '14:00', end: '14:45' },
  'ai:2026-05':          { date: '2026-06-24', start: '14:00', end: '14:45' },
};

// Default times for each call (America/New_York).
const DEFAULT_TIMES: Record<CallId, { start: string; end: string }> = {
  boardroom:   { start: '13:00', end: '14:00' },
  agencybrain: { start: '14:00', end: '14:45' },
  ai:          { start: '14:00', end: '14:45' },
};

const TZ = 'America/New_York';

/** Today's date in America/New_York as YYYY-MM-DD. */
function todayInTZ(): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

/** Day-of-week (0=Sun..6=Sat) for a given Y-M-D treated as a local calendar date. */
function dowOf(y: number, m: number, d: number): number {
  // Use UTC math on the calendar date — the weekday is identical regardless of TZ.
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Returns the day-of-month (1-31) for the Nth Wednesday of the given month. */
function nthWednesday(year: number, month1: number, n: number): number {
  const firstDow = dowOf(year, month1, 1);
  // Wednesday = 3
  const firstWedDay = 1 + ((3 - firstDow + 7) % 7);
  return firstWedDay + (n - 1) * 7;
}

interface Occurrence {
  /** YYYY-MM-DD in America/New_York */
  date: string;
  start: string;
  end: string;
  isOverride: boolean;
}

function pad(n: number) { return n.toString().padStart(2, '0'); }

function cadenceOccurrenceForMonth(
  callId: CallId,
  cadenceWeek: number,
  year: number,
  month1: number,
): Occurrence {
  const key = `${callId}:${year}-${pad(month1)}`;
  const override = OVERRIDES[key];
  if (override) {
    return { date: override.date, start: override.start, end: override.end, isOverride: !!override.special };
  }
  const day = nthWednesday(year, month1, cadenceWeek);
  const def = DEFAULT_TIMES[callId];
  return {
    date: `${year}-${pad(month1)}-${pad(day)}`,
    start: def.start,
    end: def.end,
    isOverride: false,
  };
}

/**
 * Returns the next upcoming occurrence (today counts as upcoming until its end time passes).
 */
export function getNextOccurrence(callId: CallId, cadenceWeek: number): Occurrence {
  const today = todayInTZ();
  // Check current month, then next, then the one after (safety).
  for (let offset = 0; offset < 3; offset++) {
    const year  = today.y + Math.floor((today.m - 1 + offset) / 12);
    const month = ((today.m - 1 + offset) % 12) + 1;
    const occ = cadenceOccurrenceForMonth(callId, cadenceWeek, year, month);
    const occDay = Number(occ.date.slice(-2));
    if (offset > 0 || occDay >= today.d) return occ;
  }
  // Fallback (shouldn't hit)
  return cadenceOccurrenceForMonth(callId, cadenceWeek, today.y, today.m);
}

/** Formats an occurrence like "Wed, May 20, 2026 · 1:00–3:00 PM EST". */
export function formatOccurrence(occ: Occurrence): string {
  const [y, m, d] = occ.date.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 12)); // midday UTC avoids TZ slippage
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short' }).format(dateObj);
  const month = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short' }).format(dateObj);
  const start = formatTime(occ.start);
  const end   = formatTime(occ.end);
  // Use EST/EDT abbreviation appropriate to the date
  const tzAbbr = tzAbbreviation(y, m, d);
  return `${weekday}, ${month} ${d}, ${y} · ${start}–${end} ${tzAbbr}`;
}

function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  let h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return m === 0 ? `${h}:00 ${ampm}` : `${h}:${pad(m)} ${ampm}`;
}

function tzAbbreviation(y: number, m: number, d: number): string {
  const dt = new Date(Date.UTC(y, m - 1, d, 17)); // 17:00 UTC = 12/1 PM ET
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, timeZoneName: 'short', hour: 'numeric',
  }).formatToParts(dt);
  const tz = parts.find((p) => p.type === 'timeZoneName')?.value || 'ET';
  return tz;
}
