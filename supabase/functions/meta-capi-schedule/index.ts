import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

/**
 * Meta CAPI: Schedule event
 * ---------------------------------------------------------------
 * Receives an Acuity (or any calendar) webhook on every booking
 * and forwards a Schedule event to Meta's Conversions API.
 *
 * Setup (one-time):
 *   1. Deploy:    supabase functions deploy meta-capi-schedule
 *   2. Set env:   supabase secrets set META_PIXEL_ID=1543875540296120
 *                 supabase secrets set META_CAPI_TOKEN=<long-lived token>
 *                 (optional) supabase secrets set META_TEST_EVENT_CODE=TEST12345
 *   3. Acuity → Integrations → Webhooks → POST to:
 *      https://puidotfmyrouxezsorlt.supabase.co/functions/v1/meta-capi-schedule
 *      Trigger: appointment.scheduled
 *
 * Generate a CAPI access token in Meta Events Manager:
 *   Pixel → Settings → Conversions API → Generate access token
 *
 * Deduplication (optional):
 *   Acuity's confirmation page fires fbq('track', 'Schedule')
 *   client-side via Acuity's HTML Tracking Code box. To dedupe with
 *   this server-side fire, paste an eventID into that snippet that
 *   matches `acuity_<id>` (e.g. fbq('track','Schedule', {...},
 *   { eventID: 'acuity_%appointmentId%' })). Meta merges matching
 *   {event_name, event_id} pairs into one conversion.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
const ACCESS_TOKEN = Deno.env.get("META_CAPI_TOKEN");
const TEST_EVENT_CODE = Deno.env.get("META_TEST_EVENT_CODE");

async function sha256Lower(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface AcuityWebhook {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  datetime?: string;
  appointmentTypeID?: number;
  fields?: Array<{ name: string; value: string }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("Missing META_PIXEL_ID or META_CAPI_TOKEN env vars");
    return new Response(
      JSON.stringify({ error: "CAPI not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const ct = req.headers.get("content-type") || "";
    let payload: AcuityWebhook = {};

    // Acuity sends application/x-www-form-urlencoded by default
    if (ct.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      const id = form.get("id");
      payload = {
        id: id ? String(id) : undefined,
        firstName: form.get("firstName")?.toString(),
        lastName: form.get("lastName")?.toString(),
        email: form.get("email")?.toString(),
        phone: form.get("phone")?.toString(),
        datetime: form.get("datetime")?.toString(),
      };
    } else {
      payload = await req.json();
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const userData: Record<string, string | string[]> = {};
    if (payload.email) userData.em = await sha256Lower(payload.email);
    if (payload.phone) {
      userData.ph = await sha256Lower(payload.phone.replace(/\D/g, ""));
    }
    if (payload.firstName) userData.fn = await sha256Lower(payload.firstName);
    if (payload.lastName) userData.ln = await sha256Lower(payload.lastName);
    if (ip) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;

    const eventId = payload.id
      ? `acuity_${payload.id}`
      : `schedule_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const eventTime = payload.datetime
      ? Math.floor(new Date(payload.datetime).getTime() / 1000)
      : Math.floor(Date.now() / 1000);

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Schedule",
          event_time: eventTime,
          event_id: eventId,
          action_source: "website",
          event_source_url: "https://standardplaybook.com/8-week-apply",
          user_data: userData,
          custom_data: {
            content_name: "Strategy Call Booked",
            source: "acuity-webhook",
          },
        },
      ],
    };

    if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const metaRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const metaJson = await metaRes.json();

    if (!metaRes.ok) {
      console.error("Meta CAPI error:", metaJson);
      return new Response(
        JSON.stringify({ ok: false, meta: metaJson }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("CAPI Schedule sent:", { eventId, meta: metaJson });

    return new Response(
      JSON.stringify({ ok: true, event_id: eventId, meta: metaJson }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("meta-capi-schedule error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
