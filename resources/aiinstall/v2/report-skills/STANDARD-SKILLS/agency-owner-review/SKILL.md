---
name: agency-owner-review
description: Turn business-metrics and optional new-business exports into a concise agency-owner operating review covering book size, retention, premium, loss ratio, production mix, and producer contribution. Use for monthly business reviews, scorecards, or owner briefings. Do not invent goals or carrier thresholds.
---

# Agency Owner Review

Produce a decision-oriented operating brief from the agency's aggregated business-metrics report and optional new-business detail.

## Workflow

1. Accept a business-metrics export and, when available, a matching new-business detail export.
2. Keep source files unchanged and create a new local output directory alongside the exports, outside `MY BIZ BRAIN`.
3. Run `scripts/analyze.py`, repeating `--input` for each report.
4. Open `OWNER-REPORT.html` as the primary owner dashboard. Use `OWNER-REPORT.pdf` for a printable briefing and `ACTION-LIST.xlsx` as the formatted, filterable working file. Keep `summary.json`, `action-list.csv`, and `run-manifest.json` as the calculation and audit layer.
5. Review the metric records in context: book size, retention, tenure, written premium, and loss ratio. Use the exact report labels and periods. Present what improved, what weakened, the three most important management questions, and the next operating actions. Include new-business product and producer mix only when supplied.

Read [references/report-contract.md](references/report-contract.md) for period and comparison rules.

## Guardrails

- Do not infer goals, benchmarks, bonus thresholds, or carrier expectations that are absent from the files.
- Keep percentages in the report's displayed units; identify whether the source stores 86.9 or 0.869 before restating it.
- Loss ratio is a performance signal, not a directive to change coverage or underwriting.
