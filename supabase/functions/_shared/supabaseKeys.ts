// Service-key resolution across Supabase's key naming generations.
// Same env names the platform injects automatically.
export function getSupabaseServiceKeyCandidates(): string[] {
  const candidates: string[] = [];

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeys) {
    try {
      const parsed = JSON.parse(secretKeys);
      if (parsed && typeof parsed.default === "string") {
        candidates.push(parsed.default);
      }
    } catch (_err) {
      // fall through to the flat vars
    }
  }

  const flat = Deno.env.get("SUPABASE_SECRET_KEY");
  if (flat) candidates.push(flat);

  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) candidates.push(legacy);

  return candidates;
}

export function getSupabaseServiceKey(): string {
  const [first] = getSupabaseServiceKeyCandidates();
  if (!first) {
    throw new Error("No Supabase service key available in environment");
  }
  return first;
}
