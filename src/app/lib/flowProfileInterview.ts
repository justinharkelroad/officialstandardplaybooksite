export const PROFILE_FLOW_SLUGS = new Set([
  'profile-builder',
  'profile-reprofile',
]);

const PROFILE_INTERVIEW_QUESTION_LABELS: Readonly<Record<string, string>> = {
  preferred_name: 'What should I call you?',
  life_roles: 'Roles you carry',
  core_values: 'Values that govern your decisions',
  current_goals: 'Your one 90-day result',
  current_challenges: 'The recurring pattern',
  peak_state: 'When you are at your best',
  growth_edge: 'Growth area you are avoiding',
  overwhelm_response: 'Your default under pressure',
  accountability_style: 'Accountability that works',
  feedback_preference: 'Feedback that helps',
  spiritual_beliefs: 'Faith or spiritual context',
  background_notes: 'Anything else your coach should know',
};

export function isProfileFlowSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && PROFILE_FLOW_SLUGS.has(slug);
}

export function profileInterviewQuestionLabel(
  questionId: string,
  fallbackPrompt: string,
): string {
  return PROFILE_INTERVIEW_QUESTION_LABELS[questionId] ?? fallbackPrompt;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isOpenProfileInterviewReview(
  status: unknown,
  metadata: unknown,
): boolean {
  if (status !== 'completed' || !isRecord(metadata)) return false;

  return Number(metadata.profile_interview_version) === 2
    && Number(metadata.profile_confirmed_version) !== 2
    && typeof metadata.profile_confirmed_at !== 'string'
    && typeof metadata.profile_review_discarded_at !== 'string';
}

export function safeFlowStartRedirect(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  const match = value.match(/^\/app\/flows\/start\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (!match || isProfileFlowSlug(match[1])) return undefined;

  return value;
}
