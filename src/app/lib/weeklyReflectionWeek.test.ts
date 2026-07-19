import assert from "node:assert/strict";
import test from "node:test";
import {
  getWeeklyReflectionWindow,
  getWeeklyReflectionWindowFromKey,
  isWeeklyReflectionWeekKey,
  normalizeTimezone,
  shiftWeeklyReflectionWeek,
  takeReflectionSentences,
} from "./weeklyReflectionWeek";

test("uses the member timezone when UTC has already crossed into Monday", () => {
  const window = getWeeklyReflectionWindow(
    new Date("2026-07-20T03:30:00.000Z"),
    "America/Indiana/Indianapolis",
  );

  assert.equal(window.weekKey, "2026-W29");
  assert.equal(window.weekStartIso, "2026-07-13T04:00:00.000Z");
  assert.equal(window.weekEndIso, "2026-07-20T04:00:00.000Z");
  assert.equal(window.label, "July 13 – 19, 2026");
});

test("creates DST-safe half-open weekly bounds", () => {
  const window = getWeeklyReflectionWindowFromKey(
    "2026-W10",
    "America/New_York",
  );

  assert.equal(window.weekStartIso, "2026-03-02T05:00:00.000Z");
  assert.equal(window.weekEndIso, "2026-03-09T04:00:00.000Z");
  assert.equal(
    new Date(window.weekEndIso).getTime() - new Date(window.weekStartIso).getTime(),
    167 * 60 * 60 * 1000,
  );
});

test("shifts cleanly across ISO week years and rejects impossible week keys", () => {
  assert.equal(
    shiftWeeklyReflectionWeek("2025-W52", 1, "UTC").weekKey,
    "2026-W01",
  );
  assert.equal(isWeeklyReflectionWeekKey("2026-W53"), true);
  assert.equal(isWeeklyReflectionWeekKey("2025-W53"), false);
  assert.equal(isWeeklyReflectionWeekKey("2026-W00"), false);
});

test("falls back to UTC for an invalid timezone", () => {
  assert.equal(normalizeTimezone("Not/A_Timezone"), "UTC");
});

test("limits dashboard copy to complete sentences", () => {
  assert.equal(
    takeReflectionSentences(
      "You created space before reacting. That space helped you lead clearly. A third insight stays on the full page.",
      2,
    ),
    "You created space before reacting. That space helped you lead clearly.",
  );
});
