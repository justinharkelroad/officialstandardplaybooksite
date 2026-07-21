export const FLOW_PROFILE_ROLES = [
  'Spouse', 'Parent', 'Business Owner', 'Employee', 'Coach',
  'Student', 'Caregiver', 'Leader', 'Creative', 'Athlete',
] as const;

export const FLOW_PROFILE_VALUES = [
  'Faith', 'Family', 'Growth', 'Impact', 'Freedom', 'Health',
  'Wealth', 'Adventure', 'Connection', 'Excellence', 'Integrity', 'Service',
] as const;

export const ACCOUNTABILITY_LABEL_TO_CODE = {
  'Direct challenge - Tell me the hard truth': 'direct_challenge',
  'Gentle nudge - Lead with encouragement': 'gentle_nudge',
  'Questions to discover - Help me figure it out myself': 'questions_discover',
} as const;

export const FEEDBACK_LABEL_TO_CODE = {
  "Blunt truth first - Don't sugarcoat it": 'blunt_truth',
  'Encouragement then truth - Acknowledge before challenging': 'encouragement_then_truth',
  'Questions that let me discover it - Socratic approach': 'questions_to_discover',
} as const;

export type FlowProfileDraft = {
  preferred_name: string | null;
  life_roles: string[];
  core_values: string[];
  current_goals: string | null;
  current_challenges: string | null;
  peak_state: string | null;
  growth_edge: string | null;
  overwhelm_response: string | null;
  accountability_style: string | null;
  feedback_preference: string | null;
  spiritual_beliefs: string | null;
  background_notes: string | null;
};

const ACCOUNTABILITY_CODES = new Set(Object.values(ACCOUNTABILITY_LABEL_TO_CODE));
const FEEDBACK_CODES = new Set(Object.values(FEEDBACK_LABEL_TO_CODE));
const ROLE_SET = new Set<string>(FLOW_PROFILE_ROLES);
const VALUE_SET = new Set<string>(FLOW_PROFILE_VALUES);
const TEXT_FIELDS = [
  'current_goals', 'current_challenges', 'peak_state', 'growth_edge',
  'overwhelm_response', 'spiritual_beliefs', 'background_notes',
] as const;

type NarrativeField = typeof TEXT_FIELDS[number];

const NARRATIVE_WORD_FLOORS: Record<NarrativeField, number> = {
  current_goals: 24,
  current_challenges: 24,
  peak_state: 24,
  growth_edge: 12,
  overwhelm_response: 12,
  spiritual_beliefs: 12,
  background_notes: 12,
};

function cleanText(value: unknown, maxLength = 6000): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function words(value: string): string[] {
  return value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
}

function normalizedAnchors(value: string): string[] {
  const matches = value.replace(/[\u2010-\u2015-]/g, ' ').match(
    /\b\d{1,2}:\d{2}\s*(?:a\.?m\.?|p\.?m\.?)?|\$\s*\d[\d,]*(?:\.\d+)?(?:\s*%|\s*(?:days?|weeks?|months?|years?|hours?|minutes?))?|\b\d[\d,]*(?:\.\d+)?(?:\s*%|\s*(?:days?|weeks?|months?|years?|hours?|minutes?))?/gi,
  ) ?? [];
  return [...new Set(matches.map(match => match.toLowerCase().replace(/[\s,.]/g, '')))];
}

export function narrativeCandidatePreservesDepth(
  field: NarrativeField,
  candidate: string,
  baseline: string,
): boolean {
  const baselineWords = words(baseline);
  const candidateWords = words(candidate);
  const minimumWords = Math.max(
    Math.ceil(baselineWords.length * 0.6),
    Math.min(NARRATIVE_WORD_FLOORS[field], baselineWords.length),
  );
  if (candidateWords.length < minimumWords) return false;

  const baselineAnchors = new Set(normalizedAnchors(baseline));
  const candidateAnchors = new Set(normalizedAnchors(candidate));
  return baselineAnchors.size === candidateAnchors.size
    && [...baselineAnchors].every(anchor => candidateAnchors.has(anchor));
}

function normalizedShortAnswer(value: unknown): string {
  const cleaned = cleanText(value, 200)?.toLowerCase() ?? '';
  return cleaned.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isNoChangeAnswer(value: unknown): boolean {
  return /^(yes|yep|yeah|same|same as before|still the same|still fits|that still fits|no change|no changes|unchanged|nothing changed|keep it|keep that|keep it the same|still calling me the same name)$/.test(
    normalizedShortAnswer(value),
  );
}

function isSkipAnswer(value: unknown): boolean {
  return /^(pass|skip|none|n a|not applicable|prefer not to answer)$/.test(normalizedShortAnswer(value));
}

function validUniqueStrings(value: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && allowed.has(item)))];
}

function valuesMentionedInAnswer(value: unknown, allowed: readonly string[]): string[] {
  const normalized = cleanText(value)?.toLowerCase() ?? '';
  if (!normalized) return [];
  return allowed.filter(item => {
    const escaped = item.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`).test(normalized);
  });
}

function validCode(value: unknown, allowed: Set<string>): string | null {
  return typeof value === 'string' && allowed.has(value) ? value : null;
}

function inferCode(value: unknown, kind: 'accountability' | 'feedback'): string | null {
  const normalized = normalizedShortAnswer(value);
  if (!normalized) return null;
  if (/\b(question|questions|ask|discover|socratic|figure it out|draw it out)\b/.test(normalized)) {
    return kind === 'accountability' ? 'questions_discover' : 'questions_to_discover';
  }
  if (/\b(gentle|encourag|support|acknowledge|positive|affirm|patient|soft|reassur)\w*\b/.test(normalized)) {
    return kind === 'accountability' ? 'gentle_nudge' : 'encouragement_then_truth';
  }
  if (/\b(direct|challenge|blunt|truth first|hard truth|call me out|straight|no sugarcoat|honest)\w*\b/.test(normalized)) {
    return kind === 'accountability' ? 'direct_challenge' : 'blunt_truth';
  }
  return null;
}

export function normalizeFlowProfileDraft(
  candidate: unknown,
  responses: Record<string, string>,
  existing: Record<string, unknown> | null,
  options: { preserveExisting?: boolean } = {},
): FlowProfileDraft {
  const raw = typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate)
    ? candidate as Record<string, unknown>
    : {};
  const preserveExisting = options.preserveExisting ?? Boolean(existing);

  const listValue = (
    field: 'life_roles' | 'core_values',
    allowedValues: readonly string[],
    allowedSet: Set<string>,
  ) => {
    const response = cleanText(responses[field]);
    const existingValues = preserveExisting ? validUniqueStrings(existing?.[field], allowedSet) : [];
    if (!response || isNoChangeAnswer(response) || isSkipAnswer(response)) return existingValues;
    if (Array.isArray(raw[field])) {
      const validated = validUniqueStrings(raw[field], allowedSet);
      if (validated.length > 0 || raw[field].length === 0) return validated;
    }
    return valuesMentionedInAnswer(response, allowedValues);
  };

  const textValue = (field: NarrativeField | 'preferred_name', maxLength = 6000) => {
    const responseValue = cleanText(responses[field], maxLength);
    const existingValue = preserveExisting ? cleanText(existing?.[field], maxLength) : null;
    if (!responseValue || isNoChangeAnswer(responseValue) || isSkipAnswer(responseValue)) return existingValue;
    const candidateValue = cleanText(raw[field], maxLength);
    if (candidateValue && !isNoChangeAnswer(candidateValue) && !isSkipAnswer(candidateValue)) {
      if (field === 'preferred_name' || narrativeCandidatePreservesDepth(field, candidateValue, responseValue)) {
        return candidateValue;
      }
    }
    return responseValue;
  };

  const accountabilityResponse = cleanText(responses.accountability_style);
  const feedbackResponse = cleanText(responses.feedback_preference);
  const draft: FlowProfileDraft = {
    preferred_name: textValue('preferred_name', 120),
    life_roles: listValue('life_roles', FLOW_PROFILE_ROLES, ROLE_SET),
    core_values: listValue('core_values', FLOW_PROFILE_VALUES, VALUE_SET),
    current_goals: null,
    current_challenges: null,
    peak_state: null,
    growth_edge: null,
    overwhelm_response: null,
    accountability_style: !accountabilityResponse || isNoChangeAnswer(accountabilityResponse) || isSkipAnswer(accountabilityResponse)
      ? (preserveExisting ? validCode(existing?.accountability_style, ACCOUNTABILITY_CODES) : null)
      : inferCode(accountabilityResponse, 'accountability') ?? validCode(raw.accountability_style, ACCOUNTABILITY_CODES),
    feedback_preference: !feedbackResponse || isNoChangeAnswer(feedbackResponse) || isSkipAnswer(feedbackResponse)
      ? (preserveExisting ? validCode(existing?.feedback_preference, FEEDBACK_CODES) : null)
      : inferCode(feedbackResponse, 'feedback') ?? validCode(raw.feedback_preference, FEEDBACK_CODES),
    spiritual_beliefs: null,
    background_notes: null,
  };

  for (const field of TEXT_FIELDS) draft[field] = textValue(field);
  return draft;
}

export function oneToOneProfileDraft(
  responses: Record<string, string>,
  existing: Record<string, unknown> | null,
  options: { preserveExisting?: boolean } = {},
): FlowProfileDraft {
  return normalizeFlowProfileDraft({}, responses, existing, options);
}
