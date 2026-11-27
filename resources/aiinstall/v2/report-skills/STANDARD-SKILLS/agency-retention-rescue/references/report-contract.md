# Retention Rescue Report Contract

## Recognized fields

Policy and timing, termination reason, new and old premium, line code, phone, and email. The analyzer normalizes punctuation and matches complete words or phrases. It groups explicit non-pay/payment language as `Payment rescue`; `price`, `pricing`, `rate`, `rates`, premium-increase language, and explicit premium dissatisfaction as `Price conversation`. Partial substrings do not qualify, so `separate policies` and `separate household account` remain owner review unless another explicit price signal is present.

## Outputs

- `summary.json`: termination count, premium totals, category/reason mix, line mix, and contactability.
- `action-list.csv`: local customer-level queue with reason, contact fields, premium change, and priority.
- `run-manifest.json`: source hashes and detected report structure.
- `OWNER-REPORT.html`: primary branded owner dashboard with aggregate KPIs, reason mix, findings, and next actions.
- `OWNER-REPORT.pdf`: printable aggregate owner briefing.
- `ACTION-LIST.xlsx`: branded dashboard plus a frozen, filterable local retention queue with priority styling.

## Interpretation

`Premium New` is the report's premium value associated with the terminating record. Describe it as premium represented in the audit, not guaranteed saved premium or agency revenue.

XLSX date-formatted numeric cells are converted using the workbook's declared date system. Formula-like strings beginning with `=`, `+`, `-`, or `@` are apostrophe-neutralized in `action-list.csv`; real numeric values remain numeric.
