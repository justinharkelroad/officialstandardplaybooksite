import type { WeeklyReflectionRequestWindow } from "../types/weeklyReflection";

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

const WEEK_KEY_PATTERN = /^(\d{4})-W(0[1-9]|[1-4]\d|5[0-3])$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function calendarDateFromUtc(date: Date): CalendarDate {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function calendarDateToUtc(date: CalendarDate): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  return calendarDateFromUtc(
    new Date(calendarDateToUtc(date).getTime() + days * DAY_IN_MS),
  );
}

function getZonedDateParts(date: Date, timezone: string): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function getZonedDateTimeParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<"year" | "month" | "day" | "hour" | "minute" | "second", number>;
}

function getTimezoneOffsetMs(date: Date, timezone: string): number {
  const parts = getZonedDateTimeParts(date, timezone);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return representedAsUtc - Math.floor(date.getTime() / 1000) * 1000;
}

function zonedMidnightToUtc(date: CalendarDate, timezone: string): Date {
  const localAsUtc = Date.UTC(date.year, date.month - 1, date.day);
  let candidate = new Date(localAsUtc);

  // Re-evaluate because an offset can change near the requested boundary.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const next = new Date(localAsUtc - getTimezoneOffsetMs(candidate, timezone));
    if (next.getTime() === candidate.getTime()) return next;
    candidate = next;
  }

  return candidate;
}

function getIsoWeekKeyFromCalendarDate(date: CalendarDate): string {
  const current = calendarDateToUtc(date);
  const isoWeekday = current.getUTCDay() || 7;
  const thursday = new Date(current.getTime() + (4 - isoWeekday) * DAY_IN_MS);
  const isoYear = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / DAY_IN_MS + 1) / 7,
  );

  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

function getMondayForDate(date: CalendarDate): CalendarDate {
  const utcDate = calendarDateToUtc(date);
  const isoWeekday = utcDate.getUTCDay() || 7;
  return addCalendarDays(date, 1 - isoWeekday);
}

function getMondayForWeekKey(weekKey: string): CalendarDate | null {
  const match = WEEK_KEY_PATTERN.exec(weekKey);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Weekday = jan4.getUTCDay() || 7;
  const weekOneMonday = new Date(jan4.getTime() - (jan4Weekday - 1) * DAY_IN_MS);
  const monday = calendarDateFromUtc(
    new Date(weekOneMonday.getTime() + (week - 1) * 7 * DAY_IN_MS),
  );

  return getIsoWeekKeyFromCalendarDate(monday) === weekKey ? monday : null;
}

function formatCalendarDate(date: CalendarDate, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(undefined, {
    ...options,
    timeZone: "UTC",
  }).format(calendarDateToUtc(date));
}

function formatWeekLabel(monday: CalendarDate, sunday: CalendarDate): string {
  if (monday.year !== sunday.year) {
    return `${formatCalendarDate(monday, {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} – ${formatCalendarDate(sunday, {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  if (monday.month === sunday.month) {
    return `${formatCalendarDate(monday, {
      month: "long",
      day: "numeric",
    })} – ${sunday.day}, ${sunday.year}`;
  }

  return `${formatCalendarDate(monday, {
    month: "long",
    day: "numeric",
  })} – ${formatCalendarDate(sunday, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function getBrowserTimezone(): string {
  const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return resolved || "UTC";
}

export function normalizeTimezone(timezone: string | null | undefined): string {
  if (!timezone) return "UTC";

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
    return timezone;
  } catch {
    return "UTC";
  }
}

export function isWeeklyReflectionWeekKey(value: string): boolean {
  return getMondayForWeekKey(value) !== null;
}

export function getWeeklyReflectionWindowFromKey(
  weekKey: string,
  timezone: string,
): WeeklyReflectionRequestWindow {
  const normalizedTimezone = normalizeTimezone(timezone);
  const monday = getMondayForWeekKey(weekKey);

  if (!monday) {
    throw new Error(`Invalid ISO week key: ${weekKey}`);
  }

  const nextMonday = addCalendarDays(monday, 7);
  const sunday = addCalendarDays(monday, 6);

  return {
    weekKey,
    timezone: normalizedTimezone,
    weekStartIso: zonedMidnightToUtc(monday, normalizedTimezone).toISOString(),
    weekEndIso: zonedMidnightToUtc(nextMonday, normalizedTimezone).toISOString(),
    label: formatWeekLabel(monday, sunday),
  };
}

export function getWeeklyReflectionWindow(
  date: Date = new Date(),
  timezone: string = getBrowserTimezone(),
): WeeklyReflectionRequestWindow {
  const normalizedTimezone = normalizeTimezone(timezone);
  const localDate = getZonedDateParts(date, normalizedTimezone);
  const monday = getMondayForDate(localDate);
  const weekKey = getIsoWeekKeyFromCalendarDate(monday);
  return getWeeklyReflectionWindowFromKey(weekKey, normalizedTimezone);
}

export function shiftWeeklyReflectionWeek(
  weekKey: string,
  amount: number,
  timezone: string,
): WeeklyReflectionRequestWindow {
  const monday = getMondayForWeekKey(weekKey);
  if (!monday) throw new Error(`Invalid ISO week key: ${weekKey}`);

  const shiftedKey = getIsoWeekKeyFromCalendarDate(addCalendarDays(monday, amount * 7));
  return getWeeklyReflectionWindowFromKey(shiftedKey, timezone);
}

export function takeReflectionSentences(text: string, count = 2): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized || count <= 0) return "";

  const sentences = normalized.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) ?? [normalized];
  return sentences
    .slice(0, count)
    .map((sentence) => sentence.trim())
    .join(" ");
}
