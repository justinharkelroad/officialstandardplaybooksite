import { BibleScriptureContext } from '@/app/lib/flowAgentApi';
import { supabase } from '@/integrations/supabase/client';

// Backed by the `resolve_bible_scripture` edge function (API.Bible for the
// passage text, OpenAI for the recommend-from-context path). Manual paste
// (buildUserProvidedBibleScripture) remains a first-class alternative.
const SCRIPTURE_LOOKUP_FAILED_MESSAGE =
  'Scripture lookup failed. Paste the passage text instead.';

export interface ResolveBibleScriptureArgs {
  mode: 'lookup_reference' | 'recommend_from_context';
  reference?: string;
  userContext?: string;
  preferredBibleId?: string;
  maxResults?: number;
  excludeReferences?: string[];
}

interface ResolveResponse {
  mode?: string;
  scripture?: BibleScriptureContext;
  recommendations?: BibleScriptureContext[];
  response_message?: string;
  safety_message?: string;
}

/** Surface the function's own message when it sent one -- it explains *why*. */
async function invokeResolve(body: Record<string, unknown>): Promise<ResolveResponse> {
  const { data, error } = await supabase.functions.invoke<ResolveResponse>(
    'resolve_bible_scripture',
    { body },
  );

  if (error) {
    // FunctionsHttpError carries the response; the function returns
    // { error: { message } } on failure, which is more useful than "non-2xx".
    let message: string | null = null;
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === 'function') {
      try {
        const parsed = await context.json();
        message = parsed?.error?.message ?? parsed?.error ?? parsed?.message ?? null;
      } catch {
        message = null;
      }
    }
    throw new Error(message || error.message || SCRIPTURE_LOOKUP_FAILED_MESSAGE);
  }

  if (!data) throw new Error(SCRIPTURE_LOOKUP_FAILED_MESSAGE);
  return data;
}

export async function resolveBibleScripture(
  args: ResolveBibleScriptureArgs,
): Promise<BibleScriptureContext> {
  const data = await invokeResolve({
    mode: 'lookup_reference',
    reference: args.reference,
    preferred_bible_id: args.preferredBibleId,
  });

  if (!data.scripture) throw new Error(SCRIPTURE_LOOKUP_FAILED_MESSAGE);
  return data.scripture;
}

export async function recommendBibleScriptures(
  args: Omit<ResolveBibleScriptureArgs, 'mode' | 'reference'>,
): Promise<{
  recommendations: BibleScriptureContext[];
  responseMessage?: string;
  safetyMessage?: string;
}> {
  const data = await invokeResolve({
    mode: 'recommend_from_context',
    user_context: args.userContext,
    preferred_bible_id: args.preferredBibleId,
    max_results: args.maxResults,
    exclude_references: args.excludeReferences,
  });

  return {
    recommendations: data.recommendations ?? [],
    responseMessage: data.response_message,
    // Crisis-language guard: the function returns a safety message and zero
    // recommendations. The caller must show this rather than an empty state.
    safetyMessage: data.safety_message,
  };
}

export function buildUserProvidedBibleScripture(content: string): BibleScriptureContext {
  return {
    source: 'user_provided',
    content,
    reference: null,
    translation_name: null,
    bible_id: null,
    passage_id: null,
    copyright: null,
    content_cached_at: new Date().toISOString(),
    content_cache_policy: 'user_provided_text',
  };
}
