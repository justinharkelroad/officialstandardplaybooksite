import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { GUIDES, parseGuide, renderGuideHtml, renderInline } from "./build-aiinstall-v2-guides.ts";

const guidesDir = join(resolve(dirname(fileURLToPath(import.meta.url)), ".."), "resources", "aiinstall", "v2", "guides");

const SAMPLE = [
  "# AI Install Day 9 Guide: Test It",
  "",
  "Opening line with `MY BIZ BRAIN`.",
  "",
  "## Step: `phase-x` (30 minutes)",
  "",
  "**Builds:** `x.md`",
  "",
  "| A | B |",
  "|---|---|",
  "| one | `two` |",
  "",
  "1. first",
  "2. second",
  "",
  "- bullet",
  "",
  "### Step: `check-x`",
  "",
  "Done.",
].join("\n");

test("inline text is escaped and only code and bold are rendered", () => {
  assert.equal(
    renderInline("Use `<step name>` & **bold** <b>"),
    "Use <code>&lt;step name&gt;</code> &amp; <strong>bold</strong> &lt;b&gt;",
  );
});

test("a guide parses into a cover, steps, and body", () => {
  const guide = parseGuide(SAMPLE);
  assert.equal(guide.title, "AI Install Day 9 Guide");
  assert.equal(guide.subtitle, "Test It");
  assert.equal(guide.lede, "Opening line with `MY BIZ BRAIN`.");
  assert.deepEqual(guide.steps, [{ name: "phase-x", minutes: "30 minutes" }, { name: "check-x", minutes: null }]);
  assert.match(guide.bodyHtml, /<table><thead><tr><th>A<\/th><th>B<\/th><\/tr><\/thead>/);
  assert.match(guide.bodyHtml, /<ol><li>first<\/li><li>second<\/li><\/ol>/);
  assert.match(guide.bodyHtml, /<ul><li>bullet<\/li><\/ul>/);
  assert.equal((guide.bodyHtml.match(/<section/g) ?? []).length, (guide.bodyHtml.match(/<\/section>/g) ?? []).length);

  const html = renderGuideHtml(guide);
  assert.match(html, /Day 9 Guide: Test It/);
  assert.match(html, /class="tracker"/);
});

test("Markdown the PDF build cannot render stops the build", () => {
  assert.throws(() => parseGuide(SAMPLE + "\n\n> a quote"), /does not support/);
  assert.throws(() => parseGuide(SAMPLE + "\n\n```\ncode\n```"), /does not support/);
  assert.throws(() => parseGuide(SAMPLE + "\n\nSee [the page](https://example.com)."), /does not support/);
  assert.throws(() => parseGuide(SAMPLE + "\n\n| a | b |\n| c | d |"), /separator/);
  assert.throws(() => parseGuide(SAMPLE.replace("Opening line", "Opening — line")), /em dash/);
  assert.throws(() => parseGuide("# No subtitle\n\nText.\n\n## Step: `x`"), /Title: Subtitle/);
  assert.throws(() => parseGuide("# A: B\n\nText only."), /at least one step/);
});

test("both real guides parse, and nothing in them is dropped", () => {
  for (const spec of GUIDES) {
    const markdown = readFileSync(join(guidesDir, spec.source), "utf8");
    const guide = parseGuide(markdown);
    const html = renderGuideHtml(guide);
    const text = html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<[^>]+>/g, " ")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ");
    // Every sentence-like run of plain words in the source must reach the page.
    const phrases = markdown.replace(/[`*|#]/g, " ").match(/[A-Za-z][A-Za-z ,']{24,}/g) ?? [];
    assert.ok(phrases.length > 30);
    for (const phrase of phrases) {
      const wanted = phrase.replace(/\s+/g, " ").trim();
      assert.ok(text.includes(wanted), `${spec.source}: lost "${wanted}"`);
    }
  }
});
