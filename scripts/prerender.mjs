#!/usr/bin/env node
/**
 * Post-build prerendering script.
 * Uses Puppeteer to render each route and save the static HTML to dist/.
 *
 * Usage: node scripts/prerender.mjs
 * Runs after `vite build` to generate pre-rendered HTML for each route,
 * enabling AI crawlers and search engines to see page content.
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Routes to prerender — all public-facing pages
const ROUTES = [
  '/',
  '/boardroom',
  '/directive',
  '/partnership',
  '/sales-experience',
  '/producer-power-up',
  '/owner-challenge',
  '/callscoring',
  // '/app' excluded — AppRedirect immediately navigates to external URL
  '/appinfo',
  '/about',
  '/contact',
  '/decision',
  '/privacy',
  '/terms',
  '/formulaai',
];

// MIME types for the static file server
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function createStaticServer(dir) {
  return createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    let filePath = join(dir, urlPath);

    // Try the exact path first
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath);
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(readFileSync(filePath));
      return;
    }

    // Try path/index.html
    const indexPath = join(filePath, 'index.html');
    if (existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(readFileSync(indexPath));
      return;
    }

    // SPA fallback — serve root index.html
    const rootIndex = join(dir, 'index.html');
    if (existsSync(rootIndex)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(readFileSync(rootIndex));
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });
}

async function prerender() {
  if (!existsSync(DIST)) {
    console.error('Error: dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('Starting prerender of', ROUTES.length, 'routes...\n');

  const server = createStaticServer(DIST);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Static server running on http://127.0.0.1:${port}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let success = 0;
  let failed = 0;

  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();

      // Block unnecessary resources for faster rendering
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'media', 'font'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(`http://127.0.0.1:${port}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait for React to mount
      await page.waitForSelector('#root > *', { timeout: 10000 });

      // Small delay for dynamic meta tags to settle
      await new Promise((r) => setTimeout(r, 500));

      // Get the rendered HTML
      const html = await page.content();

      // Determine output path
      const outputPath =
        route === '/'
          ? join(DIST, 'index.html')
          : join(DIST, route.slice(1), 'index.html');

      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      writeFileSync(outputPath, html);
      console.log(`  [OK] ${route} → ${outputPath.replace(DIST, 'dist')}`);
      success++;

      await page.close();
    } catch (err) {
      console.error(`  [FAIL] ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPrerender complete: ${success} succeeded, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
