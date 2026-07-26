#!/usr/bin/env node
/**
 * Guards against FACTUAL contradiction between the two copy sources that
 * describe the same route:
 *
 *   scripts/og-routes.json  -> baked into dist/<route>/index.html by og-stamp.mjs.
 *                              This is what social scrapers and search engines read.
 *   src/data/seoConfig.ts   -> applied at runtime by the useSEO() hook.
 *
 * The two are ALLOWED to word things differently: a social card caption and a
 * search snippet have different jobs. What they may NOT do is state different
 * FACTS. On 2026-07-26 og-routes.json said the Ascension was "Ninety days"
 * while every other source said 12 weeks, and it shipped to Google for hours
 * because nothing compared them. A plain digit grep could not catch it, because
 * the number was spelled out.
 *
 * Compares: durations (digit AND word form) and dollar amounts.
 * Exit 1 on conflict.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const WORD_NUM = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, ninety: 90,
};

// Normalise "Ninety days", "90-day", "90 days" all to "90d".
function durations(text) {
  const out = new Set();
  const unit = (u) => (/^w/i.test(u) ? 'w' : 'd');
  for (const m of text.matchAll(/(\d+)[\s-]*(day|days|week|weeks)\b/gi)) {
    out.add(`${m[1]}${unit(m[2])}`);
  }
  // Compound tens FIRST, so "Forty-two days" is read as 42 and never as the
  // substring "two days". Found by this checker flagging its own output.
  const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
  const UNITS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
  const tens = Object.keys(TENS).join('|');
  const units = Object.keys(UNITS).join('|');
  let scrubbed = text;
  for (const m of text.matchAll(new RegExp(`\\b(${tens})[\\s-](${units})[\\s-]*(day|days|week|weeks)\\b`, 'gi'))) {
    out.add(`${TENS[m[1].toLowerCase()] + UNITS[m[2].toLowerCase()]}${unit(m[3])}`);
    scrubbed = scrubbed.replace(m[0], ' ');
  }
  // Simple word forms. The lookbehind stops a hyphenated compound's second half
  // from matching on its own.
  const words = Object.keys(WORD_NUM).join('|');
  for (const m of scrubbed.matchAll(new RegExp(`(?<![-A-Za-z])(${words})[\\s-]*(day|days|week|weeks)\\b`, 'gi'))) {
    out.add(`${WORD_NUM[m[1].toLowerCase()]}${unit(m[2])}`);
  }
  return out;
}

function money(text) {
  return new Set([...text.matchAll(/\$[\d,]+(?:\.\d{2})?/g)].map((m) => m[0].replace(/,/g, '')));
}

function seoBlocks(ts) {
  const out = {};
  for (const m of ts.matchAll(/^ {2}'([^']+)': \{(.*?)^ {2}\},/gms)) out[m[1]] = m[2];
  return out;
}
function field(block, name) {
  const m =
    block.match(new RegExp(`${name}:\\s*'((?:[^'\\\\]|\\\\.)*)'`)) ||
    block.match(new RegExp(`${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1] : '';
}

export function findConflicts(ogRoutes, seoTs) {
  const blocks = seoBlocks(seoTs);
  const conflicts = [];
  for (const route of Object.keys(ogRoutes)) {
    const block = blocks[route];
    if (!block) continue; // no counterpart to compare against
    const a = `${ogRoutes[route].title || ''} ${ogRoutes[route].subhead || ''} ${ogRoutes[route].metaTitle || ''}`;
    const b = `${field(block, 'title')} ${field(block, 'description')}`;
    for (const [label, fn] of [['duration', durations], ['price', money]]) {
      const sa = fn(a);
      const sb = fn(b);
      // Only a genuine contradiction counts: both state something, and they disagree.
      if (sa.size && sb.size) {
        const onlyA = [...sa].filter((x) => !sb.has(x));
        const onlyB = [...sb].filter((x) => !sa.has(x));
        if (onlyA.length && onlyB.length) {
          conflicts.push({ route, label, og: [...sa], seo: [...sb] });
        }
      }
    }
  }
  return conflicts;
}

/**
 * Retired offers must not appear on ANY publishing surface.
 *
 * Added 2026-07-26 after the duration check missed a worse bug: the Owner
 * Challenge was retired that morning, yet it was still named in seoConfig.ts,
 * structuredData.ts, and a hardcoded JSON-LD offer catalog in index.html that
 * every page on the site served. Comparing two files against each other could
 * never have caught it, because both agreed and both were wrong.
 *
 * Phrases must be specific. Bare "Stack" is legitimate (Discovery Stack, tech
 * stack, font stack), so only the offer-shaped phrases are listed.
 */
const RETIRED_OFFERS = [
  'Owner Challenge',
  'Producer Power-Up',
  'Standard Stack',
  'Arsenal Level',
  'FORMULA50',
  'STANDARD50',
];

const PUBLISHING_SURFACES = [
  'scripts/og-routes.json',
  'src/data/seoConfig.ts',
  'src/data/structuredData.ts',
  'index.html',
  'public/sitemap.xml',
  // Added after the 5-surface version reported OK while the built site still
  // shipped a retired offer in these two. They are written for AI crawlers and
  // robots.txt sets their Content-Type, so they are publishing surfaces.
  'public/llms.txt',
  'public/llms-full.txt',
];

export function findRetired(readFile) {
  const hits = [];
  for (const file of PUBLISHING_SURFACES) {
    let text;
    try {
      text = readFile(file);
    } catch {
      continue;
    }
    for (const offer of RETIRED_OFFERS) {
      const n = text.split(offer).length - 1;
      if (n) hits.push({ file, offer, count: n });
    }
  }
  return hits;
}

const ogRoutes = JSON.parse(readFileSync(join(ROOT, 'scripts/og-routes.json'), 'utf8')).routes;
const seoTs = readFileSync(join(ROOT, 'src/data/seoConfig.ts'), 'utf8');
const conflicts = findConflicts(ogRoutes, seoTs);

const retired = findRetired((f) => readFileSync(join(ROOT, f), 'utf8'));
if (retired.length) {
  console.error('\nRETIRED OFFER STILL PUBLISHED\n');
  for (const r of retired) {
    console.error(`  ${r.file}  "${r.offer}"  x${r.count}`);
  }
  console.error('\nThis offer was retired. It must not appear on a publishing surface.\n');
  process.exit(1);
}

if (conflicts.length) {
  console.error('\nOG CONSISTENCY FAILED: og-routes.json contradicts seoConfig.ts\n');
  for (const c of conflicts) {
    console.error(`  ${c.route}  [${c.label}]`);
    console.error(`     og-routes.json : ${c.og.join(', ')}`);
    console.error(`     seoConfig.ts   : ${c.seo.join(', ')}\n`);
  }
  console.error('These are the same fact stated two different ways. Fix both, then rebuild.\n');
  process.exit(1);
}
console.log(`OG consistency OK: ${Object.keys(ogRoutes).length} stamped routes, ${PUBLISHING_SURFACES.length} surfaces scanned for ${RETIRED_OFFERS.length} retired offers`);
