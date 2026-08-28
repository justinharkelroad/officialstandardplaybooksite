import type {
  SupabaseClient,
  User,
} from "https://esm.sh/@supabase/supabase-js@2";

import { createServiceClient, errorResponse } from "./memberAuth.ts";
import {
  BRAND,
  buildEmailHtml,
  EmailComponents,
  escapeHtml,
} from "./email-template.ts";

export type AiInstallPlatform = "claude" | "codex" | "both";

export interface AiInstallPortalAccess {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  platform: AiInstallPlatform;
  source: "manual" | "purchase";
  is_active: boolean;
  expires_at: string | null;
  first_login_at: string | null;
  last_login_at: string | null;
  login_count: number;
  last_magic_link_sent_at: string | null;
  magic_link_send_count: number;
  last_magic_link_error: string | null;
  testimonial_prompt_dismissed_at: string | null;
  testimonial_submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerifiedPortalAccess {
  userId: string;
  access: AiInstallPortalAccess;
  supabase: SupabaseClient;
}

export const PORTAL_URL = Deno.env.get("AI_INSTALL_PORTAL_URL") ??
  "https://standardplaybook.com/aiinstall/portal";

export const PORTAL_SESSION_WINDOW_MS = 30 * 60 * 1000;

const ACCESS_COLUMNS = [
  "id",
  "user_id",
  "email",
  "full_name",
  "platform",
  "source",
  "is_active",
  "expires_at",
  "first_login_at",
  "last_login_at",
  "login_count",
  "last_magic_link_sent_at",
  "magic_link_send_count",
  "last_magic_link_error",
  "testimonial_prompt_dismissed_at",
  "testimonial_submitted_at",
  "created_at",
  "updated_at",
].join(",");

export function normalizePortalEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isPortalEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizePortalPlatform(value: unknown): AiInstallPlatform {
  return value === "claude" || value === "codex" || value === "both"
    ? value
    : "both";
}

export function canAccessPortalAsset(
  accessPlatform: AiInstallPlatform,
  assetPlatform: AiInstallPlatform,
): boolean {
  return assetPlatform === "both" ||
    accessPlatform === "both" ||
    accessPlatform === assetPlatform;
}

export function isPortalAccessCurrent(
  access: Pick<AiInstallPortalAccess, "is_active" | "expires_at">,
  now = new Date(),
): boolean {
  if (!access.is_active) return false;
  if (!access.expires_at) return true;
  const expiry = new Date(access.expires_at);
  return !Number.isNaN(expiry.getTime()) && expiry.getTime() > now.getTime();
}

export function shouldCountPortalSession(
  lastLoginAt: string | null,
  now = new Date(),
): boolean {
  if (!lastLoginAt) return true;
  const lastLogin = new Date(lastLoginAt);
  if (Number.isNaN(lastLogin.getTime())) return true;
  return now.getTime() - lastLogin.getTime() >= PORTAL_SESSION_WINDOW_MS;
}

export async function getPortalAccessByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<AiInstallPortalAccess | null> {
  const { data, error } = await supabase
    .from("ai_install_portal_access")
    .select(ACCESS_COLUMNS)
    .ilike("email", email)
    .maybeSingle();
  if (error) throw new Error(`Portal access lookup failed: ${error.message}`);
  return (data as AiInstallPortalAccess | null) ?? null;
}

export async function getPortalAccessByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<AiInstallPortalAccess | null> {
  const { data, error } = await supabase
    .from("ai_install_portal_access")
    .select(ACCESS_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`Portal access lookup failed: ${error.message}`);
  return (data as AiInstallPortalAccess | null) ?? null;
}

async function findExistingAuthUser(
  supabase: SupabaseClient,
  email: string,
): Promise<User | null> {
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (member?.id) {
    const { data } = await supabase.auth.admin.getUserById(member.id);
    if (data?.user) return data.user;
  }

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw new Error(`Auth user lookup failed: ${error.message}`);
    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === email,
    );
    if (match) return match;
    if (data.users.length < 1000) return null;
  }

  throw new Error("Auth user lookup exceeded the supported page limit");
}

export async function ensurePortalAuthUser(
  supabase: SupabaseClient,
  email: string,
): Promise<User> {
  const existing = await findExistingAuthUser(supabase, email);
  if (existing) return existing;

  const generatedPassword = `${crypto.randomUUID()}aA7!`;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Auth user creation failed");
  }
  return data.user;
}

export async function requirePortalAccess(
  req: Request,
): Promise<VerifiedPortalAccess | Response> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return errorResponse("Missing authorization", 401);

  const supabase = createServiceClient();
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data.user) {
    return errorResponse("Invalid or expired session", 401);
  }

  let access: AiInstallPortalAccess | null;
  try {
    access = await getPortalAccessByUserId(supabase, data.user.id);
  } catch (lookupError) {
    console.error("ai-install-portal: access lookup failed", lookupError);
    return errorResponse("Access lookup failed", 500);
  }

  if (!access || !isPortalAccessCurrent(access)) {
    return errorResponse("This email does not have active portal access", 403);
  }

  return { userId: data.user.id, access, supabase };
}

export interface PortalMagicLinkResult {
  status: "sent" | "failed" | "skipped_no_key";
  error?: string;
}

export function buildPortalVerificationUrl(
  hashedToken: string,
  portalUrl = PORTAL_URL,
): string {
  const url = new URL(portalUrl);
  url.hash = new URLSearchParams({ portal_token: hashedToken }).toString();
  return url.toString();
}

function buildPortalMagicLinkHtml(
  access: AiInstallPortalAccess,
  verificationUrl: string,
): string {
  const firstName = access.full_name?.trim().split(/\s+/)[0] || "there";
  return buildEmailHtml({
    title: "Your Agency AI Install access",
    eyebrow: "PRIVATE WORKSHOP PORTAL",
    footerName: BRAND.name,
    bodyContent: `
      ${EmailComponents.paragraph(`${escapeHtml(firstName)},`)}
      ${
      EmailComponents.paragraph(
        "Use the secure link below to open both workshop replays and your AI Install resources.",
      )
    }
      ${EmailComponents.button("Open the portal", verificationUrl)}
      ${
      EmailComponents.infoText(
        "On the next screen, select Confirm and open portal. This extra step prevents automated email security checks from using your one-time access.",
      )
    }
    `,
  });
}

export async function sendPortalMagicLink(
  supabase: SupabaseClient,
  access: AiInstallPortalAccess,
): Promise<PortalMagicLinkResult> {
  const { data, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: access.email,
    options: { redirectTo: PORTAL_URL },
  });

  const hashedToken = data?.properties?.hashed_token;
  if (linkError || !hashedToken) {
    const error = linkError?.message ?? "Magic link generation failed";
    await recordMagicLinkResult(supabase, access, null, error);
    return { status: "failed", error };
  }
  const verificationUrl = buildPortalVerificationUrl(hashedToken);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    const error = "RESEND_API_KEY is not set";
    await recordMagicLinkResult(supabase, access, null, error);
    return { status: "skipped_no_key", error };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: BRAND.fromEmail,
        to: access.email,
        subject: "Your Agency AI Install sign-in link",
        html: buildPortalMagicLinkHtml(access, verificationUrl),
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      const error = `Resend ${response.status}: ${responseText.slice(0, 500)}`;
      await recordMagicLinkResult(supabase, access, null, error);
      return { status: "failed", error };
    }

    const sentAt = new Date().toISOString();
    await recordMagicLinkResult(supabase, access, sentAt, null);
    return { status: "sent" };
  } catch (sendError) {
    const error = sendError instanceof Error
      ? sendError.message
      : String(sendError);
    await recordMagicLinkResult(supabase, access, null, error);
    return { status: "failed", error };
  }
}

async function recordMagicLinkResult(
  supabase: SupabaseClient,
  access: AiInstallPortalAccess,
  sentAt: string | null,
  error: string | null,
): Promise<void> {
  const fields: Record<string, unknown> = {
    magic_link_send_count: access.magic_link_send_count + 1,
    last_magic_link_error: error,
    updated_at: new Date().toISOString(),
  };
  if (sentAt) fields.last_magic_link_sent_at = sentAt;

  const { error: updateError } = await supabase
    .from("ai_install_portal_access")
    .update(fields)
    .eq("id", access.id);
  if (updateError) {
    console.error(
      "ai-install-portal: magic link ledger update failed",
      updateError.message,
    );
  }
}
