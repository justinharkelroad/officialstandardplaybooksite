export function generateSessionId(): string {
  const randomId = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}_${Math.random().toString(36).slice(2, 15)}`;
  return `theta_${randomId}`;
}

export function isValidThetaSessionId(value: unknown): value is string {
  return typeof value === 'string'
    && value.length >= 12
    && value.length <= 160
    && /^theta_[A-Za-z0-9_-]+$/.test(value);
}

export function getOrCreateSessionId(): string {
  const stored = localStorage.getItem('theta_session_id');
  if (isValidThetaSessionId(stored)) return stored;
  
  const newId = generateSessionId();
  localStorage.setItem('theta_session_id', newId);
  return newId;
}

export function clearSessionId(): void {
  localStorage.removeItem('theta_session_id');
}
