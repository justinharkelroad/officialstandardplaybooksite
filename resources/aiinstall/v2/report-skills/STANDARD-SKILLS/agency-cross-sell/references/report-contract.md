# Cross-Sell Report Contract

## Recognized inputs

- Commission export: policy number, primary insured, product, bundle type, written premium, and state.
- New-business export: policy, product, disposition, item count, and written premium.

## Confidence

Every row derived from a commission export is labeled `Candidate—verify against full in-force household data`. The action list is a research queue, not an outreach list.

## Outputs

`summary.json` contains bundle-type counts, monoline count, add-item activity, and product mix. `action-list.csv` contains provisional monoline rows. `run-manifest.json` records the inputs used. `OWNER-REPORT.html` is the primary branded owner dashboard, `OWNER-REPORT.pdf` is the printable aggregate briefing, and `ACTION-LIST.xlsx` contains a branded dashboard plus a frozen, filterable household-verification queue.

XLSX date-formatted numeric cells use the workbook's declared date system. Formula-like strings beginning with `=`, `+`, `-`, or `@` are apostrophe-neutralized in the CSV; genuine numeric values remain numeric.
