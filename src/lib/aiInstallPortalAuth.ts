export const AI_INSTALL_PORTAL_TOKEN_KEY = "portal_token";

const PORTAL_TOKEN_PATTERN = /^[A-Za-z0-9._~-]{20,1024}$/;

export function parseAiInstallPortalToken(hash: string): string | null {
  const fragment = hash.startsWith("#") ? hash.slice(1) : hash;
  const token = new URLSearchParams(fragment).get(AI_INSTALL_PORTAL_TOKEN_KEY)?.trim() ?? "";
  return PORTAL_TOKEN_PATTERN.test(token) ? token : null;
}
