import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { QuizAnswers } from '@/config/quiz';
import { explainPrescription, prescribe } from './prescribe';

const base: QuizAnswers = { producers: '1-3', manager: 'no', problem: 'alone', timing: 'month', budget: '500-2500' };
const rx = (overrides: Partial<QuizAnswers>) => prescribe({ ...base, ...overrides });

test('calls → Agency Brain Plus + LCC, even with a big budget', () => {
  assert.deepEqual(rx({ problem: 'calls', budget: '5000+' }), { a: 'agencyBrainPlusLcc', b: 'agencyBrainCore', rule: 'calls' });
});

test('rebuild needs $5,000+ for Standard 90', () => {
  assert.deepEqual(rx({ problem: 'rebuild', budget: '5000+' }), { a: 'standard90', b: 'teamStandard2x', rule: 'rebuild' });
  assert.equal(rx({ problem: 'rebuild', budget: '2500-5000' }).a, 'boardroom');
});

test('manager problem with a manager → 8-Week; without one falls through', () => {
  assert.deepEqual(rx({ problem: 'manager', manager: 'yes' }), { a: 'eightWeek', b: 'boardroom', rule: 'manager' });
  assert.equal(rx({ problem: 'manager', manager: 'self' }).a, 'boardroom');
  assert.equal(rx({ problem: 'manager', manager: 'no', budget: 'under500' }).a, 'mirror');
});

test('team problem → Team Standard 2X at 4+ producers and $2,500+', () => {
  assert.deepEqual(rx({ problem: 'team', producers: '4-9', budget: '2500-5000' }), { a: 'teamStandard2x', b: 'boardroom', rule: 'team' });
  assert.equal(rx({ problem: 'team', producers: '4-9', budget: '5000+' }).a, 'teamStandard2x');
  assert.equal(rx({ problem: 'team', producers: '10+', budget: '2500-5000' }).a, 'teamStandard2x');
  assert.equal(rx({ problem: 'team', producers: '1-3', budget: '5000+' }).a, 'boardroom');
  assert.equal(rx({ problem: 'team', producers: '4-9', budget: '500-2500' }).a, 'boardroom');
});

test('team problem → 4X only at 10+ producers and $5,000+', () => {
  assert.equal(rx({ problem: 'team', producers: '10+', budget: '5000+' }).a, 'teamStandard4x');
});

test('under $500 → Mirror (when no earlier rule matched)', () => {
  assert.deepEqual(rx({ budget: 'under500' }), { a: 'mirror', b: 'boardroom', rule: 'budget' });
  assert.equal(rx({ problem: 'calls', budget: 'under500' }).a, 'agencyBrainPlusLcc');
});

test('anything else → Boardroom with Agency Brain Plus + LCC as the alternative', () => {
  assert.deepEqual(rx({}), { a: 'boardroom', b: 'agencyBrainPlusLcc', rule: 'default' });
});

test('the why text uses their own answers and reads as sentences', () => {
  const why = explainPrescription('teamStandard2x', { ...base, producers: '4-9', problem: 'team', budget: '2500-5000' });
  assert.match(why, /^You have 4–9 producers and said your team doesn't follow through when you're not watching\./);
  assert.match(why, /\$2,500–\$5,000 a month/);
  assert.doesNotMatch(why, /[{}]/);
  assert.doesNotMatch(why, /—/, 'no em dashes in copy');
  const eight = explainPrescription('eightWeek', { ...base, manager: 'yes', problem: 'manager' });
  assert.match(eight, /^You said you have a sales manager and your sales manager has no system to run\./);
});
