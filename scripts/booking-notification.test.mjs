import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
const source = stripTypeScriptTypes(readFileSync(new URL('../supabase/functions/send-booking-notification/index.ts', import.meta.url), 'utf8').replace(/^import .*;\n/gm, ''));
const lead = { source: 'standard-fit-prep', session_id: 'session_synthetic_prep_001', full_name: 'Synthetic Prep Contact', email: 'prep@example.test', cell_phone: '(260) 555-0100',
  primary_carrier: 'Example Carrier', whats_working: 'Referrals', whats_not_working: 'Manual tracking', desired_outcome: 'A consistent process' };
const receipt = '12345678-1234-1234-1234-123456789abc';
function fixture({ providerStatus = 200, crmStatus = 200, crmBody = { ok: true, receipt_id: receipt }, configured = true, providerThrows = false } = {}) {
  const requests = []; let handler;
  new Function('serve', 'Deno', 'fetch', 'Response', 'AbortSignal', 'console', source)(
    value => { handler = value; }, { env: { get: key => key === 'AGENCYBRAIN_LEAD_INTAKE_URL' ? undefined : key === 'AGENCYBRAIN_LEAD_INTAKE_SECRET' && !configured ? undefined : 'synthetic-key' } },
    async (url, options) => {
      requests.push({ url, ...options });
      if (url.includes('crm-lead-intake')) return Response.json(crmBody, { status: crmStatus });
      if (providerThrows) throw Error('private transport detail');
      return Response.json({ message: 'provider result' }, { status: providerStatus });
    }, Response, AbortSignal, { log() {}, error() {} },
  );
  return { requests, send: (body = lead, method = 'POST') => handler(new Request('https://example.test', { method, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) })) };
}
test('completion saves all prep answers to CRM before separately emailing Mary and info', async () => {
  const f = fixture();
  const long = { ...lead, whats_working: 'A'.repeat(3000), whats_not_working: 'B'.repeat(3000), desired_outcome: 'C'.repeat(3000) };
  const response = await f.send(long);
  assert.deepEqual(await response.json(), { ok: true, crm: 'saved', notify: 'sent' });
  assert.equal(f.requests.length, 2);
  const saved = JSON.parse(f.requests[0].body);
  assert.equal(saved.form, 'booking_prep');
  assert.equal(saved.source, 'standard-fit-prep');
  assert.equal(saved.submission_key, lead.session_id);
  assert.equal(saved.name, lead.full_name);
  assert.equal(saved.phone, lead.cell_phone);
  for (const key of ['email', 'primary_carrier', 'whats_working', 'whats_not_working', 'desired_outcome']) assert.equal(saved[key], long[key]);
  assert.equal(f.requests[0].headers['x-lead-intake-secret'], 'synthetic-key');
  assert.equal(f.requests[1].url, 'https://api.resend.com/emails/batch');
  assert.equal(f.requests[1].headers['Idempotency-Key'], `booking-prep-${receipt}`);
  const messages = JSON.parse(f.requests[1].body);
  assert.deepEqual(messages.map(message => message.to), [['mary@standardplaybook.com'], ['info@standardplaybook.com']]);
  for (const message of messages) for (const key of ['full_name','email','cell_phone','primary_carrier','whats_working','whats_not_working','desired_outcome']) assert.ok(message.html.includes(long[key]));
});
test('email rejection or timeout cannot erase a successfully saved prep receipt', async () => {
  for (const options of [{ providerStatus: 403 }, { providerThrows: true }]) {
    const response = await fixture(options).send();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, crm: 'saved', notify: 'failed' });
  }
});
test('missing configuration, rejected CRM writes and unconfirmed receipts never report success', async () => {
  for (const options of [{ configured: false }, { crmStatus: 503 }, { crmBody: { ok: false } }, { crmBody: { ok: true } }]) {
    const f = fixture(options); const response = await f.send();
    assert.equal(response.status, 500);
    assert.match((await response.json()).error, /contact info@standardplaybook.com/);
    assert.ok(f.requests.every(request => !request.url.includes('api.resend.com')));
  }
});
test('preflight and incomplete or oversized submissions have no external side effects', async () => {
  const f = fixture(); assert.equal((await f.send(null, 'OPTIONS')).status, 200);
  for (const body of [null, {}, { full_name: lead.full_name }, { ...lead, desired_outcome: null }, { ...lead, whats_working: 'x'.repeat(20001) }]) assert.equal((await f.send(body)).status, 500);
  assert.equal(f.requests.length, 0);
});
test('prep answers remain plain text inside notification HTML', async () => {
  const f = fixture(); await f.send({ ...lead, whats_working: '<script>alert("x")</script>' });
  const html = JSON.parse(f.requests[1].body)[0].html;
  assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;'));
});

// Execute the actual React submit callback without a browser or live Supabase connection.
const formSource = readFileSync(new URL('../src/components/BookingOnboardingForm.tsx', import.meta.url), 'utf8');
const callback = stripTypeScriptTypes(formSource.slice(formSource.indexOf('  const handleComplete = async'), formSource.indexOf('\n  if (isLoading)')));
function submissionFixture() {
  let resolve; const pending = new Promise(done => { resolve = done; });
  const state = { completed: 0, invoked: 0, error: null, busy: false };
  const mounted = { current: true }; const submitting = { current: false };
  const supabase = { from: () => ({ update: () => ({ eq: async () => ({ error: null }) }) }), functions: { invoke: () => { state.invoked++; return pending; } } };
  const run = new Function('supabase','isStep2Valid','submitting','formData','source','sessionId','setSubmitError','setIsSubmitting','mounted','onCompleteRedirectUrl','onComplete','programName','window','console', callback+'; return handleComplete;')(
    supabase, () => true, submitting, lead, lead.source, 'synthetic-session', value => { state.error=value; }, value => { state.busy=value; }, mounted,
    undefined, () => { state.completed++; }, undefined, {}, { error() {} });
  return { state, mounted, run, resolve };
}
test('the form waits for a saved CRM receipt and blocks double submission', async () => {
  const f=submissionFixture(); const first=f.run(); await Promise.resolve(); await f.run();
  assert.equal(f.state.invoked,1); assert.equal(f.state.completed,0); assert.equal(f.state.busy,true);
  f.resolve({ data: { ok:true, crm:'saved' }, error:null }); await first;
  assert.equal(f.state.completed,1); assert.equal(f.state.busy,false);
});
test('failed or closed form submissions never advance to the success screen', async () => {
  for (const closed of [false,true]) {
    const f=submissionFixture(); const run=f.run(); await Promise.resolve(); f.mounted.current=!closed;
    f.resolve(closed ? { data:{ ok:true, crm:'saved' },error:null } : { data:null,error:{ message:'private backend detail' } }); await run;
    assert.equal(f.state.completed,0);
    if(!closed) assert.match(f.state.error,/contact info@standardplaybook.com/);
  }
});
