#!/usr/bin/env node
/**
 * Renders the homepage social share card as an animated video plus a still.
 *
 *   public/video/home-og.mp4  -> og:video (1200x630, H.264, muted, 9s)
 *   public/og/home.jpg        -> og:image (the video's final frame)
 *
 * Story: RAISE / YOUR / STANDARD. slammed over a black-and-white photo
 * montage, the mission line with AVERAGE struck through, the four programs,
 * then the paper end card that mirrors the homepage hero (tilted photo card
 * bursting into the headline). iMessage, SMS and Telegram only show the still,
 * so the end card must stand on its own.
 *
 * Every frame is a pure function of time: the page exposes seek(t), and this
 * script steps it at FPS, screenshots, and pipes frames into ffmpeg.
 *
 * Usage: bun scripts/generate-home-og.mjs   (needs ffmpeg on PATH)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const videoOut = join(root, "public/video/home-og.mp4");
const posterOut = join(root, "public/og/home.jpg");

const W = 1200;
const H = 630;
const FPS = 30;
const DURATION = 9;
const POSTER_T = 8.95;

const fileUrl = (rel, mime) => `data:${mime};base64,${readFileSync(join(root, rel)).toString("base64")}`;
// Photos are downscaled before embedding so the page stays light.
const photo = async (rel, width = 1400) =>
  `data:image/jpeg;base64,${(await sharp(join(root, rel)).resize({ width, withoutEnlargement: true }).jpeg({ quality: 86 }).toBuffer()).toString("base64")}`;

const antonUrl = fileUrl("scripts/assets/Anton-Regular.ttf", "font/ttf");
const interUrl = fileUrl("scripts/assets/Inter-Variable.ttf", "font/ttf");
const wordmarkUrl = `data:image/png;base64,${(await sharp(join(root, "src/assets/standard-word-logo.png")).trim().png().toBuffer()).toString("base64")}`;
const shots = {
  board: await photo("public/8-week-hero.jpg"),
  chair: await photo("public/hero-decision.jpg"),
  arms: await photo("public/aboutpagehero.jpg", 900),
  calls: await photo("public/standard-cadence-hero.jpg"),
};

const PROGRAMS = ["Boardroom", "Momentum", "Team Standard", "Ascension"];

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
  @font-face { font-family: "SP Anton"; src: url("${antonUrl}") format("truetype"); }
  @font-face { font-family: "SP Inter"; src: url("${interUrl}") format("truetype"); font-weight: 100 900; }
  :root { --paper: #f4f2ee; --ink: #0a0a0b; --blue: #2997ff; }
  * { box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; margin: 0; overflow: hidden; background: var(--ink); }
  body { position: relative; color: var(--paper); font-family: "SP Inter", sans-serif; -webkit-font-smoothing: antialiased; }
  .layer { position: absolute; inset: 0; overflow: hidden; }
  .shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15) brightness(.55); }
  .noise { position: absolute; inset: 0; opacity: .13; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E"); }
  .anton { font-family: "SP Anton", sans-serif; text-transform: uppercase; line-height: .86; white-space: nowrap; }
  .eyebrow { font-weight: 800; text-transform: uppercase; font-size: 13px; line-height: 1; letter-spacing: 3.6px; }

  /* Act 1: RAISE / YOUR / STANDARD. */
  .word { position: absolute; left: 0; right: 0; top: 50%; text-align: center; font-size: 250px; transform-origin: 50% 50%; margin-top: -108px; }
  .word.blue { color: var(--blue); }

  /* Act 2: mission. */
  .mission { position: absolute; left: 70px; top: 150px; font-size: 104px; }
  .mission { line-height: .94; }
  .mission > span { display: block; }
  .strike { position: relative; display: inline-block; color: var(--blue); }
  .strike i { position: absolute; left: -8px; right: -8px; top: 48%; height: 12px; background: var(--paper); transform-origin: left; }

  /* Act 3: programs. */
  .prog-eyebrow { position: absolute; left: 70px; top: 92px; color: var(--blue); }
  .programs { position: absolute; left: 70px; top: 128px; display: grid; gap: 6px; }
  .prog { position: relative; font-size: 88px; overflow: hidden; padding-right: 14px; }
  .prog .wipe { position: absolute; inset: 0; background: var(--blue); transform-origin: left; }
  .prog .num { font-family: "SP Inter", sans-serif; font-weight: 800; font-size: 16px; letter-spacing: 3px; color: var(--blue); vertical-align: top; margin-left: 12px; position: relative; top: 10px; }

  /* Act 4: paper end card. */
  #paper { background: var(--paper); color: var(--ink); }
  .edge { position: absolute; left: 0; right: 0; height: 10px; background: var(--blue); }
  .rail { position: absolute; left: 0; top: 0; width: 14px; height: 100%; background: var(--blue); transform-origin: top; }
  .line { position: absolute; left: 44px; right: 30px; height: 2px; background: var(--ink); transform-origin: left; }
  .line.top { top: 28px; } .line.bot { bottom: 28px; }
  .topline { position: absolute; top: 46px; left: 49px; right: 50px; display: flex; align-items: center; justify-content: space-between; }
  .chip { background: var(--ink); padding: 7px 10px; display: inline-flex; }
  .chip img { width: 132px; height: auto; display: block; }
  .headline { position: absolute; left: 49px; top: 126px; }
  .hl { display: block; font-size: 150px; line-height: .9; transform-origin: 0% 60%; }
  .hl.indent { padding-left: 74px; }
  .hl.blue { color: var(--blue); position: relative; }
  .glint { position: absolute; inset: -6px -10px; padding-left: inherit; background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,.9) 50%, transparent 60%);
    background-size: 300% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; }
  .card { position: absolute; left: 770px; top: 108px; width: 336px; height: 420px; background: var(--ink); padding: 10px;
    box-shadow: 0 28px 60px rgba(10,10,11,.35); transform-origin: 50% 100%; }
  .card img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; display: block; filter: contrast(1.05) saturate(.9); }
  .tag { position: absolute; left: -26px; bottom: 34px; background: var(--blue); color: var(--ink); padding: 10px 14px; font-weight: 800; font-size: 13px; letter-spacing: 2.6px; text-transform: uppercase; transform-origin: left center; }
  .bottom { position: absolute; left: 49px; right: 50px; bottom: 49px; display: flex; justify-content: space-between; align-items: center; color: var(--ink); }
  .bottom .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--blue); margin: 0 14px 2px; }
  .url { color: var(--blue); }
  .flash { position: absolute; inset: 0; background: #fff; pointer-events: none; }
</style></head><body>

<div class="layer" id="act1">
  <img class="shot" id="s1" src="${shots.board}"><img class="shot" id="s2" src="${shots.chair}"><img class="shot" id="s3" src="${shots.arms}" style="object-position:50% 8%">
  <div class="noise"></div>
  <div class="word anton" id="w1">Raise</div><div class="word anton" id="w2">Your</div><div class="word anton blue" id="w3">Standard.</div>
</div>

<div class="layer" id="act2">
  <img class="shot" id="s4" src="${shots.calls}" style="filter:grayscale(1) contrast(1.1) brightness(.32)">
  <div class="noise"></div>
  <div class="mission anton"><span id="m1">We build</span><span id="m2">agencies that refuse</span><span id="m3">to settle for <span class="strike">average.<i id="strike"></i></span></span></div>
</div>

<div class="layer" id="act3">
  <div class="noise"></div>
  <div class="eyebrow prog-eyebrow" id="pe">Coaching / Software / AI</div>
  <div class="programs">${PROGRAMS.map((p, i) => `<div class="prog anton" id="p${i}"><div class="wipe"></div><span class="t">${p}</span><span class="num">0${i + 1}</span></div>`).join("")}</div>
</div>

<div class="layer" id="paper">
  <div class="line top"></div><div class="line bot"></div>
  <div class="topline"><div class="chip" id="chip"><img src="${wordmarkUrl}" alt=""></div><div class="eyebrow" id="eb">Insurance agency coaching / Software / AI</div></div>
  <div class="headline">
    <span class="hl anton" id="h1">Raise</span>
    <span class="hl anton indent" id="h2">Your</span>
    <span class="hl anton blue" id="h3">Standard.<span class="glint" id="glint">Standard.</span></span>
  </div>
  <div class="card" id="card"><img src="${shots.arms}" alt=""><div class="tag" id="tag">20-year operator</div></div>
  <div class="bottom"><div class="eyebrow" id="foot">${PROGRAMS.join('<span class="dot"></span>')}</div><div class="eyebrow url" id="url">standardplaybook.com</div></div>
  <div class="rail" id="rail"></div>
</div>
<div class="edge" id="edge"></div>
<div class="flash" id="flash"></div>

<script>
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const p = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, x) => a + (b - a) * x;
  const expoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const expoInOut = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  const backOut = (x, s = 1.7) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
  const cubicOut = (x) => 1 - Math.pow(1 - x, 3);
  const shake = (t, at, amp, len = .35) => { const k = t - at; if (k < 0 || k > len) return [0, 0]; const d = amp * Math.pow(1 - k / len, 2);
    return [Math.sin(k * 97.3 + at * 7) * d, Math.cos(k * 83.1 + at * 3) * d]; };
  const flash = (t, at, peak, decay = 14) => { const k = t - at; return k < 0 ? 0 : peak * Math.exp(-k * decay); };
  const show = (el, on) => { el.style.visibility = on ? "visible" : "hidden"; };

  // Big centred word: scale-in slam with blur, shake on impact.
  function slamWord(el, t, at, until) {
    show(el, t >= at && t < until);
    const x = p(t, at, at + .26);
    const [sx, sy] = shake(t, at + .2, 14);
    el.style.transform = "translate(" + sx + "px," + sy + "px) scale(" + lerp(2.2, 1, backOut(x, 1.4)) * lerp(1, 1.06, p(t, at, until)) + ")";
    el.style.filter = "blur(" + (1 - expoOut(x)) * 14 + "px)";
  }
  // Hard photo cut with a slow push.
  function shot(el, t, at, until) {
    show(el, t >= at && t < until);
    el.style.transform = "scale(" + lerp(1.18, 1.04, cubicOut(p(t, at, until))) + ")";
  }
  // Line that rises in under a mask.
  function riseLine(el, t, at) {
    const x = expoOut(p(t, at, at + .45));
    el.style.transform = "translateY(" + (1 - x) * 60 + "px)";
    el.style.opacity = p(t, at, at + .12);
    el.style.clipPath = "inset(0 0 " + (1 - x) * 100 + "% 0)";
  }

  window.seek = function (t) {
    const A1 = 0, A2 = 2.35, A3 = 4.45, A4 = 6.05;
    show($("act1"), t < A2); show($("act2"), t >= A2 && t < A3); show($("act3"), t >= A3 && t < A4 + .5); show($("paper"), t >= A4);

    // Act 1.
    shot($("s1"), t, .12, .72); shot($("s2"), t, .72, 1.3); shot($("s3"), t, 1.3, A2);
    slamWord($("w1"), t, .12, .72); slamWord($("w2"), t, .72, 1.3); slamWord($("w3"), t, 1.3, A2);

    // Act 2.
    shot($("s4"), t, A2, A3);
    riseLine($("m1"), t, A2 + .08); riseLine($("m2"), t, A2 + .38); riseLine($("m3"), t, A2 + .68);
    $("strike").style.transform = "scaleX(" + expoOut(p(t, A2 + 1.3, A2 + 1.6)) + ")";
    const [mx, my] = shake(t, A2 + 1.3, 8);
    document.querySelector(".mission").style.transform = "translate(" + mx + "px," + my + "px)";

    // Act 3: each program revealed by a blue block that wipes on, then off.
    $("pe").style.opacity = p(t, A3 + .05, A3 + .3);
    $("pe").style.letterSpacing = lerp(10, 3.6, expoOut(p(t, A3 + .05, A3 + .5))) + "px";
    for (let i = 0; i < 4; i++) {
      const at = A3 + .15 + i * .2;
      const el = $("p" + i), wipe = el.querySelector(".wipe"), txt = el.querySelector(".t"), num = el.querySelector(".num");
      const a = expoInOut(p(t, at, at + .28)), b = expoInOut(p(t, at + .28, at + .56));
      wipe.style.transformOrigin = b > 0 ? "right" : "left";
      wipe.style.transform = "scaleX(" + (b > 0 ? 1 - b : a) + ")";
      txt.style.opacity = t >= at + .28 ? 1 : 0; num.style.opacity = t >= at + .4 ? 1 : 0;
      // The last program holds the blue highlight to sell the beat.
      txt.style.color = i === 3 && t >= at + .7 ? "var(--blue)" : "var(--paper)";
    }

    // Act 4: paper wipes up behind a blue leading edge.
    const up = expoInOut(p(t, A4, A4 + .5));
    $("paper").style.clipPath = "inset(" + (1 - up) * 100 + "% 0 0 0)";
    $("edge").style.top = (1 - up) * ${H} - 5 + "px";
    show($("edge"), up > 0 && up < 1);
    $("rail").style.transform = "scaleY(" + expoOut(p(t, A4 + .35, A4 + .85)) + ")";
    document.querySelectorAll("#paper .line").forEach((l, i) => { l.style.transform = "scaleX(" + expoInOut(p(t, A4 + .4 + i * .1, A4 + 1.1 + i * .1)) + ")"; });
    ["h1", "h2", "h3"].forEach((id, i) => {
      const at = A4 + .45 + i * .2, x = p(t, at, at + .28);
      $(id).style.opacity = x > 0 ? 1 : 0;
      $(id).style.transform = "scale(" + lerp(1.7, 1, backOut(x, 1.5)) + ")";
      $(id).style.filter = "blur(" + (1 - expoOut(x)) * 8 + "px)";
    });
    const [hx, hy] = shake(t, A4 + .95, 9);
    document.querySelector("#paper .headline").style.transform = "translate(" + hx + "px," + hy + "px)";
    // Photo card drops in and settles at the homepage's -8deg tilt.
    const c = p(t, A4 + .75, A4 + 1.35);
    $("card").style.opacity = p(t, A4 + .75, A4 + .9);
    $("card").style.transform = "translateY(" + (1 - expoOut(c)) * 260 + "px) rotate(" + lerp(14, -6, backOut(c, 1.3)) + "deg)";
    const g = p(t, A4 + 1.3, A4 + 1.6);
    $("tag").style.transform = "rotate(-2deg) scale(" + backOut(g, 2.4) + ")"; $("tag").style.opacity = g > 0 ? 1 : 0;
    const ch = p(t, A4 + .9, A4 + 1.3);
    $("chip").style.opacity = ch; $("chip").style.transform = "translateY(" + (1 - expoOut(ch)) * -14 + "px)";
    const eb = p(t, A4 + 1, A4 + 1.5);
    $("eb").style.opacity = eb; $("eb").style.letterSpacing = lerp(9, 3.6, expoOut(eb)) + "px";
    $("foot").style.clipPath = "inset(0 " + (1 - expoOut(p(t, A4 + 1.5, A4 + 2.1))) * 100 + "% 0 0)";
    const u = p(t, A4 + 1.7, A4 + 2.2);
    $("url").style.opacity = u; $("url").style.transform = "translateX(" + (1 - expoOut(u)) * 30 + "px)";
    const gl = p(t, A4 + 2.1, A4 + 2.8);
    $("glint").style.backgroundPosition = lerp(130, -30, expoInOut(gl)) + "% 0"; $("glint").style.opacity = gl > 0 && gl < 1 ? 1 : 0;

    $("flash").style.opacity = Math.min(.9,
      flash(t, .12, .35) + flash(t, .72, .3) + flash(t, 1.3, .55, 10) +
      flash(t, A2, .25) + flash(t, A2 + 1.3, .18) + flash(t, A3, .2));
  };

  window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode()))).then(() => true);
</script></body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ["--force-color-profile=srgb", "--font-render-hinting=none"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => window.ready);

  const preview = process.env.PREVIEW_TIMES;
  if (preview) {
    // PREVIEW_TIMES=0.5,1.5 writes single frames to PREVIEW_DIR instead of encoding.
    for (const t of preview.split(",").map(Number)) {
      await page.evaluate((x) => window.seek(x), t);
      await page.screenshot({ path: join(process.env.PREVIEW_DIR, `home-${t}.png`) });
    }
  } else {
    const ff = spawn("ffmpeg", [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
      "-profile:v", "high", "-movflags", "+faststart", "-an", videoOut,
    ], { stdio: ["pipe", "inherit", "inherit"] });
    const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exit ${c}`)))));
    for (let i = 0; i < Math.round(DURATION * FPS); i++) {
      await page.evaluate((t) => window.seek(t), i / FPS);
      const buf = await page.screenshot({ type: "png" });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    }
    ff.stdin.end();
    await done;

    await page.evaluate((t) => window.seek(t), POSTER_T);
    writeFileSync(posterOut, await sharp(await page.screenshot({ type: "png" })).jpeg({ quality: 88, mozjpeg: true }).toBuffer());
    console.log(`Wrote ${videoOut}\nWrote ${posterOut}`);
  }
} finally {
  await browser.close();
}
