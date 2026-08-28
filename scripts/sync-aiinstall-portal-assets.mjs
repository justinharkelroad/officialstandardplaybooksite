import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

const scriptDirectory = fileURLToPath(new URL(".", import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const assetRoot = join(repositoryRoot, "resources", "aiinstall", "portal-assets");
const bucket = "ai-install-portal";
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before syncing portal assets.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: createError } = await supabase.storage.createBucket(bucket, {
  public: false,
  fileSizeLimit: 100 * 1024 * 1024,
});

if (createError && !/already exists/i.test(createError.message)) {
  throw new Error(`Could not create private bucket: ${createError.message}`);
}

const { error: updateError } = await supabase.storage.updateBucket(bucket, {
  public: false,
  fileSizeLimit: 100 * 1024 * 1024,
});
if (updateError) throw new Error(`Could not secure private bucket: ${updateError.message}`);

const files = await listFiles(assetRoot);
if (files.length === 0) throw new Error(`No portal assets found at ${assetRoot}`);

for (const absolutePath of files) {
  const storagePath = relative(assetRoot, absolutePath).split("\\").join("/");
  const bytes = await readFile(absolutePath);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType: contentTypeFor(absolutePath),
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  console.log(`synced ${storagePath}`);
}

console.log(`Synced ${files.length} protected AI Install assets to ${bucket}.`);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }));
  return nested.flat().sort();
}

function contentTypeFor(path) {
  const extension = extname(path).toLowerCase();
  if (extension === ".pdf") return "application/pdf";
  if (extension === ".zip") return "application/zip";
  return "application/octet-stream";
}
