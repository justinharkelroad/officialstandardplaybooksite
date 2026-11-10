import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { JSDOM } from 'jsdom';

test('stamps literal prices and special characters into social metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'mirror-og-'));
  try {
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'dist'));
    mkdirSync(join(root, 'src/data'), { recursive: true });
    copyFileSync(new URL('../src/data/boardroomSchema.mjs', import.meta.url), join(root, 'src/data/boardroomSchema.mjs'));
    copyFileSync(new URL('./og-stamp.mjs', import.meta.url), join(root, 'scripts/og-stamp.mjs'));
    const title = 'The Mirror Challenge | $197';
    const subhead = 'Eight weeks. $197. Systems & Rhythm. "One payment."';
    writeFileSync(join(root, 'scripts/og-routes.json'), JSON.stringify({ routes: {
      '/mirror': { title, subhead, image: '/og-image.png' },
    } }));
    writeFileSync(join(root, 'dist/index.html'), `<html><head><title>Original</title>
      <meta name="description" content="Original">
      <meta property="og:title" content="Original">
      <meta property="og:description" content="Original">
      <meta name="twitter:title" content="Original">
      <meta name="twitter:description" content="Original">
      <link rel="canonical" href="https://example.com">
      </head></html>`);
    execFileSync(process.execPath, [join(root, 'scripts/og-stamp.mjs')], {
      env: { ...process.env, BASE_URL: 'https://standardplaybook.com' },
    });
    const doc = new JSDOM(readFileSync(join(root, 'dist/mirror/index.html'), 'utf8')).window.document;
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      assert.equal(doc.querySelector(selector)?.content, subhead, selector);
    }
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      assert.equal(doc.querySelector(selector)?.content, title, selector);
    }
    assert.equal(doc.title, `${title} | The Standard Playbook`);
    assert.equal(doc.querySelector('link[rel="canonical"]').href, 'https://standardplaybook.com/mirror');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
