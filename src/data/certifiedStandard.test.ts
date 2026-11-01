import assert from 'node:assert/strict';
import test from 'node:test';
import { getCertifiedStandardHandoff } from './certifiedStandard';

test('purchase handoff carries homepage source before the verified pricing hash', () => {
  const url = new URL(getCertifiedStandardHandoff('?src=home-programs'));
  assert.equal(url.origin, 'https://myagencybrain.com');
  assert.equal(url.pathname, '/certifiedstandard');
  assert.equal(url.hash, '#pricing');
  assert.equal(url.searchParams.get('src'), 'home-programs');
  assert.equal(url.searchParams.get('utm_source'), 'standardplaybook');
  assert.equal(url.searchParams.get('utm_medium'), 'referral');
});

test('preserves explicit campaign data without forwarding unrelated or private parameters', () => {
  const search = '?src=home-band&utm_source=owner-news&utm_medium=email&utm_campaign=fall&utm_content=guide&utm_term=producer&email=private@example.com&token=secret&redirect=https://elsewhere.test';
  const url = new URL(getCertifiedStandardHandoff(search));
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    src: 'home-band', utm_source: 'owner-news', utm_medium: 'email',
    utm_campaign: 'fall', utm_content: 'guide', utm_term: 'producer',
  });
  assert.equal(url.hash, '#pricing');
});

test('program exploration is unfragmented and empty campaign values use safe defaults', () => {
  const url = new URL(getCertifiedStandardHandoff('?src=&utm_campaign=', 'program'));
  assert.equal(url.hash, '');
  assert.equal(url.searchParams.get('src'), 'coaching-site');
  assert.equal(url.searchParams.get('utm_campaign'), 'certified-standard');
});
