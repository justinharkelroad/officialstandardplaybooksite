#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..");
const iconData = readFileSync(join(root, "src/assets/sp-icon-blue.png")).toString("base64");

const cards = [
  {
    tool: "CLAUDE",
    platform: "CLAUDE DESKTOP",
    primary: "#0A0A0B",
    secondary: "#168BFF",
    output: "ai-install-claude-prework.png",
  },
  {
    tool: "CODEX",
    platform: "CHATGPT DESKTOP + CODEX",
    primary: "#168BFF",
    secondary: "#0A0A0B",
    output: "ai-install-codex-prework.png",
  },
];

function cardSvg({ tool, platform, primary, secondary }) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="17" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 .035" />
          </feComponentTransfer>
        </filter>
        <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#54D9E5" />
          <stop offset=".42" stop-color="#2997FF" />
          <stop offset="1" stop-color="#0066CC" />
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill="#F4F2EE" />
      <rect width="1200" height="630" fill="#111111" filter="url(#paper)" />
      <rect x="0" y="0" width="16" height="630" fill="url(#blue)" />

      <rect x="42" y="28" width="146" height="48" fill="none" stroke="#0A0A0B" stroke-width="3" />
      <text x="115" y="64" text-anchor="middle" fill="#0A0A0B"
        font-family="Arial Black, Arial, sans-serif" font-size="25" font-weight="900"
        letter-spacing="-1.2">STANDARD</text>
      <text x="1158" y="61" text-anchor="end" fill="#0A0A0B"
        font-family="Arial, sans-serif" font-size="18" font-weight="700"
        letter-spacing="6">STANDARD PLAYBOOK</text>
      <line x1="42" y1="94" x2="1158" y2="94" stroke="#0A0A0B" stroke-width="2" />

      <rect x="914" y="94" width="286" height="536" fill="#0A0A0B" />
      <rect x="914" y="94" width="286" height="10" fill="url(#blue)" />
      <text x="950" y="147" fill="#F4F2EE" font-family="Arial, sans-serif"
        font-size="16" font-weight="800" letter-spacing="4">SETUP GUIDE / 01</text>
      <image href="data:image/png;base64,${iconData}" x="942" y="180" width="230" height="230" opacity=".92" />
      <line x1="950" y1="444" x2="1162" y2="444" stroke="#F4F2EE" stroke-opacity=".28" />
      <text x="950" y="485" fill="#F4F2EE" font-family="Arial, sans-serif"
        font-size="14" font-weight="700" letter-spacing="3">THE AGENCY</text>
      <text x="950" y="518" fill="#F4F2EE" font-family="Arial, sans-serif"
        font-size="24" font-weight="900" letter-spacing="1">AI INSTALL</text>
      <text x="950" y="575" fill="#2997FF" font-family="Arial, sans-serif"
        font-size="14" font-weight="800" letter-spacing="2.5">AUGUST 26–27</text>
      <text x="950" y="600" fill="#F4F2EE" font-family="Arial, sans-serif"
        font-size="13" font-weight="700" letter-spacing="2">LIVE ON ZOOM</text>

      <text x="44" y="141" fill="#0A0A0B" font-family="Arial, sans-serif"
        font-size="18" font-weight="800" letter-spacing="4">THE AGENCY AI INSTALL · PRE-WORK</text>
      <text x="42" y="326" fill="${primary}" font-family="Impact, Anton, Arial Black, sans-serif"
        font-size="175" font-weight="900" letter-spacing="-3">${tool}</text>
      <text x="42" y="490" fill="${secondary}" font-family="Impact, Anton, Arial Black, sans-serif"
        font-size="135" font-weight="900" letter-spacing="-2">PRE-WORK.</text>

      <rect x="43" y="523" width="820" height="2" fill="#0A0A0B" />
      <text x="44" y="558" fill="#0A0A0B" font-family="Arial, sans-serif"
        font-size="18" font-weight="900" letter-spacing="2.8">${platform}</text>
      <text x="44" y="592" fill="#0A0A0B" font-family="Arial, sans-serif"
        font-size="16" font-weight="700" letter-spacing="1.6">INSTALL THE APP · CONNECT YOUR FOLDER · GET READY</text>
    </svg>
  `;
}

for (const card of cards) {
  const outputPath = join(root, "public/og", card.output);
  await sharp(Buffer.from(cardSvg(card)))
    .png({ compressionLevel: 9, palette: false })
    .toFile(outputPath);
  console.log(`Created ${outputPath}`);
}
