import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getDailyProofProgress } from './lifeTargetsProgress';

test('Daily Proof remains complete for legacy plans with saved selections', () => {
  assert.deepEqual(
    getDailyProofProgress({
      body_daily_actions: ['Walk for 20 minutes'],
      being_daily_actions: [],
    }),
    { completed: true, selectedDomainCount: 1 },
  );
});

test('Daily Proof can be completed after reviewing with zero optional selections', () => {
  assert.deepEqual(
    getDailyProofProgress({
      body_daily_actions: [],
      being_daily_actions: [],
      balance_daily_actions: [],
      business_daily_actions: [],
      daily_proof_reviewed_at: '2026-07-25T15:30:00.000Z',
    }),
    { completed: true, selectedDomainCount: 0 },
  );
});

test('an untouched empty Daily Proof step remains incomplete', () => {
  assert.deepEqual(
    getDailyProofProgress({
      body_daily_actions: [],
      being_daily_actions: [],
      balance_daily_actions: [],
      business_daily_actions: [],
      daily_proof_reviewed_at: null,
    }),
    { completed: false, selectedDomainCount: 0 },
  );
});

test('Daily Proof navigation flushes pending writes before leaving', () => {
  const source = readFileSync(
    new URL('../pages/LifeTargetsDaily.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /await flushPendingChanges\(markReviewed\)/);
  assert.match(source, /navigateAfterFlush\(`\$\{lifeTargetsBasePath\}\/cascade`, true\)/);
  assert.match(source, /onClick=\{\(\) => void navigateAfterFlush\(`\$\{lifeTargetsBasePath\}\/missions`\)\}/);
  assert.doesNotMatch(
    source,
    /handleContinue\s*=\s*\(\)\s*=>\s*\{\s*navigate\(/,
  );
});
