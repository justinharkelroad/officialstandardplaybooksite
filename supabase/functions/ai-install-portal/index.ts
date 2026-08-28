import { handleOptions } from "../_shared/cors.ts";
import {
  errorResponse,
  isResponse,
  jsonResponse,
} from "../_shared/memberAuth.ts";
import {
  type AiInstallPlatform,
  canAccessPortalAsset,
  requirePortalAccess,
  shouldCountPortalSession,
} from "../_shared/ai-install-portal.ts";

type VideoId = "day-1" | "day-2";
type VideoEvent = "play" | "progress" | "complete";

interface PortalAsset {
  id: string;
  path: string;
  filename: string;
  platform: AiInstallPlatform;
}

export const PORTAL_ASSETS: Record<string, PortalAsset> = {
  "day-1-guide": {
    id: "day-1-guide",
    path: "common/ai-install-day-1-guide.pdf",
    filename: "Ai Install Day 1 Guide.pdf",
    platform: "both",
  },
  "day-2-guide": {
    id: "day-2-guide",
    path: "common/ai-install-day-2-guide.pdf",
    filename: "Ai Install Day 2 Guide.pdf",
    platform: "both",
  },
  "skills-guide": {
    id: "skills-guide",
    path: "common/standard-playbook-skills.pdf",
    filename: "Standard Playbook Skills.pdf",
    platform: "both",
  },
  "claude-prework": {
    id: "claude-prework",
    path: "claude/ai-install-claude-starter-pack.zip",
    filename: "AI Install Claude Starter Pack.zip",
    platform: "claude",
  },
  "claude-skills": {
    id: "claude-skills",
    path: "claude/standard-agency-intelligence-skills-claude.zip",
    filename: "Standard Agency Intelligence Skills - Claude.zip",
    platform: "claude",
  },
  "codex-prework": {
    id: "codex-prework",
    path: "codex/ai-install-codex-starter-pack.zip",
    filename: "AI Install Codex Starter Pack.zip",
    platform: "codex",
  },
  "codex-skills": {
    id: "codex-skills",
    path: "codex/standard-agency-intelligence-skills-codex.zip",
    filename: "Standard Agency Intelligence Skills - Codex.zip",
    platform: "codex",
  },
};

const PORTAL_VIDEOS = [
  { id: "day-1", vimeo_id: "1221779945", title: "Agency AI Install - Day 1" },
  { id: "day-2", vimeo_id: "1222026378", title: "Agency AI Install - Day 2" },
] as const;

const TESTIMONIAL_BUCKET = "ai-install-testimonials";
const TESTIMONIAL_VIMEO_ID = "1222084782";
const TESTIMONIAL_MAX_BYTES = 500 * 1024 * 1024;
const TESTIMONIAL_ALLOWED_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const verified = await requirePortalAccess(req);
  if (isResponse(verified)) return verified;
  const { access, supabase, userId } = verified;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "status") {
      const nowDate = new Date();
      if (shouldCountPortalSession(access.last_login_at, nowDate)) {
        const now = nowDate.toISOString();
        const { error: sessionUpdateError } = await supabase
          .from("ai_install_portal_access")
          .update({
            first_login_at: access.first_login_at ?? now,
            last_login_at: now,
            login_count: access.login_count + 1,
            updated_at: now,
          })
          .eq("id", access.id);
        if (sessionUpdateError) throw sessionUpdateError;

        const { error: sessionEventError } = await supabase
          .from("ai_install_portal_events")
          .insert({
            access_id: access.id,
            user_id: userId,
            event_type: "portal_visit",
          });
        if (sessionEventError) throw sessionEventError;
      }

      const [progressResult, settingsResult, testimonialResult] = await Promise
        .all([
          supabase
            .from("ai_install_portal_progress")
            .select(
              "content_id, max_progress, started_at, completed_at, last_viewed_at",
            )
            .eq("access_id", access.id),
          supabase
            .from("ai_install_portal_settings")
            .select("testimonial_prompt_enabled")
            .eq("id", "default")
            .maybeSingle(),
          supabase
            .from("ai_install_portal_testimonials")
            .select("id, submitted_at")
            .eq("access_id", access.id)
            .eq("status", "uploaded")
            .order("submitted_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);
      const firstError = progressResult.error ?? settingsResult.error ??
        testimonialResult.error;
      if (firstError) throw firstError;

      return jsonResponse({
        ok: true,
        access: {
          email: access.email,
          full_name: access.full_name,
          platform: access.platform,
          expires_at: access.expires_at,
        },
        videos: PORTAL_VIDEOS,
        progress: progressResult.data ?? [],
        testimonial: {
          enabled: settingsResult.data?.testimonial_prompt_enabled ?? true,
          intro_vimeo_id: TESTIMONIAL_VIMEO_ID,
          prompt_dismissed_at: access.testimonial_prompt_dismissed_at,
          submitted_at: testimonialResult.data?.submitted_at ??
            access.testimonial_submitted_at,
        },
      });
    }

    if (action === "testimonial_skip") {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("ai_install_portal_access")
        .update({ testimonial_prompt_dismissed_at: now, updated_at: now })
        .eq("id", access.id);
      if (updateError) throw updateError;

      const { error: eventError } = await supabase.from(
        "ai_install_portal_events",
      ).insert({
        access_id: access.id,
        user_id: userId,
        event_type: "testimonial_skip",
      });
      if (eventError) throw eventError;
      return jsonResponse({ ok: true, prompt_dismissed_at: now });
    }

    if (action === "testimonial_upload_url") {
      const filename = normalizeFilename(body.filename);
      const contentType = normalizeTestimonialContentType(body.content_type);
      const sizeBytes = normalizeTestimonialSize(body.size_bytes);
      if (!filename || !contentType || sizeBytes === null) {
        return errorResponse(
          "Choose an MP4, MOV, M4V, or WEBM video up to 500 MB.",
          400,
        );
      }
      if (body.consent_granted !== true) {
        return errorResponse(
          "Permission to use the testimonial is required before upload.",
          400,
        );
      }

      const testimonialId = crypto.randomUUID();
      const storagePath = `${access.id}/${testimonialId}.${
        extensionFor(contentType)
      }`;
      const now = new Date().toISOString();
      const { error: insertError } = await supabase
        .from("ai_install_portal_testimonials")
        .insert({
          id: testimonialId,
          access_id: access.id,
          user_id: userId,
          storage_path: storagePath,
          original_filename: filename,
          content_type: contentType,
          size_bytes: sizeBytes,
          status: "pending",
          consent_granted_at: now,
          consent_text_version: "2026-08-28",
          created_at: now,
          updated_at: now,
        });
      if (insertError) throw insertError;

      const { data: signed, error: signError } = await supabase.storage
        .from(TESTIMONIAL_BUCKET)
        .createSignedUploadUrl(storagePath);
      if (signError || !signed?.token) {
        await supabase.from("ai_install_portal_testimonials")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", testimonialId);
        return errorResponse(
          signError?.message ?? "Could not prepare the private upload.",
          500,
        );
      }

      return jsonResponse({
        ok: true,
        testimonial_id: testimonialId,
        storage_path: storagePath,
        upload_token: signed.token,
      });
    }

    if (action === "testimonial_complete") {
      const testimonialId = typeof body.testimonial_id === "string"
        ? body.testimonial_id
        : "";
      if (!testimonialId) {
        return errorResponse("testimonial_id is required", 400);
      }

      const { data: testimonial, error: readError } = await supabase
        .from("ai_install_portal_testimonials")
        .select("id, storage_path, original_filename, status")
        .eq("id", testimonialId)
        .eq("access_id", access.id)
        .maybeSingle();
      if (readError) throw readError;
      if (!testimonial) {
        return errorResponse("Testimonial upload not found", 404);
      }
      if (testimonial.status === "uploaded") {
        return jsonResponse({
          ok: true,
          submitted_at: access.testimonial_submitted_at,
        });
      }
      if (testimonial.status !== "pending") {
        return errorResponse("This upload can no longer be completed", 409);
      }

      const [folder, objectName] = splitStoragePath(testimonial.storage_path);
      const { data: objects, error: storageError } = await supabase.storage
        .from(TESTIMONIAL_BUCKET)
        .list(folder, { search: objectName, limit: 10 });
      if (storageError) throw storageError;
      if (!(objects ?? []).some((object) => object.name === objectName)) {
        return errorResponse("The video has not finished uploading yet.", 409);
      }

      const now = new Date().toISOString();
      const { error: completeError } = await supabase
        .from("ai_install_portal_testimonials")
        .update({ status: "uploaded", submitted_at: now, updated_at: now })
        .eq("id", testimonial.id)
        .eq("status", "pending");
      if (completeError) throw completeError;

      const [accessUpdate, eventInsert] = await Promise.all([
        supabase.from("ai_install_portal_access")
          .update({ testimonial_submitted_at: now, updated_at: now })
          .eq("id", access.id),
        supabase.from("ai_install_portal_events").insert({
          access_id: access.id,
          user_id: userId,
          event_type: "testimonial_upload",
          content_id: testimonial.id,
        }),
      ]);
      if (accessUpdate.error) throw accessUpdate.error;
      if (eventInsert.error) throw eventInsert.error;

      const notification = await sendTestimonialNotification(access, {
        id: testimonial.id,
        filename: testimonial.original_filename,
      });
      await supabase.from("ai_install_portal_testimonials").update(
        notification.ok
          ? {
            notification_sent_at: new Date().toISOString(),
            notification_error: null,
          }
          : {
            notification_error: notification.error?.slice(0, 500) ?? "unknown",
          },
      ).eq("id", testimonial.id);

      return jsonResponse({
        ok: true,
        submitted_at: now,
        notified: notification.ok,
      });
    }

    if (action === "video") {
      const contentId = normalizeVideoId(body.content_id);
      const event = normalizeVideoEvent(body.event);
      const progressPercent = normalizePercent(body.progress_percent);
      if (!contentId || !event || progressPercent === null) {
        return errorResponse("Invalid video event", 400);
      }

      const { data: existing, error: readError } = await supabase
        .from("ai_install_portal_progress")
        .select("max_progress, started_at, completed_at")
        .eq("access_id", access.id)
        .eq("content_id", contentId)
        .maybeSingle();
      if (readError) throw readError;

      const now = new Date().toISOString();
      const maxProgress = Math.max(
        existing?.max_progress ?? 0,
        progressPercent,
      );
      const completedAt = event === "complete"
        ? existing?.completed_at ?? now
        : existing?.completed_at ?? null;

      const { error: upsertError } = await supabase
        .from("ai_install_portal_progress")
        .upsert({
          access_id: access.id,
          content_id: contentId,
          max_progress: event === "complete" ? 100 : maxProgress,
          started_at: existing?.started_at ?? now,
          completed_at: completedAt,
          last_viewed_at: now,
          updated_at: now,
        }, { onConflict: "access_id,content_id" });
      if (upsertError) throw upsertError;

      if (event !== "progress") {
        const { error: eventError } = await supabase
          .from("ai_install_portal_events")
          .insert({
            access_id: access.id,
            user_id: userId,
            event_type: event === "play" ? "video_play" : "video_complete",
            content_id: contentId,
            progress_percent: event === "complete" ? 100 : progressPercent,
          });
        if (eventError) throw eventError;
      }

      return jsonResponse({
        ok: true,
        max_progress: event === "complete" ? 100 : maxProgress,
      });
    }

    if (action === "download") {
      const assetId = typeof body.asset_id === "string" ? body.asset_id : "";
      const asset = PORTAL_ASSETS[assetId];
      if (!asset || !canAccessPortalAsset(access.platform, asset.platform)) {
        return errorResponse("Resource not available for this access", 403);
      }

      const { data, error: signError } = await supabase.storage
        .from("ai-install-portal")
        .createSignedUrl(asset.path, 60 * 5, { download: asset.filename });
      if (signError || !data?.signedUrl) {
        return errorResponse(
          signError?.message ?? "Could not prepare that download",
          500,
        );
      }

      const { error: eventError } = await supabase
        .from("ai_install_portal_events")
        .insert({
          access_id: access.id,
          user_id: userId,
          event_type: "download",
          content_id: asset.id,
        });
      if (eventError) throw eventError;

      return jsonResponse({ ok: true, url: data.signedUrl });
    }

    if (action === "sign_out") {
      const { error } = await supabase.from("ai_install_portal_events").insert({
        access_id: access.id,
        user_id: userId,
        event_type: "sign_out",
      });
      if (error) throw error;
      return jsonResponse({ ok: true });
    }

    return errorResponse(`Unknown action: ${action}`, 400);
  } catch (error) {
    console.error(`ai-install-portal: action=${action} failed`, error);
    return errorResponse("Portal request failed", 500);
  }
});

function normalizeVideoId(value: unknown): VideoId | null {
  return value === "day-1" || value === "day-2" ? value : null;
}

function normalizeVideoEvent(value: unknown): VideoEvent | null {
  return value === "play" || value === "progress" || value === "complete"
    ? value
    : null;
}

function normalizePercent(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeFilename(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const filename = value.trim().replace(/[\\/\0]/g, "-").slice(0, 180);
  return filename || null;
}

function normalizeTestimonialContentType(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const contentType = value.trim().toLowerCase();
  return TESTIMONIAL_ALLOWED_TYPES.has(contentType) ? contentType : null;
}

function normalizeTestimonialSize(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) return null;
  return value > 0 && value <= TESTIMONIAL_MAX_BYTES ? value : null;
}

function extensionFor(contentType: string): string {
  if (contentType === "video/quicktime") return "mov";
  if (contentType === "video/webm") return "webm";
  if (contentType === "video/x-m4v") return "m4v";
  return "mp4";
}

function splitStoragePath(path: string): [string, string] {
  const index = path.lastIndexOf("/");
  return index === -1
    ? ["", path]
    : [path.slice(0, index), path.slice(index + 1)];
}

async function sendTestimonialNotification(
  access: { email: string; full_name: string | null },
  testimonial: { id: string; filename: string },
): Promise<{ ok: boolean; error?: string }> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY is not configured" };
  const notifyTo = Deno.env.get("AI_INSTALL_TESTIMONIAL_NOTIFY_EMAIL");
  if (!notifyTo) {
    return {
      ok: false,
      error: "AI_INSTALL_TESTIMONIAL_NOTIFY_EMAIL is not configured",
    };
  }

  const from = Deno.env.get("AI_INSTALL_FROM_EMAIL") ||
    "Standard Playbook <info@standardplaybook.com>";
  const name = access.full_name?.trim() || access.email;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `ai-install-testimonial/${testimonial.id}`,
      },
      body: JSON.stringify({
        from,
        to: [notifyTo],
        reply_to: access.email,
        subject: `New AI Install video testimonial from ${name}`,
        html:
          `<!doctype html><html lang="en"><body style="margin:0;padding:24px;background:#f0efe9;font-family:Arial,sans-serif;color:#0b0c0e"><div style="max-width:560px;margin:auto;border:1px solid #0b0c0e;background:#fff;padding:28px"><p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase">Agency AI Install</p><h1 style="font-size:24px">New video testimonial</h1><p><strong>${
            escapeHtml(name)
          }</strong> (${escapeHtml(access.email)}) uploaded <strong>${
            escapeHtml(testimonial.filename)
          }</strong>.</p><p>The video is stored privately in your AI Install testimonial files. Sign in to <a href="https://standardplaybook.com/aiinstall/portal/admin">AI Install access control</a> to review it.</p><p style="color:#63666b;font-size:13px">Reply to this email to reach them directly.</p></div></body></html>`,
        tags: [
          { name: "source", value: "ai_install" },
          { name: "email_kind", value: "video_testimonial" },
        ],
      }),
    });
    if (!response.ok) {
      return {
        ok: false,
        error: `Resend ${response.status}: ${
          (await response.text()).slice(0, 300)
        }`,
      };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[character] ?? character);
}
