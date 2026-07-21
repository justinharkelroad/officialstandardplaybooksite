// Builds a reviewable Flow Profile draft from a completed guided interview.
// This function never writes flow_profiles; only the member's confirmation RPC does.
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { corsHeaders, createServiceClient } from '../_shared/flow_agent_runtime.ts';
import { getSupabaseServiceKeyCandidates } from '../_shared/supabaseKeys.ts';
import { isProfileFlowSlug, joinedFlowTemplateSlug } from '../_shared/profileFlow.ts';
import {
  FLOW_PROFILE_ROLES,
  FLOW_PROFILE_VALUES,
  normalizeFlowProfileDraft,
  oneToOneProfileDraft,
} from './profileDraft.ts';

const PROFILE_FIELDS = [
  'preferred_name', 'life_roles', 'core_values', 'current_goals',
  'current_challenges', 'peak_state', 'growth_edge', 'overwhelm_response',
  'accountability_style', 'feedback_preference', 'spiritual_beliefs',
  'background_notes',
] as const;
const MAX_RESPONSE_LENGTH = 6000;
const MAX_TOTAL_RESPONSE_LENGTH = 50000;

function getBearerToken(req: Request): string | null {
  return (req.headers.get('Authorization') ?? '').match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? null;
}

function isServiceRequest(req: Request): boolean {
  const bearer = getBearerToken(req);
  return Boolean(bearer && getSupabaseServiceKeyCandidates().includes(bearer));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedResponses(raw: unknown): Record<string, string> {
  if (!isRecord(raw)) return {};
  const allowed = new Set<string>(PROFILE_FIELDS);
  const result: Record<string, string> = {};
  let totalLength = 0;

  for (const [key, value] of Object.entries(raw)) {
    if (!allowed.has(key) || typeof value !== 'string') continue;
    const remaining = MAX_TOTAL_RESPONSE_LENGTH - totalLength;
    if (remaining <= 0) break;
    const bounded = value.slice(0, Math.min(MAX_RESPONSE_LENGTH, remaining));
    result[key] = bounded;
    totalLength += bounded.length;
  }
  return result;
}

serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { error: 'Only POST is supported.' });
  if (!isServiceRequest(req)) return json(401, { error: 'Internal service authorization is required.' });

  let sessionId: string | null = null;
  try {
    const body = await req.json().catch(() => null);
    sessionId = typeof body?.session_id === 'string' && body.session_id.trim()
      ? body.session_id.trim()
      : null;
    if (!sessionId) return json(400, { error: 'session_id is required.' });

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('flow_sessions')
      .select('id,user_id,status,responses_json,agent_metadata,flow_template:flow_templates(slug)')
      .eq('id', sessionId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return json(404, { error: 'Flow session not found.' });

    const slug = joinedFlowTemplateSlug(data.flow_template);
    if (!isProfileFlowSlug(slug)) return json(400, { error: 'This session is not a profile interview.' });
    if (data.status !== 'completed') return json(409, { error: 'The profile interview is not complete.' });

    const metadata = isRecord(data.agent_metadata) ? data.agent_metadata : {};
    if (isRecord(metadata.profile_draft) && Number(metadata.profile_draft_version) === 3) {
      return json(200, { success: true, profile_draft: metadata.profile_draft, cached: true });
    }

    const responses = boundedResponses(data.responses_json);
    const { data: existing, error: existingError } = await supabase
      .from('flow_profiles')
      .select(PROFILE_FIELDS.join(','))
      .eq('user_id', data.user_id)
      .maybeSingle();
    if (existingError) throw existingError;

    const existingProfile = existing as Record<string, unknown> | null;
    const candidate = await extractWithOpenAi(responses, existingProfile);
    const draft = normalizeFlowProfileDraft(candidate, responses, existingProfile, {
      preserveExisting: Boolean(existingProfile),
    });
    const extractedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('flow_sessions')
      .update({
        agent_metadata: {
          ...metadata,
          profile_interview_version: 2,
          profile_draft: draft,
          profile_draft_version: 3,
          profile_draft_at: extractedAt,
        },
      })
      .eq('id', data.id)
      .eq('user_id', data.user_id);
    if (updateError) throw updateError;

    return json(200, { success: true, profile_draft: draft });
  } catch (error) {
    console.error('[extract_flow_profile] failed', {
      session_id: sessionId,
      error_kind: error instanceof Error ? error.name : typeof error,
    });
    return json(200, { success: false, profile_draft: null });
  }
});

async function extractWithOpenAi(
  responses: Record<string, string>,
  existing: Record<string, unknown> | null,
): Promise<unknown> {
  const apiKey = Deno.env.get('OPENAI_API_KEY')?.trim();
  if (!apiKey) return oneToOneProfileDraft(responses, existing, { preserveExisting: Boolean(existing) });

  const properties = {
    preferred_name: { type: ['string', 'null'] },
    life_roles: { type: 'array', items: { type: 'string', enum: FLOW_PROFILE_ROLES } },
    core_values: { type: 'array', items: { type: 'string', enum: FLOW_PROFILE_VALUES } },
    current_goals: { type: ['string', 'null'] },
    current_challenges: { type: ['string', 'null'] },
    peak_state: { type: ['string', 'null'] },
    growth_edge: { type: ['string', 'null'] },
    overwhelm_response: { type: ['string', 'null'] },
    accountability_style: {
      type: ['string', 'null'],
      enum: ['direct_challenge', 'gentle_nudge', 'questions_discover', null],
    },
    feedback_preference: {
      type: ['string', 'null'],
      enum: ['blunt_truth', 'encouragement_then_truth', 'questions_to_discover', null],
    },
    spiritual_beliefs: { type: ['string', 'null'] },
    background_notes: { type: ['string', 'null'] },
  };
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties,
    required: Object.keys(properties),
  };
  const model = Deno.env.get('FLOW_EXTRACT_OPENAI_MODEL')?.trim()
    || Deno.env.get('FLOW_COACH_MODEL')?.trim()
    || 'gpt-5.4-mini';

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          model,
          response_format: { type: 'json_schema', json_schema: { name: 'flow_profile', strict: true, schema } },
          messages: [
            {
              role: 'system',
              content: 'Convert this guided Standard Playbook interview into a faithful first-person profile. Preserve concrete facts, numbers, examples, tensions, and the member\'s depth. Use only the allowed enums. Never invent facts.',
            },
            {
              role: 'user',
              content: JSON.stringify({
                interview_answers: responses,
                existing_profile: existing,
                allowed_roles: FLOW_PROFILE_ROLES,
                allowed_values: FLOW_PROFILE_VALUES,
              }),
            },
          ],
          max_completion_tokens: 3000,
        }),
      });
      if (!response.ok) continue;
      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || !content.trim() || content.length > 60000) continue;
      return JSON.parse(content);
    } catch {
      // Retry once, then use the deterministic evidence-preserving fallback.
    }
  }

  return oneToOneProfileDraft(responses, existing, { preserveExisting: Boolean(existing) });
}

function json(status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
