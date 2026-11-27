#!/usr/bin/env bun
/**
 * Turns the AI Install day guides from Markdown into the PDFs the portal
 * serves.
 *
 *   bun run build:aiinstall-guides
 *
 * Source:  resources/aiinstall/v2/guides/day-1-guide.md, day-2-guide.md
 * Output:  resources/aiinstall/portal-assets/common/ai-install-v2-day-<n>-guide.pdf
 *
 * The first cohort's PDFs keep their own file names and are not touched.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EM_DASH = "—";

export interface GuideSpec {
  source: string;
  output: string;
  /** Shown in the page footer, for example "DAY 1 GUIDE". */
  footer: string;
}

export const GUIDES: GuideSpec[] = [
  { source: "day-1-guide.md", output: "ai-install-v2-day-1-guide.pdf", footer: "DAY 1 GUIDE" },
  { source: "day-2-guide.md", output: "ai-install-v2-day-2-guide.pdf", footer: "DAY 2 GUIDE" },
];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inline Markdown the guides use: `code` and **bold**. Everything else is text. */
export function renderInline(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }
      return escapeHtml(part).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    })
    .join("");
}

export interface GuideStep {
  name: string;
  minutes: string | null;
}

export interface ParsedGuide {
  /** "AI Install Day 1 Guide" */
  title: string;
  /** "Build the Brain" */
  subtitle: string;
  /** The opening paragraph, shown on the cover. */
  lede: string;
  steps: GuideStep[];
  bodyHtml: string;
}

const STEP_HEADING = /^Step: `([^`]+)`(?: \(([^)]+)\))?$/;

function tableHtml(rows: string[]): string {
  const cells = (row: string) =>
    row.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
  const [head, separator, ...body] = rows;
  if (!separator || !/^\|[\s:|-]+\|$/.test(separator)) {
    throw new Error(`Guide table is missing its separator row after: ${head}`);
  }
  const width = cells(head).length;
  const tr = (row: string, tag: "th" | "td") => {
    const values = cells(row);
    if (values.length !== width) throw new Error(`Guide table row has ${values.length} cells, expected ${width}: ${row}`);
    return `<tr>${values.map((value) => `<${tag}>${renderInline(value)}</${tag}>`).join("")}</tr>`;
  };
  return `<table><thead>${tr(head, "th")}</thead><tbody>${body.map((row) => tr(row, "td")).join("")}</tbody></table>`;
}

/**
 * Parses the small Markdown subset the guides are written in. Anything outside
 * that subset stops the build, so a guide never reaches an owner half rendered.
 */
export function parseGuide(markdown: string): ParsedGuide {
  if (markdown.includes(EM_DASH)) throw new Error("Guides must not contain an em dash.");
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let title = "";
  let subtitle = "";
  let lede = "";
  const steps: GuideStep[] = [];
  const html: string[] = [];
  let sectionOpen = false;

  const openSection = (className: string) => {
    if (sectionOpen) html.push("</section>");
    html.push(`<section class="${className}">`);
    sectionOpen = true;
  };

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") {
      index += 1;
      continue;
    }
    if (/^(```|>|!\[|<|\s+\S)/.test(line) || /\[[^\]]+\]\([^)]+\)/.test(line)) {
      throw new Error(`Guide uses Markdown the PDF build does not support: ${line}`);
    }

    const heading = /^(#{1,3}) (.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (level === 1) {
        if (title) throw new Error("A guide has exactly one top heading.");
        const split = text.split(": ");
        title = split[0];
        subtitle = split.slice(1).join(": ");
      } else {
        const step = STEP_HEADING.exec(text);
        if (step) {
          steps.push({ name: step[1], minutes: step[2] ?? null });
          if (level === 2) openSection("step");
          html.push(
            `<h${level} class="step-heading"><span class="step-kicker">Step${
              step[2] ? ` · ${escapeHtml(step[2])}` : ""
            }</span><code>${escapeHtml(step[1])}</code></h${level}>`,
          );
        } else {
          if (level === 2) openSection("block");
          html.push(`<h${level}>${renderInline(text)}</h${level}>`);
        }
      }
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (index < lines.length && lines[index].startsWith("|")) rows.push(lines[index++]);
      html.push(tableHtml(rows));
      continue;
    }

    const ordered = /^\d+\. /.test(line);
    if (ordered || line.startsWith("- ")) {
      const pattern = ordered ? /^\d+\. (.*)$/ : /^- (.*)$/;
      const items: string[] = [];
      while (index < lines.length && pattern.test(lines[index])) {
        items.push(pattern.exec(lines[index++])![1]);
      }
      const tag = ordered ? "ol" : "ul";
      html.push(`<${tag}>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`);
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length && lines[index].trim() !== "" &&
      !/^(#{1,3} |\||- |\d+\. )/.test(lines[index])
    ) {
      paragraph.push(lines[index++].trim());
    }
    const text = paragraph.join(" ");
    if (!lede && !sectionOpen) lede = text;
    else html.push(`<p>${renderInline(text)}</p>`);
  }
  if (sectionOpen) html.push("</section>");

  if (!title || !subtitle) throw new Error('A guide must open with "# Title: Subtitle".');
  if (!lede) throw new Error("A guide needs an opening paragraph for its cover.");
  if (steps.length === 0) throw new Error("A guide must contain at least one step.");
  return { title, subtitle, lede, steps, bodyHtml: html.join("\n") };
}

const CSS = `
  @page { size: Letter; margin: 0.75in 0.8in 0.95in; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; color: #0a0a0b; font-family: Inter, "SF Pro Text", -apple-system, "Helvetica Neue", Arial, sans-serif; font-size: 11.5pt; line-height: 1.6; }
  .cover { padding: 44px 46px 48px; border-radius: 14px; background: #0a0a0b; color: #fff; }
  .cover .brand { margin: 0; color: #2997ff; font-size: 8pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
  .cover h1 { margin: 26px 0 0; font-size: 34pt; line-height: 1.05; letter-spacing: -0.03em; }
  .cover .subtitle { margin: 12px 0 0; color: #2997ff; font-size: 19pt; font-weight: 700; letter-spacing: -0.02em; }
  .cover .lede { margin: 24px 0 0; color: #c4c4c6; font-size: 13.5pt; line-height: 1.5; }
  .cover code { background: rgb(255 255 255 / 0.12); color: #fff; }
  .label { margin: 34px 0 10px; color: #6e6e73; font-size: 8pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
  .tracker { margin: 0; padding: 6px 28px; border: 1px solid #e3e3e6; border-radius: 14px; list-style: none; break-inside: avoid; }
  .tracker li { display: flex; align-items: center; gap: 18px; padding: 11px 0; border-top: 1px solid #e3e3e6; }
  .tracker li:first-child { border-top: 0; }
  .tracker .n { width: 26px; color: #0066cc; font-weight: 700; }
  .tracker .name { flex: 1; }
  .tracker .box { width: 17px; height: 17px; border: 1.5px solid #c7c7cc; border-radius: 4px; }
  section { margin-top: 30px; }
  section.step { padding-top: 24px; border-top: 1px solid #e3e3e6; break-inside: avoid; }
  h2 { margin: 0 0 10px; font-size: 19pt; line-height: 1.15; letter-spacing: -0.02em; break-after: avoid; }
  h3 { margin: 22px 0 8px; font-size: 13.5pt; letter-spacing: -0.01em; break-after: avoid; }
  .step-heading { display: flex; flex-direction: column; gap: 6px; }
  .step-heading code { font-size: 0.82em; padding: 0; background: none; color: #0a0a0b; }
  .step-kicker { color: #0066cc; font-size: 8pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
  p { margin: 0 0 11px; orphans: 3; widows: 3; }
  ul, ol { margin: 0 0 12px; padding-left: 22px; }
  li { margin: 0 0 6px; break-inside: avoid; }
  code { padding: 1px 5px; border-radius: 4px; background: #f2f2f4; font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 0.88em; }
  table { width: calc(100% - 1px); margin: 6px 0 16px; border-collapse: collapse; table-layout: fixed; break-inside: avoid; }
  th:first-child, td:first-child { width: 34%; }
  td { overflow-wrap: anywhere; }
  td code { white-space: normal; }
  th, td { padding: 9px 12px; border: 1px solid #e3e3e6; text-align: left; vertical-align: top; }
  th { background: #f6f6f8; font-size: 8.5pt; letter-spacing: 0.08em; text-transform: uppercase; }
`;

export function renderGuideHtml(guide: ParsedGuide): string {
  const tracker = guide.steps
    .map(
      (step, i) =>
        `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="name"><code>${
          escapeHtml(step.name)
        }</code>${step.minutes ? ` · ${escapeHtml(step.minutes)}` : ""}</span><span class="box"></span></li>`,
    )
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(`${guide.title}: ${guide.subtitle}`)}</title>
<style>${CSS}</style>
</head>
<body>
<header class="cover">
  <p class="brand">Standard Playbook</p>
  <h1>The AI Co-Working Brain Install.</h1>
  <p class="subtitle">${escapeHtml(guide.title.replace(/^AI Install /, ""))}: ${escapeHtml(guide.subtitle)}</p>
  <p class="lede">${renderInline(guide.lede)}</p>
</header>
<p class="label">Progress tracker</p>
<ol class="tracker">${tracker}</ol>
${guide.bodyHtml}
</body>
</html>`;
}

function footerTemplate(label: string): string {
  const style =
    "width:100%;margin:0 0.8in;padding-top:8px;border-top:1px solid #e3e3e6;display:flex;justify-content:space-between;font-family:Helvetica,Arial,sans-serif;font-size:7px;letter-spacing:1.4px;color:#6e6e73;";
  return `<div style="${style}"><span>STANDARD PLAYBOOK</span><span>${escapeHtml(label)} · <span class="pageNumber"></span> OF <span class="totalPages"></span></span></div>`;
}

export async function buildGuides(sourceDir: string, outputDir: string): Promise<string[]> {
  const { default: puppeteer } = await import("puppeteer");
  const work = mkdtempSync(join(tmpdir(), "aii-guides-"));
  mkdirSync(outputDir, { recursive: true });
  const written: string[] = [];
  const launch = (extra: { channel?: "chrome" }) =>
    puppeteer.launch({
      headless: true,
      userDataDir: join(work, "profile"),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ...extra,
    });
  // Puppeteer's own browser download is often missing on a laptop. Fall back
  // to the Google Chrome already installed there before giving up.
  const browser = await launch({}).catch(() => launch({ channel: "chrome" }));
  try {
    for (const spec of GUIDES) {
      const guide = parseGuide(readFileSync(join(sourceDir, spec.source), "utf8"));
      const htmlFile = join(work, spec.source.replace(/\.md$/, ".html"));
      writeFileSync(htmlFile, renderGuideHtml(guide));
      const page = await browser.newPage();
      await page.goto(pathToFileURL(htmlFile).href, { waitUntil: "load" });
      const target = join(outputDir, spec.output);
      await page.pdf({
        path: target,
        format: "Letter",
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: true,
        headerTemplate: "<span></span>",
        footerTemplate: footerTemplate(spec.footer),
      });
      await page.close();
      written.push(target);
    }
  } finally {
    await browser.close();
    rmSync(work, { recursive: true, force: true });
  }
  return written;
}

if (import.meta.main) {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const written = await buildGuides(
    join(repoRoot, "resources", "aiinstall", "v2", "guides"),
    join(repoRoot, "resources", "aiinstall", "portal-assets", "common"),
  );
  for (const file of written) console.log(`Built ${file}`);
}
