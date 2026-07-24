export interface MobileDiagnosticEvent {
  at: string;
  event: string;
  details?: Record<string, string | number | boolean | null>;
}

const events: MobileDiagnosticEvent[] = [];
const MAX_EVENTS = 40;

export function recordMobileDiagnostic(
  event: string,
  details?: Record<string, string | number | boolean | null>,
): void {
  events.push({ at: new Date().toISOString(), event, details });
  if (events.length > MAX_EVENTS) events.shift();
}

export function getMobileDiagnostics(): MobileDiagnosticEvent[] {
  return events.map((event) => ({ ...event, details: event.details ? { ...event.details } : undefined }));
}
