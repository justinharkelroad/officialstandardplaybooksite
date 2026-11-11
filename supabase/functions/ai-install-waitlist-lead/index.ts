// AI Install waitlist (/aiinstall): sends each signup to Agency Brain's house CRM as a warm lead,
// through Agency Brain's crm-lead-intake (matched against who is already there, never doubled).
// The page still saves the signup to booking_leads itself; this only forwards it, server to server,
// because the shared secret must never be in the page.
//
// POST { full_name, email } from the page after the signup is saved. Best effort: skipped until
// AGENCYBRAIN_LEAD_INTAKE_SECRET is set, 5-second timeout, and the page never waits on the answer.
// Self-contained (no shared imports) so it deploys as one file.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGENCYBRAIN_LEAD_URL = Deno.env.get("AGENCYBRAIN_LEAD_INTAKE_URL")?.trim() ||
  "https://wjqyccbytctqwceuhzhk.supabase.co/functions/v1/crm-lead-intake";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });

async function sendToAgencyBrain(lead: Record<string, unknown>): Promise<string> {
  const secret = Deno.env.get("AGENCYBRAIN_LEAD_INTAKE_SECRET")?.trim();
  if (!secret) return "skipped";
  try {
    const res = await fetch(AGENCYBRAIN_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-lead-intake-secret": secret },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("Agency Brain lead:", res.status, (await res.text()).slice(0, 200));
      return `failed_${res.status}`;
    }
    return "sent";
  } catch (error) {
    console.error("Agency Brain lead:", error instanceof Error ? error.message : error);
    return "failed";
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  const fullName = typeof body?.full_name === "string" ? body.full_name.trim().slice(0, 200) : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  if (!fullName || !EMAIL_RE.test(email)) return json({ error: "A name and a valid email are required." }, 400);

  const crm = await sendToAgencyBrain({ form: "ai_install", name: fullName, email });
  return json({ ok: true, crm });
});
