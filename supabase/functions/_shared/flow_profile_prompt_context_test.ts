import { withReprofileContext } from '../../../src/app/lib/flowProfilePromptContext.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

Deno.test('re-profile prompts show the member the value being revisited', () => {
  const prompt = withReprofileContext(
    {
      flow_slug: 'profile-reprofile',
      prior_profile: { life_roles: ['Spouse', 'Parent', 'Business Owner'] },
    },
    'life_roles',
    'What changed?',
  );

  assert(prompt.includes('Spouse, Parent, Business Owner'), 'the current roles should be visible');
  assert(prompt.endsWith('What changed?'), 'the official question should remain intact');
});

Deno.test('ordinary flows do not receive profile context', () => {
  const prompt = withReprofileContext(
    { flow_slug: 'gratitude', prior_profile: { life_roles: ['Parent'] } },
    'life_roles',
    'What are you grateful for?',
  );
  assert(prompt === 'What are you grateful for?', 'non-profile prompts should be unchanged');
});
