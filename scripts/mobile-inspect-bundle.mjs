import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const outputDirectory = join(root, "dist-mobile");
const env = Object.fromEntries(
  readFileSync(join(root, ".env"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^['\"]|['\"]$/g, "")];
    }),
);

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const file = join(directory, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

const allFiles = walk(outputDirectory);
const searchable = allFiles.filter((file) => [".html", ".js", ".css", ".json"].includes(extname(file)));
const bundle = searchable.map((file) => readFileSync(file, "utf8")).join("\n");
const failures = [];

const totalBytes = allFiles.reduce((sum, file) => sum + statSync(file).size, 0);
if (totalBytes > 30 * 1024 * 1024) {
  failures.push(`packaged assets are unexpectedly large (${Math.ceil(totalBytes / 1024 / 1024)} MB)`);
}

const forbiddenAssetNames = [
  "Team Standard (Facebook Video).mp4",
  "AI_Brain_Walkthrough.pdf",
  "Example_Sales_Call_Result.pdf",
  "Insurance_Agency_Prompts_Formula.pdf",
  "background.mp4",
  "_headers",
  "_redirects",
];
for (const name of forbiddenAssetNames) {
  if (allFiles.some((file) => file.endsWith(`/${name}`))) failures.push(`website-only public asset detected: ${name}`);
}

if (!statSync(join(outputDirectory, "index.html")).isFile()) failures.push("dist-mobile/index.html is missing");
for (const key of ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "VITE_ELEVENLABS_AGENT_ID"]) {
  if (!env[key] || !bundle.includes(env[key])) failures.push(`${key} is absent from the packaged public configuration`);
}

const forbidden = [
  ["Supabase service-role credential", /service[_-]?role|c2VydmljZV9yb2xl/i],
  ["OpenAI secret", /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ["Anthropic secret", /sk-ant-[A-Za-z0-9_-]{20,}/],
  ["ElevenLabs secret key", /xi-api-key/i],
  ["Stripe purchase URL", /buy\.stripe\.com/i],
  ["external checkout URL", /link\.fastpaydirect\.com/i],
];
for (const [label, pattern] of forbidden) {
  if (pattern.test(bundle)) failures.push(`${label} detected`);
}

if (/BoldMockup|ProducerPowerUp|standardplaybook\.com\/(?:boardroom|directive|sales-experience)/i.test(bundle)) {
  failures.push("marketing route code or URL detected");
}

if (failures.length) {
  console.error(`Mobile bundle inspection failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Mobile bundle inspection passed (${allFiles.length} assets, ${searchable.length} text assets, ${(totalBytes / 1024 / 1024).toFixed(1)} MB).`,
);
