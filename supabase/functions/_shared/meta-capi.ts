/**
 * Meta Conversions API: server-side Purchase for The Agency AI Install.
 *
 * Checkout completes on Stripe's domain, where the browser pixel cannot see
 * it, so Purchase has to be reported from the server. The browser fired
 * InitiateCheckout with an event id and handed that id plus the _fbp / _fbc
 * cookies to Stripe inside client_reference_id. This module decodes that,
 * rebuilds the identifiers, and reports Purchase with the same event id so
 * Meta collapses the browser and server events into one conversion.
 *
 * Every entry point here is non-throwing by contract. A tracking failure must
 * never cost a buyer their confirmation email.
 */

const GRAPH_VERSION = Deno.env.get("META_API_VERSION")?.trim() || "v23.0";

/** Mirror of the encoder in src/lib/metaCheckout.ts. Keep the two in sync. */
export interface DecodedClientReference {
  eventId: string;
  fbp: string | null;
  fbc: string | null;
}

/**
 * Decodes the handoff. Two versions are accepted:
 *
 *   v2-<eventId>-<fbpTime36>-<fbpRand36>-<fbcTime36>-<fbclid>   current
 *   v1-<eventId>-<fbpTime>-<fbpRand>-<fbcTime>-<fbclid>         decimal
 *
 * v1 is still read because clicks made before the v2 deploy can still convert
 * days later, and a purchase that loses its attribution to a version bump is
 * exactly the failure this module exists to prevent.
 *
 * Every field before <fbclid> is hex or base36 and therefore dash-free, so the
 * first five positions are fixed and everything after is rejoined as the
 * fbclid, which may itself contain dashes.
 */
export function decodeClientReference(
  raw: string | null | undefined,
): DecodedClientReference | null {
  if (!raw) return null;

  const parts = raw.split("-");
  if (parts.length < 6) return null;

  const version = parts[0];
  if (version !== "v1" && version !== "v2") return null;

  const [, eventId, fbpTime, fbpRand, fbcTime] = parts;
  const fbclid = parts.slice(5).join("-");

  if (!/^[0-9a-f]{8,64}$/i.test(eventId)) return null;

  // BigInt throughout: _fbp's random component exceeds Number.MAX_SAFE_INTEGER
  // and would round if parsed as a float.
  const decode = (value: string): string | null => {
    if (value === "0") return null;
    try {
      if (version === "v1") {
        return /^\d+$/.test(value) ? value : null;
      }
      if (!/^[0-9a-z]+$/.test(value)) return null;
      let n = 0n;
      for (const ch of value) {
        const digit = BigInt(parseInt(ch, 36));
        if (Number.isNaN(parseInt(ch, 36))) return null;
        n = n * 36n + digit;
      }
      return n.toString();
    } catch {
      return null;
    }
  };

  const pTime = decode(fbpTime);
  const pRand = decode(fbpRand);
  const cTime = decode(fbcTime);

  const fbp = pTime && pRand ? `fb.1.${pTime}.${pRand}` : null;
  const fbc = cTime && fbclid !== "0" ? `fb.1.${cTime}.${fbclid}` : null;

  return { eventId, fbp, fbc };
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Digits only, E.164 without the plus, per Meta's normalisation rules. */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 7 ? digits : null;
}

function splitName(full: string | null): { first: string | null; last: string | null } {
  if (!full) return { first: null, last: null };
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: null, last: null };
  if (parts.length === 1) return { first: parts[0], last: null };
  return { first: parts[0], last: parts[parts.length - 1] };
}

export interface PurchaseEventInput {
  email: string;
  fullName?: string | null;
  phone?: string | null;
  /** Stripe amount_total in cents. Falls back to the list price when absent. */
  amountTotalCents?: number | null;
  currency?: string | null;
  /** Raw client_reference_id straight off the Checkout Session. */
  clientReferenceId?: string | null;
  /** Unix seconds. Stripe's event.created is the right source. */
  eventTime?: number | null;
  /** Deduplication key of last resort when no client_reference_id arrived. */
  fallbackEventId: string;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  eventSourceUrl?: string | null;
}

export interface PurchaseEventResult {
  sent: boolean;
  reason?: string;
  eventId?: string;
  matchedFbp?: boolean;
  matchedFbc?: boolean;
  response?: unknown;
}

const LIST_PRICE_CENTS = 99700;
const DEFAULT_SOURCE_URL = "https://standardplaybook.com/aiinstall";

/**
 * Reports Purchase to the Conversions API. Resolves with a result object in
 * every case, including failure. It does not throw and it does not reject.
 */
export async function sendMetaPurchaseEvent(
  input: PurchaseEventInput,
): Promise<PurchaseEventResult> {
  try {
    const pixelId = Deno.env.get("META_PIXEL_ID")?.trim();
    const accessToken = Deno.env.get("META_CAPI_TOKEN")?.trim();

    if (!pixelId || !accessToken) {
      return { sent: false, reason: "META_PIXEL_ID or META_CAPI_TOKEN not configured" };
    }

    const decoded = decodeClientReference(input.clientReferenceId);
    const eventId = decoded?.eventId ?? input.fallbackEventId;

    const userData: Record<string, unknown> = {
      em: [await sha256Hex(input.email)],
    };

    const { first, last } = splitName(input.fullName ?? null);
    if (first) userData.fn = [await sha256Hex(first)];
    if (last) userData.ln = [await sha256Hex(last)];

    if (input.phone) {
      const phone = normalizePhone(input.phone);
      if (phone) userData.ph = [await sha256Hex(phone)];
    }

    // Present only when the browser handed them across via Stripe.
    if (decoded?.fbp) userData.fbp = decoded.fbp;
    if (decoded?.fbc) userData.fbc = decoded.fbc;

    // A Stripe webhook originates from Stripe's servers, so the buyer's IP and
    // user agent are not on the request. They are wired through here for the
    // day a direct Checkout integration can supply them.
    if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
    if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;

    // The amount actually charged is the truth. Falling back to list price
    // keeps a discounted or comped seat from being reported as full revenue.
    const cents = typeof input.amountTotalCents === "number" && input.amountTotalCents > 0
      ? input.amountTotalCents
      : LIST_PRICE_CENTS;

    const payload = {
      data: [{
        event_name: "Purchase",
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl ?? DEFAULT_SOURCE_URL,
        user_data: userData,
        custom_data: {
          value: Number((cents / 100).toFixed(2)),
          currency: (input.currency ?? "USD").toUpperCase(),
          content_name: "The Agency AI Install",
          content_type: "product",
        },
      }],
      ...(Deno.env.get("META_TEST_EVENT_CODE")?.trim()
        ? { test_event_code: Deno.env.get("META_TEST_EVENT_CODE")!.trim() }
        : {}),
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response: Response;
    try {
      response = await fetch(
        `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, access_token: accessToken }),
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeout);
    }

    const text = await response.text();
    if (!response.ok) {
      return {
        sent: false,
        reason: `CAPI ${response.status}: ${text.slice(0, 300)}`,
        eventId,
      };
    }

    return {
      sent: true,
      eventId,
      matchedFbp: Boolean(decoded?.fbp),
      matchedFbc: Boolean(decoded?.fbc),
      response: safeJson(text),
    };
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
