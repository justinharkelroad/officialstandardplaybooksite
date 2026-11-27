# Quote Conversion Report Contract

## Recognized fields

- Producer: `Sub Producer`
- Quote identity: `Quote Control Number`
- Date: `Production Date`
- Product and volume: `Product`, `Quoted Item Count`, `Quoted Premium($)`
- Bound signal: `Issued Policy #`

## Outputs

- `summary.json`: unique-quote count, source row count, bound/unbound count when available, conversion rate when available, quoted premium, producer/product participation rollups, and data limitations.
- `action-list.csv`: one row per unique unbound quote, ordered by aggregated quoted premium, with multi-product context. Missing quote IDs use one row per source row and are labeled as a row-level fallback.
- `run-manifest.json`: source hashes, detected sheets, header rows, and output names.
- `OWNER-REPORT.html`: primary branded owner dashboard with KPIs, product participation, findings, limitations, and next actions.
- `OWNER-REPORT.pdf`: printable owner briefing containing aggregate information only.
- `ACTION-LIST.xlsx`: branded dashboard plus a frozen, filterable unique-quote working queue.

## Interpretation

Overall quote counts use unique nonblank `Quote Control Number` values. A quote is bound when any row in that quote has an issued-policy signal. Product and producer scorecards use participation counting: one multi-product quote can appear once under several products, so product counts may exceed and do not have to sum to the overall count.

When the export has no issued-policy or equivalent bound column, or the bound column has no usable values, `bound_quotes`, `unbound_quotes`, `conversion_rate`, and `unbound_quoted_premium` are `null`; the action list is empty and the limitation requests a conversion-capable export with populated signals. This conservative rule avoids reporting a false 0% conversion when an export contains an empty placeholder column. Use the report's date window. Do not annualize or forecast unless the user supplies a comparable period and asks for it. Producer comparisons with very small samples must be labeled directional.

XLSX date-formatted numeric cells are converted using the workbook's 1900 or 1904 date system. Ordinary numeric cells are not date-converted. Strings beginning with `=`, `+`, `-`, or `@` are apostrophe-neutralized in `action-list.csv`; genuine numeric values remain numeric.
