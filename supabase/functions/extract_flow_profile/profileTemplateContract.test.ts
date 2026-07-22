function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const migrationPath = new URL(
  '../../migrations/20260721220000_profile_flow_parity_repairs.sql',
  import.meta.url,
);

Deno.test('profile template repair keeps examples, choices, and optional skips user-visible', async () => {
  const migration = await Deno.readTextFile(migrationPath);
  const blocks = [...migration.matchAll(/\$questions\$(\[[\s\S]*?\])\$questions\$/g)]
    .map(match => JSON.parse(match[1]) as Array<{
      id: string;
      type: string;
      prompt: string;
      required: boolean;
      options?: string[];
    }>);

  assert(blocks.length === 2, 'builder and re-profile question blocks should both be present');
  for (const questions of blocks) {
    const byId = Object.fromEntries(questions.map(question => [question.id, question]));
    assert(/spouse/i.test(byId.life_roles.prompt), 'role examples must be in the spoken prompt');
    assert(/faith/i.test(byId.core_values.prompt), 'value examples must be in the spoken prompt');
    assert(byId.accountability_style.type === 'select', 'accountability should use visible choices');
    assert(byId.feedback_preference.type === 'select', 'feedback should use visible choices');
    assert((byId.accountability_style.options?.length ?? 0) >= 3, 'accountability choices must be configured');
    assert((byId.feedback_preference.options?.length ?? 0) >= 3, 'feedback choices must be configured');
    assert(questions.filter(question => question.required).length === 1, 'only preferred name should block completion');
  }
});
