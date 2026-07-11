import { BibleScriptureContext } from '@/app/lib/flowAgentApi';

// The `resolve_bible_scripture` edge function is not deployed in this project.
// Lookup and recommendation fail soft with a clear message; manual paste
// (buildUserProvidedBibleScripture) remains the supported path for the Bible flow.
const SCRIPTURE_LOOKUP_UNAVAILABLE_MESSAGE =
  'Scripture lookup is not available yet. Paste the passage text instead.';

export interface ResolveBibleScriptureArgs {
  mode: 'lookup_reference' | 'recommend_from_context';
  reference?: string;
  userContext?: string;
  preferredBibleId?: string;
  maxResults?: number;
  excludeReferences?: string[];
}

export async function resolveBibleScripture(
  _args: ResolveBibleScriptureArgs,
): Promise<BibleScriptureContext> {
  throw new Error(SCRIPTURE_LOOKUP_UNAVAILABLE_MESSAGE);
}

export async function recommendBibleScriptures(
  _args: Omit<ResolveBibleScriptureArgs, 'mode' | 'reference'>,
): Promise<{
  recommendations: BibleScriptureContext[];
  responseMessage?: string;
  safetyMessage?: string;
}> {
  throw new Error(SCRIPTURE_LOOKUP_UNAVAILABLE_MESSAGE);
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
