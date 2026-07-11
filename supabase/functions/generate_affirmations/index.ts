// generate_affirmations — ported to the Standard Playbook member app.
// Auth: requireActiveMember replaces the source's verifyRequest + agency/tier
// gates; ownership via theta_targets.user_id. Model: claude-haiku-4-5-20251001.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";
import {
  thetaRowBelongsToActor,
  validateThetaAffirmations,
  validateThetaSessionId,
  validateThetaTargets,
  validateThetaTone,
} from "../theta_audio_state/thetaAudio.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;
    const admin = member.supabase;
    const userId = member.userId;

    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: "AI isn't configured yet (missing ANTHROPIC_API_KEY)" }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    const session = validateThetaSessionId(body.sessionId);
    if (!session.ok) {
      return new Response(JSON.stringify({ error: session.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: savedTarget, error: savedTargetError } = await admin
      .from("theta_targets")
      .select("body, being, balance, business, user_id")
      .eq("session_id", session.value)
      .maybeSingle();
    if (savedTargetError) {
      console.error("Failed to load theta target session", savedTargetError);
      throw new Error("Failed to verify the audio session");
    }
    if (!savedTarget || !thetaRowBelongsToActor(savedTarget, userId)) {
      return new Response(JSON.stringify({ error: "Audio session not found." }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const targetResult = validateThetaTargets(savedTarget);
    if (!targetResult.ok) {
      return new Response(JSON.stringify({ error: targetResult.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const toneResult = validateThetaTone(body.tone);
    if (!toneResult.ok) {
      return new Response(JSON.stringify({ error: toneResult.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const targets = targetResult.value;
    const tone = toneResult.value;

    const toneDescriptions = {
      inspiring: "inspiring and uplifting, focusing on potential and possibility",
      motivational: "motivational and action-oriented, focusing on drive and achievement",
      calm: "calm and peaceful, focusing on inner peace and balance",
      energizing: "energizing and powerful, focusing on strength and vitality"
    };

    const systemPrompt = `You are an expert affirmation writer specializing in theta brainwave meditation scripts.
Generate 5 powerful first-person affirmations for EACH of the 4 life categories based on the user's specific goals.
The tone should be ${toneDescriptions[tone as keyof typeof toneDescriptions]}.

Rules:
- Each affirmation must be in first person ("I am...", "I have...", "I create...")
- Keep affirmations between 10-20 words
- Make them present tense, as if already achieved
- Make them specific to the user's goals
- Each category must have exactly 5 affirmations
- Return ONLY valid JSON with no markdown formatting`;

    const userPrompt = `Generate affirmations for these goals:

BODY (Physical health, fitness, nutrition, energy):
${targets.body || 'General wellness and vitality'}

BEING (Mental health, mindfulness, spiritual practices, personal growth):
${targets.being || 'Inner peace and personal growth'}

BALANCE (Work-life harmony, time management, boundaries, relationships):
${targets.balance || 'Harmony and healthy boundaries'}

BUSINESS (Career goals, income targets, skill development, professional growth):
${targets.business || 'Career success and abundance'}

Return JSON in this exact format:
{
  "body": ["affirmation 1", "affirmation 2", "affirmation 3", "affirmation 4", "affirmation 5"],
  "being": ["affirmation 1", "affirmation 2", "affirmation 3", "affirmation 4", "affirmation 5"],
  "balance": ["affirmation 1", "affirmation 2", "affirmation 3", "affirmation 4", "affirmation 5"],
  "business": ["affirmation 1", "affirmation 2", "affirmation 3", "affirmation 4", "affirmation 5"]
}`;

    console.log('Calling Claude Haiku 4.5 with tone:', tone);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? '';

    let affirmations;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      affirmations = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse affirmations from AI response');
    }

    const affirmationResult = validateThetaAffirmations(affirmations);
    if (!affirmationResult.ok) {
      throw new Error(affirmationResult.error);
    }

    console.log('Successfully generated affirmations');

    return new Response(
      JSON.stringify({ affirmations: affirmationResult.value, tone }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-affirmations function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error generating affirmations'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
