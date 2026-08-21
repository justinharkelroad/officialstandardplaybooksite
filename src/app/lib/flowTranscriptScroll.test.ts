import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldFollowFlowTranscript } from './flowTranscriptScroll';

test('pauses transcript following on the first upward move near the bottom', () => {
  assert.equal(shouldFollowFlowTranscript({
    following: true,
    previousScrollTop: 500,
    scrollTop: 490,
    scrollHeight: 1_000,
    clientHeight: 500,
  }), false);
});

test('keeps following while streaming content grows without reader movement', () => {
  assert.equal(shouldFollowFlowTranscript({
    following: true,
    previousScrollTop: 500,
    scrollTop: 500,
    scrollHeight: 1_200,
    clientHeight: 500,
  }), true);
});

test('stays paused until the reader returns to the bottom', () => {
  assert.equal(shouldFollowFlowTranscript({
    following: false,
    previousScrollTop: 300,
    scrollTop: 400,
    scrollHeight: 1_200,
    clientHeight: 500,
  }), false);

  assert.equal(shouldFollowFlowTranscript({
    following: false,
    previousScrollTop: 400,
    scrollTop: 700,
    scrollHeight: 1_200,
    clientHeight: 500,
  }), true);
});
