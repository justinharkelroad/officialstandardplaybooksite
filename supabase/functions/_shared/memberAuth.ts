// Member-app auth for edge functions.
// Replaces the source platform's verifyRequest (owner/staff dual-auth +
// agency/tier gating) with the single closed model this app uses:
// a Supabase JWT belonging to an ACTIVE row in public.members.
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { getSupabaseServiceKey } from "./supabaseKeys.ts";

export interface VerifiedMember {
  userId: string;
  email: string | null;
  fullName: string;
  isAdmin: boolean;
  supabase: SupabaseClient; // service-role client
}

export function createServiceClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  if (!url) throw new Error("SUPABASE_URL not set");
  return createClient(url, getSupabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

/**
 * Verifies the caller's JWT and requires an ACTIVE members row.
 * Returns a Response (ready to send) on failure.
 */
export async function requireActiveMember(
  req: Request,
): Promise<VerifiedMember | Response> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return errorResponse("Missing authorization", 401);

  const supabase = createServiceClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData?.user) {
    return errorResponse("Invalid or expired session", 401);
  }

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, full_name, email, is_active, is_admin")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (memberError) return errorResponse("Member lookup failed", 500);
  if (!member || !member.is_active) {
    return errorResponse("Your access is inactive — contact Justin.", 403);
  }

  return {
    userId: userData.user.id,
    email: member.email ?? userData.user.email ?? null,
    fullName: member.full_name,
    isAdmin: !!member.is_admin,
    supabase,
  };
}

/** Same as requireActiveMember but additionally requires is_admin. */
export async function requireAdminMember(
  req: Request,
): Promise<VerifiedMember | Response> {
  const result = await requireActiveMember(req);
  if (result instanceof Response) return result;
  if (!result.isAdmin) return errorResponse("Admin access required", 403);
  return result;
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
