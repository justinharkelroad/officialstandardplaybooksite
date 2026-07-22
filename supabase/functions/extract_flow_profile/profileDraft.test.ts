import {
  narrativeCandidatePreservesDepth,
  normalizeFlowProfileDraft,
} from './profileDraft.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

Deno.test('keeps the member answer when a model draft loses concrete depth', () => {
  const response = 'For the next 90 days I want to lose 18 pounds, train four mornings each week, and be home for dinner by 6:30 p.m. at least five nights a week so my family gets the best of me too.';
  const compressed = 'I want to improve my health and family balance.';

  assert(
    !narrativeCandidatePreservesDepth('current_goals', compressed, response),
    'a compressed draft should fail the depth guard',
  );

  const draft = normalizeFlowProfileDraft(
    { current_goals: compressed },
    { current_goals: response },
    null,
    { preserveExisting: false },
  );

  assert(draft.current_goals === response, 'the original answer should be preserved');
});

Deno.test('normalizes role, value, accountability, and feedback answers', () => {
  const draft = normalizeFlowProfileDraft(
    {},
    {
      preferred_name: 'Karina',
      life_roles: 'I am a Spouse, Parent, Business Owner, and Creative.',
      core_values: 'Faith, Family, Integrity, Growth, and Service guide me.',
      accountability_style: 'Be direct and challenge me with the hard truth.',
      feedback_preference: 'Encourage me first, then tell me the truth.',
    },
    null,
    { preserveExisting: false },
  );

  assert(draft.preferred_name === 'Karina', 'preferred name should be kept');
  assert(draft.life_roles.join('|') === 'Spouse|Parent|Business Owner|Creative', 'roles should be canonical');
  assert(draft.core_values.join('|') === 'Faith|Family|Growth|Integrity|Service', 'values should be canonical');
  assert(draft.accountability_style === 'direct_challenge', 'accountability should be inferred');
  assert(draft.feedback_preference === 'encouragement_then_truth', 'feedback should be inferred');
});

Deno.test('a re-profile no-change answer preserves existing context', () => {
  const existing = {
    preferred_name: 'Karina',
    life_roles: ['Spouse', 'Parent'],
    life_roles_context: 'Parent carries the most weight; Spouse gets the least of me.',
    core_values: ['Faith', 'Family'],
    core_values_context: 'Faith wins when the two collide.',
    current_challenges: 'I overcommit, then withdraw when everything collides.',
    accountability_style: 'gentle_nudge',
    feedback_preference: 'questions_to_discover',
  };

  const draft = normalizeFlowProfileDraft(
    {},
    {
      preferred_name: 'same as before',
      life_roles: 'No, same roles.',
      core_values: 'Nothing has changed with my values.',
      current_challenges: 'Nothing has changed with my challenge.',
      accountability_style: 'keep it',
      feedback_preference: 'still fits',
    },
    existing,
    { preserveExisting: true },
  );

  assert(draft.preferred_name === existing.preferred_name, 'name should remain');
  assert(draft.life_roles.join('|') === existing.life_roles.join('|'), 'roles should remain');
  assert(draft.life_roles_context === existing.life_roles_context, 'role context should remain');
  assert(draft.core_values.join('|') === existing.core_values.join('|'), 'values should remain');
  assert(draft.core_values_context === existing.core_values_context, 'value context should remain');
  assert(draft.current_challenges === existing.current_challenges, 'challenge should remain');
  assert(draft.accountability_style === existing.accountability_style, 'accountability should remain');
  assert(draft.feedback_preference === existing.feedback_preference, 'feedback should remain');
});

Deno.test('a partial re-profile answer merges additions and preserves the narrative', () => {
  const existing = {
    life_roles: ['Spouse', 'Parent', 'Business Owner'],
    life_roles_context: 'Business Owner carried the most weight.',
    core_values: ['Faith', 'Family', 'Growth'],
    core_values_context: 'Family usually won.',
  };

  const draft = normalizeFlowProfileDraft(
    { life_roles: ['Coach'], core_values: ['Health'] },
    {
      life_roles: 'Coach is carrying more weight now, and I am no longer an Employee.',
      core_values: 'Health has moved up this season.',
    },
    existing,
    { preserveExisting: true },
  );

  assert(
    draft.life_roles.join('|') === 'Spouse|Parent|Business Owner|Coach',
    'a partial role update should merge instead of replacing the profile',
  );
  assert(
    draft.core_values.join('|') === 'Faith|Family|Growth|Health',
    'a partial value update should merge instead of replacing the profile',
  );
  assert(draft.life_roles_context?.includes('Coach is carrying more weight'), 'role narrative should be retained');
  assert(draft.core_values_context?.includes('Health has moved up'), 'value narrative should be retained');
});
