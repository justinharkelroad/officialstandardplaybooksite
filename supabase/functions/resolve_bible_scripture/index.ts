// resolve_bible_scripture -- ported to the Standard Playbook member app.
// Auth: requireActiveMember (Supabase JWT + ACTIVE members row) replaces the
// source platform's verifyRequest. No other changes: the API.Bible lookup,
// the OpenAI recommendation path, and the crisis-language guard are unchanged.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  errorResponse,
  jsonResponse,
  methodNotAllowed,
  parseJsonBody,
} from "../_shared/flow_agent_runtime.ts";
import {
  buildApiBibleVerseId,
  extractSingleVerseFromPassageContent,
  isSingleVerseReference,
  selectBibleSearchCandidate,
} from "../_shared/bibleSearch.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";

type ResolveMode = "lookup_reference" | "recommend_from_context";

type RequestBody = {
  mode?: unknown;
  reference?: unknown;
  user_context?: unknown;
  preferred_bible_id?: unknown;
  max_results?: unknown;
  exclude_references?: unknown;
};

type ApiBiblePassage = {
  id?: string;
  bibleId?: string;
  content?: string;
  reference?: string;
  copyright?: string;
  verseCount?: number;
};

type ApiBibleSearchResponse = {
  data?: {
    passages?: ApiBiblePassage[];
    verses?: Array<{
      id?: string;
      reference?: string;
      text?: string;
      content?: string;
      copyright?: string;
    }>;
  };
};

type ApiBibleVerseResponse = {
  data?: ApiBiblePassage;
};

type ApiBibleInfoResponse = {
  data?: {
    id?: string;
    name?: string;
    nameLocal?: string;
    abbreviation?: string;
    abbreviationLocal?: string;
  };
};

type ThemeKey =
  | "anxiety"
  | "fear"
  | "overwhelm"
  | "grief"
  | "shame"
  | "identity"
  | "wisdom"
  | "provision"
  | "patience"
  | "anger"
  | "forgiveness"
  | "loneliness"
  | "gratitude"
  | "courage"
  | "relationships"
  | "work";

type BibleScriptureResult = ReturnType<typeof normalizeApiBiblePassage> & {
  reason?: string | null;
  user_context?: string | null;
  tags?: string[];
};

type RecommendationCopy = {
  intro: string | null;
  reasons: Record<string, string>;
};

const DEFAULT_BIBLE_ID = "6f11a7de016f942e-01";
const DEFAULT_API_BIBLE_BASE_URL = "https://rest.api.bible/v1";
const MAX_RECOMMENDATIONS = 5;
const CRISIS_PATTERN =
  /\b(kill myself|suicide|end my life|hurt myself|self harm|self-harm|don't want to live|do not want to live)\b/i;

const THEME_REFERENCES: Record<ThemeKey, string[]> = {
  anxiety: ["Matthew 6:25-34", "Philippians 4:6-7", "1 Peter 5:7", "Psalm 55:22"],
  fear: ["Isaiah 41:10", "Psalm 23:4", "2 Timothy 1:7", "John 14:27"],
  overwhelm: ["Matthew 11:28-30", "Psalm 46:10", "Isaiah 40:29-31", "Psalm 61:2"],
  grief: ["Psalm 34:18", "Matthew 5:4", "2 Corinthians 1:3-4", "Revelation 21:4"],
  shame: ["Romans 8:1", "Psalm 103:10-12", "1 John 1:9", "Isaiah 43:1"],
  identity: ["Psalm 139:13-16", "Ephesians 2:10", "1 Peter 2:9", "Romans 8:15-16"],
  wisdom: ["James 1:5", "Proverbs 3:5-6", "Psalm 32:8", "Proverbs 2:6"],
  provision: ["Matthew 6:31-34", "Psalm 23:1", "Philippians 4:19", "Psalm 37:25"],
  patience: ["Galatians 6:9", "James 1:2-4", "Isaiah 40:31", "Romans 5:3-5"],
  anger: ["James 1:19-20", "Proverbs 15:1", "Ephesians 4:26-27", "Psalm 4:4"],
  forgiveness: ["Colossians 3:13", "Ephesians 4:32", "Matthew 18:21-22", "Psalm 86:5"],
  loneliness: ["Hebrews 13:5", "Psalm 139:7-10", "Psalm 68:5-6", "John 14:18"],
  gratitude: ["1 Thessalonians 5:16-18", "Psalm 100", "Colossians 3:15-17", "Psalm 103:1-5"],
  courage: ["Joshua 1:9", "Deuteronomy 31:6", "Psalm 27:1", "1 Corinthians 16:13-14"],
  relationships: ["Romans 12:9-18", "Ephesians 4:29-32", "Colossians 3:12-14", "Proverbs 15:1"],
  work: ["Colossians 3:23-24", "Proverbs 16:3", "Galatians 6:9", "Psalm 90:17"],
};

const THEME_REASON: Record<ThemeKey, string> = {
  anxiety: "This passage may speak to anxiety, attention, peace, and returning to what can be carried today.",
  fear: "This passage may help you reflect on courage, God's nearness, and fear losing the final word.",
  overwhelm: "This passage may fit when your heart feels crowded, tired, or beyond its own strength.",
  grief: "This passage may speak gently to sorrow, comfort, and the promise that pain is seen.",
  shame: "This passage may help you reflect on mercy, forgiveness, and identity beyond failure.",
  identity: "This passage may speak to being known, chosen, formed, and given purpose.",
  wisdom: "This passage may fit a moment where clarity, direction, or discernment is needed.",
  provision: "This passage may speak to trust, need, daily provision, and releasing the pressure to control everything.",
  patience: "This passage may help you reflect on endurance, waiting well, and continuing without giving up.",
  anger: "This passage may fit when emotions are hot and the next faithful step is restraint or gentleness.",
  forgiveness: "This passage may help you reflect on mercy, release, and the hard work of forgiving.",
  loneliness: "This passage may speak to presence, belonging, and not being abandoned.",
  gratitude: "This passage may help you turn attention toward worship, thanks, and remembered goodness.",
  courage: "This passage may fit when obedience, bravery, or a hard next step is in front of you.",
  relationships: "This passage may help you reflect on humility, repair, patience, and how to move toward people with grace.",
  work: "This passage may fit when your responsibilities, effort, or daily work need to be brought back into focus.",
};

const THEME_KEYWORDS: Record<ThemeKey, string[]> = {
  anxiety: ["anxious", "anxiety", "worry", "worried", "stress", "stressed", "panic", "nervous"],
  fear: ["fear", "afraid", "scared", "terrified", "unsafe"],
  overwhelm: ["overwhelmed", "overload", "exhausted", "burned out", "burnt out", "too much", "tired"],
  grief: ["grief", "grieving", "loss", "lost", "mourning", "sad", "heartbroken"],
  shame: ["shame", "ashamed", "guilt", "guilty", "failed", "failure", "regret"],
  identity: ["identity", "worth", "purpose", "behind", "comparison", "compare", "enough"],
  wisdom: ["wisdom", "decision", "decide", "clarity", "direction", "discern", "discernment"],
  provision: ["money", "provision", "bills", "financial", "finances", "job", "income"],
  patience: ["waiting", "wait", "patience", "delay", "slow", "stuck"],
  anger: ["angry", "anger", "mad", "resent", "resentment", "frustrated"],
  forgiveness: ["forgive", "forgiveness", "bitter", "bitterness", "hurt me"],
  loneliness: ["lonely", "alone", "isolated", "unseen", "forgotten"],
  gratitude: ["grateful", "gratitude", "thankful", "thanks", "blessing"],
  courage: ["courage", "brave", "bold", "hard thing", "step out"],
  relationships: ["marriage", "spouse", "wife", "husband", "friend", "relationship", "family", "parent", "kid", "coworker", "conflict"],
  work: ["work", "career", "business", "agency", "team", "client", "customer", "boss", "employee", "performance"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") return methodNotAllowed();

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;

    const body = await parseJsonBody<RequestBody>(req);
    const mode = normalizeMode(body?.mode);
    if (!mode) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "mode must be lookup_reference or recommend_from_context.",
      );
    }

    const apiKey = Deno.env.get("API_BIBLE_API_KEY");
    if (!apiKey) {
      return errorResponse(
        503,
        "INTERNAL_ERROR",
        "Bible lookup is not configured yet.",
      );
    }

    const bibleId = getTrimmedString(body?.preferred_bible_id) ??
      Deno.env.get("API_BIBLE_DEFAULT_BIBLE_ID") ??
      DEFAULT_BIBLE_ID;
    const baseUrl = (Deno.env.get("API_BIBLE_BASE_URL") ??
      DEFAULT_API_BIBLE_BASE_URL).replace(/\/$/, "");

    if (mode === "recommend_from_context") {
      const userContext = getTrimmedString(body?.user_context);
      if (!userContext) {
        return errorResponse(400, "INVALID_REQUEST", "user_context is required.");
      }
      if (CRISIS_PATTERN.test(userContext)) {
        return jsonResponse(200, {
          mode,
          safety_message:
            "If you may hurt yourself or feel in immediate danger, call 988 in the U.S. or local emergency services now. Scripture can support you, but please reach a live person first.",
          recommendations: [],
        });
      }

      const recommendationResult = await recommendFromContext(
        baseUrl,
        apiKey,
        bibleId,
        userContext,
        normalizeMaxResults(body?.max_results),
        normalizeReferenceList(body?.exclude_references),
      );

      return jsonResponse(200, {
        mode,
        response_message: recommendationResult.responseMessage,
        recommendations: recommendationResult.recommendations,
      });
    }

    const reference = getTrimmedString(body?.reference);
    if (!reference) {
      return errorResponse(400, "INVALID_REQUEST", "reference is required.");
    }

    const result = await lookupReference(baseUrl, apiKey, bibleId, reference);

    return jsonResponse(200, {
      mode,
      scripture: result,
    });
  } catch (error) {
    if (error instanceof ApiBibleUserError) {
      return errorResponse(error.status, "INVALID_REQUEST", error.message);
    }

    console.error("[resolve_bible_scripture] failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "Unable to resolve Bible scripture.",
    );
  }
});

async function recommendFromContext(
  baseUrl: string,
  apiKey: string,
  bibleId: string,
  userContext: string,
  maxResults: number,
  excludeReferences: string[],
): Promise<{
  responseMessage: string | null;
  recommendations: BibleScriptureResult[];
}> {
  // Primary path: let the model choose real passages from across the whole
  // Bible that authentically fit THIS person's situation. Every proposed
  // reference is then verified against API.Bible before it can be shown
  // (fail-closed) — an invented or misremembered reference never reaches a
  // user. The curated theme table (recommendFromThemes) remains only as a
  // safety net when OpenAI is unavailable or returns nothing verifiable.
  const openAiKey = Deno.env.get("OPENAI_API_KEY");
  if (openAiKey) {
    const modelResult = await recommendFromModel(
      baseUrl,
      apiKey,
      bibleId,
      userContext,
      maxResults,
      excludeReferences,
      openAiKey,
    );
    if (modelResult && modelResult.recommendations.length) {
      return modelResult;
    }
  }

  return recommendFromThemes(
    baseUrl,
    apiKey,
    bibleId,
    userContext,
    maxResults,
    excludeReferences,
  );
}

async function recommendFromModel(
  baseUrl: string,
  apiKey: string,
  bibleId: string,
  userContext: string,
  maxResults: number,
  excludeReferences: string[],
  openAiKey: string,
): Promise<
  { responseMessage: string | null; recommendations: BibleScriptureResult[] } | null
> {
  const proposed = await proposeReferencesWithOpenAI(
    openAiKey,
    userContext,
    excludeReferences,
    maxResults,
  ).catch((error) => {
    console.warn("[resolve_bible_scripture] model reference proposal failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [] as string[];
  });

  if (!proposed.length) return null;

  const excluded = new Set(excludeReferences.map(normalizeReferenceKey));
  const seen = new Set<string>();
  const recommendations: BibleScriptureResult[] = [];

  for (const reference of proposed) {
    const key = normalizeReferenceKey(reference);
    if (!key || excluded.has(key) || seen.has(key)) continue;
    seen.add(key);

    try {
      const scripture = await lookupReference(baseUrl, apiKey, bibleId, reference) as BibleScriptureResult;
      recommendations.push({
        ...scripture,
        reason: null,
        user_context: userContext,
        tags: ["personalized"],
      });
    } catch (error) {
      // 404 = the model proposed a reference that does not verify; skip it.
      // Auth/rate-limit errors are fatal for the whole request — surface them
      // rather than silently falling back into a second wave of API calls.
      if (
        error instanceof ApiBibleUserError &&
        (error.status === 401 || error.status === 403 || error.status === 429)
      ) {
        throw error;
      }
      console.warn("[resolve_bible_scripture] model reference failed validation", {
        reference,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (recommendations.length >= maxResults) break;
  }

  if (!recommendations.length) return null;

  // Ground the intro + per-passage reason in the REAL verified verse text,
  // not the model's recollection of it.
  const personalizedCopy = await personalizeRecommendations(userContext, recommendations)
    .catch((error) => {
      console.warn("[resolve_bible_scripture] recommendation copy failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    });

  return {
    responseMessage: personalizedCopy?.intro ?? buildFallbackRecommendationIntro([]),
    recommendations: recommendations.map((recommendation) => ({
      ...recommendation,
      reason: getPersonalizedReason(personalizedCopy?.reasons, recommendation) ??
        recommendation.reason,
    })),
  };
}

async function proposeReferencesWithOpenAI(
  apiKey: string,
  userContext: string,
  excludeReferences: string[],
  maxResults: number,
): Promise<string[]> {
  const desired = Math.max(1, Math.min(MAX_RECOMMENDATIONS, maxResults));
  const overfetch = Math.min(10, desired * 2 + 2);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("BIBLE_FLOW_REFERENCE_MODEL") ??
        Deno.env.get("BIBLE_FLOW_THEME_MODEL") ??
        "gpt-5.4-mini",
      reasoning_effort: "low",
      max_completion_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You select real Bible passages that authentically fit a person's stated situation, for personal reflection. Choose passages from across the whole Protestant canon (Genesis to Revelation) that genuinely speak to what they shared — pastoral fit over cliche. Vary your choices; do not default to the most over-quoted verses. Every reference MUST be a real passage that exists exactly as written. Use full English book names and standard formatting like \"Matthew 6:25-34\" or \"Psalm 23:1-4\". Do NOT invent references, do NOT include any verse text, do NOT use apocryphal/deuterocanonical books. Order best-fit first. Return ONLY JSON: {\"references\":[\"Book chapter:verse\"]}.",
        },
        {
          role: "user",
          content: JSON.stringify({
            user_context: userContext,
            avoid_references: excludeReferences,
            count: overfetch,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI reference proposal failed: ${response.status}`);
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return [];

  const parsed = parseJson<{ references?: unknown }>(content) ??
    parseJson<{ references?: unknown }>(
      content.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim(),
    );
  if (!Array.isArray(parsed?.references)) return [];

  return uniqueStrings(
    parsed.references
      .map((reference) => typeof reference === "string" ? reference.trim() : "")
      .filter((reference) => reference.length > 0),
  ).slice(0, overfetch);
}

async function recommendFromThemes(
  baseUrl: string,
  apiKey: string,
  bibleId: string,
  userContext: string,
  maxResults: number,
  excludeReferences: string[],
): Promise<{
  responseMessage: string | null;
  recommendations: BibleScriptureResult[];
}> {
  const themes = await classifyThemes(userContext);
  const excluded = new Set(excludeReferences.map(normalizeReferenceKey));
  const references = uniqueStrings(
    themes.flatMap((theme) => THEME_REFERENCES[theme] ?? []),
  ).slice(0, Math.max(maxResults * 2, maxResults));
  const preferredReferences = references.length > 0
    ? references
    : THEME_REFERENCES.wisdom;
  const backupReferences = uniqueStrings(
    Object.values(THEME_REFERENCES).flat(),
  );
  const selectedReferences = [
    ...preferredReferences.filter((reference) => !excluded.has(normalizeReferenceKey(reference))),
    ...backupReferences.filter((reference) =>
      !excluded.has(normalizeReferenceKey(reference)) &&
      !preferredReferences.includes(reference)
    ),
  ];
  const referencesToTry = selectedReferences.length > 0
    ? selectedReferences
    : preferredReferences;
  const recommendations: BibleScriptureResult[] = [];

  for (const reference of referencesToTry) {
    try {
      const scripture = await lookupReference(baseUrl, apiKey, bibleId, reference) as BibleScriptureResult;
      const theme = themes.find((candidate) =>
        THEME_REFERENCES[candidate]?.includes(reference)
      ) ?? "wisdom";
      recommendations.push({
        ...scripture,
        reason: THEME_REASON[theme],
        user_context: userContext,
        tags: [theme],
      });
    } catch (error) {
      console.warn("[resolve_bible_scripture] skipped recommendation", {
        reference,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (recommendations.length >= maxResults) break;
  }

  if (!recommendations.length) {
    throw new ApiBibleUserError(
      404,
      "I could not load verified Scripture recommendations right now. Try a specific reference instead.",
    );
  }

  const personalizedCopy = await personalizeRecommendations(userContext, recommendations)
    .catch((error) => {
      console.warn("[resolve_bible_scripture] recommendation copy failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    });

  return {
    responseMessage: personalizedCopy?.intro ??
      buildFallbackRecommendationIntro(themes),
    recommendations: recommendations.map((recommendation) => ({
      ...recommendation,
      reason: getPersonalizedReason(
        personalizedCopy?.reasons,
        recommendation,
      ) ?? recommendation.reason,
    })),
  };
}

async function personalizeRecommendations(
  userContext: string,
  recommendations: BibleScriptureResult[],
): Promise<RecommendationCopy | null> {
  const openAiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openAiKey) return null;

  const references = recommendations
    .map((recommendation) => recommendation.reference)
    .filter((reference): reference is string => typeof reference === "string" && reference.length > 0);

  if (!references.length) return null;

  const passages = recommendations
    .filter((recommendation): recommendation is BibleScriptureResult & { reference: string } =>
      typeof recommendation.reference === "string" && recommendation.reference.length > 0)
    .map((recommendation) => ({
      reference: recommendation.reference,
      text: typeof recommendation.content === "string"
        ? recommendation.content.replace(/\s+/g, " ").trim().slice(0, 320)
        : "",
    }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("BIBLE_FLOW_RESPONSE_MODEL") ??
        Deno.env.get("BIBLE_FLOW_THEME_MODEL") ??
        "gpt-5.4-mini",
      reasoning_effort: "low",
      max_completion_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You help a user choose a verified Bible passage for reflection. You are given the user's situation and the ACTUAL text of each verified passage. Acknowledge their stated emotion or struggle with warmth, directness, and restraint. Ground each reason in what that specific passage actually says, but do NOT quote, paraphrase, or summarize the verse wording itself. Do not diagnose, over-spiritualize, preach, invent Scripture, or say God is telling them something. Use language like \"this passage may speak to\" or \"this may help you reflect on.\" Keep the intro specific to what they shared. Keep each reason distinct and true to its passage. Return only JSON with this shape: {\"intro\":\"one brief empathetic paragraph, max 55 words\",\"reasons\":[\"one sentence, max 32 words\"]}. The reasons array MUST contain exactly one entry per passage, in the SAME ORDER as the passages you were given.",
        },
        {
          role: "user",
          content: JSON.stringify({
            user_context: userContext,
            passages,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI recommendation copy failed: ${response.status}`);
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return null;

  const parsed = parseJson<{ intro?: unknown; reasons?: unknown }>(content) ??
    parseJson<{ intro?: unknown; reasons?: unknown }>(
      content.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim(),
    );
  if (!parsed) return null;

  const intro = sanitizeRecommendationText(parsed.intro, 360);
  const reasons: Record<string, string> = {};
  if (Array.isArray(parsed.reasons)) {
    // Primary path: reasons arrive in passage order, mapped by index. This
    // never depends on the model echoing the reference string verbatim —
    // which it does not do reliably for ranges (en-dash vs hyphen, etc.),
    // the cause of only the first passage getting a blurb.
    const reasonList = parsed.reasons as unknown[];
    references.forEach((reference, index) => {
      const reason = sanitizeRecommendationText(reasonList[index], 260);
      if (reason) reasons[reference] = reason;
    });
  } else if (parsed.reasons && typeof parsed.reasons === "object") {
    // Fallback: keyed object. Match on a normalized reference key so minor
    // formatting differences still resolve instead of silently dropping.
    const byNormalizedKey = new Map<string, unknown>();
    for (const [key, value] of Object.entries(parsed.reasons as Record<string, unknown>)) {
      byNormalizedKey.set(normalizeReferenceKey(key), value);
    }
    for (const reference of references) {
      const raw = (parsed.reasons as Record<string, unknown>)[reference] ??
        byNormalizedKey.get(normalizeReferenceKey(reference));
      const reason = sanitizeRecommendationText(raw, 260);
      if (reason) reasons[reference] = reason;
    }
  }

  return intro || Object.keys(reasons).length ? { intro, reasons } : null;
}

async function classifyThemes(userContext: string): Promise<ThemeKey[]> {
  const openAiKey = Deno.env.get("OPENAI_API_KEY");
  if (openAiKey) {
    const aiThemes = await classifyThemesWithOpenAI(openAiKey, userContext).catch((error) => {
      console.warn("[resolve_bible_scripture] theme classifier failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    });
    if (aiThemes.length) return aiThemes;
  }

  const normalized = userContext.toLowerCase();
  const scored = (Object.entries(THEME_KEYWORDS) as Array<[ThemeKey, string[]]>)
    .map(([theme, keywords]) => ({
      theme,
      score: keywords.reduce((total, keyword) =>
        normalized.includes(keyword) ? total + 1 : total, 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.theme);

  return scored.length ? scored.slice(0, 3) : ["wisdom", "overwhelm"];
}

async function classifyThemesWithOpenAI(
  apiKey: string,
  userContext: string,
): Promise<ThemeKey[]> {
  const allowedThemes = Object.keys(THEME_REFERENCES) as ThemeKey[];
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("BIBLE_FLOW_THEME_MODEL") ?? "gpt-5.4-mini",
      reasoning_effort: "low",
      max_completion_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `Classify the user's spiritual/emotional context into 1-3 themes. Allowed themes: ${allowedThemes.join(", ")}. Return only JSON: {"themes":["theme"]}.`,
        },
        {
          role: "user",
          content: userContext,
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI theme classification failed: ${response.status}`);
  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return [];

  const parsed = parseJson<{ themes?: unknown }>(content) ??
    parseJson<{ themes?: unknown }>(
      content.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim(),
    );
  if (!Array.isArray(parsed?.themes)) return [];

  return uniqueStrings(parsed.themes.filter((theme): theme is ThemeKey =>
    typeof theme === "string" && allowedThemes.includes(theme as ThemeKey)
  )).slice(0, 3) as ThemeKey[];
}

async function lookupReference(
  baseUrl: string,
  apiKey: string,
  bibleId: string,
  reference: string,
) {
  const searchUrl = new URL(`${baseUrl}/bibles/${encodeURIComponent(bibleId)}/search`);
  searchUrl.searchParams.set("query", reference);
  searchUrl.searchParams.set("offset", "0");

  const response = await fetch(searchUrl, {
    headers: {
      "api-key": apiKey,
    },
  });

  const bodyText = await response.text();
  const body = parseJson<ApiBibleSearchResponse>(bodyText);

  if (!response.ok) {
    console.error("[resolve_bible_scripture] API.Bible search failed", {
      status: response.status,
      body: scrubApiError(bodyText),
    });
    if (response.status === 401 || response.status === 403) {
      return Promise.reject(new ApiBibleUserError(
        response.status,
        "This Bible translation is not available for the configured API.Bible account.",
      ));
    }
    if (response.status === 429) {
      return Promise.reject(new ApiBibleUserError(
        429,
        "Bible lookup is temporarily rate limited. Try again in a moment.",
      ));
    }
    return Promise.reject(new Error(`API.Bible search failed: ${response.status}`));
  }

  const bibleInfo = await fetchBibleInfo(baseUrl, apiKey, bibleId).catch(() => null);
  const translationName = bibleInfo?.nameLocal ?? bibleInfo?.name ??
    bibleInfo?.abbreviationLocal ?? bibleInfo?.abbreviation ?? null;

  const candidate = selectBibleSearchCandidate(body?.data, reference);
  if (candidate?.kind === "passage") {
    return normalizeApiBiblePassage(candidate.value, bibleId, translationName);
  }

  if (candidate?.kind === "verse") {
    const verse = candidate.value;
    return {
      source: "api_bible",
      reference: verse.reference ?? reference,
      bible_id: bibleId,
      translation_name: translationName,
      passage_id: verse.id ?? null,
      content: normalizeBibleContent(verse.text ?? verse.content ?? ""),
      copyright: normalizeBibleContent(verse.copyright ?? ""),
      content_cached_at: new Date().toISOString(),
      content_cache_policy: "session_display_only_until_license_confirmed",
    };
  }

  if (isSingleVerseReference(reference)) {
    const exactVerse = await fetchExactVerse(
      baseUrl,
      apiKey,
      bibleId,
      body?.data?.passages,
      reference,
    );
    if (exactVerse) {
      return normalizeApiBiblePassage(exactVerse, bibleId, translationName);
    }

    for (const passage of body?.data?.passages ?? []) {
      const verseContent = extractSingleVerseFromPassageContent(
        passage.content ?? "",
        reference,
      );
      if (verseContent) {
        return normalizeApiBiblePassage({
          ...passage,
          reference,
          content: verseContent,
          verseCount: 1,
        }, bibleId, translationName);
      }
    }
  }

  throw new ApiBibleUserError(
    404,
    "I could not verify that exact reference in this translation. Try a format like John 3:16, choose a passage range, or paste the verse text.",
  );
}

async function fetchExactVerse(
  baseUrl: string,
  apiKey: string,
  bibleId: string,
  passages: ApiBiblePassage[] | undefined,
  reference: string,
): Promise<ApiBiblePassage | null> {
  const verseId = buildApiBibleVerseId(passages, reference);
  if (!verseId) return null;

  const verseUrl = new URL(
    `${baseUrl}/bibles/${encodeURIComponent(bibleId)}/verses/${encodeURIComponent(verseId)}`,
  );
  verseUrl.searchParams.set("content-type", "html");
  verseUrl.searchParams.set("include-notes", "false");
  verseUrl.searchParams.set("include-titles", "false");
  verseUrl.searchParams.set("include-chapter-numbers", "false");
  verseUrl.searchParams.set("include-verse-numbers", "false");

  const response = await fetch(verseUrl, {
    headers: {
      "api-key": apiKey,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new ApiBibleUserError(
        429,
        "Bible lookup is temporarily rate limited. Try again in a moment.",
      );
    }
    console.warn("[resolve_bible_scripture] exact verse lookup failed", {
      status: response.status,
      verseId,
    });
    return null;
  }

  const body = await response.json() as ApiBibleVerseResponse;
  if (!body.data?.content) return null;

  return {
    ...body.data,
    reference,
    verseCount: 1,
  };
}

async function fetchBibleInfo(
  baseUrl: string,
  apiKey: string,
  bibleId: string,
): Promise<ApiBibleInfoResponse["data"] | null> {
  const response = await fetch(`${baseUrl}/bibles/${encodeURIComponent(bibleId)}`, {
    headers: {
      "api-key": apiKey,
    },
  });

  if (!response.ok) return null;
  const body = await response.json() as ApiBibleInfoResponse;
  return body.data ?? null;
}

function normalizeApiBiblePassage(
  passage: ApiBiblePassage,
  fallbackBibleId: string,
  translationName: string | null,
) {
  return {
    source: "api_bible",
    reference: passage.reference ?? null,
    bible_id: passage.bibleId ?? fallbackBibleId,
    translation_name: translationName,
    passage_id: passage.id ?? null,
    content: normalizeBibleContent(passage.content ?? ""),
    copyright: normalizeBibleContent(passage.copyright ?? ""),
    verse_count: passage.verseCount ?? null,
    content_cached_at: new Date().toISOString(),
    content_cache_policy: "session_display_only_until_license_confirmed",
  };
}

function normalizeMode(value: unknown): ResolveMode | null {
  if (value === "lookup_reference" || value === "recommend_from_context") {
    return value;
  }
  return null;
}

function normalizeMaxResults(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(MAX_RECOMMENDATIONS, Math.floor(value)));
}

function normalizeReferenceList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(
    value
      .map((item) => typeof item === "string" ? item.trim() : "")
      .filter((item) => item.length > 0),
  ).slice(0, 20);
}

function normalizeReferenceKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getTrimmedString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function uniqueStrings<T extends string>(values: T[]): T[] {
  return [...new Set(values)];
}

function buildFallbackRecommendationIntro(themes: ThemeKey[]): string {
  if (themes.includes("anxiety") || themes.includes("overwhelm")) {
    return "That sounds like a lot to carry. These passages may help you slow down, name what is weighing on you, and bring today's pressure into prayer.";
  }
  if (themes.includes("grief")) {
    return "That sounds tender and heavy. These passages may give you space to be honest about sorrow while reflecting on comfort and nearness.";
  }
  if (themes.includes("wisdom")) {
    return "It makes sense to want clarity before you move forward. These passages may help you reflect on direction, trust, and the next faithful step.";
  }
  return "Thank you for naming what you are carrying. These passages may help you pause, reflect, and choose one Scripture to flow through today.";
}

function getPersonalizedReason(
  reasons: Record<string, string> | undefined,
  recommendation: BibleScriptureResult,
): string | null {
  if (!reasons || !recommendation.reference) return null;
  return reasons[recommendation.reference] ?? null;
}

function sanitizeRecommendationText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const sanitized = value.replace(/\s+/g, " ").trim();
  if (!sanitized) return null;
  return sanitized.length > maxLength
    ? `${sanitized.slice(0, Math.max(0, maxLength - 1)).trim()}...`
    : sanitized;
}

function parseJson<T>(value: string): T | null {
  try {
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function normalizeBibleContent(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function scrubApiError(value: string): string {
  return value.slice(0, 500);
}

class ApiBibleUserError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiBibleUserError";
    this.status = status;
  }
}
