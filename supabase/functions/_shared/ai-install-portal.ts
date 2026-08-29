import type {
  SupabaseClient,
  User,
} from "https://esm.sh/@supabase/supabase-js@2";

import { createServiceClient, errorResponse } from "./memberAuth.ts";

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

export const PORTAL_SESSION_WINDOW_MS = 30 * 60 * 1000;
export const PORTAL_ACTIVATION_CODE_RANDOM_LENGTH = 12;

const PORTAL_ACTIVATION_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

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

export function generatePortalActivationCode(randomBytes?: Uint8Array): string {
  const bytes = randomBytes ?? crypto.getRandomValues(
    new Uint8Array(PORTAL_ACTIVATION_CODE_RANDOM_LENGTH),
  );
  if (bytes.length < PORTAL_ACTIVATION_CODE_RANDOM_LENGTH) {
    throw new Error("Activation code entropy is incomplete");
  }
  const randomPart = Array.from(
    bytes.slice(0, PORTAL_ACTIVATION_CODE_RANDOM_LENGTH),
    (value) => PORTAL_ACTIVATION_ALPHABET[value % PORTAL_ACTIVATION_ALPHABET.length],
  ).join("");
  return `${randomPart}-Aa7!`;
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
): Promise<{ user: User; activationCode: string | null }> {
  const existing = await findExistingAuthUser(supabase, email);
  if (existing) return { user: existing, activationCode: null };

  const activationCode = generatePortalActivationCode();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: activationCode,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Auth user creation failed");
  }
  return { user: data.user, activationCode };
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
