import { handleOptions } from "../_shared/cors.ts";
import {
  createServiceClient,
  jsonResponse,
} from "../_shared/memberAuth.ts";
import {
  getPortalAccessByEmail,
  isPortalAccessCurrent,
  isPortalEmail,
  normalizePortalEmail,
  sendPortalMagicLink,
} from "../_shared/ai-install-portal.ts";

const GENERIC_RESPONSE = {
  ok: true,
  message: "If that email has access, a secure password setup link is on the way.",
};

const LINK_COOLDOWN_MS = 60_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);
  if (req.method !== "POST") return jsonResponse(GENERIC_RESPONSE);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse(GENERIC_RESPONSE);
  }

  const email = normalizePortalEmail(body.email);
  if (!isPortalEmail(email)) return jsonResponse(GENERIC_RESPONSE);

  try {
    const supabase = createServiceClient();
    const access = await getPortalAccessByEmail(supabase, email);
    if (!access || !isPortalAccessCurrent(access)) {
      return jsonResponse(GENERIC_RESPONSE);
    }

    if (access.last_magic_link_sent_at) {
      const lastSentAt = new Date(access.last_magic_link_sent_at).getTime();
      if (
        Number.isFinite(lastSentAt) &&
        Date.now() - lastSentAt < LINK_COOLDOWN_MS
      ) {
        return jsonResponse(GENERIC_RESPONSE);
      }
    }

    const result = await sendPortalMagicLink(supabase, access);
    if (result.status !== "sent") {
      console.error(
        `ai-install-request-link: send failed access=${access.id} status=${result.status}`,
        result.error,
      );
    }
  } catch (error) {
    console.error("ai-install-request-link: unhandled", error);
  }

  return jsonResponse(GENERIC_RESPONSE);
});
