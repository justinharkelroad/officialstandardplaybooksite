import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { buildFlowVoicePrompt } from "../../../src/app/lib/flowVoicePrompt.ts";

Deno.test("legacy voice facilitates the Flow without per-question coaching", () => {
  const prompt = buildFlowVoicePrompt({
    flow_slug: "bible",
    flow_name: "Bible Flow",
    first_question: {
      id: "title",
      prompt: "Give this study a title.",
      type: "text",
      required: true,
    },
    questions: [
      {
        id: "title",
        prompt: "Give this study a title.",
        type: "text",
        required: true,
      },
      {
        id: "lesson",
        prompt: "What is the lesson?",
        type: "textarea",
        required: true,
        ai_challenge: true,
      },
    ],
  });

  assertStringIncludes(
    prompt,
    "structured facilitator, not per-question AI coaching",
  );
  assertStringIncludes(prompt, "Do not call flow_coach_reflect");
  assertEquals(prompt.includes("coach_reflection"), false);
  assertEquals(prompt.includes("coach_probe"), false);
  assertEquals(prompt.includes("coach_resolution"), false);
  assertStringIncludes(prompt, "immediately call complete_flow_session");
});
