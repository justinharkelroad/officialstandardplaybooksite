export const AI_INSTALL_PORTAL_MIN_PASSWORD_LENGTH = 8;

export function validateAiInstallPortalPassword(password: string, confirmation: string): string | null {
  if (password.length < AI_INSTALL_PORTAL_MIN_PASSWORD_LENGTH) {
    return `Use at least ${AI_INSTALL_PORTAL_MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirmation) return "The passwords do not match.";
  return null;
}
