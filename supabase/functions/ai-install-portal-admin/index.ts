import { handleOptions } from "../_shared/cors.ts";
import {
  errorResponse,
  isResponse,
  jsonResponse,
  requireAdminMember,
} from "../_shared/memberAuth.ts";
import {
  ensurePortalAuthUser,
  getPortalAccessByEmail,
  isPortalEmail,
  normalizePortalEmail,
  normalizePortalPlatform,
  sendPortalMagicLink,
  type AiInstallPortalAccess,
} from "../_shared/ai-install-portal.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const verified = await requireAdminMember(req);
  if (isResponse(verified)) return verified;
  const { supabase, userId } = verified;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "list") {
      const [accessResult, progressResult, eventResult, readyResult] = await Promise.all([
        supabase
          .from("ai_install_portal_access")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("ai_install_portal_progress")
          .select("access_id, content_id, max_progress, completed_at, last_viewed_at"),
        supabase
          .from("ai_install_portal_events")
          .select("access_id, event_type, content_id, occurred_at")
          .eq("event_type", "download")
          .order("occurred_at", { ascending: false }),
        supabase
          .from("ai_install_ready_submissions")
          .select("email, submitted_at")
          .order("submitted_at", { ascending: false }),
      ]);

      const firstError = accessResult.error ?? progressResult.error ??
        eventResult.error ?? readyResult.error;
      if (firstError) throw firstError;

      const progressByAccess = new Map<string, Record<string, unknown>>();
      for (const item of progressResult.data ?? []) {
        const current = progressByAccess.get(item.access_id) ?? {};
        current[item.content_id] = {
          max_progress: item.max_progress,
          completed_at: item.completed_at,
          last_viewed_at: item.last_viewed_at,
        };
        progressByAccess.set(item.access_id, current);
      }

      const downloadsByAccess = new Map<string, { count: number; last_at: string | null }>();
      for (const event of eventResult.data ?? []) {
        const current = downloadsByAccess.get(event.access_id) ?? { count: 0, last_at: null };
        current.count += 1;
        current.last_at = current.last_at ?? event.occurred_at;
        downloadsByAccess.set(event.access_id, current);
      }

      const readyByEmail = new Map<string, string>();
      for (const submission of readyResult.data ?? []) {
        const email = normalizePortalEmail(submission.email);
        if (email && !readyByEmail.has(email)) {
          readyByEmail.set(email, submission.submitted_at);
        }
      }

      const rows = ((accessResult.data ?? []) as AiInstallPortalAccess[]).map((access) => ({
        ...access,
        progress: progressByAccess.get(access.id) ?? {},
        downloads: downloadsByAccess.get(access.id) ?? { count: 0, last_at: null },
        ready_submitted_at: readyByEmail.get(normalizePortalEmail(access.email)) ?? null,
      }));

      return jsonResponse({ ok: true, rows });
    }

    if (action === "grant") {
      const email = normalizePortalEmail(body.email);
      const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
      const platform = normalizePortalPlatform(body.platform);
      const expiresAt = normalizeExpiry(body.expires_at);
      if (!isPortalEmail(email)) return errorResponse("A valid email is required", 400);
      if (expiresAt === undefined) return errorResponse("Expiration date is invalid", 400);

      const authUser = await ensurePortalAuthUser(supabase, email);
      const existing = await getPortalAccessByEmail(supabase, email);
      const now = new Date().toISOString();

      if (existing) {
        const { error } = await supabase
          .from("ai_install_portal_access")
          .update({
            user_id: authUser.id,
            full_name: fullName || existing.full_name,
            platform,
            is_active: true,
            expires_at: expiresAt,
            last_magic_link_error: null,
            updated_at: now,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ai_install_portal_access").insert({
          user_id: authUser.id,
          email,
          full_name: fullName || null,
          platform,
          source: "manual",
          is_active: true,
          expires_at: expiresAt,
          created_by: userId,
          created_at: now,
          updated_at: now,
        });
        if (error) throw error;
      }

      const access = await getPortalAccessByEmail(supabase, email);
      if (!access) throw new Error("Portal access was not created");
      const magicLink = await sendPortalMagicLink(supabase, access);

      return jsonResponse({ ok: true, access, magic_link: magicLink });
    }

    if (action === "set_active") {
      const accessId = typeof body.access_id === "string" ? body.access_id : "";
      const isActive = body.is_active === true;
      if (!accessId) return errorResponse("access_id is required", 400);

      const { data, error } = await supabase
        .from("ai_install_portal_access")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", accessId)
        .select("id, is_active")
        .maybeSingle();
      if (error) throw error;
      if (!data) return errorResponse("Portal access not found", 404);
      return jsonResponse({ ok: true, access: data });
    }

    if (action === "resend") {
      const accessId = typeof body.access_id === "string" ? body.access_id : "";
      if (!accessId) return errorResponse("access_id is required", 400);

      const { data, error } = await supabase
        .from("ai_install_portal_access")
        .select("*")
        .eq("id", accessId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return errorResponse("Portal access not found", 404);
      if (!data.is_active) return errorResponse("Reactivate access before sending a link", 400);

      const result = await sendPortalMagicLink(
        supabase,
        data as AiInstallPortalAccess,
      );
      return jsonResponse({ ok: true, magic_link: result });
    }

    return errorResponse(`Unknown action: ${action}`, 400);
  } catch (error) {
    console.error(`ai-install-portal-admin: action=${action} failed`, error);
    const message = error instanceof Error ? error.message : "Admin request failed";
    return errorResponse(message, 500);
  }
});

function normalizeExpiry(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}
