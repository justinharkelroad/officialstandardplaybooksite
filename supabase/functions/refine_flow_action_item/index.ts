// refine_flow_action_item — ported to the Standard Playbook member app.
// Auth: requireActiveMember (JWT-only; the source's staff-session branch is
// deleted). Model: gpt-4o-mini.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";

interface RequestBody {
  action_text?: string;
  flow_name?: string;
  flow_title?: string | null;
  domain?: string | null;
  previous_actions?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;

    const {
      action_text,
      flow_name = "Flow",
      flow_title = null,
      domain = null,
      previous_actions = [],
    } = (await req.json()) as RequestBody;

    if (!action_text?.trim()) {
      return new Response(
        JSON.stringify({ error: "action_text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "AI isn't configured yet (missing OPENAI_API_KEY)" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const systemPrompt = `You are a direct but encouraging accountability coach.

Your job is to sharpen a user's declared action item so it is:
- measurable,
- pass/fail where possible,
- time-bound enough for this week or the next 24 hours,
- slightly deeper and more courageous than the vague version.

Keep the language human and practical. Do not sound robotic. Do not preach.

Return ONLY valid JSON with this exact shape:
{
  "coach_message": "2-3 short sentences. Affirm the intent, call out what is vague or strong, and explain the sharper version.",
  "refined_action": "One concise rewritten action item.",
  "is_measurable": true
}

Rules:
- If the original is already strong, keep the rewritten version close to it.
- Prefer observable outcomes, counts, durations, or deadlines.
- Avoid corporate fluff.
- Avoid quotation marks around the rewritten action.
- Make the rewritten action a single sentence.`;

    const priorActionsText =
      previous_actions.length > 0
        ? previous_actions.map((action, index) => `${index + 1}. ${action}`).join("\n")
        : "None yet";

    const userPrompt = `Flow name: ${flow_name}
Flow title: ${flow_title || "Untitled"}
Domain: ${domain || "Not specified"}
Previously declared action items:
${priorActionsText}

Original action item:
${action_text.trim()}

Sharpen this action item so it is more measurable and a little deeper, while still sounding like the same person wrote it.`;

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error("AI refinement failed");
    }

    const openAIData = await openAIResponse.json();
    const content = openAIData.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No AI response returned");
    }

    let parsed:
      | {
          coach_message: string;
          refined_action: string;
          is_measurable: boolean;
        }
      | undefined;

    try {
      const jsonMatch =
        content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse refine_flow_action_item response:", error, content);
    }

    const refinedAction = parsed?.refined_action?.trim() || action_text.trim();
    const coachMessage =
      parsed?.coach_message?.trim() ||
      "That has strong intent. I sharpened it so it is easier to measure and easier to win.";
    const isMeasurable =
      typeof parsed?.is_measurable === "boolean"
        ? parsed.is_measurable
        : refinedAction !== action_text.trim();

    return new Response(
      JSON.stringify({
        coach_message: coachMessage,
        refined_action: refinedAction,
        is_measurable: isMeasurable,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unexpected error in refine_flow_action_item:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
