import { handleOptions } from "../_shared/cors.ts";
import {
  errorResponse,
  isResponse,
  jsonResponse,
  requireAdminMember,
} from "../_shared/memberAuth.ts";
import {
  type AiInstallPortalAccess,
  ensurePortalAuthUser,
  generatePortalActivationCode,
  getPortalAccessByEmail,
  isPortalEmail,
  normalizePortalEmail,
  normalizePortalPlatform,
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
      const [
        accessResult,
        progressResult,
        eventResult,
        readyResult,
        settingsResult,
        testimonialResult,
      ] = await Promise.all([
        supabase
          .from("ai_install_portal_access")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("ai_install_portal_progress")
          .select(
            "access_id, content_id, max_progress, completed_at, last_viewed_at",
          ),
        supabase
          .from("ai_install_portal_events")
          .select("access_id, event_type, content_id, occurred_at")
          .eq("event_type", "download")
          .order("occurred_at", { ascending: false }),
        supabase
          .from("ai_install_ready_submissions")
          .select("email, submitted_at")
          .order("submitted_at", { ascending: false }),
        supabase
          .from("ai_install_portal_settings")
          .select("testimonial_prompt_enabled")
          .eq("id", "default")
          .maybeSingle(),
        supabase
          .from("ai_install_portal_testimonials")
          .select("id, access_id, original_filename, size_bytes, submitted_at")
          .eq("status", "uploaded")
          .order("submitted_at", { ascending: false }),
      ]);

      const firstError = accessResult.error ?? progressResult.error ??
        eventResult.error ?? readyResult.error ?? settingsResult.error ??
        testimonialResult.error;
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

      const downloadsByAccess = new Map<
        string,
        { count: number; last_at: string | null }
      >();
      for (const event of eventResult.data ?? []) {
        const current = downloadsByAccess.get(event.access_id) ??
          { count: 0, last_at: null };
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

      const testimonialByAccess = new Map<string, Record<string, unknown>>();
      for (const testimonial of testimonialResult.data ?? []) {
        if (!testimonialByAccess.has(testimonial.access_id)) {
          testimonialByAccess.set(testimonial.access_id, {
            id: testimonial.id,
            original_filename: testimonial.original_filename,
            size_bytes: testimonial.size_bytes,
            submitted_at: testimonial.submitted_at,
          });
        }
      }

      const rows = ((accessResult.data ?? []) as AiInstallPortalAccess[]).map((
        access,
      ) => ({
        ...access,
        progress: progressByAccess.get(access.id) ?? {},
        downloads: downloadsByAccess.get(access.id) ??
          { count: 0, last_at: null },
        ready_submitted_at:
          readyByEmail.get(normalizePortalEmail(access.email)) ?? null,
        testimonial: testimonialByAccess.get(access.id) ?? null,
      }));

      return jsonResponse({
        ok: true,
        rows,
        testimonial_prompt_enabled:
          settingsResult.data?.testimonial_prompt_enabled ?? true,
      });
    }

    if (action === "set_testimonial_prompt") {
      if (typeof body.enabled !== "boolean") {
        return errorResponse("enabled is required", 400);
      }
      const { error } = await supabase.from("ai_install_portal_settings")
        .upsert({
          id: "default",
          testimonial_prompt_enabled: body.enabled,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      return jsonResponse({
        ok: true,
        testimonial_prompt_enabled: body.enabled,
      });
    }

    if (action === "testimonial_download") {
      const testimonialId = typeof body.testimonial_id === "string"
        ? body.testimonial_id
        : "";
      if (!testimonialId) {
        return errorResponse("testimonial_id is required", 400);
      }
      const { data: testimonial, error } = await supabase
        .from("ai_install_portal_testimonials")
        .select("storage_path, original_filename")
        .eq("id", testimonialId)
        .eq("status", "uploaded")
        .maybeSingle();
      if (error) throw error;
      if (!testimonial) return errorResponse("Testimonial not found", 404);

      const { data: signed, error: signError } = await supabase.storage
        .from("ai-install-testimonials")
        .createSignedUrl(testimonial.storage_path, 60 * 10);
      if (signError || !signed?.signedUrl) {
        return errorResponse(
          signError?.message ?? "Could not prepare the private video",
          500,
        );
      }
      return jsonResponse({
        ok: true,
        url: signed.signedUrl,
        filename: testimonial.original_filename,
      });
    }

    if (action === "grant") {
      const email = normalizePortalEmail(body.email);
      const fullName = typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";
      const platform = normalizePortalPlatform(body.platform);
      const expiresAt = normalizeExpiry(body.expires_at);
      if (!isPortalEmail(email)) {
        return errorResponse("A valid email is required", 400);
      }
      if (expiresAt === undefined) {
        return errorResponse("Expiration date is invalid", 400);
      }

      const ensuredAuth = await ensurePortalAuthUser(supabase, email);
      const authUser = ensuredAuth.user;
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
            updated_at: now,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ai_install_portal_access")
          .insert({
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

      return jsonResponse({
        ok: true,
        access,
        activation_code: ensuredAuth.activationCode,
        existing_user: ensuredAuth.activationCode === null,
      });
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

    if (action === "issue_activation_code") {
      const accessId = typeof body.access_id === "string" ? body.access_id : "";
      if (!accessId) return errorResponse("access_id is required", 400);

      const { data: access, error: accessError } = await supabase
        .from("ai_install_portal_access")
        .select("id, user_id, email, is_active")
        .eq("id", accessId)
        .maybeSingle();
      if (accessError) throw accessError;
      if (!access) return errorResponse("Portal access not found", 404);
      if (!access.is_active) {
        return errorResponse("Reactivate access before issuing a code", 400);
      }

      const activationCode = generatePortalActivationCode();
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        access.user_id,
        { password: activationCode },
      );
      if (passwordError) throw passwordError;

      return jsonResponse({
        ok: true,
        email: access.email,
        activation_code: activationCode,
      });
    }

    if (action === "reset_activity") {
      const accessId = typeof body.access_id === "string" ? body.access_id : "";
      if (!accessId) return errorResponse("access_id is required", 400);

      const { data: access, error: accessError } = await supabase
        .from("ai_install_portal_access")
        .select("id, email")
        .eq("id", accessId)
        .maybeSingle();
      if (accessError) throw accessError;
      if (!access) return errorResponse("Portal access not found", 404);

      const { error: progressError } = await supabase
        .from("ai_install_portal_progress")
        .delete()
        .eq("access_id", accessId);
      if (progressError) throw progressError;

      const { error: eventError } = await supabase
        .from("ai_install_portal_events")
        .delete()
        .eq("access_id", accessId);
      if (eventError) throw eventError;

      const { error: resetError } = await supabase
        .from("ai_install_portal_access")
        .update({
          first_login_at: null,
          last_login_at: null,
          login_count: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", accessId);
      if (resetError) throw resetError;

      if (body.include_ready === true) {
        const { error: readyError } = await supabase
          .from("ai_install_ready_submissions")
          .delete()
          .ilike("email", access.email);
        if (readyError) throw readyError;
      }

      return jsonResponse({ ok: true });
    }

    return errorResponse(`Unknown action: ${action}`, 400);
  } catch (error) {
    console.error(`ai-install-portal-admin: action=${action} failed`, error);
    const message = error instanceof Error
      ? error.message
      : "Admin request failed";
    return errorResponse(message, 500);
  }
});

function normalizeExpiry(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}
