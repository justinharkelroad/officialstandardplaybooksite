type ReprofilePromptSession = {
  flow_slug: string;
  prior_profile?: Record<string, unknown> | null;
};

const PROFILE_FIELD_BY_QUESTION: Record<string, string> = {
  preferred_name: 'preferred_name',
  life_roles: 'life_roles',
  core_values: 'core_values',
  current_goals: 'current_goals',
  current_challenges: 'current_challenges',
  peak_state: 'peak_state',
  growth_edge: 'growth_edge',
  overwhelm_response: 'overwhelm_response',
  accountability_style: 'accountability_style',
  feedback_preference: 'feedback_preference',
  spiritual_beliefs: 'spiritual_beliefs',
  background_notes: 'background_notes',
};

const PROFILE_CODE_LABELS: Record<string, string> = {
  direct_challenge: 'Direct challenge',
  gentle_nudge: 'Gentle nudge',
  questions_discover: 'Questions that help me discover it',
  blunt_truth: 'Blunt truth first',
  encouragement_then_truth: 'Encouragement, then truth',
  questions_to_discover: 'Questions that let me discover it',
};

function displayProfileValue(value: unknown): string | null {
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    return items.length ? items.join(', ') : null;
  }
  if (typeof value !== 'string' || !value.trim()) return null;
  const cleaned = PROFILE_CODE_LABELS[value] ?? value.trim().replace(/\s+/g, ' ');
  return cleaned.length > 360 ? `${cleaned.slice(0, 357)}...` : cleaned;
}

export function withReprofileContext(
  session: ReprofilePromptSession,
  questionId: string | undefined,
  prompt: string,
): string {
  if (session.flow_slug !== 'profile-reprofile' || !questionId || !session.prior_profile) return prompt;
  const field = PROFILE_FIELD_BY_QUESTION[questionId];
  const primaryValue = field ? displayProfileValue(session.prior_profile[field]) : null;
  const contextField = questionId === 'life_roles'
    ? 'life_roles_context'
    : questionId === 'core_values'
      ? 'core_values_context'
      : null;
  const contextValue = contextField ? displayProfileValue(session.prior_profile[contextField]) : null;
  const currentValue = [primaryValue, contextValue].filter(Boolean).join(' — ') || null;
  if (!currentValue) return prompt;

  return `Your current profile says: ${currentValue}\n\n${prompt}`;
}
