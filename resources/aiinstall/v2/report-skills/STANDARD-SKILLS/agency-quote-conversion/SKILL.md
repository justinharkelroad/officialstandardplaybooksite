---
name: agency-quote-conversion
description: Analyze insurance quote-detail and conversion exports to produce producer/product conversion results and a prioritized unbound-quote follow-up list. Use when the user asks about quote conversion, open quotes, producer close rates, or quote follow-up. Do not use quoted premium as revenue or send outreach.
---

# Agency Quote Conversion

Turn one or more local quote-detail exports into an auditable conversion brief and follow-up queue.

## Workflow

1. Confirm the supplied file is a quote-detail export containing production date, product, quoted premium, and—when available—issued policy number.
2. Keep the source report in place. Create a new local output directory alongside the export, outside `MY BIZ BRAIN`.
3. Run `scripts/analyze.py`, passing each report with a separate `--input` argument and the output directory with `--output`.
4. Open `OWNER-REPORT.html` as the primary owner dashboard. Use `OWNER-REPORT.pdf` for a printable briefing and `ACTION-LIST.xlsx` as the formatted, filterable working queue. Keep `summary.json`, `action-list.csv`, and `run-manifest.json` as the calculation and audit layer.
5. Reconcile unique Quote Control Numbers, bound quotes, quoted items, and conversion against any summary sheet in the source workbook. Present the owner with overall conversion, producer and product differences, the highest-value unbound quotes, data-quality limitations, and three specific next actions.

For column definitions and interpretation rules, read [references/report-contract.md](references/report-contract.md).

## Guardrails

- Quoted premium measures opportunity volume, not revenue or expected commission.
- Combine files only when they cover the same agency and compatible reporting periods; otherwise run them separately.
- Count each nonblank `Quote Control Number` once. If it appears on multiple product rows, treat it as one quote and mark it bound when any row has an issued-policy signal.
- When Quote Control Number is missing, count that row separately and disclose the row-level fallback.
- Product scorecards count quote participation: a multi-product quote appears once in each product it includes, so product counts need not sum to the overall unique-quote count.
- If the export lacks `Issued Policy #` or an equivalent bound field—or the field exists but contains no usable values—report quote volume and quoted premium but leave bound, unbound, conversion, and unbound premium unavailable. Do not generate a false 0% result or follow-up queue.
- An empty issued-policy value in a conversion-capable export means "unbound in this export," not proof the customer never bought.
- Do not send follow-up messages or update a CRM without explicit approval.
- Never confirm coverage, quote a rate, or bind a policy in generated material.
- Keep customer-level action lists local and show them only when the user asks.
