import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';

// Execute the actual Edge handler; stub only Deno's server/env and the provider transport.
// No installed packages, credentials, database access or real emails are needed.
const source = stripTypeScriptTypes(readFileSync(new URL('../supabase/functions/send-booking-notification/index.ts', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, ''));
const lead = {
  full_name: 'Synthetic Prep Contact', email: 'prep@example.test', cell_phone: '(260) 555-0100',
  primary_carrier: 'Example Carrier', whats_working: 'Referrals', whats_not_working: 'Manual tracking',
  desired_outcome: 'A consistent process',
};
function fixture(providerStatus = 200) {
  const requests = [];
  let handler;
  new Function('serve', 'Deno', 'fetch', 'Response', 'AbortSignal', 'console', source)(
    value => { handler = value; }, { env: { get: () => 'synthetic-key' } },
    async (url, options) => {
      requests.push({ url, ...options });
      return Response.json(providerStatus === 200 ? { data: [{ id: 'one' }, { id: 'two' }] } : { message: 'private provider detail' }, { status: providerStatus });
    }, Response, AbortSignal, { log() {}, error() {} },
  );
  return { requests, send: (body = lead, method = 'POST') => handler(new Request('https://example.test', {
    method, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
  })) };
}

test('completion sends Mary and the existing inbox separate messages with every prep answer', async () => {
  const f = fixture();
  assert.equal((await f.send()).status, 200);
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].url, 'https://api.resend.com/emails/batch');
  const messages = JSON.parse(f.requests[0].body);
  assert.deepEqual(messages.map(message => message.to), [['mary@standardplaybook.com'], ['info@standardplaybook.com']]);
  for (const message of messages) {
    assert.equal(message.subject, 'New Booking Lead: Synthetic Prep Contact');
    for (const answer of Object.values(lead)) assert.ok(message.html.includes(answer));
  }
});

test('provider rejection is a failure without leaking provider internals', async () => {
  const f = fixture(403);
  const response = await f.send();
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: 'The notification could not be sent. Please contact info@standardplaybook.com.' });
});

test('preflight and incomplete contact information never send mail', async () => {
  const f = fixture();
  assert.equal((await f.send(null, 'OPTIONS')).status, 200);
  for (const body of [null, {}, { full_name: lead.full_name }, { email: lead.email }]) {
    assert.equal((await f.send(body)).status, 500);
  }
  assert.equal(f.requests.length, 0);
});
