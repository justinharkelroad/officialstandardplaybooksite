#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";
import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..");
const outputPath = join(root, "public/og/app.png");

const asDataUrl = (filePath, mimeType) =>
  `data:${mimeType};base64,${readFileSync(filePath).toString("base64")}`;
const bufferAsDataUrl = (buffer, mimeType) =>
  `data:${mimeType};base64,${buffer.toString("base64")}`;

const antonUrl = asDataUrl(join(root, "scripts/assets/Anton-Regular.ttf"), "font/ttf");
const interUrl = asDataUrl(join(root, "scripts/assets/Inter-Variable.ttf"), "font/ttf");
const wordmarkBuffer = await sharp(join(root, "src/assets/standard-word-logo.png"))
  .trim()
  .png()
  .toBuffer();
const wordmarkUrl = bufferAsDataUrl(wordmarkBuffer, "image/png");
const iconUrl = asDataUrl(join(root, "src/assets/sp-icon-white.png"), "image/png");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      @font-face {
        font-family: "SP Anton";
        src: url("${antonUrl}") format("truetype");
        font-style: normal;
        font-weight: 400;
      }

      @font-face {
        font-family: "SP Inter";
        src: url("${interUrl}") format("truetype");
        font-style: normal;
        font-weight: 100 900;
      }

      :root {
        --paper: #f4f2ee;
        --ink: #0a0a0b;
        --blue: #2997ff;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 1200px;
        height: 630px;
        margin: 0;
        overflow: hidden;
        background: var(--paper);
      }

      body {
        position: relative;
        color: var(--ink);
        font-family: "SP Inter", sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      body::before {
        position: absolute;
        inset: 0;
        content: "";
        pointer-events: none;
        opacity: 0.13;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
      }

      .blue-rail {
        position: absolute;
        inset: 0 auto 0 0;
        width: 14px;
        background: var(--blue);
      }

      .left {
        position: absolute;
        inset: 0 450px 0 14px;
        padding: 30px 46px 0 34px;
      }

      .topline {
        display: flex;
        height: 65px;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: 2px solid var(--ink);
      }

      .wordmark {
        width: 154px;
        height: 46px;
        object-fit: contain;
        filter: brightness(0);
      }

      .brand-label,
      .eyebrow,
      .subhead,
      .pillars,
      .rhythm-label,
      .access-label,
      .url {
        font-family: "SP Inter", sans-serif;
        font-weight: 800;
        text-transform: uppercase;
      }

      .brand-label {
        margin-top: 14px;
        font-size: 17px;
        line-height: 1;
        letter-spacing: 5px;
      }

      .eyebrow {
        margin: 43px 0 0;
        font-size: 16px;
        line-height: 1;
        letter-spacing: 4.2px;
      }

      .headline {
        position: absolute;
        left: 34px;
        top: 198px;
        margin: 0;
        font-family: "SP Anton", sans-serif;
        font-size: 112px;
        font-weight: 400;
        line-height: 1.2;
        letter-spacing: -1px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .headline span {
        display: block;
      }

      .headline .blue {
        color: var(--blue);
      }

      .lower {
        position: absolute;
        right: 46px;
        bottom: 44px;
        left: 34px;
        padding-top: 21px;
        border-top: 2px solid var(--ink);
      }

      .subhead {
        font-size: 19px;
        line-height: 1;
        letter-spacing: 2.2px;
      }

      .pillars {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 33px;
        font-size: 14px;
        line-height: 1;
        letter-spacing: 2.4px;
      }

      .dot {
        width: 9px;
        height: 9px;
        flex: 0 0 auto;
        border-radius: 50%;
        background: var(--blue);
      }

      .right {
        position: absolute;
        inset: 0 0 0 750px;
        color: var(--paper);
        background: var(--ink);
        border-left: 12px solid var(--blue);
        padding: 46px 47px 0 32px;
      }

      .rhythm-label {
        font-size: 16px;
        line-height: 1;
        letter-spacing: 4.2px;
      }

      .rhythm-stack {
        display: grid;
        gap: 12px;
        margin-top: 30px;
      }

      .rhythm-row {
        display: flex;
        height: 82px;
        align-items: center;
        justify-content: space-between;
        padding: 0 27px 0 30px;
        color: var(--ink);
        background: var(--paper);
        box-shadow: 0 13px 22px rgba(10, 10, 11, 0.24);
      }

      .rhythm-row.today {
        height: 108px;
        color: var(--paper);
        background: var(--blue);
      }

      .rhythm-name {
        font-family: "SP Anton", sans-serif;
        font-size: 42px;
        font-weight: 400;
        line-height: 1;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .today .rhythm-name {
        font-size: 54px;
      }

      .plus {
        position: relative;
        width: 46px;
        height: 46px;
      }

      .plus::before,
      .plus::after {
        position: absolute;
        top: 20px;
        left: 4px;
        width: 38px;
        height: 6px;
        content: "";
        background: currentColor;
      }

      .plus::after {
        transform: rotate(90deg);
      }

      .clock {
        position: relative;
        width: 50px;
        height: 50px;
        border: 6px solid currentColor;
        border-radius: 50%;
      }

      .clock::before {
        position: absolute;
        top: 6px;
        left: 19px;
        width: 5px;
        height: 18px;
        content: "";
        background: currentColor;
      }

      .clock::after {
        position: absolute;
        top: 21px;
        left: 20px;
        width: 18px;
        height: 5px;
        content: "";
        background: currentColor;
        transform: rotate(35deg);
        transform-origin: left center;
      }

      .week-mark {
        display: grid;
        gap: 7px;
        width: 44px;
      }

      .week-mark i {
        display: block;
        height: 6px;
        margin-left: auto;
        background: currentColor;
      }

      .week-mark i:nth-child(1) { width: 44px; }
      .week-mark i:nth-child(2) { width: 34px; }
      .week-mark i:nth-child(3) { width: 24px; }

      .today-dot {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--paper);
      }

      .member {
        position: absolute;
        right: 47px;
        bottom: 30px;
        left: 32px;
        display: grid;
        grid-template-columns: 72px 1fr;
        column-gap: 21px;
        min-height: 80px;
        padding-top: 18px;
        border-top: 2px solid rgba(244, 242, 238, 0.18);
      }

      .sp-icon {
        width: 72px;
        height: 72px;
        object-fit: contain;
      }

      .access-copy {
        padding-top: 17px;
      }

      .access-label {
        font-size: 13px;
        line-height: 1;
        letter-spacing: 3.1px;
      }

      .url {
        margin-top: 13px;
        color: var(--blue);
        font-size: 15px;
        line-height: 1;
        letter-spacing: 2.1px;
      }
    </style>
  </head>
  <body>
    <div class="blue-rail"></div>

    <main class="left">
      <div class="topline">
        <img class="wordmark" src="${wordmarkUrl}" alt="">
        <div class="brand-label">The Standard Playbook App</div>
      </div>

      <div class="eyebrow">Your Personal Operating System / 01</div>

      <h1 class="headline">
        <span>The Standard</span>
        <span class="blue">Playbook App.</span>
      </h1>

      <div class="lower">
        <div class="subhead">Turn Quarterly Goals Into Daily Action.</div>
        <div class="pillars">
          <span>Body</span><i class="dot"></i>
          <span>Being</span><i class="dot"></i>
          <span>Balance</span><i class="dot"></i>
          <span>Business</span>
        </div>
      </div>
    </main>

    <aside class="right">
      <div class="rhythm-label">The Rhythm</div>
      <div class="rhythm-stack">
        <div class="rhythm-row">
          <span class="rhythm-name">Quarter</span>
          <i class="plus"></i>
        </div>
        <div class="rhythm-row">
          <span class="rhythm-name">Month</span>
          <i class="clock"></i>
        </div>
        <div class="rhythm-row">
          <span class="rhythm-name">Week</span>
          <i class="week-mark"><i></i><i></i><i></i></i>
        </div>
        <div class="rhythm-row today">
          <span class="rhythm-name">Today</span>
          <i class="today-dot"></i>
        </div>
      </div>

      <div class="member">
        <img class="sp-icon" src="${iconUrl}" alt="">
        <div class="access-copy">
          <div class="access-label">Member Access</div>
          <div class="url">standardplaybook.com/app</div>
        </div>
      </div>
    </aside>
  </body>
</html>`;

const browserProfile = mkdtempSync(join(tmpdir(), "sp-og-chrome-"));
let browser;

try {
  browser = await puppeteer.launch({
    headless: "new",
    userDataDir: browserProfile,
    timeout: 60000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const fontsReady = await page.evaluate(() => ({
    anton: document.fonts.check('112px "SP Anton"'),
    inter: document.fonts.check('17px "SP Inter"'),
  }));

  if (!fontsReady.anton || !fontsReady.inter) {
    throw new Error(`Brand fonts did not load: ${JSON.stringify(fontsReady)}`);
  }

  await page.screenshot({
    path: outputPath,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
} finally {
  if (browser) await browser.close();
  rmSync(browserProfile, { recursive: true, force: true });
}

console.log(`Created ${outputPath} with the official wordmark, Anton, and Inter`);
