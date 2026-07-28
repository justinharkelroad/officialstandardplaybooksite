#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";
import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..");
const outputPath = join(root, "public/og/calls.png");

const asDataUrl = (filePath, mimeType) =>
  `data:${mimeType};base64,${readFileSync(filePath).toString("base64")}`;
const bufferAsDataUrl = (buffer, mimeType) =>
  `data:${mimeType};base64,${buffer.toString("base64")}`;

const antonUrl = asDataUrl(join(root, "scripts/assets/Anton-Regular.ttf"), "font/ttf");
const interUrl = asDataUrl(join(root, "scripts/assets/Inter-Variable.ttf"), "font/ttf");
const photoUrl = asDataUrl(join(root, "scripts/assets/calls-og-photo.png"), "image/png");
const wordmarkBuffer = await sharp(join(root, "src/assets/standard-word-logo.png"))
  .trim()
  .png()
  .toBuffer();
const wordmarkUrl = bufferAsDataUrl(wordmarkBuffer, "image/png");

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
        background: var(--ink);
      }

      body {
        position: relative;
        color: var(--paper);
        font-family: "SP Inter", sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      .photo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        filter: saturate(0.84) contrast(1.08) brightness(0.76);
      }

      .grade {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(10, 10, 11, 0.98) 0%, rgba(10, 10, 11, 0.94) 31%, rgba(10, 10, 11, 0.66) 57%, rgba(10, 10, 11, 0.12) 100%),
          linear-gradient(0deg, rgba(10, 10, 11, 0.76) 0%, transparent 34%, rgba(10, 10, 11, 0.18) 100%);
      }

      .noise {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E");
      }

      .blue-rail {
        position: absolute;
        inset: 0 auto 0 0;
        width: 14px;
        background: var(--blue);
      }

      .frame {
        position: absolute;
        inset: 28px 30px 28px 44px;
        border-top: 2px solid rgba(244, 242, 238, 0.82);
        border-bottom: 2px solid rgba(244, 242, 238, 0.82);
      }

      .topline {
        position: absolute;
        top: 48px;
        right: 50px;
        left: 49px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .wordmark {
        width: 145px;
        height: auto;
        object-fit: contain;
      }

      .eyebrow,
      .call-label,
      .lower-copy {
        font-family: "SP Inter", sans-serif;
        font-weight: 800;
        text-transform: uppercase;
      }

      .eyebrow {
        font-size: 13px;
        line-height: 1;
        letter-spacing: 3.6px;
      }

      .headline {
        position: absolute;
        top: 137px;
        left: 48px;
        margin: 0;
        font-family: "SP Anton", sans-serif;
        font-size: 116px;
        font-weight: 400;
        line-height: 0.82;
        letter-spacing: -1.8px;
        text-transform: uppercase;
      }

      .headline span {
        display: block;
      }

      .headline .offset {
        margin-left: 65px;
      }

      .headline .blue {
        color: var(--blue);
      }

      .call-stack {
        position: absolute;
        top: 130px;
        right: 43px;
        display: grid;
        gap: 8px;
        width: 245px;
      }

      .call-label {
        display: flex;
        height: 43px;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px 0 16px;
        border: 1px solid rgba(244, 242, 238, 0.48);
        color: var(--paper);
        background: rgba(10, 10, 11, 0.74);
        font-size: 12px;
        letter-spacing: 2.1px;
        backdrop-filter: blur(8px);
      }

      .call-label.flagship {
        border-color: var(--blue);
        color: var(--ink);
        background: var(--blue);
      }

      .index {
        opacity: 0.66;
      }

      .flagship .index {
        opacity: 1;
      }

      .lower {
        position: absolute;
        right: 50px;
        bottom: 48px;
        left: 49px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }

      .lower-copy {
        font-size: 14px;
        line-height: 1;
        letter-spacing: 2.5px;
      }

      .lower-copy .dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin: 0 14px 2px;
        border-radius: 50%;
        background: var(--blue);
      }

      .url {
        color: var(--blue);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <img class="photo" src="${photoUrl}" alt="">
    <div class="grade"></div>
    <div class="noise"></div>
    <div class="blue-rail"></div>
    <div class="frame"></div>

    <div class="topline">
      <img class="wordmark" src="${wordmarkUrl}" alt="">
      <div class="eyebrow">Recurring Calls / The Standard Playbook</div>
    </div>

    <h1 class="headline">
      <span>The</span>
      <span class="offset">Standard</span>
      <span class="blue">Cadence.</span>
    </h1>

    <div class="call-stack">
      <div class="call-label"><span>AgencyBrain</span><span class="index">01</span></div>
      <div class="call-label flagship"><span>Boardroom</span><span class="index">02</span></div>
      <div class="call-label"><span>AI</span><span class="index">03</span></div>
    </div>

    <div class="lower">
      <div class="lower-copy">
        Show Up <span class="dot"></span> Cameras On <span class="dot"></span> Get Better
      </div>
      <div class="url">standardplaybook.com/calls</div>
    </div>
  </body>
</html>`;

const browserProfile = mkdtempSync(join(tmpdir(), "sp-calls-og-chrome-"));
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
    anton: document.fonts.check('116px "SP Anton"'),
    inter: document.fonts.check('14px "SP Inter"'),
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

console.log(`Created ${outputPath} with the calls artwork, official wordmark, Anton, and Inter`);
