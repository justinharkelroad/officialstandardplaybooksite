// Supabase Edge Functions bundle pinned npm: imports directly.
// deno-lint-ignore no-import-prefix
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.95.3";
// deno-lint-ignore no-import-prefix
import { Resend } from "npm:resend@4.0.0";
import { sha256Hex } from "../_shared/meta-capi.ts";
import { buildEmailHtml, escapeHtml } from "../_shared/email-template.ts";
import { getSupabaseServiceKey } from "../_shared/supabaseKeys.ts";
import {
  type EventRequest,
  type FunnelRequest,
  ghlLeadPayload,
  ghlVslPayload,
  leadNotification,
  type LeadRequest,
  metaEventName,
  parseRequest,
  splitName,
  summarizeVsl,
  VSL_EVENTS,
} from "./logic.ts";

/**
 * Funnel tracking intake for the VSL funnel (/start, /decision, /book,
 * /booked, /mirror).
 *
 * Public endpoint, no JWT: the browser posts here directly. Every field is
 * validated in logic.ts. For each request it:
 *   1. stores the event in vsl_events (or the lead in funnel_leads),
 *   2. forwards the event to the Meta Conversions API with the browser's
 *      event id, so Meta merges it with the pixel event,
 *   3. posts to GHL, but only once the visitor has an email.
 *
 * Meta and GHL are best effort. The row is the record; a failed forward is
 * logged and reported in the response, never retried by the browser.
 *
 * Every quiz and booking lead is also emailed to the team (Justin and Mary
 * read info@standardplaybook.com, same as the other booking notifications).
 *
 * Secrets: RESEND_API_KEY (shared with the other notification functions),
 * optional FUNNEL_LEAD_NOTIFY_TO (comma-separated; defaults to
 * info@standardplaybook.com), META_PIXEL_ID, META_CAPI_TOKEN, optional
 * META_TEST_EVENT_CODE (shared with the other Meta functions), and optional
 * GHL_VSL_WEBHOOK_URL / GHL_LEAD_WEBHOOK_URL (GHL is skipped when unset).
 */

const NOTIFY_FROM = "Standard Playbook <booking@standardplaybook.com>";
const DEFAULT_NOTIFY_TO = "info@standardplaybook.com";
const GRAPH_VERSION = Deno.env.get("META_API_VERSION")?.trim() || "v23.0";
const FORWARD_TIMEOUT_MS = 5000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

type ForwardResult = "sent" | "skipped" | "failed";

async function postJson(url: string, body: unknown): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

interface MetaInput {
  req: FunnelRequest;
  eventName: string;
  ip: string | null;
  userAgent: string | null;
  name?: string | null;
  phone?: string | null;
  customData: Record<string, unknown>;
}

async function sendMeta({ req, eventName, ip, userAgent, name, phone, customData }: MetaInput): Promise<ForwardResult> {
  const pixelId = Deno.env.get("META_PIXEL_ID")?.trim();
  const token = Deno.env.get("META_CAPI_TOKEN")?.trim();
  if (!pixelId || !token) return "skipped";
  try {
    const userData: Record<string, unknown> = { external_id: [await sha256Hex(req.visitorId)] };
    if (req.email) userData.em = [await sha256Hex(req.email)];
    const { first, last } = splitName(name ?? null);
    if (first) userData.fn = [await sha256Hex(first)];
    if (last) userData.ln = [await sha256Hex(last)];
    const digits = phone?.replace(/\D/g, "");
    if (digits && digits.length >= 10) userData.ph = [await sha256Hex(digits.length === 10 ? `1${digits}` : digits)];
    if (req.fbp) userData.fbp = req.fbp;
    if (req.fbc) userData.fbc = req.fbc;
    if (ip) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;

    const testCode = Deno.env.get("META_TEST_EVENT_CODE")?.trim();
    const res = await postJson(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: req.eventId,
        action_source: "website",
        event_source_url: req.url ?? "https://standardplaybook.com/start",
        user_data: userData,
        custom_data: customData,
      }],
      ...(testCode ? { test_event_code: testCode } : {}),
      access_token: token,
    });
    if (!res.ok) {
      console.error("funnel-track: Meta CAPI", res.status, (await res.text()).slice(0, 300));
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("funnel-track: Meta CAPI", error instanceof Error ? error.message : error);
    return "failed";
  }
}

async function sendGhl(url: string | undefined, body: unknown): Promise<ForwardResult> {
  if (!url) return "skipped";
  try {
    const res = await postJson(url, body);
    if (!res.ok) {
      console.error("funnel-track: GHL", res.status, (await res.text()).slice(0, 300));
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("funnel-track: GHL", error instanceof Error ? error.message : error);
    return "failed";
  }
}

/** Emails the team about a lead. Best effort, like Meta and GHL. */
async function notifyTeam(req: LeadRequest, watched: ReturnType<typeof summarizeVsl>): Promise<ForwardResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  if (!apiKey) {
    console.error("funnel-track: RESEND_API_KEY missing, lead email not sent");
    return "skipped";
  }
  const to = (Deno.env.get("FUNNEL_LEAD_NOTIFY_TO") || DEFAULT_NOTIFY_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  try {
    const n = leadNotification(req, watched, escapeHtml);
    const { error } = await new Resend(apiKey).emails.send({
      from: NOTIFY_FROM,
      to,
      replyTo: req.email,
      subject: n.subject,
      html: buildEmailHtml({ title: n.title, subtitle: n.subtitle, bodyContent: n.bodyHtml, eyebrow: "Funnel lead" }),
    });
    if (error) {
      console.error("funnel-track: lead email", error.message);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("funnel-track: lead email", error instanceof Error ? error.message : error);
    return "failed";
  }
}

type Db = SupabaseClient;

function eventRow(req: FunnelRequest, fields: { event: string; video_id?: string | null; value?: string | null; offer?: string | null }, userAgent: string | null) {
  return {
    event_id: req.eventId,
    visitor_id: req.visitorId,
    email: req.email,
    event: fields.event,
    video_id: fields.video_id ?? null,
    value: fields.value ?? null,
    offer: fields.offer ?? null,
    url: req.url,
    ...req.utm,
    user_agent: userAgent?.slice(0, 400) ?? null,
  };
}

/** The email this visitor gave on an earlier visit, if any. */
async function knownEmail(db: Db, visitorId: string): Promise<string | null> {
  const { data } = await db
    .from("vsl_events")
    .select("email")
    .eq("visitor_id", visitorId)
    .not("email", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as { email: string } | null)?.email ?? null;
}

async function handleEvent(db: Db, req: EventRequest, ip: string | null, userAgent: string | null) {
  if (!req.email) req.email = await knownEmail(db, req.visitorId);

  const { error } = await db
    .from("vsl_events")
    .upsert(eventRow(req, { event: req.event, video_id: req.videoId, value: req.value, offer: req.offer }, userAgent), {
      onConflict: "event_id",
      ignoreDuplicates: true,
    });
  if (error) {
    console.error("funnel-track: insert vsl_events", error.message);
    return json({ ok: false, error: "Could not store the event" }, 500);
  }

  const customData: Record<string, unknown> = {};
  if (req.videoId) customData.video_id = req.videoId;
  if (req.value) customData.value_label = req.value;
  if (req.offer) customData.content_ids = [req.offer];
  if (req.contentName) customData.content_name = req.contentName;
  if (req.amount !== null) {
    customData.value = req.amount;
    customData.currency = "USD";
  }

  const isVsl = (VSL_EVENTS as readonly string[]).includes(req.event);
  const [meta, ghl] = await Promise.all([
    sendMeta({ req, eventName: metaEventName(req.event, req.value), ip, userAgent, customData }),
    isVsl && req.email
      ? sendGhl(Deno.env.get("GHL_VSL_WEBHOOK_URL")?.trim(), ghlVslPayload({ ...req, email: req.email }))
      : Promise.resolve<ForwardResult>("skipped"),
  ]);
  return json({ ok: true, meta, ghl });
}

// Agency Brain house CRM: each lead from this form also goes into the CRM as warm, through
// Agency Brain's crm-lead-intake function (matched against who is already there, never doubled).
// Best effort: skipped until AGENCYBRAIN_LEAD_INTAKE_SECRET is set, and a failure never fails the form.
const AGENCYBRAIN_LEAD_URL = Deno.env.get("AGENCYBRAIN_LEAD_INTAKE_URL")?.trim() ||
  "https://wjqyccbytctqwceuhzhk.supabase.co/functions/v1/crm-lead-intake";

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

async function handleLead(db: Db, req: LeadRequest, ip: string | null, userAgent: string | null) {
  const { lead } = req;

  // Link every earlier anonymous event from this browser to the email.
  const { error: linkError } = await db
    .from("vsl_events")
    .update({ email: req.email })
    .eq("visitor_id", req.visitorId)
    .is("email", null);
  if (linkError) console.error("funnel-track: link vsl_events", linkError.message);

  const { data: history } = await db
    .from("vsl_events")
    .select("event, video_id, value")
    .eq("visitor_id", req.visitorId)
    .in("event", [...VSL_EVENTS])
    .limit(500);
  const watched = summarizeVsl((history ?? []) as { event: string; video_id: string | null; value: string | null }[]);

  const ghlUrl = Deno.env.get("GHL_LEAD_WEBHOOK_URL")?.trim() || Deno.env.get("GHL_VSL_WEBHOOK_URL")?.trim();
  const [meta, ghl, notify, crm] = await Promise.all([
    sendMeta({
      req,
      eventName: "Lead",
      ip,
      userAgent,
      name: lead.name,
      phone: lead.phone,
      customData: {
        content_name: lead.kind === "quiz" ? "Prescription Quiz" : "Booking Form",
        ...(lead.prescription ? { content_ids: [lead.prescription] } : {}),
      },
    }),
    sendGhl(ghlUrl, ghlLeadPayload(req, watched)),
    notifyTeam(req, watched),
    sendToAgencyBrain({
      form: lead.kind === "quiz" ? "decision_quiz" : "book_call",
      name: lead.name, email: req.email, phone: lead.phone, business: lead.agency,
      detail: lead.summary?.prescriptionName ? `recommended ${lead.summary.prescriptionName}` : null,
    }),
  ]);
  console.log("funnel-track: Agency Brain lead", crm);

  const { error } = await db.from("funnel_leads").insert({
    kind: lead.kind,
    visitor_id: req.visitorId,
    event_id: req.eventId,
    name: lead.name,
    email: req.email,
    phone: lead.phone,
    agency: lead.agency,
    answers: lead.answers,
    prescription: lead.prescription,
    alternative: lead.alternative,
    offer: lead.offer,
    route: lead.route,
    rule: lead.rule,
    url: req.url,
    utm: req.utm,
    ghl_status: ghl,
    notify_status: notify,
  });
  if (error) {
    console.error("funnel-track: insert funnel_leads", error.message);
    return json({ ok: false, error: "Could not store the lead" }, 500);
  }

  // The lead is also a funnel step, so it shows up next to the VSL events.
  await db
    .from("vsl_events")
    .upsert(eventRow(req, { event: "lead", value: lead.kind, offer: lead.offer ?? lead.prescription }, userAgent), {
      onConflict: "event_id",
      ignoreDuplicates: true,
    });

  return json({ ok: true, meta, ghl, notify });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try {
    // The browser sends text/plain to avoid a CORS preflight; the body is JSON either way.
    const text = await req.text();
    if (text.length > 20_000) return json({ error: "Body too large" }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ error: "Body must be JSON" }, 400);
  }

  const parsed = parseRequest(raw);
  if (typeof parsed === "string") return json({ error: parsed }, 400);

  const ip = req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    null;
  const userAgent = req.headers.get("user-agent");

  try {
    const db = createClient(Deno.env.get("SUPABASE_URL") ?? "", getSupabaseServiceKey(), {
      auth: { persistSession: false },
    });
    return parsed.action === "event"
      ? await handleEvent(db, parsed, ip, userAgent)
      : await handleLead(db, parsed, ip, userAgent);
  } catch (error) {
    console.error("funnel-track:", error instanceof Error ? error.message : error);
    return json({ ok: false, error: "Unexpected error" }, 500);
  }
});
