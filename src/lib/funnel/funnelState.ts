import type { QuizAnswers } from '@/config/quiz';
import type { FunnelContact } from './track';

/*
 * Quiz answers and contact details carried from /decision to /book and
 * /booked in this tab. sessionStorage can throw or be partitioned (in-app
 * browsers), so every access is guarded and a memory copy backs it up.
 */

const ANSWERS_KEY = 'sp_funnel_answers';
const CONTACT_KEY = 'sp_funnel_contact';
const memory: Record<string, string> = {};

function read<T>(key: string): T | null {
  let raw: string | null = null;
  try { raw = window.sessionStorage.getItem(key); } catch { raw = null; }
  raw = raw ?? memory[key] ?? null;
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function write(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  memory[key] = raw;
  try { window.sessionStorage.setItem(key, raw); } catch { /* memory copy only */ }
}

export const readAnswers = () => read<Partial<QuizAnswers>>(ANSWERS_KEY);
export const saveAnswers = (answers: Partial<QuizAnswers>) => write(ANSWERS_KEY, answers);
export const readContact = () => read<FunnelContact>(CONTACT_KEY);
export const saveContact = (contact: FunnelContact) => write(CONTACT_KEY, contact);

/** Run once per tab for a given key (e.g. Schedule on the confirmation page). */
export function once(key: string): boolean {
  const storageKey = `sp_funnel_once:${key}`;
  if (memory[storageKey]) return false;
  try {
    if (window.sessionStorage.getItem(storageKey)) return false;
    window.sessionStorage.setItem(storageKey, '1');
  } catch {
    // Fall through to the memory flag.
  }
  memory[storageKey] = '1';
  return true;
}
