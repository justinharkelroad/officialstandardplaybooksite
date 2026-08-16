import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import {
  buildFlowConversation,
  hashFlowAnswer,
  validateFlowCoachRows,
  type FlowCoachRow,
} from '@/app/lib/flowConversation';
import { buildFlowPDFConversationTextStream } from '@/app/lib/generateFlowPDF';
import type { FlowCoachTurn, FlowQuestion, FlowSession } from '@/app/types/flows';

const questions: FlowQuestion[] = [
  {
    id: 'theme',
    type: 'text',
    prompt: 'Name the theme.',
    required: true,
    interpolation_key: 'theme_name',
  },
  {
    id: 'first',
    type: 'textarea',
    prompt: 'How does {theme_name} show up?',
    required: true,
  },
  {
    id: 'second',
    type: 'textarea',
    prompt: 'What changes next?',
    required: true,
  },
  {
    id: 'hidden',
    type: 'textarea',
    prompt: 'This stale conditional question must stay hidden.',
    required: false,
    show_if: { question_id: 'theme', equals: 'something else' },
  },
];

const responses = {
  theme: '<p><span style="color: #2563eb">courage</span></p>',
  first: '<p><span style="color: rgb(37, 99, 235)"><strong>Official answer one</strong></span> <mark data-color="#fef08a" style="background-color: #fef08a">highlighted truth</mark><script>bad()</script></p><ul><li>One concrete point</li></ul>',
  second: 'Official answer two',
  hidden: 'A stale hidden answer',
};

function row(overrides: Partial<FlowCoachRow> & Pick<FlowCoachRow, 'id' | 'question_id' | 'reflection'>): FlowCoachRow {
  return {
    answer_excerpt: null,
    answer_hash: null,
    probe: null,
    probe_answer: null,
    resolution: null,
    memory_refs: [],
    created_at: '2026-08-16T12:00:00.000Z',
    ...overrides,
  };
}

function session(): FlowSession {
  return {
    id: 'session-1',
    user_id: 'user-1',
    flow_template_id: 'template-1',
    title: 'Transcript regression',
    domain: null,
    responses_json: responses,
    ai_analysis_json: null,
    status: 'completed',
    completed_at: '2026-08-16T12:00:00.000Z',
    pdf_url: null,
    created_at: '2026-08-16T12:00:00.000Z',
    updated_at: '2026-08-16T12:00:00.000Z',
  };
}

test('validates first-current Coach rows by stable question ID and degrades incomplete depth to reflection-only', async () => {
  const firstHash = await hashFlowAnswer(responses.first);
  const hiddenHash = await hashFlowAnswer(responses.hidden);
  const coachTurns = await validateFlowCoachRows([
    row({ id: 'stale', question_id: 'first', reflection: 'Stale reflection', answer_hash: await hashFlowAnswer('old answer') }),
    row({
      id: 'current-first',
      question_id: 'first',
      reflection: 'Current reflection',
      answer_hash: firstHash,
      probe: 'Coach follow-up question',
      probe_answer: 'Member follow-up response',
      resolution: 'Coach resolution text',
      memory_refs: [
        { id: 'memory-1', flow_slug: 'prayer', session_title: 'Earlier Prayer' },
        { id: 'memory-1', flow_slug: 'duplicate', session_title: 'Duplicate provenance' },
      ],
    }),
    row({ id: 'duplicate-current', question_id: 'first', reflection: 'Duplicate reflection', answer_hash: firstHash }),
    row({
      id: 'reflection-only',
      question_id: 'second',
      reflection: 'Reflection only',
      answer_excerpt: responses.second.slice(0, 240),
      probe: 'Orphaned unanswered probe',
      resolution: 'Orphaned resolution',
    }),
    row({
      id: 'duplicate-legacy',
      question_id: 'second',
      reflection: 'Duplicate legacy reflection',
      answer_excerpt: responses.second.slice(0, 240),
    }),
    row({ id: 'orphan', question_id: 'removed-question', reflection: 'Orphaned row', answer_excerpt: 'answer' }),
    row({ id: 'hidden', question_id: 'hidden', reflection: 'Hidden stale row', answer_hash: hiddenHash }),
  ], questions, responses);

  assert.deepEqual(Object.keys(coachTurns), ['first', 'second']);
  assert.equal(coachTurns.first.reflection, 'Current reflection');
  assert.equal(coachTurns.first.probe, 'Coach follow-up question');
  assert.equal(coachTurns.first.probe_answer, 'Member follow-up response');
  assert.equal(coachTurns.first.resolution, 'Coach resolution text');
  assert.deepEqual(coachTurns.first.memory_refs.map((reference) => reference.id), ['memory-1']);
  assert.equal(coachTurns.second.reflection, 'Reflection only');
  assert.equal(coachTurns.second.probe, null);
  assert.equal(coachTurns.second.probe_answer, null);
  assert.equal(coachTurns.second.resolution, null);
});

test('real transcript DOM preserves chronological order, does not repeat questions, and keeps sanitized rich-text styling', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, {
    React,
    window: dom.window,
    document: dom.window.document,
    DOMParser: dom.window.DOMParser,
    Node: dom.window.Node,
    Element: dom.window.Element,
    HTMLElement: dom.window.HTMLElement,
  });

  const { FlowConversationTranscript } = await import('@/app/components/flows/FlowConversationTranscript');
  const coachTurns: Record<string, FlowCoachTurn> = {
    first: {
      reflection: '<p><em>Coach reflection one</em></p>',
      probe: 'Coach follow-up question',
      probe_answer: 'Member follow-up response',
      resolution: 'Coach resolution text',
      memory_refs: [{ id: 'memory-1', flow_slug: 'prayer', session_title: 'Earlier Prayer' }],
    },
    second: {
      reflection: 'Reflection only',
      probe: null,
      probe_answer: null,
      resolution: null,
      memory_refs: [],
    },
  };

  const markup = renderToStaticMarkup(React.createElement(FlowConversationTranscript, {
    questions,
    responses,
    coachTurns,
    flowSlug: 'test-flow',
    fallbackIcon: null,
  }));
  const document = new JSDOM(markup).window.document;
  const text = document.body.textContent ?? '';
  const orderedPhrases = [
    'How does courage show up?',
    'Official answer one',
    'Coach reflection one',
    'Coach follow-up question',
    'Member follow-up response',
    'Coach resolution text',
    'What changes next?',
  ];
  let previousIndex = -1;
  for (const phrase of orderedPhrases) {
    const index = text.indexOf(phrase);
    assert.ok(index > previousIndex, `${phrase} must follow the previous transcript part`);
    previousIndex = index;
  }

  assert.equal(text.match(/How does courage show up\?/g)?.length, 1);
  assert.equal(text.includes('Coach Reflections'), false);
  assert.equal(text.includes('Turning Points'), false);
  assert.equal(text.includes('Orphaned unanswered probe'), false);
  assert.equal(document.querySelectorAll('[data-transcript-role="coach-reflection"]').length, 2);
  assert.ok(document.querySelector('[data-transcript-role="official-answer"] span[style*="color"]'));
  assert.ok(document.querySelector('[data-transcript-role="official-answer"] mark[style*="background-color"]'));
  assert.ok(document.querySelector('[data-transcript-role="official-answer"] strong'));
  assert.ok(document.querySelector('[data-transcript-role="official-answer"] li'));
  assert.equal(document.querySelector('script'), null);
});

test('PDF conversation text follows the same order and contains neither editor HTML nor known placeholders', () => {
  const coachTurns: Record<string, FlowCoachTurn> = {
    first: {
      reflection: '<p>Coach reflection one</p>',
      probe: 'Coach follow-up question',
      probe_answer: '<p>Member follow-up response</p>',
      resolution: '<p>Coach resolution text</p>',
      memory_refs: [{ id: 'memory-1', flow_slug: 'prayer', session_title: 'Earlier Prayer' }],
    },
  };
  const stream = buildFlowPDFConversationTextStream({
    session: session(),
    questions,
    coachReflections: coachTurns,
  });
  const text = stream.join('\n');

  const orderedPhrases = [
    'How does courage show up?',
    'Official answer: Official answer one highlighted truth',
    'Coach reflection: Coach reflection one',
    'Coach follow-up: Coach follow-up question',
    'Member follow-up: Member follow-up response',
    'Coach resolution: Coach resolution text',
    'Past-Flow provenance: Earlier Prayer',
    'What changes next?',
  ];
  let previousIndex = -1;
  for (const phrase of orderedPhrases) {
    const index = text.indexOf(phrase);
    assert.ok(index > previousIndex, `${phrase} must follow the previous PDF transcript part`);
    previousIndex = index;
  }

  assert.equal(text.match(/How does courage show up\?/g)?.length, 1);
  assert.equal(/<\/?[a-z][^>]*>/i.test(text), false);
  assert.equal(text.includes('{theme_name}'), false);
  assert.equal(text.includes('Coach Reflections'), false);
});

test('a Flow without Coach content still builds and exports its official conversation', () => {
  const conversation = buildFlowConversation(questions, responses, {});
  assert.equal(conversation.length, 3);
  assert.equal(conversation.some((turn) => turn.coach), false);

  const text = buildFlowPDFConversationTextStream({
    session: session(),
    questions,
    coachReflections: {},
  }).join('\n');
  assert.match(text, /Your Flow Conversation/);
  assert.match(text, /Official answer two/);
  assert.equal(text.includes('Coach reflection:'), false);
});
