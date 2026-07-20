import {
  assert,
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import {
  buildBoundedWeeklyReflectionPromptData,
  buildEmptyReflectionContent,
  buildSourceFlows,
  buildWeeklyReflectionSystemPrompt,
  canonicalWeeklyReflectionBounds,
  computeWeeklyReflectionSourceHash,
  type FlowSessionForReflection,
  isWeeklyReflectionCacheCurrent,
  progressiveIAmCount,
  progressiveSignalCount,
  validateWeeklyReflectionBounds,
  validateWeeklyReflectionModelOutput,
} from "./weeklyReflection.ts";

const SESSION_ID = "11111111-1111-4111-8111-111111111111";

function session(
  overrides: Partial<FlowSessionForReflection> = {},
): FlowSessionForReflection {
  return {
    id: SESSION_ID,
    title: "Choose calm",
    domain: "BEING",
    responses_json: {
      want_for_you: "I want to slow down and respond with clarity.",
      lesson: "Stillness helps me choose my response.",
    },
    ai_analysis_json: { headline: "Calm before speed" },
    completed_at: "2026-07-13T14:00:00.000Z",
    flow_template: {
      id: "22222222-2222-4222-8222-222222222222",
      name: "Grateful",
      slug: "grateful",
      questions_json: [
        { id: "want_for_you", prompt: "What do you want for you?" },
      ],
    },
    ...overrides,
  };
}

Deno.test("weekly bounds accept a DST-safe local Monday-to-Monday range", () => {
  const result = validateWeeklyReflectionBounds({
    weekKey: "2026-W44",
    timezone: "America/New_York",
    weekStartIso: "2026-10-26T04:00:00.000Z",
    weekEndIso: "2026-11-02T05:00:00.000Z",
  });
  assert(result.ok);
  if (!result.ok) return;
  assertEquals(result.value.weekStart, "2026-10-26");
  assertEquals(result.value.weekEnd, "2026-11-01");
});

Deno.test("weekly bounds reject a key that does not match the local week", () => {
  const result = validateWeeklyReflectionBounds({
    weekKey: "2026-W45",
    timezone: "America/New_York",
    weekStartIso: "2026-10-26T04:00:00.000Z",
    weekEndIso: "2026-11-02T05:00:00.000Z",
  });
  assert(!result.ok);
  if (result.ok) return;
  assertStringIncludes(result.error, "weekKey");
});

Deno.test("an established week keeps its original timezone and instant bounds", () => {
  const requested = validateWeeklyReflectionBounds({
    weekKey: "2026-W29",
    timezone: "America/Los_Angeles",
    weekStartIso: "2026-07-13T07:00:00.000Z",
    weekEndIso: "2026-07-20T07:00:00.000Z",
  });
  assert(requested.ok);
  if (!requested.ok) return;

  const canonical = canonicalWeeklyReflectionBounds(requested.value, {
    week_key: "2026-W29",
    week_start: "2026-07-13",
    week_end: "2026-07-19",
    timezone: "America/New_York",
    range_start_at: "2026-07-13T04:00:00.000Z",
    range_end_at: "2026-07-20T04:00:00.000Z",
  });
  assertEquals(canonical.timezone, "America/New_York");
  assertEquals(canonical.weekStartIso, "2026-07-13T04:00:00.000Z");
  assertEquals(canonical.weekEndIso, "2026-07-20T04:00:00.000Z");
});

Deno.test("I AM and signal counts grow with the week's evidence", () => {
  assertEquals([0, 1, 2, 3, 4, 5, 6, 9].map(progressiveIAmCount), [
    0,
    2,
    3,
    4,
    5,
    5,
    6,
    6,
  ]);
  assertEquals([0, 1, 2, 3, 4, 5, 7].map(progressiveSignalCount), [
    0,
    1,
    1,
    2,
    2,
    3,
    3,
  ]);
});

Deno.test("model prompt input is globally bounded and authorizes only included sessions", () => {
  const sessions = Array.from({ length: 30 }, (_, index) =>
    session({
      id: `${String(index + 1).padStart(8, "0")}-1111-4111-8111-111111111111`,
      responses_json: { want_for_you: "x".repeat(20_000) },
    }));
  const bounded = buildBoundedWeeklyReflectionPromptData(sessions, 20_000, 14);
  assert(bounded.json.length <= 20_000);
  assert(bounded.sessions.length <= 14);
  assert(bounded.sessions.length > 0);
  assertStringIncludes(bounded.json, bounded.sessions.at(-1)!.id);
});

Deno.test("prompt calibrates pattern language to the amount of weekly evidence", () => {
  assertStringIncludes(
    buildWeeklyReflectionSystemPrompt(2, 1, 1),
    "first signal",
  );
  assertStringIncludes(
    buildWeeklyReflectionSystemPrompt(3, 1, 2),
    "taking shape",
  );
  assertStringIncludes(
    buildWeeklyReflectionSystemPrompt(5, 3, 4),
    "recurring only",
  );
});

Deno.test("prompt requires reflection copy to address the reader directly", () => {
  const prompt = buildWeeklyReflectionSystemPrompt(2, 1, 1);
  assertStringIncludes(prompt, 'using "you" and "your."');
  assertStringIncludes(prompt, 'Never refer to the reader as "the member"');
});

Deno.test("source hashes are stable across object key order and change with source text", async () => {
  const first = session({
    responses_json: { lesson: "Choose calm", actions: "Pause" },
  });
  const reordered = session({
    responses_json: { actions: "Pause", lesson: "Choose calm" },
  });
  const changed = session({
    responses_json: { actions: "Pause twice", lesson: "Choose calm" },
  });

  assertEquals(
    await computeWeeklyReflectionSourceHash([first]),
    await computeWeeklyReflectionSourceHash([reordered]),
  );
  assert(
    await computeWeeklyReflectionSourceHash([first]) !==
      await computeWeeklyReflectionSourceHash([changed]),
  );
});

Deno.test("source hashes are stable when completion timestamps tie", async () => {
  const first = session({
    id: "11111111-1111-4111-8111-111111111111",
    completed_at: "2026-07-13T14:00:00.000Z",
  });
  const second = session({
    id: "22222222-2222-4222-8222-222222222222",
    completed_at: "2026-07-13T14:00:00.000Z",
  });
  assertEquals(
    await computeWeeklyReflectionSourceHash([first, second]),
    await computeWeeklyReflectionSourceHash([second, first]),
  );
});

Deno.test("cache eligibility includes model and prompt identity", () => {
  const ready = {
    sourceHash: "source-a",
    contentSourceHash: "source-a",
    sourceCount: 4,
    generationStatus: "ready" as const,
    model: "gpt-4o-mini",
    promptVersion: "weekly-flow-reflection-v1",
  };
  assert(isWeeklyReflectionCacheCurrent(
    ready,
    "source-a",
    "gpt-4o-mini",
    "weekly-flow-reflection-v1",
  ));
  assert(
    !isWeeklyReflectionCacheCurrent(
      ready,
      "source-a",
      "gpt-4.1-mini",
      "weekly-flow-reflection-v1",
    ),
  );
  assert(
    !isWeeklyReflectionCacheCurrent(
      ready,
      "source-a",
      "gpt-4o-mini",
      "weekly-flow-reflection-v2",
    ),
  );

  assert(isWeeklyReflectionCacheCurrent(
    {
      ...ready,
      sourceCount: 0,
      generationStatus: "empty",
      model: null,
      promptVersion: null,
    },
    "source-a",
    "any-model",
    "any-prompt",
  ));
});

Deno.test("validated synthesis accepts only authorized evidence IDs", () => {
  const result = validateWeeklyReflectionModelOutput({
    headline: "Calm is becoming a practice",
    reflection:
      "You repeatedly described slowing down before responding. That stated direction connects the lesson you named to a practical way of showing up this week.",
    signals: [{
      text: "A deliberate pause is becoming part of how you choose clarity.",
      evidence_session_ids: [SESSION_ID],
    }],
    iam_statements: [
      {
        text: "I am creating enough space to choose a clear response.",
        category: "posture",
        evidence_session_ids: [SESSION_ID],
      },
      {
        text: "I am practicing stillness before I move into action.",
        category: "practice",
        evidence_session_ids: [SESSION_ID],
      },
    ],
  }, [session()]);
  assert(result.ok);

  const unauthorized = validateWeeklyReflectionModelOutput({
    headline: "Calm is becoming a practice",
    reflection:
      "You repeatedly described slowing down before responding. That stated direction connects the lesson you named to a practical way of showing up this week.",
    signals: [{
      text: "A deliberate pause is becoming part of how you choose clarity.",
      evidence_session_ids: ["33333333-3333-4333-8333-333333333333"],
    }],
    iam_statements: [
      {
        text: "I am creating enough space to choose a clear response.",
        category: "posture",
        evidence_session_ids: [SESSION_ID],
      },
      {
        text: "I am practicing stillness before I move into action.",
        category: "practice",
        evidence_session_ids: [SESSION_ID],
      },
    ],
  }, [session()]);
  assert(!unauthorized.ok);
});

Deno.test("validation rejects third-person weekly reflection copy", () => {
  const result = validateWeeklyReflectionModelOutput({
    headline: "Calm is becoming a practice",
    reflection:
      "This week, the member is learning to slow down before responding. Their words point toward a deliberate pause and a clearer way of choosing what comes next.",
    signals: [{
      text: "The member is beginning to create more room for clarity.",
      evidence_session_ids: [SESSION_ID],
    }],
    iam_statements: [
      {
        text: "I am creating enough space to choose a clear response.",
        category: "posture",
        evidence_session_ids: [SESSION_ID],
      },
      {
        text: "I am practicing stillness before I move into action.",
        category: "practice",
        evidence_session_ids: [SESSION_ID],
      },
    ],
  }, [session()]);
  assert(!result.ok);
  if (result.ok) return;
  assertStringIncludes(result.error, "speak directly");
});

Deno.test("validation requires every signal to address the reader", () => {
  const result = validateWeeklyReflectionModelOutput({
    headline: "Calm is becoming a practice",
    reflection:
      "You are learning to slow down before responding. Your words point toward a deliberate pause and a clearer way of choosing what comes next.",
    signals: [{
      text: "A deliberate pause is becoming part of the response.",
      evidence_session_ids: [SESSION_ID],
    }],
    iam_statements: [
      {
        text: "I am creating enough space to choose a clear response.",
        category: "posture",
        evidence_session_ids: [SESSION_ID],
      },
      {
        text: "I am practicing stillness before I move into action.",
        category: "practice",
        evidence_session_ids: [SESSION_ID],
      },
    ],
  }, [session()]);
  assert(!result.ok);
  if (result.ok) return;
  assertStringIncludes(result.error, "Every signal must speak directly");
});

Deno.test("validation rejects faith or role claims that the member did not supply", () => {
  const result = validateWeeklyReflectionModelOutput({
    headline: "Faith is directing the week",
    reflection:
      "God is building a quieter foundation under the choices you described, and prayer is guiding your next response toward greater clarity.",
    signals: [{
      text: "Prayer is becoming a source of clarity in your decisions.",
      evidence_session_ids: [SESSION_ID],
    }],
    iam_statements: [
      {
        text: "I am anchored in God's direction for my next move.",
        category: "identity",
        evidence_session_ids: [SESSION_ID],
      },
      {
        text: "I am practicing stillness before I move into action.",
        category: "practice",
        evidence_session_ids: [SESSION_ID],
      },
    ],
  }, [session()]);
  assert(!result.ok);
  if (result.ok) return;
  assertStringIncludes(result.error, "faith or spiritual belief");
});

Deno.test("empty content and source metadata use member-local completion dates", () => {
  const flows = buildSourceFlows([
    session({ completed_at: "2026-07-13T03:30:00.000Z" }),
  ], "America/New_York");
  const content = buildEmptyReflectionContent(flows);
  assertEquals(flows[0].local_date, "2026-07-12");
  assertEquals(content.source_count, 1);
  assertEquals(content.source_day_count, 1);
  assertEquals(content.signals, []);
  assertEquals(content.iam_statements, []);
});
