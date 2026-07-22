import type { FlowProfile as FlowProfileRecord } from '@/app/types/flows';

export const LIFE_ROLES = [
  'Spouse', 'Parent', 'Business Owner', 'Employee', 'Coach',
  'Student', 'Caregiver', 'Leader', 'Creative', 'Athlete',
];

export const CORE_VALUES = [
  'Faith', 'Family', 'Growth', 'Impact', 'Freedom', 'Health',
  'Wealth', 'Adventure', 'Connection', 'Excellence', 'Integrity', 'Service',
];

export const ACCOUNTABILITY_STYLES = [
  { value: 'direct_challenge', label: 'Direct challenge - Tell me the hard truth' },
  { value: 'gentle_nudge', label: 'Gentle nudge - Lead with encouragement' },
  { value: 'questions_discover', label: 'Questions to discover - Help me figure it out myself' },
];

export const FEEDBACK_PREFERENCES = [
  { value: 'blunt_truth', label: 'Blunt truth first - Don\'t sugarcoat it' },
  { value: 'encouragement_then_truth', label: 'Encouragement then truth - Acknowledge before challenging' },
  { value: 'questions_to_discover', label: 'Questions that let me discover it - Socratic approach' },
];

export type ProfileFormData = {
  preferred_name: string;
  life_roles: string[];
  life_roles_context: string;
  core_values: string[];
  core_values_context: string;
  current_goals: string;
  current_challenges: string;
  spiritual_beliefs: string;
  background_notes: string;
  accountability_style: string;
  feedback_preference: string;
  peak_state: string;
  growth_edge: string;
  overwhelm_response: string;
};

export const EMPTY_FORM_DATA: ProfileFormData = {
  preferred_name: '', life_roles: [], life_roles_context: '', core_values: [], core_values_context: '', current_goals: '',
  current_challenges: '', spiritual_beliefs: '', background_notes: '',
  accountability_style: '', feedback_preference: '', peak_state: '',
  growth_edge: '', overwhelm_response: '',
};

export const ACCOUNTABILITY_CODES = new Set(ACCOUNTABILITY_STYLES.map(option => option.value));
export const FEEDBACK_CODES = new Set(FEEDBACK_PREFERENCES.map(option => option.value));

const ACCOUNTABILITY_LABEL_TO_CODE = Object.fromEntries(
  ACCOUNTABILITY_STYLES.map(option => [option.label, option.value]),
);
const FEEDBACK_LABEL_TO_CODE = Object.fromEntries(
  FEEDBACK_PREFERENCES.map(option => [option.label, option.value]),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizedShortAnswer(value: unknown): string {
  return cleanText(value).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isNoChangeAnswer(value: unknown): boolean {
  const normalized = normalizedShortAnswer(value);
  if (!normalized || /\b(?:not|isnt|arent)\s+the\s+same\b/.test(normalized)) return false;
  if (/^(yes|yep|yeah|same|same as before|still the same|still fits|that still fits|no change|no changes|unchanged|nothing changed|keep it|keep that|keep it the same|keep my current setting|still calling me the same name)$/.test(normalized)) return true;
  if (/^(?:no\s+)?(?:still\s+)?(?:the\s+)?same(?:\s+as\s+before)?(?:\s+(?:roles?|values?|goal|challenge|answer|thing|ones?))?$/.test(normalized)) return true;
  if (/^(?:nothing|not much|none of (?:it|that|them))\s+(?:has|have)?\s*changed(?:\s+.+)?$/.test(normalized)) return true;
  return /^(?:it|that|they|those|these|my .+)\s+(?:hasnt|havent|has not|have not|didnt|did not)\s+changed(?:\s+.+)?$/.test(normalized);
}

function isSkipAnswer(value: unknown): boolean {
  return /^(pass|skip|none|n a|not applicable|prefer not to answer)$/.test(normalizedShortAnswer(value));
}

export function validProfileArray(value: unknown, allowed: string[]): string[] {
  if (!Array.isArray(value)) return [];
  const allowedSet = new Set(allowed);
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && allowedSet.has(item)))];
}

function valuesMentionedInAnswer(answer: unknown, allowed: string[]): string[] {
  const normalized = cleanText(answer).toLowerCase();
  if (!normalized) return [];
  return allowed.filter(value => {
    const escaped = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`).test(normalized);
  });
}

function valuesExplicitlyRemoved(answer: unknown, allowed: string[]): Set<string> {
  const normalized = cleanText(answer).toLowerCase();
  return new Set(allowed.filter(value => {
    const escaped = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:no longer|not|stopped being|let go of|dropped|removed)\\s+(?:an?\\s+)?${escaped}(?:\\b|$)|${escaped}.{0,24}(?:no longer|not anymore|fell off|dropped off)`, 'i').test(normalized);
  }));
}

function codeFromSelection(
  value: unknown,
  response: unknown,
  allowedCodes: Set<string>,
  labelMap: Record<string, string>,
): string {
  const selectedLabel = cleanText(response);
  if (selectedLabel && labelMap[selectedLabel]) return labelMap[selectedLabel];
  const candidate = cleanText(value);
  return allowedCodes.has(candidate) ? candidate : '';
}

export function toProfileFormData(
  raw: unknown,
  responses: Record<string, unknown> = {},
  fallback: FlowProfileRecord | null = null,
  preserveExisting = false,
): ProfileFormData {
  const source = isRecord(raw) ? raw : {};
  const rolesFromDraft = validProfileArray(source.life_roles, LIFE_ROLES);
  const valuesFromDraft = validProfileArray(source.core_values, CORE_VALUES);
  const rolesFromResponse = valuesMentionedInAnswer(responses.life_roles, LIFE_ROLES);
  const valuesFromResponse = valuesMentionedInAnswer(responses.core_values, CORE_VALUES);
  const hasInterviewResponses = Object.keys(responses).length > 0;

  const text = (field: keyof ProfileFormData) => {
    const draftValue = cleanText(source[field]);
    const responseValue = cleanText(responses[field]);
    const fallbackValue = cleanText(fallback?.[field as keyof FlowProfileRecord]);
    if (preserveExisting && (isNoChangeAnswer(draftValue) || isNoChangeAnswer(responseValue))) return fallbackValue;
    if (draftValue && (!hasInterviewResponses || !isSkipAnswer(draftValue))) return draftValue;
    if (responseValue && (!hasInterviewResponses || !isSkipAnswer(responseValue))) return responseValue;
    return preserveExisting || !hasInterviewResponses ? fallbackValue : '';
  };

  const fallbackRoles = validProfileArray(fallback?.life_roles, LIFE_ROLES);
  const fallbackValues = validProfileArray(fallback?.core_values, CORE_VALUES);
  const rolesUnchanged = preserveExisting
    && (isNoChangeAnswer(source.life_roles) || isNoChangeAnswer(responses.life_roles));
  const valuesUnchanged = preserveExisting
    && (isNoChangeAnswer(source.core_values) || isNoChangeAnswer(responses.core_values));

  const context = (field: 'life_roles_context' | 'core_values_context', responseField: 'life_roles' | 'core_values') => {
    const draftValue = cleanText(source[field]);
    const responseValue = cleanText(responses[responseField]);
    const fallbackValue = cleanText(fallback?.[field]);
    if (preserveExisting && (isNoChangeAnswer(draftValue) || isNoChangeAnswer(responseValue) || isSkipAnswer(responseValue))) {
      return fallbackValue;
    }
    return draftValue || responseValue || (preserveExisting ? fallbackValue : '');
  };
  const mergedResponseValues = (response: unknown, fallbackValues: string[], mentionedValues: string[], allowed: string[]) => {
    const removed = valuesExplicitlyRemoved(response, allowed);
    return [...new Set([...fallbackValues, ...mentionedValues])].filter(value => !removed.has(value));
  };

  return {
    preferred_name: text('preferred_name'),
    life_roles: rolesUnchanged
      ? fallbackRoles
      : Array.isArray(source.life_roles)
        ? rolesFromDraft
        : cleanText(responses.life_roles)
          ? isSkipAnswer(responses.life_roles) ? (preserveExisting ? fallbackRoles : []) : preserveExisting
            ? mergedResponseValues(responses.life_roles, fallbackRoles, rolesFromResponse, LIFE_ROLES)
            : rolesFromResponse
          : preserveExisting ? fallbackRoles : [],
    life_roles_context: context('life_roles_context', 'life_roles'),
    core_values: valuesUnchanged
      ? fallbackValues
      : Array.isArray(source.core_values)
        ? valuesFromDraft
        : cleanText(responses.core_values)
          ? isSkipAnswer(responses.core_values) ? (preserveExisting ? fallbackValues : []) : preserveExisting
            ? mergedResponseValues(responses.core_values, fallbackValues, valuesFromResponse, CORE_VALUES)
            : valuesFromResponse
          : preserveExisting ? fallbackValues : [],
    core_values_context: context('core_values_context', 'core_values'),
    current_goals: text('current_goals'),
    current_challenges: text('current_challenges'),
    spiritual_beliefs: text('spiritual_beliefs'),
    background_notes: text('background_notes'),
    accountability_style: preserveExisting
      && (isNoChangeAnswer(source.accountability_style) || isNoChangeAnswer(responses.accountability_style))
      ? (ACCOUNTABILITY_CODES.has(fallback?.accountability_style || '') ? fallback?.accountability_style || '' : '')
      : codeFromSelection(source.accountability_style, responses.accountability_style, ACCOUNTABILITY_CODES, ACCOUNTABILITY_LABEL_TO_CODE)
        || (preserveExisting && ACCOUNTABILITY_CODES.has(fallback?.accountability_style || '') ? fallback?.accountability_style || '' : ''),
    feedback_preference: preserveExisting
      && (isNoChangeAnswer(source.feedback_preference) || isNoChangeAnswer(responses.feedback_preference))
      ? (FEEDBACK_CODES.has(fallback?.feedback_preference || '') ? fallback?.feedback_preference || '' : '')
      : codeFromSelection(source.feedback_preference, responses.feedback_preference, FEEDBACK_CODES, FEEDBACK_LABEL_TO_CODE)
        || (preserveExisting && FEEDBACK_CODES.has(fallback?.feedback_preference || '') ? fallback?.feedback_preference || '' : ''),
    peak_state: text('peak_state'),
    growth_edge: text('growth_edge'),
    overwhelm_response: text('overwhelm_response'),
  };
}
