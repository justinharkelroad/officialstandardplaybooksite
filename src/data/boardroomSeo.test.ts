import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { seoConfig } from './seoConfig';
import { structuredDataByRoute } from './structuredData';
import { boardroomServiceSchema } from './boardroomSchema.mjs';
import BoardroomPlanChoices from '../components/boardroom/BoardroomPlanChoices';

const expected = [
  { name: 'Boardroom', price: '399', software: 'Agency Brain Core' },
  { name: 'Boardroom Plus', price: '549', software: 'Agency Brain Plus' },
  { name: 'Boardroom Pro', price: '699', software: 'Agency Brain Pro' },
];
const html = () => new JSDOM(readFileSync('dist/boardroom/index.html', 'utf8')).window.document;
const schemas = (doc: Document) => Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map((script) => JSON.parse(script.textContent!));

test('the three schema offers match the visible plans, USD prices and monthly billing', () => {
  const doc = new JSDOM(renderToStaticMarkup(createElement(BoardroomPlanChoices, { audience: 'signed-out' }))).window.document;
  assert.equal(boardroomServiceSchema.offers.length, 3);
  assert.equal(structuredDataByRoute['/boardroom'][0], boardroomServiceSchema);
  for (const [index, plan] of expected.entries()) {
    const offer = boardroomServiceSchema.offers[index];
    const card = doc.querySelector(`article[aria-label="${plan.name}"]`)!;
    assert.equal(offer.name, plan.name);
    assert.equal(offer.price, plan.price);
    assert.equal(card.querySelector('.br-plan-price strong')?.textContent, `$${offer.price}`);
    assert.equal(card.querySelector('.br-plan-value')?.textContent ?? null, index === 0 ? '($299/mo value)' : null);
    assert.ok(offer.itemOffered.name.includes(plan.software));
    assert.equal(offer.priceCurrency, 'USD');
    assert.equal(offer.priceSpecification.price, plan.price);
    assert.equal(offer.priceSpecification.priceCurrency, 'USD');
    assert.equal(offer.priceSpecification.unitCode, 'MON');
    assert.equal(offer.priceSpecification.billingIncrement, 1);
    assert.equal(offer.url, 'https://standardplaybook.com/boardroom#pricing');
  }
  assert.ok(!JSON.stringify(boardroomServiceSchema).includes('buy.stripe.com'));
});

test('the actual Cloudflare build serves the complete offer schema without JavaScript', () => {
  const doc = html();
  const service = schemas(doc).filter((schema) => schema['@type'] === 'Service');
  assert.deepEqual(service, [boardroomServiceSchema]);
  assert.equal(doc.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]').length, 1);
  const otherPage = new JSDOM(readFileSync('dist/mirror/index.html', 'utf8')).window.document;
  assert.ok(!schemas(otherPage).some((schema) => schema['@id'] === boardroomServiceSchema['@id']));
});

test('built search, Open Graph and Twitter descriptions agree with runtime metadata on all prices', () => {
  const doc = html();
  const config = seoConfig['/boardroom'];
  assert.equal(doc.title, config.title);
  for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    const description = doc.querySelector(selector)?.getAttribute('content');
    assert.equal(description, config.description, selector);
    for (const { price } of expected) assert.ok(description?.includes(`$${price}/mo`), `${selector} missing ${price}`);
  }
  assert.equal(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'), config.canonical);
  assert.equal(doc.querySelector('meta[property="og:image"]')?.getAttribute('content'), config.ogImage);
  assert.equal(doc.querySelector('meta[property="og:type"]')?.getAttribute('content'), config.type);
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    const title = doc.querySelector(selector)?.getAttribute('content');
    for (const tier of ['Core', 'Plus', 'Pro']) assert.ok(title?.includes(tier));
  }
});

test('FAQ and AI-readable program references carry all three prices and existing-customer guidance', () => {
  const faq = JSON.stringify(structuredDataByRoute['/boardroom'].find((schema) => schema['@type'] === 'FAQPage'));
  const references = ['public/llms.txt', 'public/llms-full.txt'].map((path) => readFileSync(path, 'utf8'));
  for (const text of [faq, ...references]) {
    for (const { price } of expected) assert.ok(text.includes(`$${price}/month`));
    assert.match(text, /[Ee]xisting.*upgrade/);
  }
});
