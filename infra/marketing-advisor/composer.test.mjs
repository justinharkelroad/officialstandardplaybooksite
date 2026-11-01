import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import { replyBubbles, bubblePause, waitForBubble } from './public/messages.mjs';

const source = (await readFile(new URL('./public/chat.js', import.meta.url), 'utf8')).replace(/^import .*\n/, '');
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const response = value => ({ ok: true, json: async () => value });
function harness(fetch) {
 const elements = new Map();
 const element = () => ({ value: '', hidden: true, children: [], append(child) { this.children.push(child); }, replaceChildren() { this.children = []; }, addEventListener() {}, focus() {} });
 const get = id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
 runInNewContext(source, { document: { getElementById: get, createElement: element, body: { dataset: {} } }, location: { href: 'https://chat.example/?brand=standard' }, localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} }, URL, AbortSignal, AbortController, crypto: webcrypto, fetch, replyBubbles, bubblePause, waitForBubble });
 return { get, send: () => get('composer').onsubmit({ preventDefault() {} }) };
}
const chat = { brand: 'standard', messages: [] };

test('send clears the composer before session creation and throughout the pending reply', async () => {
 const start = deferred(), reply = deferred(), requested = deferred();
 const ui = harness(async path => { if (path === '/api/session') return start.promise; requested.resolve(); return reply.promise; });
 ui.get('message').value = 'My team is missing their goals.';
 const sending = ui.send();
 assert.equal(ui.get('message').value, '');
 assert.equal(ui.get('send').disabled, true);
 start.resolve(response({ token: 'synthetic', session: chat }));
 await requested.promise;
 assert.equal(ui.get('message').value, '');
 assert.equal(ui.get('messages').children.at(-1).textContent, 'My team is missing their goals.');
 reply.resolve(response({ ...chat, messages: [{ role: 'assistant', text: 'What happened this week?', actions: [] }] }));
 await sending;
 assert.equal(ui.get('message').value, '');
 assert.equal(ui.get('send').disabled, false);
});

test('a failed reply restores the draft and retries with the same request ID', async () => {
 const requests = [];
 const ui = harness(async (path, options) => {
  if (path === '/api/session') return response({ token: 'synthetic', session: chat });
  requests.push(JSON.parse(options.body));
  if (requests.length === 1) throw new DOMException('Timed out', 'TimeoutError');
  return response({ ...chat, messages: [{ role: 'assistant', text: 'What happened this week?', actions: [] }] });
 });
 const draft = '  My team is missing their goals.  ';
 ui.get('message').value = draft;
 await ui.send();
 assert.equal(ui.get('message').value, draft);
 assert.equal(ui.get('message').readOnly, false);
 assert.match(ui.get('error').textContent, /Send again/);
 await ui.send();
 assert.equal(requests[0].requestId, requests[1].requestId);
 assert.equal(ui.get('message').value, '');
});

test('session creation failure restores the draft without losing it', async () => {
 const ui = harness(async () => { throw new Error('Connection unavailable'); });
 ui.get('message').value = 'Help with my team';
 await ui.send();
 assert.equal(ui.get('message').value, 'Help with my team');
 assert.equal(ui.get('send').disabled, false);
 assert.equal(ui.get('typing').hidden, true);
});
