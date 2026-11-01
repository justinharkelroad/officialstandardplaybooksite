/**
 * Pure helpers for funnel-track: request validation, Meta event shaping and
 * GHL payloads. Kept free of I/O so they can be unit tested.
 */

export const VSL_EVENTS = ["vsl_play", "vsl_unmute", "vsl_chapter", "vsl_milestone", "vsl_reveal"] as const;
export const FUNNEL_EVENTS = [
  ...VSL_EVENTS,
  "view_content",
  "lead",
  "schedule",
  "initiate_checkout",
  "purchase",
] as const;
export type FunnelEvent = typeof FUNNEL_EVENTS[number];

const META_STANDARD: Partial<Record<FunnelEvent, string>> = {
  view_content: "ViewContent",
  lead: "Lead",
  schedule: "Schedule",
  initiate_checkout: "InitiateCheckout",
  purchase: "Purchase",
};

/**
 * Meta event names. Milestones get their own names (vsl_milestone_35,
 * vsl_milestone_100) so each can back a custom conversion in Events Manager.
 * Must match metaEventName() in src/lib/funnel/track.ts for deduplication.
 */
export function metaEventName(event: FunnelEvent, value: string | null): string {
  if (event === "vsl_milestone" && value) return `vsl_milestone_${value}`;
  return META_STANDARD[event] ?? event;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "fbclid",
  "gclid",
  "referrer",
  "landing_path",
] as const;
export type Utm = Partial<Record<typeof UTM_KEYS[number], string>>;

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const ID_RE = /^[a-f0-9]{16,64}$/;

/** Trimmed string up to `max` characters, or null. */
export function str(value: unknown, max: number): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const s = String(value).trim();
  return s ? s.slice(0, max) : null;
}

export function email(value: unknown): string | null {
  const s = str(value, 320)?.toLowerCase() ?? null;
  return s && EMAIL_RE.test(s) ? s : null;
}

function utm(value: unknown): Utm {
  const out: Utm = {};
  if (!value || typeof value !== "object") return out;
  for (const key of UTM_KEYS) {
    const v = str((value as Record<string, unknown>)[key], key === "referrer" ? 500 : 200);
    if (v) out[key] = v;
  }
  return out;
}

/** String-to-string map, capped, for quiz and booking answers. */
function answers(value: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!value || typeof value !== "object") return out;
  for (const [k, v] of Object.entries(value as Record<string, unknown>).slice(0, 30)) {
    const key = str(k, 60);
    const val = str(v, 500);
    if (key && val) out[key] = val;
  }
  return out;
}

interface Common {
  eventId: string;
  visitorId: string;
  email: string | null;
  url: string | null;
  utm: Utm;
  fbp: string | null;
  fbc: string | null;
}

export interface EventRequest extends Common {
  action: "event";
  event: FunnelEvent;
  videoId: string | null;
  value: string | null;
  offer: string | null;
  amount: number | null;
  contentName: string | null;
}

export interface LeadRequest extends Common {
  action: "lead";
  email: string;
  lead: {
    kind: "quiz" | "booking";
    name: string | null;
    phone: string | null;
    agency: string | null;
    answers: Record<string, string>;
    prescription: string | null;
    alternative: string | null;
    offer: string | null;
    route: string | null;
    rule: string | null;
  };
}

export type FunnelRequest = EventRequest | LeadRequest;

/** Validates a request body. Returns an error string for anything malformed. */
export function parseRequest(raw: unknown): FunnelRequest | string {
  if (!raw || typeof raw !== "object") return "Body must be a JSON object";
  const body = raw as Record<string, unknown>;

  const eventId = str(body.event_id, 64);
  const visitorId = str(body.visitor_id, 64);
  if (!eventId || !ID_RE.test(eventId)) return "Invalid event_id";
  if (!visitorId || !ID_RE.test(visitorId)) return "Invalid visitor_id";

  const common: Common = {
    eventId,
    visitorId,
    email: email(body.email),
    url: str(body.url, 500),
    utm: utm(body.utm),
    fbp: str(body.fbp, 200),
    fbc: str(body.fbc, 400),
  };

  if (body.action === "event") {
    const event = str(body.event, 40) as FunnelEvent | null;
    if (!event || !(FUNNEL_EVENTS as readonly string[]).includes(event)) return "Unknown event";
    const amount = typeof body.amount === "number" && Number.isFinite(body.amount) && body.amount >= 0
      ? Math.min(body.amount, 1_000_000)
      : null;
    return {
      ...common,
      action: "event",
      event,
      videoId: str(body.video_id, 60),
      value: str(body.value, 200),
      offer: str(body.offer, 60),
      amount,
      contentName: str(body.content_name, 120),
    };
  }

  if (body.action === "lead") {
    const lead = (body.lead && typeof body.lead === "object" ? body.lead : {}) as Record<string, unknown>;
    const contact = (lead.contact && typeof lead.contact === "object" ? lead.contact : {}) as Record<string, unknown>;
    const leadEmail = email(contact.email) ?? common.email;
    if (!leadEmail) return "A valid email is required";
    const kind = lead.kind === "booking" ? "booking" : lead.kind === "quiz" ? "quiz" : null;
    if (!kind) return "Unknown lead kind";
    return {
      ...common,
      action: "lead",
      email: leadEmail,
      lead: {
        kind,
        name: str(contact.name, 200),
        phone: str(contact.phone, 40),
        agency: str(contact.agency, 200),
        answers: answers(lead.answers),
        prescription: str(lead.prescription, 60),
        alternative: str(lead.alternative, 60),
        offer: str(lead.offer, 60),
        route: str(lead.route, 20),
        rule: str(lead.rule, 20),
      },
    };
  }

  return "Unknown action";
}

export function splitName(full: string | null): { first: string | null; last: string | null } {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: null, last: null };
  return { first: parts[0], last: parts.length > 1 ? parts[parts.length - 1] : null };
}

/** The GHL inbound-webhook body for a lead. Flat keys map cleanly to GHL fields. */
export function ghlLeadPayload(req: LeadRequest, watched: Record<string, unknown>): Record<string, unknown> {
  const { first, last } = splitName(req.lead.name);
  return {
    type: `funnel_${req.lead.kind}`,
    email: req.email,
    first_name: first,
    last_name: last,
    full_name: req.lead.name,
    phone: req.lead.phone,
    agency_name: req.lead.agency,
    prescription: req.lead.prescription,
    alternative: req.lead.alternative,
    offer: req.lead.offer,
    route: req.lead.route,
    rule: req.lead.rule,
    ...prefixKeys("answer_", req.lead.answers),
    ...req.utm,
    visitor_id: req.visitorId,
    page_url: req.url,
    vsl: watched,
  };
}

/** The GHL body for one VSL event from a known visitor. */
export function ghlVslPayload(req: EventRequest & { email: string }) {
  return {
    type: "vsl_event",
    email: req.email,
    event: req.event,
    video_id: req.videoId,
    value: req.value,
    tag: vslTag(req),
    visitor_id: req.visitorId,
    page_url: req.url,
    ...req.utm,
  };
}

/** A ready-made tag name, e.g. "vsl sp-main watched 35%". */
export function vslTag(req: Pick<EventRequest, "event" | "videoId" | "value">): string | null {
  if (!req.videoId) return null;
  if (req.event === "vsl_milestone" && req.value) return `vsl ${req.videoId} watched ${req.value}%`;
  if (req.event === "vsl_reveal") return `vsl ${req.videoId} reached menu`;
  if (req.event === "vsl_unmute") return `vsl ${req.videoId} unmuted`;
  return null;
}

/** Summarizes a visitor's VSL history, e.g. { "sp-main": { max_milestone: 35, revealed: true } }. */
export function summarizeVsl(rows: { event: string; video_id: string | null; value: string | null }[]) {
  const out: Record<string, { max_milestone: number; revealed: boolean; unmuted: boolean }> = {};
  for (const row of rows) {
    if (!row.video_id) continue;
    const entry = out[row.video_id] ??= { max_milestone: 0, revealed: false, unmuted: false };
    if (row.event === "vsl_milestone") entry.max_milestone = Math.max(entry.max_milestone, Number(row.value) || 0);
    if (row.event === "vsl_reveal") entry.revealed = true;
    if (row.event === "vsl_unmute") entry.unmuted = true;
  }
  return out;
}

function prefixKeys(prefix: string, obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${prefix}${k}`, v]));
}
