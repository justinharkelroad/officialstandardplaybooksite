// Supabase Edge Functions bundle pinned npm: imports directly.
// deno-lint-ignore no-import-prefix
import { createClient } from "npm:@supabase/supabase-js@2.95.3";

/**
 * READY pre-work confirmation intake for The Agency AI Install.
 *
 * Public endpoint, no JWT: this is a form on a marketing page. Every field is
 * validated here rather than trusted from the browser, and the screenshot goes
 * into a private bucket that only admins can read.
 *
 * The notification to Mary is best effort. A submission that is safely stored
 * but whose email failed is still a successful submission from the buyer's
 * point of view, and the failure is recorded on the row so it is visible in
 * the admin list rather than lost.
 */

const NOTIFY_TO = Deno.env.get("AI_INSTALL_READY_NOTIFY_TO") ||
  "info@standardplaybook.com";
const FROM = Deno.env.get("AI_INSTALL_FROM_EMAIL") ||
  "Standard Playbook <info@standardplaybook.com>";
const BUCKET = "ai-install-ready";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const form = await req.formData();

    const firstName = text(form.get("first_name"));
    const lastName = text(form.get("last_name"));
    const email = text(form.get("email")).toLowerCase();
    const platform = text(form.get("platform")).toLowerCase();
    const screenshot = form.get("screenshot");

    if (!firstName) return json({ error: "First name is required." }, 400);
    if (!lastName) return json({ error: "Last name is required." }, 400);
    if (!isEmail(email)) return json({ error: "A valid email is required." }, 400);
    if (platform !== "claude" && platform !== "codex") {
      return json({ error: "Choose Claude or Codex." }, 400);
    }
    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return json({ error: "A screenshot is required." }, 400);
    }
    if (screenshot.size > MAX_BYTES) {
      return json({ error: "That image is over 10 MB. Please upload a smaller one." }, 400);
    }
    if (!ALLOWED_TYPES.has(screenshot.type.toLowerCase())) {
      return json({ error: "Upload an image file (PNG, JPG, WEBP or HEIC)." }, 400);
    }

    const supabase = createClient(
      requiredEnv("SUPABASE_URL"),
      requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `${platform}/${stamp}-${crypto.randomUUID()}.${
      extensionFor(screenshot.type)
    }`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, screenshot, {
        contentType: screenshot.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("ai-install-ready: upload failed", uploadError.message);
      return json({ error: "We could not save that screenshot. Please try again." }, 500);
    }

    const { data: row, error: insertError } = await supabase
      .from("ai_install_ready_submissions")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        platform,
        screenshot_path: path,
        screenshot_type: screenshot.type,
        screenshot_bytes: screenshot.size,
      })
      .select("id, submitted_at")
      .single();

    if (insertError || !row?.id) {
      // The row is the record of truth. Without it the upload is an orphan, so
      // it is removed rather than left in the bucket.
      await supabase.storage.from(BUCKET).remove([path]);
      console.error("ai-install-ready: insert failed", insertError?.message);
      return json({ error: "We could not record that. Please try again." }, 500);
    }

    // Best effort from here. The submission is already safe.
    const notify = await sendNotification(supabase, {
      id: row.id,
      firstName,
      lastName,
      email,
      platform,
      path,
    });

    await supabase
      .from("ai_install_ready_submissions")
      .update(
        notify.ok
          ? { notified_at: new Date().toISOString(), notify_error: null }
          : { notify_error: notify.error?.slice(0, 500) ?? "unknown" },
      )
      .eq("id", row.id);

    return json({ ok: true, id: row.id, notified: notify.ok });
  } catch (error) {
    console.error("ai-install-ready: unhandled", errorMessage(error));
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});

// Minimal structural type: two supabase-js copies in the graph make
// ReturnType<typeof createClient> incompatible with the client instance.
type SignedUrlClient = {
  storage: {
    from: (bucket: string) => {
      createSignedUrl: (
        path: string,
        expiresIn: number,
      ) => Promise<{ data: { signedUrl: string } | null }>;
    };
  };
};

async function sendNotification(
  supabase: SignedUrlClient,
  input: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    platform: string;
    path: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY is not configured" };

  // Signed for 7 days so Mary can open the screenshot straight from the email
  // without the bucket ever being public.
  let screenshotUrl: string | null = null;
  try {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(input.path, 60 * 60 * 24 * 7);
    screenshotUrl = data?.signedUrl ?? null;
  } catch {
    screenshotUrl = null;
  }

  const platformLabel = input.platform === "claude" ? "Claude" : "Codex";
  const name = `${input.firstName} ${input.lastName}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `ai-install-ready/${input.id}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: input.email,
        subject: `READY: ${name} (${platformLabel})`,
        html: renderNotification({ ...input, name, platformLabel, screenshotUrl }),
        tags: [
          { name: "source", value: "ai_install" },
          { name: "email_kind", value: "ready_confirmation" },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: `Resend ${response.status}: ${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

function renderNotification(input: {
  name: string;
  email: string;
  platformLabel: string;
  screenshotUrl: string | null;
}): string {
  const screenshot = input.screenshotUrl
    ? `<p style="margin:0 0 8px;"><a href="${escapeHtml(input.screenshotUrl)}">Open the screenshot</a> (link valid 7 days)</p>`
    : `<p style="margin:0 0 8px;color:#5a5a5a;">Screenshot saved. The signed link could not be generated, open it from the admin list.</p>`;

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>READY submission</title></head>
  <body style="margin:0;padding:24px;background:#f4f2ee;font-family:Inter,Arial,sans-serif;color:#0a0a0b;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #0a0a0b;padding:28px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5a5a5a;">The Agency AI Install</p>
      <h1 style="margin:0 0 20px;font-size:22px;line-height:1.25;">Pre-work confirmed</h1>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin:0 0 8px;"><strong>Platform:</strong> ${escapeHtml(input.platformLabel)}</p>
      ${screenshot}
      <p style="margin:20px 0 0;font-size:13px;color:#5a5a5a;">Reply to this email to reach them directly.</p>
    </div>
  </body>
</html>`;
}

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

function extensionFor(mime: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };
  return map[mime.toLowerCase()] ?? "img";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
