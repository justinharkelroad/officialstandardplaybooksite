import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import BoardroomPlanChoices from './BoardroomPlanChoices';

const expected = [
  ['Boardroom', '$399', 'https://buy.stripe.com/cNi6oH2CGeP4aWcbC44Vy0z'],
  ['Boardroom Plus', '$549', 'https://buy.stripe.com/28E00j2CGgXcc0gcG84Vy0K'],
  ['Boardroom Pro', '$699', 'https://buy.stripe.com/bJe8wP3GKfT89S835y4Vy0L'],
];

test('all three public purchase buttons always point to their exact Stripe URLs', () => {
  const dom = new JSDOM(renderToStaticMarkup(<BoardroomPlanChoices />));
  const doc = dom.window.document;
  for (const [name, price, url] of expected) {
    const card = doc.querySelector(`article[aria-label="${name}"]`)!;
    assert.equal(card.querySelector('.br-plan-price strong')?.textContent, price);
    assert.equal(card.querySelector('.br-plan-cta')?.getAttribute('href'), url);
    assert.equal(card.querySelector('.br-plan-cta')?.getAttribute('target'), '_blank');
    assert.match(card.querySelector('.br-plan-cta')?.getAttribute('rel') ?? '', /noopener/);
  }
  assert.equal(doc.querySelectorAll('.br-plan-cta[href^="https://buy.stripe.com"]').length, 3);
  assert.equal(doc.querySelectorAll('input, button:disabled').length, 0);
  assert.equal(doc.querySelectorAll('.br-plan-cta[href*="myagencybrain.com"]').length, 0);
  dom.window.close();
});

test('a stored website login does not override checkout after hydration', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/boardroom' });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  dom.window.localStorage.setItem('sb-website-auth-token', JSON.stringify({ user: { id: 'website-member' }, access_token: 'test-only' }));
  const container = dom.window.document.getElementById('root')!;
  const root = createRoot(container);
  try {
    await act(() => root.render(<BoardroomPlanChoices />));
    assert.deepEqual(Array.from(container.querySelectorAll('.br-plan-cta')).map((link) => link.getAttribute('href')), expected.map(([, , url]) => url));
    assert.equal(container.querySelectorAll('input, button:disabled').length, 0);
    const wrapper = readFileSync('src/components/boardroom/BoardroomPricing.tsx', 'utf8');
    assert.ok(!/supabase|auth|audience|useEffect|useState/i.test(wrapper));
    assert.match(wrapper, /<BoardroomPlanChoices \/>/);
  } finally {
    await act(() => root.unmount());
    dom.window.close();
  }
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
