---
name: agency-commission-audit
description: Reconcile policy-level commission exports and flag negative commissions, nonzero premium with zero commission, and rate-review exceptions. Use when the user asks to audit commissions, chargebacks, variable compensation, or commission anomalies. Do not declare underpayment without the carrier schedule.
---

# Agency Commission Audit

Create a policy-level exception review from one or more local commission summary exports.

## Workflow

1. Confirm each report contains policy number, written or commissionable premium, and total commission.
2. Keep source files unchanged and create a new local output directory alongside the exports, outside `MY BIZ BRAIN`.
3. Run `scripts/analyze.py`, repeating `--input` for multiple files.
4. Open `OWNER-REPORT.html` as the primary owner dashboard. Use `OWNER-REPORT.pdf` for a printable briefing and `ACTION-LIST.xlsx` as the formatted, filterable working queue. Keep `summary.json`, `action-list.csv`, and `run-manifest.json` as the calculation and audit layer.
5. Reconcile aggregate written premium, commissionable premium, base commission, variable compensation, and total commission to each report's footer. Review flagged rows, then explain what deserves human verification and what may be an ordinary adjustment or chargeback.

Read [references/report-contract.md](references/report-contract.md) before interpreting exceptions.

## Guardrails

- A flag is not proof the carrier paid incorrectly.
- Combine files only when the user intentionally wants the same agency/entity and reporting period analyzed together.
- Require the applicable carrier commission schedule, period, agent type, and adjustment rules before calculating an expected payment.
- Never change producer compensation, agency pricing, or accounting records.
- Keep insured and policy-level data local.
