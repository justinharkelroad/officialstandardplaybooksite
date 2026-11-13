#!/usr/bin/env node
/**
 * Renders the /prep social share card as an animated video plus a still.
 *
 *   public/video/prep-og.mp4  -> og:video (1200x630, H.264, muted, ~8s)
 *   public/og/prep.jpg        -> og:image (the video's final frame)
 *
 * Most messengers (iMessage, Telegram, SMS) only ever show og:image, so the
 * final frame is designed to stand alone as the card. The video is a bonus for
 * the surfaces that play og:video, and is reusable as a social clip.
 *
 * Every frame is a pure function of time: the page exposes seek(t) and this
 * script steps it at FPS, screenshots, and pipes the frames into ffmpeg.
 *
 * Usage: bun scripts/generate-prep-og.mjs   (needs ffmpeg on PATH)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const videoOut = join(root, "public/video/prep-og.mp4");
const posterOut = join(root, "public/og/prep.jpg");

const W = 1200;
const H = 630;
const FPS = 30;
const DURATION = 8;
const POSTER_T = 7.9;

const asDataUrl = (filePath, mimeType) =>
  `data:${mimeType};base64,${readFileSync(filePath).toString("base64")}`;

const antonUrl = asDataUrl(join(root, "scripts/assets/Anton-Regular.ttf"), "font/ttf");
const interUrl = asDataUrl(join(root, "scripts/assets/Inter-Variable.ttf"), "font/ttf");
const photoUrl = asDataUrl(join(root, "scripts/assets/calls-og-photo.png"), "image/png");
const wordmarkBuffer = await sharp(join(root, "src/assets/standard-word-logo.png")).trim().png().toBuffer();
const wordmarkUrl = `data:image/png;base64,${wordmarkBuffer.toString("base64")}`;

const check = `<svg viewBox="0 0 24 24" fill="none"><path class="tick" d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3.2" stroke-linecap="square" pathLength="1"/></svg>`;
const rays = Array.from({ length: 10 }, (_, i) => `<i style="--a:${i * 36}deg"></i>`).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
  @font-face { font-family: "SP Anton"; src: url("${antonUrl}") format("truetype"); }
  @font-face { font-family: "SP Inter"; src: url("${interUrl}") format("truetype"); font-weight: 100 900; }
  :root { --paper: #f4f2ee; --ink: #0a0a0b; --blue: #2997ff; }
  * { box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; margin: 0; overflow: hidden; background: var(--ink); }
  body { position: relative; color: var(--paper); font-family: "SP Inter", sans-serif; -webkit-font-smoothing: antialiased; }
  #stage { position: absolute; inset: 0; }
  .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% center;
    transform-origin: 72% 40%; }
  .grade { position: absolute; inset: 0; background:
    linear-gradient(90deg, rgba(10,10,11,.98) 0%, rgba(10,10,11,.93) 34%, rgba(10,10,11,.7) 56%, rgba(10,10,11,.42) 100%),
    linear-gradient(0deg, rgba(10,10,11,.8) 0%, transparent 34%, rgba(10,10,11,.25) 100%); }
  .noise { position: absolute; inset: 0; opacity: .1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E"); }
  .rail { position: absolute; left: 0; top: 0; width: 14px; height: 100%; background: var(--blue); transform-origin: top; }
  .line { position: absolute; left: 44px; right: 30px; height: 2px; background: rgba(244,242,238,.82); transform-origin: left; }
  .line.top { top: 28px; } .line.bot { bottom: 28px; }
  .topline { position: absolute; top: 48px; left: 49px; right: 50px; display: flex; align-items: center; justify-content: space-between; }
  .wordmark { width: 145px; height: auto; }
  .eyebrow, .foot { font-weight: 800; text-transform: uppercase; font-size: 13px; line-height: 1; letter-spacing: 3.6px; }
  .headline { position: absolute; left: 49px; top: 128px; transform-origin: 0 0; }
  .hl { display: block; font-family: "SP Anton", sans-serif; text-transform: uppercase; font-size: 128px; line-height: .9;
    letter-spacing: -.5px; white-space: nowrap; }
  .hl.blue { color: var(--blue); position: relative; }
  .glint { position: absolute; inset: -6px -10px; background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,.95) 50%, transparent 60%);
    background-size: 300% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; }
  .cards { position: absolute; right: 50px; top: 150px; width: 456px; display: grid; gap: 18px; }
  .card { position: relative; display: grid; grid-template-columns: 78px 1fr 46px; align-items: center; gap: 18px; height: 132px;
    padding: 0 22px; background: rgba(10,10,11,.72); border: 1.5px solid rgba(244,242,238,.4); backdrop-filter: blur(6px); }
  .card .num { font-family: "SP Anton", sans-serif; font-size: 66px; line-height: 1; color: var(--blue); }
  .card .label { font-weight: 800; text-transform: uppercase; font-size: 21px; letter-spacing: 2.6px; line-height: 1.1; }
  .card .sub { margin-top: 9px; font-size: 15px; font-weight: 500; color: rgba(244,242,238,.72); letter-spacing: .2px; }
  .bar { position: absolute; left: 0; bottom: -1.5px; height: 4px; width: 100%; background: var(--blue); transform-origin: left; }
  .box { position: relative; width: 46px; height: 46px; border: 2px solid rgba(244,242,238,.6); display: grid; place-items: center; }
  .box .fill { position: absolute; inset: -2px; background: var(--blue); }
  .box svg { position: relative; width: 30px; height: 30px; color: var(--ink); }
  .tick { stroke-dasharray: 1; }
  .rays { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
  .rays i { position: absolute; left: -2px; top: 0; width: 4px; height: 16px; background: var(--blue); transform-origin: 2px 0; }
  .ring { position: absolute; inset: -2px; border: 2px solid var(--blue); }
  .steps { display: flex; gap: 8px; margin-top: 10px; }
  .step { position: relative; overflow: hidden; font-size: 11px; font-weight: 800; letter-spacing: 2px; padding: 6px 10px;
    border: 1px solid rgba(244,242,238,.4); text-transform: uppercase; }
  .step .sf { position: absolute; inset: 0; background: var(--blue); transform-origin: left; }
  .step span { position: relative; }
  .play { display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
  .play b { width: 22px; height: 22px; border-radius: 50%; background: var(--paper); display: grid; place-items: center; }
  .play b::after { content: ""; border-left: 8px solid var(--ink); border-top: 5px solid transparent; border-bottom: 5px solid transparent; margin-left: 2px; }
  .bottom { position: absolute; left: 49px; right: 50px; bottom: 49px; display: flex; justify-content: space-between; align-items: center; }
  .foot .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--blue); margin: 0 16px 2px; }
  .url { color: var(--blue); }
  .flash { position: absolute; inset: 0; background: #fff; pointer-events: none; mix-blend-mode: screen; }
  .vig { position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 160px rgba(0,0,0,.6); }
</style></head><body>
<div id="stage">
  <img class="photo" src="${photoUrl}" alt="">
  <div class="grade"></div><div class="noise"></div>
  <div class="line top"></div><div class="line bot"></div>
  <div class="topline"><img class="wordmark" src="${wordmarkUrl}" alt=""><div class="eyebrow" id="eyebrow">Call prep / The Standard Playbook</div></div>
  <div class="headline" id="headline">
    <span class="hl" id="l1">Two things</span>
    <span class="hl" id="l2">before</span>
    <span class="hl blue" id="l3">we talk.<span class="glint" id="glint">we talk.</span></span>
  </div>
  <div class="cards">
    <div class="card" id="c1">
      <div class="num" id="n1">01</div>
      <div><div class="label">Watch the video</div><div class="play"><b></b><span>Press play first</span></div></div>
      <div class="box" id="b1"><div class="ring"></div><div class="fill"></div><div class="rays">${rays}</div>${check}</div>
      <div class="bar" id="bar1"></div>
    </div>
    <div class="card" id="c2">
      <div class="num" id="n2">02</div>
      <div><div class="label">Fill out the form</div>
        <div class="steps"><div class="step"><div class="sf"></div><span>Step 1</span></div><div class="step"><div class="sf"></div><span>Step 2</span></div><div class="step" style="border-color:transparent"><span style="color:rgba(244,242,238,.72)">~3 min</span></div></div></div>
      <div class="box" id="b2"><div class="ring"></div><div class="fill"></div><div class="rays">${rays}</div>${check}</div>
      <div class="bar" id="bar2"></div>
    </div>
  </div>
  <div class="bottom"><div class="foot" id="foot">Watch<span class="dot"></span>Fill it out<span class="dot"></span>Show up ready</div><div class="foot url" id="url">standardplaybook.com/prep</div></div>
  <div class="vig"></div>
  <div class="rail" id="rail"></div>
  <div class="flash" id="flash"></div>
</div>
<script>
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const p = (t, a, b) => clamp((t - a) / (b - a));
  const expoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const expoInOut = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  const backOut = (x, s = 2.2) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
  const cubicOut = (x) => 1 - Math.pow(1 - x, 3);
  const lerp = (a, b, x) => a + (b - a) * x;
  // Deterministic shake: decaying, pseudo-random per impact.
  const shake = (t, at, amp) => { const k = t - at; if (k < 0 || k > .35) return [0, 0]; const d = amp * Math.pow(1 - k / .35, 2);
    return [Math.sin(k * 97.3 + at) * d, Math.cos(k * 83.1 + at * 3) * d]; };
  const flashAt = (t, at, peak) => { const k = t - at; return k < 0 ? 0 : peak * Math.exp(-k * 14); };

  const HL_FINAL_SCALE = 1;
  let center; // translate that places the headline centred at the intro scale
  const INTRO_SCALE = 1.45;
  function measure() {
    const el = $("headline"); const r = el.getBoundingClientRect();
    center = { x: (${W} - r.width * INTRO_SCALE) / 2 - r.left, y: (${H} - r.height * INTRO_SCALE) / 2 - r.top };
  }

  function slam(el, t, at) {
    const x = p(t, at, at + .32);
    el.style.opacity = x > 0 ? 1 : 0;
    const s = lerp(1.9, 1, backOut(x, 1.6));
    el.style.transform = "scale(" + s + ")";
    el.style.transformOrigin = "0% 60%";
    el.style.filter = "blur(" + (1 - expoOut(x)) * 10 + "px)";
  }

  function box(id, t, at) {
    const b = $(id); const x = p(t, at, at + .28);
    b.querySelector(".fill").style.transform = "scale(" + backOut(x, 2.4) + ")";
    b.querySelector(".fill").style.opacity = x > 0 ? 1 : 0;
    b.querySelector(".tick").style.strokeDashoffset = 1 - cubicOut(p(t, at + .08, at + .34));
    b.querySelector(".tick").style.opacity = t >= at + .08 ? 1 : 0;
    b.style.borderColor = x > 0 ? "var(--blue)" : "rgba(244,242,238,.6)";
    const r = p(t, at, at + .55);
    const ring = b.querySelector(".ring");
    ring.style.transform = "scale(" + (1 + cubicOut(r) * 1.1) + ")"; ring.style.opacity = r > 0 && r < 1 ? 1 - r : 0;
    const rr = p(t, at + .02, at + .42);
    b.querySelectorAll(".rays i").forEach((i) => {
      const a = i.style.getPropertyValue("--a");
      i.style.transform = "rotate(" + a + ") translateY(" + (22 + cubicOut(rr) * 26) + "px) scaleY(" + (1 - rr) + ")";
      i.style.opacity = rr > 0 && rr < 1 ? 1 : 0;
    });
  }

  function card(id, numId, t, at) {
    const c = $(id); const x = expoOut(p(t, at, at + .55));
    c.style.opacity = p(t, at, at + .15);
    c.style.transform = "translateX(" + (1 - x) * 90 + "px)";
    c.style.clipPath = "inset(0 " + (1 - x) * 100 + "% 0 0)";
    const n = p(t, at + .12, at + .44);
    $(numId).style.transform = "scale(" + lerp(1.8, 1, backOut(n, 2)) + ")";
    $(numId).style.opacity = n > 0 ? 1 : 0;
  }

  window.seek = function (t) {
    // Frame + rail draw on.
    $("rail").style.transform = "scaleY(" + expoOut(p(t, 0, .5)) + ")";
    document.querySelectorAll(".line").forEach((l, i) => { l.style.transform = "scaleX(" + expoInOut(p(t, .15 + i * .1, .95 + i * .1)) + ")"; });
    const photo = document.querySelector(".photo");
    photo.style.opacity = expoOut(p(t, .1, 1.6));
    photo.style.transform = "scale(" + lerp(1.14, 1.03, cubicOut(p(t, 0, 8))) + ")";

    // Headline: three slams, centred big, then flies to its lockup position.
    slam($("l1"), t, .35); slam($("l2"), t, .7); slam($("l3"), t, 1.05);
    const fly = expoInOut(p(t, 1.75, 2.45));
    const s = lerp(INTRO_SCALE, HL_FINAL_SCALE, fly);
    const [sx1, sy1] = shake(t, .35, 9); const [sx2, sy2] = shake(t, .7, 7); const [sx3, sy3] = shake(t, 1.05, 12);
    const tx = lerp(center.x, 0, fly) + sx1 + sx2 + sx3;
    const ty = lerp(center.y, 0, fly) + sy1 + sy2 + sy3;
    $("headline").style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
    // Photo opens up behind the intro type, then settles darker once the cards land.
    const settle = expoInOut(p(t, 2.2, 3.4));
    photo.style.filter = "saturate(" + lerp(0.95, 0.84, settle) + ") contrast(1.08) brightness(" + lerp(1.15, 0.8, settle) + ")";
    document.querySelector(".grade").style.opacity = lerp(0.72, 1, settle);

    $("flash").style.opacity = flashAt(t, .35, .22) + flashAt(t, .7, .14) + flashAt(t, 1.05, .3) + flashAt(t, 4.05, .06) + flashAt(t, 5.75, .08);

    // Chrome.
    const wm = document.querySelector(".wordmark"); const wx = p(t, 2.2, 2.7);
    wm.style.opacity = wx; wm.style.transform = "translateY(" + (1 - expoOut(wx)) * -14 + "px)";
    const ex = p(t, 2.3, 2.8); $("eyebrow").style.opacity = ex; $("eyebrow").style.letterSpacing = lerp(9, 3.6, expoOut(ex)) + "px";

    // Card 01: watch the video.
    card("c1", "n1", t, 2.45);
    $("bar1").style.transform = "scaleX(" + expoInOut(p(t, 2.95, 4.0)) + ")";
    box("b1", t, 4.05);

    // Card 02: fill out the form.
    card("c2", "n2", t, 4.2);
    const steps = document.querySelectorAll("#c2 .step .sf");
    steps[0].style.transform = "scaleX(" + expoOut(p(t, 4.75, 5.05)) + ")";
    steps[1].style.transform = "scaleX(" + expoOut(p(t, 5.2, 5.5)) + ")";
    $("bar2").style.transform = "scaleX(" + expoInOut(p(t, 4.7, 5.7)) + ")";
    box("b2", t, 5.75);

    // Footer.
    const f = p(t, 6.1, 6.6);
    $("foot").style.clipPath = "inset(0 " + (1 - expoOut(f)) * 100 + "% 0 0)";
    const u = p(t, 6.3, 6.8);
    $("url").style.opacity = u; $("url").style.transform = "translateX(" + (1 - expoOut(u)) * 30 + "px)";

    // Glint across WE TALK.
    const g = p(t, 6.7, 7.5);
    $("glint").style.backgroundPosition = lerp(130, -30, expoInOut(g)) + "% 0";
    $("glint").style.opacity = g > 0 && g < 1 ? 1 : 0;
  };

  window.ready = document.fonts.ready.then(() => { measure(); return true; });
</script></body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ["--force-color-profile=srgb", "--font-render-hinting=none"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => window.ready);

  const ff = spawn("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
    "-profile:v", "high", "-movflags", "+faststart", "-an", videoOut,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exit ${c}`)))));

  const frames = Math.round(DURATION * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.seek(t), i / FPS);
    const buf = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await done;

  await page.evaluate((t) => window.seek(t), POSTER_T);
  const still = await page.screenshot({ type: "png" });
  writeFileSync(posterOut, await sharp(still).jpeg({ quality: 88, mozjpeg: true }).toBuffer());
  console.log(`Wrote ${videoOut}\nWrote ${posterOut}`);
} finally {
  await browser.close();
}
