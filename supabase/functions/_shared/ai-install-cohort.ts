// The one place the next AI Install cohort is described.
//
// Website pages import this through src/lib/aiInstallCohort.ts. Edge Functions
// import it directly. It has no imports of its own so both runtimes can load it.
//
// Every value is null until Justin sets it. Pages and emails must read the
// labels below and never write a date, price, or seat count of their own.

export interface AiInstallCohort {
  /** ISO dates, for example "2027-02-10". Null means not announced. */
  dayOne: string | null;
  dayTwo: string | null;
  preworkDeadline: string | null;
  checkupCall: string | null;
  /** For example "1:00 PM to 5:00 PM Eastern". Null means not announced. */
  sessionHours: string | null;
  /** For example "1:00 PM to 2:00 PM Eastern". Null means not announced. */
  checkupHours: string | null;
  priceUsd: number | null;
  seats: number | null;
  /**
   * When false the portal shows exactly what the first cohort received.
   * When true it also shows the fallback plugin packages and the receipt field.
   */
  portalShowsV2: boolean;
}

export const AI_INSTALL_COHORT: AiInstallCohort = {
  dayOne: null,
  dayTwo: null,
  preworkDeadline: null,
  checkupCall: null,
  sessionHours: null,
  checkupHours: null,
  priceUsd: null,
  seats: null,
  portalShowsV2: false,
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DateParts {
  year: number;
  month: number;
  day: number;
  weekday: string;
  monthName: string;
}

function parseIsoDate(value: string): DateParts {
  const match = ISO_DATE.exec(value);
  if (!match) throw new Error(`AI Install cohort date must be YYYY-MM-DD, got "${value}"`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // UTC keeps the calendar day fixed whatever time zone the reader is in.
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`AI Install cohort date is not a real day: "${value}"`);
  }
  return { year, month, day, weekday: WEEKDAYS[date.getUTCDay()], monthName: MONTHS[month - 1] };
}

/** "August 26" */
export function formatCohortDay(value: string): string {
  const parts = parseIsoDate(value);
  return `${parts.monthName} ${parts.day}`;
}

/** "Wednesday, August 26" */
export function formatCohortWeekday(value: string): string {
  const parts = parseIsoDate(value);
  return `${parts.weekday}, ${parts.monthName} ${parts.day}`;
}

/** "Wednesday, August 26, 2026" */
export function formatCohortFull(value: string): string {
  const parts = parseIsoDate(value);
  return `${parts.weekday}, ${parts.monthName} ${parts.day}, ${parts.year}`;
}

/** "August 26-27", or "August 31 and September 1" across a month end. */
export function formatCohortRange(first: string, second: string): string {
  const a = parseIsoDate(first);
  const b = parseIsoDate(second);
  if (a.year === b.year && a.month === b.month) return `${a.monthName} ${a.day}-${b.day}`;
  return `${a.monthName} ${a.day} and ${b.monthName} ${b.day}`;
}

export interface AiInstallCohortLabels {
  /** True only when both workshop days and the pre-work deadline are set. */
  scheduled: boolean;
  /** "BEFORE AUGUST 26" or "BEFORE DAY ONE" */
  beforeDayOne: string;
  /** "August 26-27" or null */
  dates: string | null;
  /** "August 26-27 · 1:00 PM to 5:00 PM Eastern", or the not-announced line */
  schedule: string;
  /** "Wednesday, August 26, 2026, 1:00 PM to 5:00 PM Eastern" or null */
  dayOneLine: string | null;
  dayTwoLine: string | null;
  checkupLine: string | null;
  /** "end of day Monday, August 24" or null */
  deadline: string | null;
  /** "Monday, August 24" or null */
  deadlineDay: string | null;
  /** "August 24" or null */
  deadlineShort: string | null;
  /** "$997" or null */
  price: string | null;
  /** "12 seats" or null */
  seats: string | null;
}

export const AI_INSTALL_DATES_NOT_ANNOUNCED = "Dates are announced to the waitlist first";

function withHours(date: string | null, hours: string | null): string | null {
  if (!date) return null;
  return hours ? `${formatCohortFull(date)}, ${hours}` : formatCohortFull(date);
}

export function getAiInstallCohortLabels(
  cohort: AiInstallCohort = AI_INSTALL_COHORT,
): AiInstallCohortLabels {
  // Check every date is real before comparing any of them.
  for (const value of [cohort.dayOne, cohort.dayTwo, cohort.preworkDeadline, cohort.checkupCall]) {
    if (value !== null) parseIsoDate(value);
  }
  const hasDays = Boolean(cohort.dayOne && cohort.dayTwo);
  if (hasDays && cohort.dayOne! >= cohort.dayTwo!) {
    throw new Error("AI Install cohort day two must be after day one");
  }
  if (cohort.preworkDeadline && cohort.dayOne && cohort.preworkDeadline >= cohort.dayOne) {
    throw new Error("AI Install pre-work deadline must be before day one");
  }
  if (cohort.priceUsd !== null && !(Number.isFinite(cohort.priceUsd) && cohort.priceUsd > 0)) {
    throw new Error("AI Install cohort price must be a positive number");
  }
  if (cohort.seats !== null && !(Number.isInteger(cohort.seats) && cohort.seats > 0)) {
    throw new Error("AI Install cohort seat count must be a positive whole number");
  }

  const dates = hasDays ? formatCohortRange(cohort.dayOne!, cohort.dayTwo!) : null;
  const schedule = dates
    ? cohort.sessionHours ? `${dates} · ${cohort.sessionHours}` : dates
    : AI_INSTALL_DATES_NOT_ANNOUNCED;

  return {
    scheduled: hasDays && Boolean(cohort.preworkDeadline),
    beforeDayOne: cohort.dayOne
      ? `BEFORE ${formatCohortDay(cohort.dayOne).toUpperCase()}`
      : "BEFORE DAY ONE",
    dates,
    schedule,
    dayOneLine: withHours(cohort.dayOne, cohort.sessionHours),
    dayTwoLine: withHours(cohort.dayTwo, cohort.sessionHours),
    checkupLine: withHours(cohort.checkupCall, cohort.checkupHours),
    deadline: cohort.preworkDeadline
      ? `end of day ${formatCohortWeekday(cohort.preworkDeadline)}`
      : null,
    deadlineDay: cohort.preworkDeadline ? formatCohortWeekday(cohort.preworkDeadline) : null,
    deadlineShort: cohort.preworkDeadline ? formatCohortDay(cohort.preworkDeadline) : null,
    price: cohort.priceUsd === null ? null : `$${cohort.priceUsd.toLocaleString("en-US")}`,
    seats: cohort.seats === null ? null : `${cohort.seats} seats`,
  };
}
