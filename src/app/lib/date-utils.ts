import { startOfDay, getISOWeek, getISOWeekYear, startOfISOWeek, addWeeks, addDays, subWeeks, format } from 'date-fns';

/**
 * Get UTC timestamp strings for a local date's boundaries.
 * Converts the start (00:00:00) and end (23:59:59.999) of the given
 * local date into ISO/UTC strings suitable for Supabase timestamptz queries.
 */
export function getLocalDayBoundsInUTC(localDate: Date) {
  const localStart = startOfDay(localDate);
  const localEnd = new Date(localStart);
  localEnd.setHours(23, 59, 59, 999);

  return {
    startUTC: localStart.toISOString(),
    endUTC: localEnd.toISOString(),
  };
}

/**
 * Returns an ISO 8601 week key like '2026-W11' for the given date.
 * Uses date-fns getISOWeek/getISOWeekYear for correct ISO week numbering
 * (weeks start on Monday, week 1 contains the first Thursday of the year).
 */
export function getWeekKey(date: Date): string {
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/**
 * Converts an ISO week key like '2026-W11' to the Monday and Sunday dates of that week.
 */
export function weekKeyToDateRange(weekKey: string): { monday: Date; sunday: Date } {
  const [yearStr, weekStr] = weekKey.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(year, 0, 4);
  const w1Monday = startOfISOWeek(jan4);
  const monday = addWeeks(w1Monday, week - 1);
  const sunday = addDays(monday, 6);
  return { monday, sunday };
}

/**
 * Returns the week key for the debrief page.
 * Monday reviews the week that just ended. Sunday reviews the current ISO week.
 * The debrief itself is only open on those two days; other days still use the
 * current week key so completed debriefs can be viewed consistently.
 */
export function getDebriefWeekKey(date: Date = new Date()): string {
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon
  if (dayOfWeek === 1) {
    return getWeekKey(subWeeks(date, 1));
  }
  return getWeekKey(date);
}

/** The weekly debrief can only be started or resumed on Sunday and Monday. */
export function isDebriefWindowOpen(date: Date = new Date()): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 1;
}

/**
 * Formats a week label as a date range: "March 16 – 22, 2026" (same month)
 * or "March 30 – April 5, 2026" (spanning months).
 */
export function formatWeekLabel(monday: Date, sunday: Date): string {
  if (monday.getFullYear() !== sunday.getFullYear()) {
    // Year-spanning: "December 29, 2025 – January 4, 2026"
    return `${format(monday, 'MMMM d, yyyy')} – ${format(sunday, 'MMMM d, yyyy')}`;
  }
  if (monday.getMonth() === sunday.getMonth()) {
    // Same month: "March 16 – 22, 2026"
    return `${format(monday, 'MMMM d')} – ${format(sunday, 'd, yyyy')}`;
  }
  // Different months: "March 30 – April 5, 2026"
  return `${format(monday, 'MMMM d')} – ${format(sunday, 'MMMM d, yyyy')}`;
}
