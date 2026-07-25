import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migration = readFileSync(
  new URL(
    '../../../supabase/migrations/20260725153000_life_targets_persistence_and_resets.sql',
    import.meta.url,
  ),
  'utf8',
);

test('quarter reset derives the actor and clears the whole quarter atomically', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.reset_my_life_targets_quarter/);
  assert.match(migration, /v_actor_id uuid := auth\.uid\(\)/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(
    migration,
    /DELETE FROM public\.life_targets_brainstorm[\s\S]*user_id = v_actor_id[\s\S]*quarter = p_quarter/,
  );
  assert.match(
    migration,
    /DELETE FROM public\.life_targets_quarterly[\s\S]*user_id = v_actor_id[\s\S]*quarter = p_quarter/,
  );
  assert.doesNotMatch(migration, /p_user_id/);
});

test('month reset archives only the authenticated member active month', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.reset_my_core4_month/);
  assert.match(
    migration,
    /UPDATE public\.core4_monthly_missions[\s\S]*status = 'archived'[\s\S]*user_id = v_actor_id[\s\S]*month_year = p_month_year[\s\S]*status = 'active'/,
  );
  assert.match(migration, /Weekly work is a separate[\s\S]*remains untouched/);
});

test('reset RPCs are unavailable to anonymous callers', () => {
  assert.match(
    migration,
    /REVOKE ALL ON FUNCTION public\.reset_my_life_targets_quarter\(text\)[\s\S]*FROM PUBLIC, anon/,
  );
  assert.match(
    migration,
    /REVOKE ALL ON FUNCTION public\.reset_my_core4_month\(text\)[\s\S]*FROM PUBLIC, anon/,
  );
});
