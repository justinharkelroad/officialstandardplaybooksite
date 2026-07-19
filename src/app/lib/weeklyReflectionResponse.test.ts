import assert from "node:assert/strict";
import test from "node:test";
import {
  parseWeeklyFlowReflectionHistoryResponse,
  parseWeeklyFlowReflectionResponse,
} from "./weeklyReflectionResponse";

const readyReflection = {
  id: "reflection-1",
  weekKey: "2026-W29",
  weekStart: "2026-07-13",
  weekEnd: "2026-07-19",
  timezone: "America/Indiana/Indianapolis",
  headline: "Calm creates room to lead",
  reflectionText: "You kept choosing clarity over urgency.",
  signals: [
    {
      text: "You slow down before deciding.",
      evidenceSessionIds: ["flow-1"],
    },
  ],
  iamStatements: [
    {
      text: "I am a leader who creates order before speed.",
      category: "leadership",
      evidenceSessionIds: ["flow-1"],
    },
  ],
  sourceFlows: [
    {
      id: "flow-1",
      title: null,
      domain: "business",
      templateName: "Daily Frame",
      templateSlug: "daily-frame",
      completedAt: "2026-07-13T13:00:00.000Z",
      localDate: "2026-07-13",
    },
  ],
  sourceCount: 1,
  sourceDayCount: 1,
  sourceVersion: 1,
  generationStatus: "ready",
  generatedAt: "2026-07-13T13:01:00.000Z",
  isStale: false,
  lastError: null,
};

test("parses a ready reflection and preserves nullable source titles", () => {
  const response = parseWeeklyFlowReflectionResponse({
    reflection: readyReflection,
  });

  assert.equal(response.reflection?.sourceFlows[0].title, null);
  assert.equal(response.reflection?.sourceVersion, 1);
  assert.equal(response.reflection?.iamStatements.length, 1);
});

test("rejects malformed synthesis instead of rendering unchecked data", () => {
  assert.throws(
    () =>
      parseWeeklyFlowReflectionResponse({
        reflection: { ...readyReflection, generationStatus: "complete-ish" },
      }),
    /invalid response/i,
  );
});

test("history remains compatible when availableWeeks is not returned", () => {
  const response = parseWeeklyFlowReflectionHistoryResponse({
    reflections: [readyReflection],
  });

  assert.equal(response.reflections[0].weekKey, "2026-W29");
  assert.deepEqual(response.availableWeeks, []);
});
