import assert from "node:assert/strict";
import test from "node:test";

import {
  AI_INSTALL_COHORT,
  AI_INSTALL_DATES_NOT_ANNOUNCED,
  type AiInstallCohort,
  getAiInstallCohortLabels,
} from "../../lib/aiInstallCohort";

const UNSET: AiInstallCohort = {
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

const FIRST_COHORT: AiInstallCohort = {
  dayOne: "2026-08-26",
  dayTwo: "2026-08-27",
  preworkDeadline: "2026-08-24",
  checkupCall: "2026-09-24",
  sessionHours: "1:00 PM to 5:00 PM Eastern",
  checkupHours: "1:00 PM to 2:00 PM Eastern",
  priceUsd: 997,
  seats: 12,
  portalShowsV2: true,
};

test("an unset cohort never produces a date, a price, or a seat count", () => {
  const labels = getAiInstallCohortLabels(UNSET);

  assert.equal(labels.scheduled, false);
  assert.equal(labels.beforeDayOne, "BEFORE DAY ONE");
  assert.equal(labels.schedule, AI_INSTALL_DATES_NOT_ANNOUNCED);
  for (const key of [
    "dates",
    "dayOneLine",
    "dayTwoLine",
    "checkupLine",
    "deadline",
    "deadlineDay",
    "deadlineShort",
    "price",
    "seats",
  ] as const) {
    assert.equal(labels[key], null, `${key} must be null until the cohort is set`);
  }
  assert.doesNotMatch(JSON.stringify(labels), /\d/, "no digit may appear before the cohort is set");
});

test("a set cohort reproduces the first cohort's wording exactly", () => {
  const labels = getAiInstallCohortLabels(FIRST_COHORT);

  assert.equal(labels.scheduled, true);
  assert.equal(labels.beforeDayOne, "BEFORE AUGUST 26");
  assert.equal(labels.dates, "August 26-27");
  assert.equal(labels.schedule, "August 26-27 · 1:00 PM to 5:00 PM Eastern");
  assert.equal(labels.dayOneLine, "Wednesday, August 26, 2026, 1:00 PM to 5:00 PM Eastern");
  assert.equal(labels.dayTwoLine, "Thursday, August 27, 2026, 1:00 PM to 5:00 PM Eastern");
  assert.equal(labels.checkupLine, "Thursday, September 24, 2026, 1:00 PM to 2:00 PM Eastern");
  assert.equal(labels.deadline, "end of day Monday, August 24");
  assert.equal(labels.deadlineDay, "Monday, August 24");
  assert.equal(labels.deadlineShort, "August 24");
  assert.equal(labels.price, "$997");
  assert.equal(labels.seats, "12 seats");
});

test("a workshop that crosses a month end names both months", () => {
  const labels = getAiInstallCohortLabels({
    ...FIRST_COHORT,
    dayOne: "2027-08-31",
    dayTwo: "2027-09-01",
    preworkDeadline: "2027-08-27",
  });

  assert.equal(labels.dates, "August 31 and September 1");
});

test("mistakes in the cohort settings stop the build instead of reaching a page", () => {
  assert.throws(() => getAiInstallCohortLabels({ ...FIRST_COHORT, dayOne: "Aug 26" }), /YYYY-MM-DD/);
  assert.throws(() => getAiInstallCohortLabels({ ...FIRST_COHORT, dayOne: "2026-02-30" }), /not a real day/);
  assert.throws(() => getAiInstallCohortLabels({ ...FIRST_COHORT, dayTwo: "2026-08-26" }), /day two/);
  assert.throws(
    () => getAiInstallCohortLabels({ ...FIRST_COHORT, preworkDeadline: "2026-08-26" }),
    /deadline/,
  );
  assert.throws(() => getAiInstallCohortLabels({ ...FIRST_COHORT, priceUsd: 0 }), /price/);
  assert.throws(() => getAiInstallCohortLabels({ ...FIRST_COHORT, seats: 2.5 }), /seat/);
});

test("the committed cohort settings are valid as they stand", () => {
  assert.doesNotThrow(() => getAiInstallCohortLabels(AI_INSTALL_COHORT));
});
