import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import {
  REACT_CLIENT_TOOL_EXECUTOR,
  shouldRunServerVoiceCoach,
} from "./voice_flow_coach.ts";

Deno.test("server voice coaching runs for an untagged conversation webhook", () => {
  const req = new Request("https://example.test/submit_flow_answer");
  assertEquals(
    shouldRunServerVoiceCoach(req, { conversation_id: "conv_123" }),
    true,
  );
});

Deno.test("browser client marker prevents duplicate voice coaching", () => {
  const req = new Request("https://example.test/submit_flow_answer");
  assertEquals(
    shouldRunServerVoiceCoach(req, {
      conversation_id: "conv_123",
      client_tool_executor: REACT_CLIENT_TOOL_EXECUTOR,
    }),
    false,
  );
});

Deno.test("ElevenLabs request headers trigger server voice coaching", () => {
  const req = new Request("https://example.test/submit_flow_answer", {
    headers: { "user-agent": "ElevenLabs/1.0" },
  });
  assertEquals(shouldRunServerVoiceCoach(req, {}), true);
});
