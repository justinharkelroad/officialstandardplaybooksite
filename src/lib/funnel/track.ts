/**
 * Funnel tracking: one call per step, sent to the `funnel-track` edge
 * function, which stores the row in `vsl_events`, forwards the Meta
 * Conversions API event, and posts to GHL once the visitor has an email.
 *
 * The browser pixel fires the same event with the same eventID, so Meta
 * keeps one conversion even when both arrive.
 *
 * Nothing here throws or awaits on the caller's path. Tracking must never
 * block a page, a video, or a checkout.
 */
import type { VslEvent } from '@/components/vsl/VslPlayer';
import { encodeClientReference } from '@/lib/metaCheckout';
import { readMirrorAttribution } from '@/lib/mirrorAttribution';
import type { LeadSummary } from './leadSummary';

export type FunnelEventName =
  | VslEvent['name']
  | 'view_content'
  | 'lead'
  | 'schedule'
  | 'initiate_checkout'
  | 'purchase';

const META_STANDARD_EVENTS: Partial<Record<FunnelEventName, string>> = {
  view_content: 'ViewContent',
  lead: 'Lead',
  schedule: 'Schedule',
  initiate_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
};

/** Matches the server's naming so browser and server events dedupe. */
export function metaEventName(name: FunnelEventName, value?: string | number): string {
  if (name === 'vsl_milestone' && value !== undefined) return `vsl_milestone_${value}`;
  return META_STANDARD_EVENTS[name] ?? name;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL ?? ''}/functions/v1/funnel-track`;
const VISITOR_COOKIE = 'sp_vid';
const VISITOR_KEY = 'sp_vid';
const EMAIL_KEY = 'sp_funnel_email';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function safeLocalGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function safeLocalSet(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* storage blocked */ }
}

/** 16 hex characters, dash-free so it fits Stripe's client_reference_id. */
export function newEventId(): string {
  const bytes = new Uint8Array(8);
  try {
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return (Date.now().toString(16) + Math.random().toString(16).slice(2)).slice(0, 16).padEnd(16, '0');
  }
}

/** Anonymous visitor id: a first-party cookie, mirrored to localStorage. */
export function getVisitorId(): string {
  const existing = readCookie(VISITOR_COOKIE) || safeLocalGet(VISITOR_KEY);
  const id = existing && /^[a-f0-9]{16,64}$/.test(existing) ? existing : newEventId() + newEventId();
  if (typeof document !== 'undefined' && readCookie(VISITOR_COOKIE) !== id) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${VISITOR_COOKIE}=${id}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
  }
  if (safeLocalGet(VISITOR_KEY) !== id) safeLocalSet(VISITOR_KEY, id);
  return id;
}

export function getKnownEmail(): string | null {
  return safeLocalGet(EMAIL_KEY);
}

function attribution() {
  const a = readMirrorAttribution();
  return {
    utm_source: a.utm_source,
    utm_medium: a.utm_medium,
    utm_campaign: a.utm_campaign,
    utm_content: a.utm_content,
    fbclid: a.fbclid,
    gclid: a.gclid,
    referrer: a.referrer,
    landing_path: a.landing_path,
  };
}

function basePayload() {
  return {
    visitor_id: getVisitorId(),
    email: getKnownEmail(),
    url: window.location.origin + window.location.pathname,
    utm: attribution(),
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  };
}

function send(body: Record<string, unknown>) {
  if (!import.meta.env.VITE_SUPABASE_URL) return;
  try {
    // text/plain keeps this a "simple" request: no CORS preflight, and
    // keepalive lets it finish while the page navigates to checkout.
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Never surface tracking failures.
  }
}

function firePixel(name: FunnelEventName, eventId: string, params: Record<string, unknown>, value?: string | number) {
  try {
    const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    if (!fbq) return;
    const metaName = metaEventName(name, value);
    const command = META_STANDARD_EVENTS[name] ? 'track' : 'trackCustom';
    fbq(command, metaName, params, { eventID: eventId });
  } catch {
    // Pixel blocked.
  }
}

export interface TrackOptions {
  videoId?: string;
  value?: string | number;
  offer?: string;
  /** Dollar value for Meta (InitiateCheckout, Purchase). */
  amount?: number;
  contentName?: string;
}

/** Record one funnel event. Returns the event id (for Stripe handoff). */
export function trackFunnel(name: FunnelEventName, options: TrackOptions = {}): string {
  const eventId = newEventId();
  if (typeof window === 'undefined') return eventId;
  const params: Record<string, unknown> = {};
  if (options.videoId) params.video_id = options.videoId;
  if (options.value !== undefined) params.value_label = String(options.value);
  if (options.offer) params.content_ids = [options.offer];
  if (options.contentName) params.content_name = options.contentName;
  if (options.amount !== undefined) {
    params.value = options.amount;
    params.currency = 'USD';
  }
  firePixel(name, eventId, params, options.value);
  send({
    action: 'event',
    event_id: eventId,
    event: name,
    video_id: options.videoId ?? null,
    value: options.value === undefined ? null : String(options.value),
    offer: options.offer ?? null,
    amount: options.amount ?? null,
    content_name: options.contentName ?? null,
    ...basePayload(),
  });
  return eventId;
}

/** Player events go straight through. */
export const trackVslEvent = (event: VslEvent) => {
  trackFunnel(event.name, { videoId: event.videoId, value: event.value });
};

export interface FunnelContact {
  name: string;
  email: string;
  phone: string;
  agency: string;
}

export interface FunnelLead {
  kind: 'quiz' | 'booking';
  contact: FunnelContact;
  answers: Record<string, string>;
  prescription: string;
  alternative?: string;
  offer?: string;
  route?: string;
  rule?: string;
  /** Readable names and answers for the team notification email. */
  summary: LeadSummary;
}

/**
 * Save a quiz or booking lead. Links every earlier event from this browser
 * to the email, sends the lead to GHL, and fires Meta Lead.
 */
export function submitFunnelLead(lead: FunnelLead): string {
  const eventId = newEventId();
  const email = lead.contact.email.trim().toLowerCase();
  safeLocalSet(EMAIL_KEY, email);
  const contentName = lead.kind === 'quiz' ? 'Prescription Quiz' : 'Booking Form';
  firePixel('lead', eventId, { content_name: contentName, content_ids: [lead.prescription] });
  send({
    action: 'lead',
    event_id: eventId,
    ...basePayload(),
    email,
    lead: { ...lead, contact: { ...lead.contact, email } },
  });
  return eventId;
}

/** Stripe client_reference_id carrying the event id and pixel cookies. */
export function checkoutClientReference(eventId: string): string {
  return encodeClientReference(eventId, readCookie('_fbp'), readCookie('_fbc'));
}
