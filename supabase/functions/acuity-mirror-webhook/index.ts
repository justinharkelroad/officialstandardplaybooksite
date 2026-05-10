// acuity-mirror-webhook — single-file Edge Function for Lovable Cloud.
// Receives Acuity's appointment.scheduled / appointment.rescheduled webhook,
// fetches full appointment details from Acuity's API, filters to Mirror
// bookings, and invokes cancel-mirror-drip with the booker's email.
//
// Acuity expects a 200 within ~10 seconds. Cancellation is idempotent so
// Acuity retries are safe.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ACUITY_USER_ID = Deno.env.get("ACUITY_USER_ID");
const ACUITY_API_KEY = Deno.env.get("ACUITY_API_KEY");

// Optional pinned ID for the Mirror appointment type. Once known, set
// ACUITY_MIRROR_APPOINTMENT_TYPE_ID in Lovable secrets to use exact matching
// instead of the case-insensitive "mirror" string match below.
const ACUITY_MIRROR_APPOINTMENT_TYPE_ID = Deno.env.get("ACUITY_MIRROR_APPOINTMENT_TYPE_ID");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

const RELEVANT_ACTIONS = new Set([
  "appointment.scheduled",
  "appointment.rescheduled",
  // Acuity's webhook UI sometimes uses bare names instead of dotted ones.
  "scheduled",
  "rescheduled",
]);

interface AcuityAppointment {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  appointmentTypeID?: number;
  datetime?: string;
}

async function fetchAppointment(id: string): Promise<AcuityAppointment | null> {
  if (!ACUITY_USER_ID || !ACUITY_API_KEY) {
    console.error("Acuity credentials missing — set ACUITY_USER_ID and ACUITY_API_KEY in Lovable secrets");
    return null;
  }
  const auth = btoa(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`);
  const url = `https://acuityscheduling.com/api/v1/appointments/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch { /* ignore */ }
    console.error(`Acuity GET ${id} failed status=${res.status}: ${body}`);
    return null;
  }
  return await res.json() as AcuityAppointment;
}

function isMirrorAppointment(appt: AcuityAppointment): boolean {
  // Prefer exact match on the pinned appointment type ID if configured.
  if (ACUITY_MIRROR_APPOINTMENT_TYPE_ID) {
    return String(appt.appointmentTypeID ?? "") === ACUITY_MIRROR_APPOINTMENT_TYPE_ID;
  }
  // Fallback: case-insensitive match on the display name.
  const typeStr = (appt.type ?? "").toLowerCase();
  return typeStr.includes("mirror");
}

async function invokeCancelMirrorDrip(email: string): Promise<{ ok: boolean; cancelled: number; detail?: string }> {
  const url = `${SUPABASE_URL}/functions/v1/cancel-mirror-drip`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ email, reason: "acuity_booking" }),
    });
    const text = await res.text();
    let parsed: any = null;
    try { parsed = JSON.parse(text); } catch { /* ignore */ }
    if (!res.ok) {
      return { ok: false, cancelled: 0, detail: `cancel-mirror-drip HTTP ${res.status}: ${text.slice(0, 500)}` };
    }
    return { ok: true, cancelled: Number(parsed?.cancelled ?? 0), detail: text };
  } catch (err: any) {
    return { ok: false, cancelled: 0, detail: err?.message ?? String(err) };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  try {
    // Acuity posts application/x-www-form-urlencoded. Some test/dev clients
    // may send JSON — accept both.
    const contentType = req.headers.get("content-type") ?? "";
    let action = "";
    let appointmentId = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      action = String(body?.action ?? "");
      appointmentId = String(body?.id ?? "");
    } else {
      const formText = await req.text();
      const params = new URLSearchParams(formText);
      action = params.get("action") ?? "";
      appointmentId = params.get("id") ?? "";
    }

    if (!RELEVANT_ACTIONS.has(action)) {
      console.log(`acuity-mirror-webhook: ignoring action=${action}`);
      return new Response(
        JSON.stringify({ ok: true, ignored: true, action }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!appointmentId) {
      console.warn("acuity-mirror-webhook: missing appointment id on relevant action");
      return new Response(
        JSON.stringify({ ok: true, ignored: true, reason: "missing_id" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const appt = await fetchAppointment(appointmentId);
    if (!appt) {
      // Acuity will retry on non-2xx, so return 200 with a flag to avoid retry storms
      // when the issue is auth or a deleted appointment, not transient.
      return new Response(
        JSON.stringify({ ok: true, ignored: true, reason: "appointment_fetch_failed", id: appointmentId }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!isMirrorAppointment(appt)) {
      console.log(`acuity-mirror-webhook: appt ${appointmentId} type="${appt.type}" not Mirror, skipping`);
      return new Response(
        JSON.stringify({
          ok: true,
          ignored: true,
          reason: "not_mirror_type",
          appointmentTypeID: appt.appointmentTypeID,
          type: appt.type,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const email = (appt.email ?? "").trim().toLowerCase();
    if (!email) {
      console.warn(`acuity-mirror-webhook: appt ${appointmentId} has no email`);
      return new Response(
        JSON.stringify({ ok: true, ignored: true, reason: "no_email" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const cancelRes = await invokeCancelMirrorDrip(email);

    console.log(
      `acuity-mirror-webhook: action=${action} appt=${appointmentId} email=${email} cancelled=${cancelRes.cancelled} ok=${cancelRes.ok}`,
    );

    return new Response(
      JSON.stringify({
        ok: true,
        action,
        appointmentId,
        email,
        cancelled: cancelRes.cancelled,
        cancel_ok: cancelRes.ok,
        cancel_detail: cancelRes.ok ? undefined : cancelRes.detail,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("acuity-mirror-webhook error:", error);
    // Return 200 so Acuity doesn't hammer us with retries on a permanent error.
    return new Response(
      JSON.stringify({ ok: false, error: error?.message ?? String(error) }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
