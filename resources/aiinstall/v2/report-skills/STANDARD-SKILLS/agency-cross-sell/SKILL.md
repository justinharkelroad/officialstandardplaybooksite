---
name: agency-cross-sell
description: Identify provisional monoline and add-item opportunities from policy-level commission and new-business exports. Use when the user asks for bundle, multiline, cross-sell, umbrella, or household review opportunities. Require full in-force household verification before outreach.
---

# Agency Cross-Sell

Create a provisional bundle-opportunity review using local commission and new-business exports.

## Workflow

1. Prefer a complete in-force customer/policy export. If unavailable, accept commission and new-business exports but label results provisional.
2. Keep source files unchanged and create a new local output directory alongside the exports, outside `MY BIZ BRAIN`.
3. Run `scripts/analyze.py`, repeating `--input` for all relevant reports.
4. Open `OWNER-REPORT.html` as the primary owner dashboard. Use `OWNER-REPORT.pdf` for a printable briefing and `ACTION-LIST.xlsx` as the formatted, filterable verification queue. Keep `summary.json`, `action-list.csv`, and `run-manifest.json` as the calculation and audit layer.
5. Review monoline flags, bundle-type mix, product mix, and add-item activity. Before producing outreach, verify every candidate against the full household and current in-force policy view. Present opportunity themes before customer-level names unless the user explicitly requests the local action list.

Read [references/report-contract.md](references/report-contract.md) for confidence rules.

## Guardrails

- A monthly commission export is not a full book of business.
- A monoline policy row does not prove the household has only one policy across every carrier or account.
- Do not recommend a specific coverage amount, confirm eligibility, quote a rate, bind coverage, or send outreach.
- Keep customer-level opportunity lists local.
