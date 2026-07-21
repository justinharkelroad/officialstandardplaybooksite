export const PROFILE_FLOW_SLUGS = new Set([
  'profile-builder',
  'profile-reprofile',
]);

export function isProfileFlowSlug(value: unknown): value is string {
  return typeof value === 'string' && PROFILE_FLOW_SLUGS.has(value);
}

export function joinedFlowTemplateSlug(value: unknown): string | null {
  const joined = Array.isArray(value) ? value[0] : value;
  if (typeof joined !== 'object' || joined === null) return null;
  const slug = (joined as Record<string, unknown>).slug;
  return typeof slug === 'string' ? slug : null;
}
