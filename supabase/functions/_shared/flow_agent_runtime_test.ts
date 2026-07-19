import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { getVisibleQuestions } from "./flow_agent_runtime.ts";
import type { FlowQuestion } from "./flow_types.ts";

const routingQuestions: FlowQuestion[] = [
  { id: "start_doing", type: "select", prompt: "Start?", required: true, options: ["YES", "NO"] },
  { id: "start_what", type: "textarea", prompt: "What will you start?", required: true, show_if: { question_id: "start_doing", equals: "YES" } },
  { id: "stop_doing", type: "select", prompt: "Stop?", required: true, options: ["YES", "NO"] },
  { id: "stop_what", type: "textarea", prompt: "What will you stop?", required: true, show_if: { question_id: "stop_doing", equals: "YES" } },
  { id: "sustain_doing", type: "select", prompt: "Keep?", required: true, options: ["YES", "NO"] },
  { id: "sustain_what", type: "textarea", prompt: "What will you keep?", required: true, show_if: { question_id: "sustain_doing", equals: "YES" } },
  { id: "lesson", type: "textarea", prompt: "Lesson?", required: true },
];

Deno.test("Bible YES/NO selectors preserve their exact routing behavior", () => {
  assertEquals(
    getVisibleQuestions(routingQuestions, { start_doing: "NO", stop_doing: "NO", sustain_doing: "NO" }).map((question) => question.id),
    ["start_doing", "stop_doing", "sustain_doing", "lesson"],
  );
  assertEquals(
    getVisibleQuestions(routingQuestions, { start_doing: "YES", stop_doing: "YES", sustain_doing: "YES" }).map((question) => question.id),
    routingQuestions.map((question) => question.id),
  );
});
