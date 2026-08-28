export type AiInstallBulkInvitePlatform = "claude" | "codex" | "both";

export interface AiInstallBulkInvite {
  email: string;
  fullName: string;
  platform: AiInstallBulkInvitePlatform;
  expiresAt: string | null;
  sourceLine: number;
}

export interface AiInstallBulkInviteIssue {
  sourceLine: number;
  value: string;
  message: string;
}

export interface AiInstallBulkInviteParseResult {
  invites: AiInstallBulkInvite[];
  issues: AiInstallBulkInviteIssue[];
  duplicateEmails: string[];
  overflowCount: number;
}

export interface AiInstallBulkInviteDefaults {
  platform: AiInstallBulkInvitePlatform;
  expiresAt: string | null;
  limit?: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_LIMIT = 100;

const HEADER_KEYS = {
  email: new Set(["email", "emailaddress", "emailaddr"]),
  name: new Set(["name", "fullname", "attendeename"]),
  platform: new Set(["platform", "access", "accessplatform"]),
  expiresAt: new Set(["expires", "expiresat", "expiration", "expirationdate"]),
};

export function parseAiInstallBulkInvites(
  input: string,
  defaults: AiInstallBulkInviteDefaults,
): AiInstallBulkInviteParseResult {
  const rows = parseDelimitedRows(input);
  const issues: AiInstallBulkInviteIssue[] = [];
  const duplicateEmails: string[] = [];
  const candidates: AiInstallBulkInvite[] = [];
  const seen = new Set<string>();

  const firstNonEmptyIndex = rows.findIndex((row) => row.cells.some(Boolean));
  const header = firstNonEmptyIndex >= 0
    ? detectHeader(rows[firstNonEmptyIndex].cells)
    : null;

  if (header) {
    for (const row of rows.slice(firstNonEmptyIndex + 1)) {
      if (!row.cells.some(Boolean)) continue;
      const email = normalizeEmail(row.cells[header.email] ?? "");
      const fullName = cleanCell(header.name === null ? "" : row.cells[header.name] ?? "");
      const platformCell = header.platform === null ? "" : row.cells[header.platform] ?? "";
      const expiryCell = header.expiresAt === null ? "" : row.cells[header.expiresAt] ?? "";
      const platform = platformCell
        ? normalizePlatform(platformCell)
        : defaults.platform;
      const expiresAt = expiryCell
        ? normalizeExpiry(expiryCell)
        : normalizeExpiry(defaults.expiresAt);

      if (!isEmail(email)) {
        issues.push(issue(row.line, row.cells.join(", "), "A valid email address is required."));
        continue;
      }
      if (!platform) {
        issues.push(issue(row.line, platformCell, "Platform must be Codex, Claude, or both."));
        continue;
      }
      if (expiryCell && expiresAt === undefined) {
        issues.push(issue(row.line, expiryCell, "Expiration date is invalid."));
        continue;
      }

      addCandidate({
        email,
        fullName,
        platform,
        expiresAt: expiresAt ?? null,
        sourceLine: row.line,
      });
    }
  } else {
    for (const row of rows) {
      if (!row.cells.some(Boolean)) continue;
      const parsed = parseLooseRow(row.cells, row.line, defaults, issues);
      for (const candidate of parsed) addCandidate(candidate);
    }
  }

  const limit = Math.max(1, defaults.limit ?? DEFAULT_LIMIT);
  const overflowCount = Math.max(0, candidates.length - limit);

  return {
    invites: candidates.slice(0, limit),
    issues,
    duplicateEmails,
    overflowCount,
  };

  function addCandidate(candidate: AiInstallBulkInvite) {
    if (seen.has(candidate.email)) {
      if (!duplicateEmails.includes(candidate.email)) duplicateEmails.push(candidate.email);
      return;
    }
    seen.add(candidate.email);
    candidates.push(candidate);
  }
}

function parseLooseRow(
  cells: string[],
  sourceLine: number,
  defaults: AiInstallBulkInviteDefaults,
  issues: AiInstallBulkInviteIssue[],
): AiInstallBulkInvite[] {
  const nonEmpty = cells.map(cleanCell).filter(Boolean);
  if (nonEmpty.length === 0) return [];

  if (nonEmpty.length === 1) {
    const parsed = parseEmailToken(nonEmpty[0]);
    if (!parsed) {
      issues.push(issue(sourceLine, nonEmpty[0], "A valid email address is required."));
      return [];
    }
    return [candidateFromToken(parsed, sourceLine, defaults)];
  }

  if (nonEmpty.length === 2) {
    const first = parseEmailToken(nonEmpty[0]);
    const second = parseEmailToken(nonEmpty[1]);
    if (first && !second) {
      return [candidateFromToken({ ...first, fullName: first.fullName || nonEmpty[1] }, sourceLine, defaults)];
    }
    if (!first && second) {
      return [candidateFromToken({ ...second, fullName: second.fullName || nonEmpty[0] }, sourceLine, defaults)];
    }
  }

  const parsed = nonEmpty.flatMap((cell) => {
    const token = parseEmailToken(cell);
    if (!token) {
      issues.push(issue(sourceLine, cell, "This value was not recognized as an email address."));
      return [];
    }
    return [candidateFromToken(token, sourceLine, defaults)];
  });
  return parsed;
}

function candidateFromToken(
  token: { email: string; fullName: string },
  sourceLine: number,
  defaults: AiInstallBulkInviteDefaults,
): AiInstallBulkInvite {
  return {
    email: token.email,
    fullName: token.fullName,
    platform: defaults.platform,
    expiresAt: normalizeExpiry(defaults.expiresAt) ?? null,
    sourceLine,
  };
}

function parseEmailToken(value: string): { email: string; fullName: string } | null {
  const cleaned = cleanCell(value);
  const angleMatch = cleaned.match(/^(.*?)\s*<\s*([^<>\s]+@[^<>\s]+)\s*>$/);
  if (angleMatch) {
    const email = normalizeEmail(angleMatch[2]);
    if (!isEmail(email)) return null;
    return { email, fullName: cleanCell(angleMatch[1]) };
  }

  const email = normalizeEmail(cleaned);
  return isEmail(email) ? { email, fullName: "" } : null;
}

function detectHeader(cells: string[]): {
  email: number;
  name: number | null;
  platform: number | null;
  expiresAt: number | null;
} | null {
  const normalized = cells.map(normalizeHeader);
  const email = normalized.findIndex((value) => HEADER_KEYS.email.has(value));
  if (email < 0) return null;
  return {
    email,
    name: findHeader(normalized, HEADER_KEYS.name),
    platform: findHeader(normalized, HEADER_KEYS.platform),
    expiresAt: findHeader(normalized, HEADER_KEYS.expiresAt),
  };
}

function findHeader(values: string[], keys: Set<string>): number | null {
  const index = values.findIndex((value) => keys.has(value));
  return index < 0 ? null : index;
}

function normalizeHeader(value: string): string {
  return cleanCell(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizePlatform(value: string): AiInstallBulkInvitePlatform | null {
  const normalized = cleanCell(value).toLowerCase().replace(/[^a-z+]/g, "");
  if (normalized === "codex") return "codex";
  if (normalized === "claude") return "claude";
  if (["both", "all", "claude+codex", "codex+claude", "claudecodex", "codexclaude"].includes(normalized)) {
    return "both";
  }
  return null;
}

function normalizeExpiry(value: string | null): string | null | undefined {
  if (!value?.trim()) return null;
  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function normalizeEmail(value: string): string {
  return cleanCell(value).toLowerCase();
}

function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

function cleanCell(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, "").trim();
}

function issue(sourceLine: number, value: string, message: string): AiInstallBulkInviteIssue {
  return { sourceLine, value: value.trim(), message };
}

function parseDelimitedRows(input: string): Array<{ line: number; cells: string[] }> {
  const rows: Array<{ line: number; cells: string[] }> = [];
  let cells: string[] = [];
  let cell = "";
  let quoted = false;
  let line = 1;
  let rowLine = 1;

  const pushCell = () => {
    cells.push(cleanCell(cell));
    cell = "";
  };
  const pushRow = () => {
    pushCell();
    rows.push({ line: rowLine, cells });
    cells = [];
    rowLine = line + 1;
  };

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (!quoted && (character === "," || character === ";" || character === "\t")) {
      pushCell();
      continue;
    }
    if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      pushRow();
      line += 1;
      continue;
    }
    if (quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      cell += "\n";
      line += 1;
      continue;
    }
    cell += character;
  }

  if (cell || cells.length) {
    pushCell();
    rows.push({ line: rowLine, cells });
  }

  return rows;
}
