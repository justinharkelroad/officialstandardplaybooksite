---
name: agency-retention-rescue
description: Analyze insurance termination or cancellation audit exports to prioritize payment-rescue, price-conversation, and owner-review cases. Use when the user asks for a retention save list, cancellation triage, non-pay analysis, or termination trends. Do not contact customers automatically.
---

# Agency Retention Rescue

Convert a termination audit into a local, reason-based review queue for the agency owner or licensed team.

## Workflow

1. Confirm the export contains policy number, termination reason, termination effective date, and premium fields.
2. Keep the source report in place. Create a new local output directory alongside the export, outside `MY BIZ BRAIN`.
3. Run `scripts/analyze.py` with the report path and output directory.
4. Open `OWNER-REPORT.html` as the primary owner dashboard. Use `OWNER-REPORT.pdf` for a printable briefing and `ACTION-LIST.xlsx` as the formatted, filterable working queue. Keep `summary.json`, `action-list.csv`, and `run-manifest.json` as the calculation and audit layer.
5. Reconcile premium volume, reason mix, line mix, contactability, and prioritized cases. Distinguish payment rescue, price conversation, likely non-saveable, and owner-review cases using explicit normalized words and phrases—not partial substrings. Give the user a recommended call order and reason-specific talking points only when requested.

Read [references/report-contract.md](references/report-contract.md) before interpreting categories or premium.

## Guardrails

- The list is triage, not permission to call, email, text, or alter a policy.
- Do not claim a policy can be reinstated; carrier rules and licensed staff control that decision.
- Never confirm coverage, promise a rate, or recommend a coverage reduction as fact.
- Keep contact information and customer-level output local.
- Treat `price`, `pricing`, `rate`, `rates`, premium-increase language, and explicit dissatisfaction with premium as price signals. Words such as `separate` must not match `rate`.
