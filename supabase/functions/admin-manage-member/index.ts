// admin-manage-member — the only place accounts are created or switched off.
// Caller authorization comes exclusively from the verified JWT -> members row
// (requireAdminMember); the request body is never trusted for authorization.
//
// Actions:
//   create         { full_name, email, password }
//   reset_password { member_id, new_password }
//   set_active     { member_id, is_active }   (deactivate also revokes all
//                                              live sessions via the GoTrue
//                                              admin logout endpoint)
import { handleOptions } from "../_shared/cors.ts";
import {
  errorResponse,
  isResponse,
  jsonResponse,
  requireAdminMember,
} from "../_shared/memberAuth.ts";
import { sendMemberEmail } from "../_shared/member-email.ts";
import {
  BRAND,
  buildEmailHtml,
  EmailComponents,
  escapeHtml,
} from "../_shared/email-template.ts";

const APP_URL = "https://standardplaybook.com/app";

function buildWelcomeHtml(
  fullName: string,
  email: string,
  password: string,
): string {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  return buildEmailHtml({
    title: "Welcome to Standard Playbook",
    eyebrow: "YOUR ACCOUNT IS LIVE",
    footerName: BRAND.name,
    bodyContent: `
      ${EmailComponents.paragraph(`${escapeHtml(firstName)},`)}
      ${EmailComponents.paragraph(
        "Your account is live. Everything we work on now has a home — your Core 4, " +
          "your weekly playbook, your flows, and your debrief.",
      )}
      ${EmailComponents.additionalFields([
        { label: "Sign in", value: escapeHtml(APP_URL) },
        { label: "Email", value: escapeHtml(email) },
        { label: "Password", value: escapeHtml(password) },
      ])}
      ${EmailComponents.button("Sign in", APP_URL)}
      ${EmailComponents.infoText("Change your password once you're in.")}
    `,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const verified = await requireAdminMember(req);
  if (isResponse(verified)) return verified;
  const { supabase } = verified;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (_err) {
    return errorResponse("Invalid JSON body", 400);
  }

  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "create") {
      const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";
      if (!fullName || !email || password.length < 8) {
        return errorResponse(
          "full_name, email and a password of at least 8 characters are required",
          400,
        );
      }

      const { data: created, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // no confirmation email — closed system
        });
      if (createError || !created?.user) {
        return errorResponse(createError?.message ?? "Auth user creation failed", 400);
      }

      const { error: memberError } = await supabase.from("members").insert({
        id: created.user.id,
        full_name: fullName,
        email,
      });
      if (memberError) {
        // Roll back the orphan auth user so create is all-or-nothing.
        await supabase.auth.admin.deleteUser(created.user.id);
        return errorResponse(`Member row creation failed: ${memberError.message}`, 400);
      }

      // Welcome mail carries the credentials Justin just typed. A send failure
      // must NOT undo a good account — surface it in the response instead, and
      // the member_emails ledger holds the reason.
      const welcome = await sendMemberEmail({
        supabase,
        memberId: created.user.id,
        to: email,
        kind: "welcome",
        refKey: created.user.id, // one welcome per member, ever
        subject: "Welcome to Standard Playbook",
        html: buildWelcomeHtml(fullName, email, password),
      });

      return jsonResponse({
        ok: true,
        member: { id: created.user.id, full_name: fullName, email },
        welcome_email: welcome,
      });
    }

    if (action === "reset_password") {
      const memberId = typeof body.member_id === "string" ? body.member_id : "";
      const newPassword = typeof body.new_password === "string" ? body.new_password : "";
      if (!memberId || newPassword.length < 8) {
        return errorResponse("member_id and new_password (min 8 chars) required", 400);
      }

      const { error } = await supabase.auth.admin.updateUserById(memberId, {
        password: newPassword,
      });
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ ok: true });
    }

    if (action === "set_active") {
      const memberId = typeof body.member_id === "string" ? body.member_id : "";
      const isActive = body.is_active === true;
      if (!memberId) return errorResponse("member_id required", 400);
      if (memberId === verified.userId && !isActive) {
        return errorResponse("You cannot deactivate your own admin account", 400);
      }

      const { data: updated, error } = await supabase
        .from("members")
        .update({ is_active: isActive })
        .eq("id", memberId)
        .select("id, is_active")
        .maybeSingle();
      if (error) return errorResponse(error.message, 400);
      if (!updated) return errorResponse("Member not found", 404);

      // An already-issued JWT stays valid until expiry; RLS (is_active_member)
      // already blocks its data access. Banning the auth user additionally
      // kills refresh + re-login so the session cannot renew; reactivation
      // lifts the ban.
      const { error: banError } = await supabase.auth.admin.updateUserById(memberId, {
        ban_duration: isActive ? "none" : "87600h",
      });
      if (banError) {
        // Surface honestly — the RLS gate still holds, but session revocation
        // is part of the contract.
        return jsonResponse(
          {
            ok: true,
            is_active: isActive,
            sessions_revoked: false,
            warning: `Ban update failed: ${banError.message}`,
          },
          200,
        );
      }

      return jsonResponse({ ok: true, is_active: isActive, sessions_revoked: !isActive });
    }

    return errorResponse(`Unknown action: ${action}`, 400);
  } catch (err) {
    console.error("admin-manage-member error", err);
    return errorResponse("Internal error", 500);
  }
});
