// Public password-recovery request endpoint.
//
// Lovable Cloud Auth generates the signed, expiring recovery link. Resend sends
// the branded email through the project's existing RESEND_API_KEY. Every public
// response is intentionally identical so callers cannot discover member emails.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { getSupabaseServiceKey } from "../_shared/supabaseKeys.ts";
import { sendMemberEmail } from "../_shared/member-email.ts";
import {
  BRAND,
  buildEmailHtml,
  EmailComponents,
  escapeHtml,
} from "../_shared/email-template.ts";

const RESET_PAGE_URL = "https://standardplaybook.com/reset-password";
const RATE_LIMIT_MS = 15 * 60 * 1000;
const GENERIC_RESPONSE = {
  ok: true,
  message: "If a member account matches that email, a reset link is on its way.",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function rateLimitKey(now = Date.now()): string {
  const bucketStart = Math.floor(now / RATE_LIMIT_MS) * RATE_LIMIT_MS;
  return new Date(bucketStart).toISOString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  let email = "";
  try {
    const body = await req.json();
    email = normalizeEmail(body?.email);
  } catch {
    return jsonResponse(GENERIC_RESPONSE);
  }

  // Keep malformed input indistinguishable from an unknown account.
  if (!email || email.length > 254 || !email.includes("@")) {
    return jsonResponse(GENERIC_RESPONSE);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured");

    const supabase = createClient(supabaseUrl, getSupabaseServiceKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("id, email, full_name, is_active")
      .eq("email", email)
      .maybeSingle();

    if (memberError) throw memberError;
    if (!member?.is_active) return jsonResponse(GENERIC_RESPONSE);

    // Avoid generating additional tokens when this account already received a
    // reset email during the current rate-limit window.
    const since = new Date(Date.now() - RATE_LIMIT_MS).toISOString();
    const { data: recent, error: recentError } = await supabase
      .from("member_emails")
      .select("id")
      .eq("member_id", member.id)
      .eq("kind", "password_reset")
      .gte("created_at", since)
      .limit(1);

    if (recentError) throw recentError;
    if (recent?.length) return jsonResponse(GENERIC_RESPONSE);

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: member.email,
    });

    const hashedToken = linkData?.properties?.hashed_token;
    if (linkError || !hashedToken) {
      throw linkError ?? new Error("Recovery link generation returned no token");
    }

    // Send members directly to our recovery screen. The page exchanges this
    // one-time token with Cloud Auth, so no separate redirect allow-list entry
    // or Lovable email-domain setup is required.
    const resetUrl = new URL(RESET_PAGE_URL);
    resetUrl.searchParams.set("token_hash", hashedToken);
    resetUrl.searchParams.set("type", "recovery");

    const firstName = member.full_name?.trim().split(/\s+/)[0] || "there";
    const html = buildEmailHtml({
      title: "Reset your password",
      subtitle: "A secure Standard Playbook password reset was requested for your account.",
      eyebrow: "SECURE ACCOUNT RECOVERY",
      footerName: BRAND.name,
      bodyContent: `
        ${EmailComponents.paragraph(`${escapeHtml(firstName)},`)}
        ${EmailComponents.paragraph(
          "Use the button below to choose a new password. If you did not request this, you can safely ignore this email.",
        )}
        ${EmailComponents.button("Choose a new password", escapeHtml(resetUrl.toString()))}
        ${EmailComponents.infoText(
          "For your security, this link is time-limited and should not be forwarded or shared.",
        )}
      `,
    });

    const result = await sendMemberEmail({
      supabase,
      memberId: member.id,
      to: member.email,
      kind: "password_reset",
      refKey: rateLimitKey(),
      subject: "Reset your Standard Playbook password",
      html,
    });

    if (result.status !== "sent" && result.status !== "duplicate") {
      console.error("password-reset: Resend delivery did not complete", result);
    }
  } catch (error) {
    // The client still receives the generic response. The actual failure stays
    // in function logs so infrastructure details and account existence do not leak.
    console.error("password-reset request failed", error);
  }

  return jsonResponse(GENERIC_RESPONSE);
});
