import { supabase } from '@/app/lib/supabaseClient';
import { BibleScriptureContext } from '@/app/lib/flowAgentApi';
import { getSupabaseFunctionErrorMessage } from '@/app/lib/supabaseFunctionErrors';

export interface ResolveBibleScriptureArgs {
  mode: 'lookup_reference' | 'recommend_from_context';
  reference?: string;
  userContext?: string;
  preferredBibleId?: string;
  maxResults?: number;
  excludeReferences?: string[];
  staffSessionToken?: string | null;
}

interface ResolveBibleScriptureResponse {
  scripture?: BibleScriptureContext;
  recommendations?: BibleScriptureContext[];
  response_message?: string | null;
  safety_message?: string;
  error?: {
    message?: string;
  } | string;
}

export async function resolveBibleScripture({
  mode,
  reference,
  userContext,
  preferredBibleId,
  maxResults,
  staffSessionToken,
}: ResolveBibleScriptureArgs): Promise<BibleScriptureContext> {
  const { data, error } = await supabase.functions.invoke(
    'resolve_bible_scripture',
    {
      headers: staffSessionToken ? { 'x-staff-session': staffSessionToken } : undefined,
      body: {
        mode,
        reference,
        user_context: userContext,
        preferred_bible_id: preferredBibleId,
        max_results: maxResults,
      },
    },
  ) as { data: ResolveBibleScriptureResponse | null; error: unknown };

  if (error) {
    throw new Error(await getSupabaseFunctionErrorMessage(error, {
      fallbackMessage: 'Unable to look up Scripture right now.',
    }));
  }

  if (!data?.scripture) {
    const fallbackMessage =
      typeof data?.error === 'string'
        ? data.error
        : data?.error?.message;
    throw new Error(fallbackMessage || 'Unable to verify that Scripture reference.');
  }

  return data.scripture;
}

export async function recommendBibleScriptures({
  userContext,
  preferredBibleId,
  maxResults = 3,
  excludeReferences,
  staffSessionToken,
}: Omit<ResolveBibleScriptureArgs, 'mode' | 'reference'>): Promise<{
  recommendations: BibleScriptureContext[];
  responseMessage?: string;
  safetyMessage?: string;
}> {
  const { data, error } = await supabase.functions.invoke(
    'resolve_bible_scripture',
    {
      headers: staffSessionToken ? { 'x-staff-session': staffSessionToken } : undefined,
      body: {
        mode: 'recommend_from_context',
        user_context: userContext,
        preferred_bible_id: preferredBibleId,
        max_results: maxResults,
        exclude_references: excludeReferences,
      },
    },
  ) as { data: ResolveBibleScriptureResponse | null; error: unknown };

  if (error) {
    throw new Error(await getSupabaseFunctionErrorMessage(error, {
      fallbackMessage: 'Unable to find Scripture recommendations right now.',
    }));
  }

  return {
    recommendations: data?.recommendations ?? [],
    responseMessage: data?.response_message ?? undefined,
    safetyMessage: data?.safety_message,
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
