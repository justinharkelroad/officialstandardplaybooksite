import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolve } from "node:path";

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

test("testimonial storage and metadata remain private behind service-role functions", () => {
  const migration = readSource("supabase/migrations/20260828130918_ai_install_portal_testimonials.sql");
  const portalFunction = readSource("supabase/functions/ai-install-portal/index.ts");
  const adminFunction = readSource("supabase/functions/ai-install-portal-admin/index.ts");

  assert.match(migration, /ai_install_portal_testimonials enable row level security/);
  assert.match(migration, /revoke all on public\.ai_install_portal_testimonials from anon, authenticated/);
  assert.match(migration, /'ai-install-testimonials',[\s\S]*?false,[\s\S]*?524288000/);
  assert.match(portalFunction, /requirePortalAccess\(req\)/);
  assert.match(portalFunction, /createSignedUploadUrl\(storagePath\)/);
  assert.match(adminFunction, /requireAdminMember\(req\)/);
  assert.match(adminFunction, /createSignedUrl\(testimonial\.storage_path, 60 \* 10\)/);
  assert.doesNotMatch(portalFunction, /getPublicUrl/);
  assert.doesNotMatch(adminFunction, /getPublicUrl/);
});

test("testimonial request is optional, persistent, consented, and can be disabled", () => {
  const portalPage = readSource("src/pages/AIInstallPortal.tsx");
  const portalClient = readSource("src/lib/aiInstallPortal.ts");
  const portalFunction = readSource("supabase/functions/ai-install-portal/index.ts");
  const adminPage = readSource("src/pages/AIInstallPortalAdmin.tsx");

  assert.match(portalPage, /1222084782|intro_vimeo_id/);
  assert.match(portalPage, /autoplay=1&muted=1/);
  assert.match(portalPage, /Skip for now/);
  assert.match(portalPage, /Upload a video testimonial/);
  assert.match(portalPage, /permission to review and use this testimonial in marketing/);
  assert.match(portalClient, /tus\.Upload/);
  assert.match(portalClient, /chunkSize: 6 \* 1024 \* 1024/);
  assert.match(portalClient, /uploadDataDuringCreation: true/);
  assert.match(portalClient, /uploadToSignedUrl/);
  assert.match(portalFunction, /body\.consent_granted !== true/);
  assert.match(portalFunction, /AI_INSTALL_TESTIMONIAL_NOTIFY_EMAIL/);
  assert.match(portalFunction, /justin@hfiagencies\.com/);
  assert.match(adminPage, /setAiInstallTestimonialPromptEnabled/);
});

test("testimonial notification contains no signed storage URL", () => {
  const portalFunction = readSource("supabase/functions/ai-install-portal/index.ts");
  const notification = portalFunction.slice(portalFunction.indexOf("async function sendTestimonialNotification"));

  assert.match(notification, /AI Install access control/);
  assert.doesNotMatch(notification, /createSignedUrl/);
  assert.doesNotMatch(notification, /signedUrl/);
});
