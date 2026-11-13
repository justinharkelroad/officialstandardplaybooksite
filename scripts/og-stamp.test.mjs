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

test('stamps og:video tags only for routes that declare a video', () => {
  const root = mkdtempSync(join(tmpdir(), 'prep-og-'));
  try {
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'dist'));
    mkdirSync(join(root, 'src/data'), { recursive: true });
    copyFileSync(new URL('../src/data/boardroomSchema.mjs', import.meta.url), join(root, 'src/data/boardroomSchema.mjs'));
    copyFileSync(new URL('./og-stamp.mjs', import.meta.url), join(root, 'scripts/og-stamp.mjs'));
    writeFileSync(join(root, 'scripts/og-routes.json'), JSON.stringify({ routes: {
      '/prep': { title: 'Prep', subhead: 'Prep', image: '/og/prep.jpg', video: '/video/prep-og.mp4' },
      '/calls': { title: 'Calls', subhead: 'Calls', image: '/og/calls.png' },
    } }));
    writeFileSync(join(root, 'dist/index.html'), `<html><head><title>Original</title>
      <meta property="og:image" content="Original">
      <link rel="canonical" href="https://example.com">
      </head></html>`);
    execFileSync(process.execPath, [join(root, 'scripts/og-stamp.mjs')], {
      env: { ...process.env, BASE_URL: 'https://standardplaybook.com' },
    });
    const prep = new JSDOM(readFileSync(join(root, 'dist/prep/index.html'), 'utf8')).window.document;
    const meta = (doc, key) => doc.querySelector(`meta[property="${key}"]`)?.content;
    assert.equal(meta(prep, 'og:image'), 'https://standardplaybook.com/og/prep.jpg');
    assert.equal(meta(prep, 'og:video'), 'https://standardplaybook.com/video/prep-og.mp4');
    assert.equal(meta(prep, 'og:video:secure_url'), 'https://standardplaybook.com/video/prep-og.mp4');
    assert.equal(meta(prep, 'og:video:type'), 'video/mp4');
    assert.equal(meta(prep, 'og:video:width'), '1200');
    assert.equal(meta(prep, 'og:video:height'), '630');
    const calls = new JSDOM(readFileSync(join(root, 'dist/calls/index.html'), 'utf8')).window.document;
    assert.equal(calls.querySelectorAll('meta[property^="og:video"]').length, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
