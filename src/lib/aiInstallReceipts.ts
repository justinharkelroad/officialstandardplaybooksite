// Pure helpers for the AI Install step receipts. The step list mirrors
// supabase/functions/_shared/ai-install-portal.ts (the Edge Function cannot be
// imported here because it pulls in Deno-only code). A test keeps this list
// equal to resources/aiinstall/v2/phases.

export type AiInstallReceiptResult = "PASS" | "FAIL";

export interface AiInstallReceipt {
  step: string;
  result: AiInstallReceiptResult;
  files: string;
  receipt_date: string;
  updated_at: string;
}

export interface AiInstallRejectedReceiptLine {
  lineNumber: number;
  line: string;
  reason: string;
}

export const AI_INSTALL_RECEIPT_STEPS: ReadonlyArray<{ name: string; label: string }> = [
  { name: "ready", label: "Pre-work readiness check" },
  { name: "phase-1-about-me", label: "Phase 1. About me" },
  { name: "phase-2-voice", label: "Phase 2. Brand voice" },
  { name: "phase-3-rules", label: "Phase 3. Working preferences and safety rules" },
  { name: "phase-4-content", label: "Phase 4. Content strategy" },
  { name: "phase-5-team", label: "Phase 5. Team members" },
  { name: "handoff", label: "Session handoff" },
  { name: "check-day-1", label: "Day 1 completion check" },
  { name: "resume", label: "Resume the build" },
  { name: "phase-6-project", label: "Phase 6. Active project" },
  { name: "cleanup", label: "Pre-index cleanup" },
  { name: "memory", label: "Memory system and master file" },
  { name: "cold-test", label: "Cold memory test" },
  { name: "brief-setup", label: "Morning brief setup" },
  { name: "dashboard", label: "Weekly dashboard" },
  { name: "build-skill", label: "Build one custom skill" },
  { name: "upkeep-setup", label: "Weekly upkeep setup" },
  { name: "check-day-2", label: "Day 2 completion check" },
  { name: "apply-updates", label: "Apply weekly updates" },
  { name: "team-pack", label: "Team-safe pack" },
];

export interface AiInstallReceiptStepRow {
  name: string;
  label: string;
  /** null means no receipt has been pasted for this step yet. */
  result: AiInstallReceiptResult | null;
  files: string | null;
  date: string | null;
}

export interface AiInstallReceiptSummary {
  total: number;
  passed: number;
  failed: number;
  day1: AiInstallReceiptResult | null;
  day2: AiInstallReceiptResult | null;
  steps: AiInstallReceiptStepRow[];
}

function isResult(value: unknown): value is AiInstallReceiptResult {
  return value === "PASS" || value === "FAIL";
}

/** Lines the 20 steps up in workshop order and attaches whatever receipts exist. Unknown steps are ignored. */
export function summarizeAiInstallReceipts(
  receipts: ReadonlyArray<Pick<AiInstallReceipt, "step" | "result" | "files" | "receipt_date">> | null | undefined,
): AiInstallReceiptSummary {
  const byStep = new Map<string, Pick<AiInstallReceipt, "step" | "result" | "files" | "receipt_date">>();
  for (const receipt of receipts ?? []) {
    if (receipt && isResult(receipt.result)) byStep.set(receipt.step, receipt);
  }

  const steps = AI_INSTALL_RECEIPT_STEPS.map(({ name, label }): AiInstallReceiptStepRow => {
    const receipt = byStep.get(name);
    return {
      name,
      label,
      result: receipt?.result ?? null,
      files: receipt?.files ?? null,
      date: receipt?.receipt_date ?? null,
    };
  });

  return {
    total: steps.length,
    passed: steps.filter((step) => step.result === "PASS").length,
    failed: steps.filter((step) => step.result === "FAIL").length,
    day1: steps.find((step) => step.name === "check-day-1")?.result ?? null,
    day2: steps.find((step) => step.name === "check-day-2")?.result ?? null,
    steps,
  };
}

export function describeAiInstallReceiptResult(result: AiInstallReceiptResult | null): string {
  if (result === "PASS") return "Passed";
  if (result === "FAIL") return "Did not pass";
  return "Not yet";
}

export function describeAiInstallReceiptSubmission(recorded: number, rejectedCount: number): string {
  if (recorded > 0 && rejectedCount === 0) {
    return recorded === 1 ? "1 receipt recorded." : `${recorded} receipts recorded.`;
  }
  if (recorded > 0) {
    const noun = recorded === 1 ? "receipt" : "receipts";
    return `${recorded} ${noun} recorded. ${rejectedCount === 1 ? "1 line" : `${rejectedCount} lines`} could not be recorded.`;
  }
  return "Nothing was recorded. Check the notes below and paste the receipt again.";
}
