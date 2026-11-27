# Commission Audit Report Contract

## Recognized fields

Policy number, primary insured, product, bundle type, written premium, retained percentage, commissionable premium, base commission, VC premium/amount, total commission, agent type, and indicator.

## Review flags

- Negative total commission or chargeback review.
- Nonzero written premium with zero total commission.
- Absolute effective commission rate above 20%, used only as a broad exception threshold.

## Outputs

`summary.json` contains reconciled totals and product/bundle rollups. `action-list.csv` contains exception rows. `run-manifest.json` records source hashes and detected structure. `OWNER-REPORT.html` is the primary branded owner dashboard, `OWNER-REPORT.pdf` is the printable aggregate briefing, and `ACTION-LIST.xlsx` contains a branded dashboard plus a frozen, filterable exception queue.

XLSX date-formatted numeric cells use the workbook's 1900 or 1904 date system. Formula-like strings beginning with `=`, `+`, `-`, or `@` are apostrophe-neutralized in the CSV, while genuine numeric values—including negative commissions—remain numeric.
