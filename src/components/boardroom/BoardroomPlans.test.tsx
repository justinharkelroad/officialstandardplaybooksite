import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import BoardroomPlanChoices, { type CheckoutAudience } from './BoardroomPlanChoices';
import { watchCheckoutAudience } from './checkoutAudience';

const expected = [
  ['Boardroom', '$399', 'https://buy.stripe.com/cNi6oH2CGeP4aWcbC44Vy0z'],
  ['Boardroom Plus', '$549', 'https://buy.stripe.com/28E00j2CGgXcc0gcG84Vy0K'],
  ['Boardroom Pro', '$699', 'https://buy.stripe.com/bJe8wP3GKfT89S835y4Vy0L'],
];

for (const audience of ['checking', 'signed-out', 'signed-in', 'error'] as const) {
  test(`no purchase links before new-customer confirmation (${audience})`, () => {
    const html = renderToStaticMarkup(<BoardroomPlanChoices audience={audience} />);
    assert.ok(!html.includes('buy.stripe.com'));
    assert.equal((html.match(/disabled=""/g) ?? []).length, 3);
    if (audience === 'signed-in') {
      assert.ok(!html.includes('type="checkbox"'));
      assert.match(html, /avoid a second subscription/);
    }
  });
}

test('each displayed price and tier opens its exact checkout only after explicit confirmation', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/boardroom' });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const container = dom.window.document.getElementById('root')!;
  const root = createRoot(container);
  const render = async (audience: CheckoutAudience) => act(() => root.render(<BoardroomPlanChoices key={audience} audience={audience} />));
  try {
    await render('signed-out');
    assert.equal(container.querySelectorAll('a[href^="https://buy.stripe.com"]').length, 0);
    await act(() => (container.querySelector('input') as HTMLInputElement).click());
    for (const [name, price, url] of expected) {
      const card = container.querySelector(`article[aria-label="${name}"]`)!;
      assert.equal(card.querySelector('.br-plan-price strong')?.textContent, price);
      assert.equal(card.querySelector('.br-plan-price span')?.textContent, '/month');
      assert.equal(card.querySelector('a')?.getAttribute('href'), url);
      assert.equal(card.querySelector('a')?.getAttribute('target'), '_blank');
      assert.match(card.querySelector('a')?.getAttribute('rel') ?? '', /noopener/);
    }
    assert.match(container.textContent!, /240 minutes per month/);
    assert.match(container.textContent!, /600 Studio roleplay minutes per month/);
    assert.ok(!container.textContent!.includes('$197'));
    await act(() => (container.querySelector('input') as HTMLInputElement).click());
    assert.equal(container.querySelectorAll('a[href^="https://buy.stripe.com"]').length, 0);
    await act(() => (container.querySelector('input') as HTMLInputElement).click());
    await render('signed-in');
    assert.equal(container.querySelectorAll('a[href^="https://buy.stripe.com"]').length, 0);
    await render('signed-out');
    assert.equal(container.querySelectorAll('a[href^="https://buy.stripe.com"]').length, 0);
  } finally {
    await act(() => root.unmount());
    dom.window.close();
  }
});

type Auth = Parameters<typeof watchCheckoutAudience>[0];
test('a sign-in event wins over an older signed-out snapshot; cleanup stops updates', async () => {
  let event: (name: string, session: unknown) => void;
  let complete: (result: unknown) => void;
  let unsubscribed = false;
  const states: CheckoutAudience[] = [];
  const auth = {
    onAuthStateChange(callback: typeof event) { event = callback; return { data: { subscription: { unsubscribe() { unsubscribed = true; } } } }; },
    getSession() { return new Promise((resolve) => { complete = resolve; }); },
  } as unknown as Auth;
  const stop = watchCheckoutAudience(auth, (state) => states.push(state));
  event!('SIGNED_IN', { user: { id: 'existing-member' } });
  complete!({ data: { session: null }, error: null });
  await Promise.resolve();
  assert.deepEqual(states, ['checking', 'signed-in']);
  stop();
  event!('SIGNED_OUT', null);
  assert.equal(states[states.length - 1], 'signed-in');
  assert.equal(unsubscribed, true);
});

test('auth failure and a stalled session check fail closed', async () => {
  for (const getSession of [() => Promise.reject(new Error('offline')), () => new Promise(() => {})]) {
    const states: CheckoutAudience[] = [];
    const auth = { getSession, onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) } as unknown as Auth;
    const stop = watchCheckoutAudience(auth, (state) => states.push(state), 5);
    await new Promise((resolve) => setTimeout(resolve, 15));
    assert.deepEqual(states, ['checking', 'error']);
    stop();
  }
});

test('an empty initial auth event cannot turn a failed session lookup into permission to buy', async () => {
  const states: CheckoutAudience[] = [];
  const auth = {
    onAuthStateChange(callback: (event: string, session: unknown) => void) {
      callback('INITIAL_SESSION', null);
      return { data: { subscription: { unsubscribe() {} } } };
    },
    getSession: async () => ({ data: { session: null }, error: new Error('unavailable') }),
  } as unknown as Auth;
  const stop = watchCheckoutAudience(auth, (state) => states.push(state));
  await Promise.resolve();
  assert.deepEqual(states, ['checking', 'error']);
  stop();
});

test('purchase links have one public owner and cannot enter signed-in routes or bypass the chooser', () => {
  const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
  const src = resolve('src');
  for (const path of files(src).filter((path) => /\.[jt]sx?$/.test(path) && !path.includes('.test.'))) {
    const text = readFileSync(path, 'utf8');
    for (const [, , url] of expected) {
      if (text.includes(url)) assert.equal(path, resolve('src/components/boardroom/BoardroomPlanChoices.tsx'), `unguarded checkout in ${path}`);
    }
    if (path.startsWith(resolve('src/app') + '/')) assert.ok(!/BoardroomPlanChoices|boardroom\/BoardroomPricing/.test(text), `public checkout imported on member surface: ${path}`);
  }
  const routes = readFileSync('src/App.tsx', 'utf8');
  assert.match(routes, /path="\/boardroom" element=\{<BoldBoardroom \/>\}/);
  assert.match(routes, /path="\/app\/\*" element=\{<Suspense fallback=\{null\}><MemberApp \/>/);
  const page = readFileSync('src/pages/BoldBoardroom.tsx', 'utf8');
  assert.match(page, /<BoardroomPricing \/>/);
  assert.ok(!page.includes('STRIPE_JOIN'));
  assert.match(page, /const PLAN_CHOICES = '#pricing'/);
});
