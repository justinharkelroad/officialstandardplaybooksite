import { handleOptions } from "../_shared/cors.ts";
import {
  errorResponse,
  isResponse,
  jsonResponse,
} from "../_shared/memberAuth.ts";
import {
  canAccessPortalAsset,
  requirePortalAccess,
  type AiInstallPlatform,
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
      const now = new Date().toISOString();
      const { error: visitUpdateError } = await supabase
        .from("ai_install_portal_access")
        .update({
          first_login_at: access.first_login_at ?? now,
          last_login_at: now,
          login_count: access.login_count + 1,
          updated_at: now,
        })
        .eq("id", access.id);
      if (visitUpdateError) throw visitUpdateError;

      const { error: visitEventError } = await supabase
        .from("ai_install_portal_events")
        .insert({
          access_id: access.id,
          user_id: userId,
          event_type: "portal_visit",
        });
      if (visitEventError) throw visitEventError;

      const { data: progress, error: progressError } = await supabase
        .from("ai_install_portal_progress")
        .select("content_id, max_progress, started_at, completed_at, last_viewed_at")
        .eq("access_id", access.id);
      if (progressError) throw progressError;

      return jsonResponse({
        ok: true,
        access: {
          email: access.email,
          full_name: access.full_name,
          platform: access.platform,
          expires_at: access.expires_at,
        },
        videos: PORTAL_VIDEOS,
        progress: progress ?? [],
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
      const maxProgress = Math.max(existing?.max_progress ?? 0, progressPercent);
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

      return jsonResponse({ ok: true, max_progress: event === "complete" ? 100 : maxProgress });
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
        return errorResponse(signError?.message ?? "Could not prepare that download", 500);
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
