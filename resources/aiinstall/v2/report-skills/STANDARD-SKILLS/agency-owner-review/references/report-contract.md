# Agency Owner Review Contract

## Recognized reports

- Business Metrics Printable View: metric label plus personal-lines and total property/casualty columns.
- New Business Details: issued policy, producer, product, item count, written premium, transaction type, and disposition.

## Outputs

- `summary.json`: ordered metric records and, when supplied, new-business totals and product/producer rollups.
- `action-list.csv`: an auditable flat list of reported metrics by section.
- `run-manifest.json`: source hashes and detected report structure.
- `OWNER-REPORT.html`: primary branded operating dashboard with KPI cards, product mix, findings, and next actions.
- `OWNER-REPORT.pdf`: printable owner briefing containing the aggregate operating picture.
- `ACTION-LIST.xlsx`: branded dashboard plus a formatted, filterable metrics working sheet.

## Comparison rules

Use current, prior-year, PYE, YTD, 12-month, and 24-month labels exactly as the report defines them. Do not compare unlike periods without explicitly saying so.

XLSX date-formatted numeric cells use the workbook's declared 1900 or 1904 date system; ordinary numerics are not converted. Formula-like strings beginning with `=`, `+`, `-`, or `@` are apostrophe-neutralized in the CSV, while genuine numeric values remain numeric.
