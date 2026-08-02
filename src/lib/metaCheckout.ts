/**
 * Meta InitiateCheckout handoff for the AI Install Stripe payment link.
 *
 * Checkout completes on Stripe's domain, so the browser pixel never sees the
 * purchase. The only way to tie a browser click to a server-side Purchase is to
 * carry the pixel's identifiers across the domain boundary ourselves, and
 * Stripe gives us exactly one field to do it with: client_reference_id.
 *
 * That field accepts alphanumerics, dashes and underscores only, max 200
 * characters. The _fbp and _fbc cookies both contain periods, so they cannot
 * ride along raw.
 *
 * ENCODING CONTRACT (keep in sync with the webhook decoder)
 *
 *   v2-<eventId>-<fbpTime36>-<fbpRand36>-<fbcTime36>-<fbclid>
 *
 * Both cookies are structurally "fb.1.<time>.<value>", so the constant "fb.1."
 * prefix is dropped and rebuilt server side. Every field before <fbclid> is
 * base36 or hex and therefore dash-free, which makes parsing unambiguous:
 * split on "-", take five fixed fields, rejoin the remainder as <fbclid>.
 * <fbclid> is last precisely because base64url values may contain dashes.
 *
 * A missing value is written as "0" so field positions never shift.
 *
 * WHY v2 IS COMPACTED
 *
 * v1 spent a 32-character event id and wrote both timestamps and the _fbp
 * random as decimal. Measured against a real Meta cookie on production, whose
 * current fbclid format runs 144 characters, that totalled 227 and blew
 * Stripe's 200-character ceiling, so _fbc was silently dropped on exactly the
 * ad-driven clicks it exists to attribute. Halving the event id to 64 bits and
 * base36-encoding the three numerics cuts fixed overhead from 83 to 51, which
 * leaves a 149-character budget for the fbclid. Same real cookie now totals
 * 195 and fits.
 *
 * Numbers are converted with BigInt because _fbp's random component exceeds
 * Number.MAX_SAFE_INTEGER and would otherwise round.
 */

const EVENT_ID_STORAGE_KEY = "sp_aiinstall_checkout_event_id";
const CLIENT_REFERENCE_MAX = 200;
const ENCODING_VERSION = "v2";

export const AI_INSTALL_VALUE = 997.0;
export const AI_INSTALL_CURRENCY = "USD";

type FbqArgs = [
  command: string,
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * 16 hex characters, no dashes, so it survives the encoding above intact.
 * 64 bits is far more than enough to keep one buyer's browser event distinct
 * from another's, which is the only uniqueness this id has to provide.
 */
function newEventId(): string {
  const cryptoRef = typeof crypto !== "undefined" ? crypto : undefined;

  if (cryptoRef?.getRandomValues) {
    const bytes = new Uint8Array(8);
    cryptoRef.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  if (cryptoRef?.randomUUID) {
    return cryptoRef.randomUUID().replace(/-/g, "").slice(0, 16);
  }

  return (
    Date.now().toString(16) + Math.random().toString(16).slice(2).padEnd(8, "0")
  ).slice(0, 16);
}

/** Decimal string to base36. Returns null when the input is not a number. */
function toBase36(decimal: string): string | null {
  if (!/^\d+$/.test(decimal)) return null;
  try {
    return BigInt(decimal).toString(36);
  } catch {
    return null;
  }
}

/** Splits "fb.1.<time>.<value>" into its two variable parts. */
function splitFbCookie(raw: string | null): { time: string; value: string } | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length < 4) return null;
  const time = parts[2];
  const value = parts.slice(3).join(".");
  if (!/^\d+$/.test(time) || !value) return null;
  return { time, value };
}

export function encodeClientReference(
  eventId: string,
  fbp: string | null,
  fbc: string | null,
): string {
  const p = splitFbCookie(fbp);
  const c = splitFbCookie(fbc);

  // _fbp's random component is numeric and compacts; _fbc's fbclid is
  // base64url and must travel verbatim.
  const fbpTime = p ? toBase36(p.time) : null;
  const fbpRand = p ? toBase36(p.value) : null;
  const fbcTime = c ? toBase36(c.time) : null;

  const withFbc = [
    ENCODING_VERSION,
    eventId,
    fbpTime ?? "0",
    fbpRand ?? "0",
    fbcTime ?? "0",
    c?.value ?? "0",
  ].join("-");

  if (withFbc.length <= CLIENT_REFERENCE_MAX) return withFbc;

  // _fbc is the longest field and a truncated one is worthless for matching,
  // so it is dropped whole rather than clipped. The event id must survive:
  // without it the server-side Purchase cannot be deduplicated.
  const withoutFbc = [
    ENCODING_VERSION,
    eventId,
    fbpTime ?? "0",
    fbpRand ?? "0",
    "0",
    "0",
  ].join("-");

  return withoutFbc.slice(0, CLIENT_REFERENCE_MAX);
}

/**
 * Fires InitiateCheckout and returns the Stripe URL with the handoff attached.
 *
 * Never throws and never awaits. A tracking failure must not cost a sale, and
 * navigation must not wait on the pixel.
 */
export function buildCheckoutHandoff(stripeUrl: string): string {
  const eventId = newEventId();

  try {
    window.sessionStorage?.setItem(EVENT_ID_STORAGE_KEY, eventId);
  } catch {
    // Private browsing and storage-blocked contexts. The id still travels on
    // the URL, which is the channel the webhook actually reads.
  }

  try {
    window.fbq?.(
      "track",
      "InitiateCheckout",
      {
        value: AI_INSTALL_VALUE,
        currency: AI_INSTALL_CURRENCY,
        content_name: "The Agency AI Install",
      },
      { eventID: eventId },
    );
  } catch {
    // Pixel blocked or not yet loaded. Proceed to Stripe regardless.
  }

  try {
    const clientReference = encodeClientReference(
      eventId,
      readCookie("_fbp"),
      readCookie("_fbc"),
    );
    const url = new URL(stripeUrl);
    url.searchParams.set("client_reference_id", clientReference);
    return url.toString();
  } catch {
    return stripeUrl;
  }
}

export function readStoredCheckoutEventId(): string | null {
  try {
    return window.sessionStorage?.getItem(EVENT_ID_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}
