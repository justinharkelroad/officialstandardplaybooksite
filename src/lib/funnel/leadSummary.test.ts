import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leadSummary } from './leadSummary';
import { prescribe } from './prescribe';

const answers = { producers: '4-9', manager: 'no', problem: 'team', timing: 'month', budget: '2500-5000' } as const;

test('quiz summary names the prescription and labels every answer', () => {
  const s = leadSummary(answers, prescribe(answers));
  assert.equal(s.routeLabel, 'Quiz: prescribed Team Standard 2X');
  assert.equal(s.alternativeName, 'The Boardroom');
  assert.equal(s.answers.length, 5);
  assert.deepEqual(s.answers[2], { question: "What's the biggest problem right now?", answer: "My team doesn't follow through when I'm not watching" });
});

test('booking summary says where the lead was sent', () => {
  const rx = prescribe(answers);
  assert.equal(leadSummary(answers, rx, 'eightWeek').routeLabel, 'Booking form: shown checkout for 8-Week Sales Management Experience, no call needed');
  assert.equal(leadSummary(answers, rx, 'standard90').routeLabel, "Booking form: sent to the Standard 90 application and Justin's calendar");
  assert.equal(leadSummary(answers, rx, 'boardroom').routeLabel, 'Booking form: shown checkout for The Boardroom, no call needed');
});
