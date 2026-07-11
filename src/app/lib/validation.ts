// Validate standard UUID v1-v5 (ported from the source platform's lib/utils —
// this repo's shared lib/utils stays untouched for the marketing site).
export function isValidUUID(v: string | null | undefined): boolean {
  if (!v) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}
