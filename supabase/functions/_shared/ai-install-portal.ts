import type {
  SupabaseClient,
  User,
} from "https://esm.sh/@supabase/supabase-js@2";

import { createServiceClient, errorResponse } from "./memberAuth.ts";

export type AiInstallPlatform = "claude" | "codex" | "both";

export interface AiInstallPortalAccess {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  platform: AiInstallPlatform;
  source: "manual" | "purchase";
  is_active: boolean;
  expires_at: string | null;
  first_login_at: string | null;
  last_login_at: string | null;
  login_count: number;
  testimonial_prompt_dismissed_at: string | null;
  testimonial_submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerifiedPortalAccess {
  userId: string;
  access: AiInstallPortalAccess;
  supabase: SupabaseClient;
}

export const PORTAL_SESSION_WINDOW_MS = 30 * 60 * 1000;
export const PORTAL_ACTIVATION_CODE_RANDOM_LENGTH = 12;

const PORTAL_ACTIVATION_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

const ACCESS_COLUMNS = [
  "id",
  "user_id",
  "email",
  "full_name",
  "platform",
  "source",
  "is_active",
  "expires_at",
  "first_login_at",
  "last_login_at",
  "login_count",
  "testimonial_prompt_dismissed_at",
  "testimonial_submitted_at",
  "created_at",
  "updated_at",
].join(",");

export function normalizePortalEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isPortalEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizePortalPlatform(value: unknown): AiInstallPlatform {
  return value === "claude" || value === "codex" || value === "both"
    ? value
    : "both";
}

export function generatePortalActivationCode(randomBytes?: Uint8Array): string {
  const bytes = randomBytes ?? crypto.getRandomValues(
    new Uint8Array(PORTAL_ACTIVATION_CODE_RANDOM_LENGTH),
  );
  if (bytes.length < PORTAL_ACTIVATION_CODE_RANDOM_LENGTH) {
    throw new Error("Activation code entropy is incomplete");
  }
  const randomPart = Array.from(
    bytes.slice(0, PORTAL_ACTIVATION_CODE_RANDOM_LENGTH),
    (value) => PORTAL_ACTIVATION_ALPHABET[value % PORTAL_ACTIVATION_ALPHABET.length],
  ).join("");
  return `${randomPart}-Aa7!`;
}

export function canAccessPortalAsset(
  accessPlatform: AiInstallPlatform,
  assetPlatform: AiInstallPlatform,
): boolean {
  return assetPlatform === "both" ||
    accessPlatform === "both" ||
    accessPlatform === assetPlatform;
}

export function isPortalAccessCurrent(
  access: Pick<AiInstallPortalAccess, "is_active" | "expires_at">,
  now = new Date(),
): boolean {
  if (!access.is_active) return false;
  if (!access.expires_at) return true;
  const expiry = new Date(access.expires_at);
  return !Number.isNaN(expiry.getTime()) && expiry.getTime() > now.getTime();
}

export function shouldCountPortalSession(
  lastLoginAt: string | null,
  now = new Date(),
): boolean {
  if (!lastLoginAt) return true;
  const lastLogin = new Date(lastLoginAt);
  if (Number.isNaN(lastLogin.getTime())) return true;
  return now.getTime() - lastLogin.getTime() >= PORTAL_SESSION_WINDOW_MS;
}

export async function getPortalAccessByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<AiInstallPortalAccess | null> {
  const { data, error } = await supabase
    .from("ai_install_portal_access")
    .select(ACCESS_COLUMNS)
    .ilike("email", email)
    .maybeSingle();
  if (error) throw new Error(`Portal access lookup failed: ${error.message}`);
  return (data as AiInstallPortalAccess | null) ?? null;
}

export async function getPortalAccessByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<AiInstallPortalAccess | null> {
  const { data, error } = await supabase
    .from("ai_install_portal_access")
    .select(ACCESS_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`Portal access lookup failed: ${error.message}`);
  return (data as AiInstallPortalAccess | null) ?? null;
}

async function findExistingAuthUser(
  supabase: SupabaseClient,
  email: string,
): Promise<User | null> {
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (member?.id) {
    const { data } = await supabase.auth.admin.getUserById(member.id);
    if (data?.user) return data.user;
  }

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw new Error(`Auth user lookup failed: ${error.message}`);
    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === email,
    );
    if (match) return match;
    if (data.users.length < 1000) return null;
  }

  throw new Error("Auth user lookup exceeded the supported page limit");
}

export async function ensurePortalAuthUser(
  supabase: SupabaseClient,
  email: string,
): Promise<{ user: User; activationCode: string | null }> {
  const existing = await findExistingAuthUser(supabase, email);
  if (existing) return { user: existing, activationCode: null };

  const activationCode = generatePortalActivationCode();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: activationCode,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Auth user creation failed");
  }
  return { user: data.user, activationCode };
}

export async function requirePortalAccess(
  req: Request,
): Promise<VerifiedPortalAccess | Response> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return errorResponse("Missing authorization", 401);

  const supabase = createServiceClient();
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data.user) {
    return errorResponse("Invalid or expired session", 401);
  }

  let access: AiInstallPortalAccess | null;
  try {
    access = await getPortalAccessByUserId(supabase, data.user.id);
  } catch (lookupError) {
    console.error("ai-install-portal: access lookup failed", lookupError);
    return errorResponse("Access lookup failed", 500);
  }

  if (!access || !isPortalAccessCurrent(access)) {
    return errorResponse("This email does not have active portal access", 403);
  }

  return { userId: data.user.id, access, supabase };
}

// ---------------------------------------------------------------------------
// Phase receipts
//
// Workshop attendees on the fallback (plugin) route finish each step with one
// receipt line printed by their AI. They paste it into the portal. Only the
// line is stored, never file contents.
//
//   AII-R1|<step name>|<PASS or FAIL>|<file names, comma separated, or none>|<YYYY-MM-DD>
// ---------------------------------------------------------------------------

/** The 20 step names in workshop order. A test keeps this equal to resources/aiinstall/v2/phases. */
export const AI_INSTALL_RECEIPT_STEPS = [
  "ready",
  "phase-1-about-me",
  "phase-2-voice",
  "phase-3-rules",
  "phase-4-content",
  "phase-5-team",
  "handoff",
  "check-day-1",
  "resume",
  "phase-6-project",
  "cleanup",
  "memory",
  "cold-test",
  "brief-setup",
  "dashboard",
  "build-skill",
  "upkeep-setup",
  "check-day-2",
  "apply-updates",
  "team-pack",
] as const;

export type AiInstallReceiptStep = typeof AI_INSTALL_RECEIPT_STEPS[number];
export type AiInstallReceiptResult = "PASS" | "FAIL";

export const AI_INSTALL_RECEIPT_PREFIX = "AII-R1";
export const AI_INSTALL_RECEIPT_MAX_TEXT_LENGTH = 8000;
export const AI_INSTALL_RECEIPT_MAX_LINES = 40;
export const AI_INSTALL_RECEIPT_MAX_FILES_LENGTH = 500;
const RECEIPT_ECHO_MAX_LENGTH = 200;

export interface ParsedAiInstallReceipt {
  step: AiInstallReceiptStep;
  result: AiInstallReceiptResult;
  files: string;
  date: string;
}

export interface RejectedAiInstallReceiptLine {
  /** 1-based line number in the pasted text, or 0 when the reason is about the whole paste. */
  lineNumber: number;
  /** The offending line, cleaned and shortened so it is safe to show as plain text. */
  line: string;
  /** Plain-English reason that says what to fix. */
  reason: string;
}

export interface ParsedAiInstallReceipts {
  receipts: ParsedAiInstallReceipt[];
  rejected: RejectedAiInstallReceiptLine[];
}

const RECEIPT_STEP_SET: ReadonlySet<string> = new Set(AI_INSTALL_RECEIPT_STEPS);

// C0 and C1 controls, line and paragraph separators, zero-width characters and
// bidirectional overrides. None belong in a file name shown to an admin.
const UNSAFE_CODE_POINT_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0000, 0x001f],
  [0x007f, 0x009f],
  [0x200b, 0x200f],
  [0x2028, 0x202e],
  [0x2060, 0x2069],
  [0xfeff, 0xfeff],
];

function isUnsafeReceiptCodePoint(codePoint: number): boolean {
  return UNSAFE_CODE_POINT_RANGES.some(([low, high]) =>
    codePoint >= low && codePoint <= high
  );
}

export function stripUnsafeReceiptCharacters(value: string): string {
  let cleaned = "";
  for (const character of value) {
    if (!isUnsafeReceiptCodePoint(character.codePointAt(0) ?? 0)) {
      cleaned += character;
    }
  }
  return cleaned;
}

export function isRealCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC maps years 0 to 99 to 1900 to 1999, so those years never round trip.
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function echoReceiptLine(line: string): string {
  const cleaned = stripUnsafeReceiptCharacters(line).trim();
  return cleaned.length > RECEIPT_ECHO_MAX_LENGTH
    ? `${cleaned.slice(0, RECEIPT_ECHO_MAX_LENGTH)}...`
    : cleaned;
}

/** Cuts a line down to the receipt itself: drops chat text before it and quotes, backticks or spaces after it. */
function extractReceiptCandidate(line: string): string | null {
  const start = line.search(/AII-R/i);
  if (start === -1) return null;
  return line
    .slice(start)
    .replace(/[\s`"'*]+$/u, "")
    .trim();
}

export function parseAiInstallReceipts(text: string): ParsedAiInstallReceipts {
  const receipts: ParsedAiInstallReceipt[] = [];
  const rejected: RejectedAiInstallReceiptLine[] = [];

  if (typeof text !== "string" || text.trim() === "") {
    rejected.push({
      lineNumber: 0,
      line: "",
      reason: "Nothing was pasted. Paste the receipt line your AI printed, then try again.",
    });
    return { receipts, rejected };
  }

  let input = text;
  if (input.length > AI_INSTALL_RECEIPT_MAX_TEXT_LENGTH) {
    input = input.slice(0, AI_INSTALL_RECEIPT_MAX_TEXT_LENGTH);
    rejected.push({
      lineNumber: 0,
      line: "",
      reason:
        `That paste was longer than ${AI_INSTALL_RECEIPT_MAX_TEXT_LENGTH} characters, so only the first part was read. Paste fewer receipts at a time.`,
    });
  }

  const lines = input.split(/\r\n|\r|\n/);
  const indexByStep = new Map<string, number>();
  let candidateCount = 0;
  let skippedCount = 0;

  lines.forEach((rawLine, index) => {
    const candidate = extractReceiptCandidate(rawLine);
    if (candidate === null) return;

    candidateCount += 1;
    if (candidateCount > AI_INSTALL_RECEIPT_MAX_LINES) {
      skippedCount += 1;
      return;
    }

    const lineNumber = index + 1;
    const reject = (reason: string) => {
      rejected.push({ lineNumber, line: echoReceiptLine(candidate), reason });
    };

    const fields = candidate.split("|").map((field) => field.trim());
    if (fields[0] !== AI_INSTALL_RECEIPT_PREFIX) {
      reject(
        `The line must start with ${AI_INSTALL_RECEIPT_PREFIX} in capital letters. Copy the whole receipt line again.`,
      );
      return;
    }
    if (fields.length !== 5) {
      reject(
        `A receipt has five parts separated by | but this line has ${fields.length}. Copy the whole line again without changing it.`,
      );
      return;
    }

    const [, step, result, rawFiles, date] = fields;
    if (!RECEIPT_STEP_SET.has(step)) {
      reject(
        `"${echoReceiptLine(step).slice(0, 60)}" is not a step name this workshop uses. Copy the receipt exactly as your AI printed it.`,
      );
      return;
    }
    if (result !== "PASS" && result !== "FAIL") {
      reject("The result must be exactly PASS or FAIL in capital letters.");
      return;
    }
    if (!isRealCalendarDate(date)) {
      reject("The date must be a real date written as YYYY-MM-DD, for example 2027-02-10.");
      return;
    }

    const files = stripUnsafeReceiptCharacters(rawFiles).trim();
    if (files === "") {
      reject('The file names part is empty. It should list file names or say "none".');
      return;
    }
    if (files.length > AI_INSTALL_RECEIPT_MAX_FILES_LENGTH) {
      reject(
        `The file names part is longer than ${AI_INSTALL_RECEIPT_MAX_FILES_LENGTH} characters. Ask your AI to print the receipt again with file names only.`,
      );
      return;
    }

    const earlier = indexByStep.get(step);
    if (earlier !== undefined) {
      const replaced = receipts[earlier];
      rejected.push({
        lineNumber: 0,
        line: "",
        reason:
          `The step ${replaced.step} appeared more than once in this paste. Only the last one was recorded.`,
      });
      receipts.splice(earlier, 1);
      for (const [key, value] of indexByStep) {
        if (value > earlier) indexByStep.set(key, value - 1);
      }
    }
    indexByStep.set(step, receipts.length);
    receipts.push({
      step: step as AiInstallReceiptStep,
      result,
      files: files.toLowerCase() === "none" ? "none" : files,
      date,
    });
  });

  if (candidateCount === 0) {
    rejected.push({
      lineNumber: 0,
      line: "",
      reason:
        `No receipt line was found. A receipt starts with ${AI_INSTALL_RECEIPT_PREFIX}. Paste the line your AI printed at the end of the step.`,
    });
  }

  if (skippedCount > 0) {
    rejected.push({
      lineNumber: 0,
      line: "",
      reason:
        `Only the first ${AI_INSTALL_RECEIPT_MAX_LINES} receipt lines are read at a time. ${skippedCount} more were skipped. Paste them again in a smaller batch.`,
    });
  }

  return { receipts, rejected };
}
