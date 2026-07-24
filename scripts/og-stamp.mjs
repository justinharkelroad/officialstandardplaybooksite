#!/usr/bin/env node
/**
 * Post-build OG stamper.
 *
 * Social scrapers (iMessage/MMS, Facebook, LinkedIn) DO NOT run JavaScript,
 * so the app's runtime useSEO() hook is invisible to them. This script bakes
 * a per-program Open Graph card directly into a static HTML file per route,
 * which is exactly what scrapers read.
 *
 * For each route in scripts/og-routes.json it clones dist/index.html and
 * rewrites title / description / og:* / twitter:* / canonical, then writes
 * dist/<route>/index.html.
 *
 * BASE_URL controls the absolute URLs (og:image MUST be absolute for most
 * scrapers). Defaults to production; override for the test deploy, e.g.
 *   BASE_URL=https://standard-playbook.pages.dev node scripts/og-stamp.mjs
 *
 * Usage: node scripts/og-stamp.mjs   (run AFTER `vite build`)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const BASE_URL = (process.env.BASE_URL || 'https://standardplaybook.com').replace(/\/$/, '');

const { routes } = JSON.parse(readFileSync(join(__dirname, 'og-routes.json'), 'utf8'));

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Replace a <meta property|name="key" content="..."> value, regardless of which
// attribute (property/name) it uses and attribute order.
function setMeta(html, key, value) {
  const v = esc(value);
  const patterns = [
    new RegExp(`(<meta\\s+property="${key}"\\s+content=")[^"]*(")`, 'i'),
    new RegExp(`(<meta\\s+name="${key}"\\s+content=")[^"]*(")`, 'i'),
    new RegExp(`(<meta\\s+content=")[^"]*("\\s+property="${key}")`, 'i'),
    new RegExp(`(<meta\\s+content=")[^"]*("\\s+name="${key}")`, 'i'),
  ];
  for (const re of patterns) {
    if (re.test(html)) return html.replace(re, `$1${v}$2`);
  }
  return html; // tag not present — skip silently
}

function stamp(template, route, cfg) {
  const url = `${BASE_URL}${route}`;
  const img = `${BASE_URL}${cfg.image}`;
  const title = cfg.title;
  const desc = cfg.subhead;

  let html = template;
  const metaTitle = cfg.metaTitle || `${title} | The Standard Playbook`;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(metaTitle)}</title>`);
  html = setMeta(html, 'description', desc);
  html = setMeta(html, 'og:title', title);
  html = setMeta(html, 'og:description', desc);
  html = setMeta(html, 'og:url', url);
  html = setMeta(html, 'og:image', img);
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', desc);
  html = setMeta(html, 'twitter:image', img);
  if (cfg.robots) {
    html = setMeta(html, 'robots', cfg.robots);
    html = setMeta(html, 'googlebot', cfg.robots);
  }
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${url}$2`);
  return html;
}

function run() {
  const tplPath = join(DIST, 'index.html');
  if (!existsSync(tplPath)) {
    console.error('dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  const template = readFileSync(tplPath, 'utf8');

  let n = 0;
  for (const [route, cfg] of Object.entries(routes)) {
    const html = stamp(template, route, cfg);
    const outDir = join(DIST, route.replace(/^\//, ''));
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    console.log(`  [OK] ${route} -> dist${route}/index.html  (img ${cfg.image})`);
    n++;
  }
  console.log(`\nStamped ${n} route(s). BASE_URL=${BASE_URL}`);
}

run();
