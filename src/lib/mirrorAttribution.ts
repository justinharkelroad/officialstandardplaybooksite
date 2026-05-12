// Attribution capture for the Mirror lead-magnet flow.
//
// Why this exists separately: the original capture (only on /mirror, sessionStorage)
// loses attribution for Meta in-app browser traffic — sessionStorage gets partitioned
// between page navigations and Meta strips/rewrites utm_* params (only fbclid survives).
//
// Strategy:
//  - Capture on EVERY Mirror page mount (/mirror, /mirror/score, /mirror/results)
//  - Read URL params: utm_source, utm_medium, utm_campaign, utm_content, fbclid, gclid
//  - Also capture document.referrer and the first-seen landing_path
//  - Persist to localStorage; fall back to sessionStorage when localStorage is unavailable
//  - Merge with prior state — only OVERWRITE existing fields when new value is non-empty,
//    so a deep link without params doesn't blow away a prior tagged landing.

const STORAGE_KEY = 'mirror_attribution_v2';
const LEGACY_KEY = 'mirror_utms';

export interface MirrorAttribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  fbclid: string | null;
  gclid: string | null;
  referrer: string | null;
  landing_path: string | null;
}

const EMPTY: MirrorAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  fbclid: null,
  gclid: null,
  referrer: null,
  landing_path: null,
};

function safeGet(storage: Storage | null, key: string): string | null {
  if (!storage) return null;
  try { return storage.getItem(key); } catch { return null; }
}

function safeSet(storage: Storage | null, key: string, value: string): boolean {
  if (!storage) return false;
  try { storage.setItem(key, value); return true; } catch { return false; }
}

function getStorages(): { local: Storage | null; session: Storage | null } {
  if (typeof window === 'undefined') return { local: null, session: null };
  let local: Storage | null = null;
  let session: Storage | null = null;
  try { local = window.localStorage; } catch { local = null; }
  try { session = window.sessionStorage; } catch { session = null; }
  return { local, session };
}

function readPersisted(): MirrorAttribution {
  const { local, session } = getStorages();

  // Preferred: new localStorage record.
  const fromLocal = safeGet(local, STORAGE_KEY);
  if (fromLocal) {
    try { return { ...EMPTY, ...JSON.parse(fromLocal) }; } catch { /* fall through */ }
  }

  // Fallback: new sessionStorage record (localStorage failed earlier).
  const fromSession = safeGet(session, STORAGE_KEY);
  if (fromSession) {
    try { return { ...EMPTY, ...JSON.parse(fromSession) }; } catch { /* fall through */ }
  }

  // Legacy: pre-v2 sessionStorage UTM record from the original /mirror capture.
  const legacy = safeGet(session, LEGACY_KEY) ?? safeGet(local, LEGACY_KEY);
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy) as Partial<MirrorAttribution>;
      return { ...EMPTY, ...parsed };
    } catch { /* fall through */ }
  }

  return { ...EMPTY };
}

function mergeNonEmpty(prev: MirrorAttribution, next: Partial<MirrorAttribution>): MirrorAttribution {
  const out: MirrorAttribution = { ...prev };
  (Object.keys(next) as (keyof MirrorAttribution)[]).forEach((k) => {
    const v = next[k];
    if (v !== null && v !== undefined && v !== '') {
      // landing_path is first-write-wins so we keep the original entry route.
      if (k === 'landing_path' && prev.landing_path) return;
      out[k] = v;
    }
  });
  return out;
}

/**
 * Capture attribution from the current URL + document.referrer and persist.
 * Call this on mount of every Mirror page (/mirror, /mirror/score, /mirror/results).
 * Safe to call multiple times — merge semantics preserve earlier captures.
 */
export function captureMirrorAttribution(): MirrorAttribution {
  if (typeof window === 'undefined') return { ...EMPTY };

  const params = new URLSearchParams(window.location.search);
  const fromUrl: Partial<MirrorAttribution> = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    fbclid: params.get('fbclid'),
    gclid: params.get('gclid'),
    referrer: (typeof document !== 'undefined' && document.referrer) ? document.referrer.slice(0, 500) : null,
    landing_path: window.location.pathname || null,
  };

  const prev = readPersisted();
  const merged = mergeNonEmpty(prev, fromUrl);

  const serialized = JSON.stringify(merged);
  const { local, session } = getStorages();
  // Write to both — localStorage is the truth, sessionStorage covers private-mode fallbacks.
  const wroteLocal = safeSet(local, STORAGE_KEY, serialized);
  if (!wroteLocal) safeSet(session, STORAGE_KEY, serialized);

  return merged;
}

/**
 * Read the merged attribution record without mutating it. Call at submit time.
 */
export function readMirrorAttribution(): MirrorAttribution {
  return readPersisted();
}
