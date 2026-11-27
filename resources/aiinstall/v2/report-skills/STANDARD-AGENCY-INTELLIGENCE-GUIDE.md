# Standard Agency Intelligence Skill Pack

Five local skills that turn common insurance-agency report exports into branded owner reports, formatted working files, clear summaries, review lists, and next actions.

Pack version: **1.2.0**

The skills work inside your `MY BIZ BRAIN` project in Codex or Claude/Cowork. Your source reports remain on your computer. The pack does not upload reports, contact customers, change policies, or update carrier systems.

## What is included

1. **Agency Quote Conversion** — measures quote-to-bind performance and identifies unbound follow-up opportunities.
2. **Agency Retention Rescue** — organizes termination records into payment, price, and owner-review queues.
3. **Agency Commission Audit** — reconciles commission totals and identifies policy rows that deserve review.
4. **Agency Owner Review** — converts business metrics and new-business reports into an operating brief.
5. **Agency Cross-Sell** — identifies provisional monoline and add-item opportunities that require household verification.

## Install the pack once

1. Open `MY BIZ BRAIN` in Codex or Claude/Cowork.
2. Ask the app: **Read `INSTALL-STANDARD-SKILLS.md` and complete the installation for this platform.**
3. Wait for `SKILLS-INSTALLED.md` to appear.
4. Confirm the receipt says `5/5 skills passed`.
5. Leave `STANDARD-SKILLS` and `SKILLS-INSTALLED.md` in the folder.

The installer places project-local copies in `.agents/skills` for Codex or `.claude/skills` for Claude. You do not need to find or edit those hidden folders.

## The normal way to use a skill

1. Export the relevant report from the carrier or agency system.
2. Leave the export where it already lives, such as Downloads, Documents, or a report folder. Do not copy raw report dumps into `MY BIZ BRAIN`.
3. Open `MY BIZ BRAIN` in Codex or Cowork.
4. Attach the report or point the app to its local file path.
5. Ask for the outcome you want in ordinary language.
6. Open `OWNER-REPORT.html` first, then use `ACTION-LIST.xlsx` as the working file. Review everything before anyone acts on it.

The analyzer accepts `.xlsx`, `.csv`, and `.tsv` exports. By default, it creates a `standard-analysis-runs` folder beside the source report—not inside `MY BIZ BRAIN`.

Each run creates:

- `OWNER-REPORT.html` — the primary, branded Standard Playbook dashboard with KPI cards, visual breakdowns, findings, guardrails, and next actions. It is self-contained and opens in any modern browser.
- `OWNER-REPORT.pdf` — a printable, shareable owner briefing using the same restrained Standard Playbook presentation system.
- `ACTION-LIST.xlsx` — a formatted Excel workbook with a dashboard sheet, filterable action-list sheet, frozen headers, useful number formats, and priority styling.
- `summary.json` — calculated totals, rates, comparisons, and guardrails.
- `action-list.csv` — the local review or follow-up queue.
- `run-manifest.json` — source filename, file hash, detected sheets, header rows, and output names.

The HTML, PDF, and XLSX artifacts use Standard Playbook formatting without a logo: white paper, near-black type, squared editorial structure, and restrained blue accents. They are generated locally without network services or added software. The dependency-free XLSX reader honors date-formatted cells and the workbook's 1900 or 1904 date system while leaving ordinary numeric cells numeric. Every action-list writer neutralizes formula-like untrusted strings beginning with `=`, `+`, `-`, or `@`; genuine numeric values, including negative commission amounts, remain numeric. The run manifest records the pack version and the exact requested output directory, and the analyzer verifies that source hashes did not change.

## 1. Agency Quote Conversion

### Use it for

- Quote-to-bind conversion.
- Producer conversion comparisons.
- Product conversion comparisons.
- Unbound quote follow-up planning.
- Identifying high-volume opportunities that may need attention.

### Best input

A Quotes Detail or Quotes Detail and Conversion Rate export containing production date, producer, product, quoted premium, and issued policy number.

### Starter request

> Analyze this quote-detail report with Agency Quote Conversion. Reconcile the totals, show conversion by producer and product, and give me the top 20 unbound quotes to review. Do not send anything.

### What you receive

- Serious, bound, and unbound quote counts.
- Overall conversion rate.
- Producer and product scorecards.
- Total and unbound quoted premium.
- A local unbound-quote action list ordered by quoted premium.
- Data-quality warnings, including missing producer attribution.

### Important limitation

Quoted premium represents opportunity volume. It is not agency revenue, expected commission, or a promise that a quote can still be sold. Overall counts use unique Quote Control Numbers; missing IDs use a disclosed row-level fallback. Multi-product scorecards use participation counting and therefore need not sum to the overall unique-quote count. A quote is bound when any row with that Quote Control Number has an issued-policy signal. If the export has no issued-policy or equivalent bound field, or the field is present but entirely unpopulated, conversion and unbound measures are unavailable and no follow-up queue is created. In a conversion-capable export with populated signals, an empty issued-policy value means unbound in that export, not proof that the customer never purchased.

## 2. Agency Retention Rescue

### Use it for

- Cancellation and termination review.
- Non-pay rescue planning.
- Renewal price-conversation queues.
- Identifying contactable customers before a termination date.
- Understanding cancellation reasons and premium represented in the audit.

### Best input

A BOB Termination Audit or similar cancellation export containing policy number, termination reason, effective date, premium, phone, and email.

### Starter request

> Run Agency Retention Rescue on this termination report. Separate payment rescues, price conversations, likely non-saveable cases, and owner-review cases. Give me the highest-priority review queue, but do not contact anyone.

### What you receive

- Termination count and premium totals.
- Cancellation categories and top reasons.
- Line-of-business mix.
- Contactability counts.
- A local queue prioritized by category, contactability, and premium.

### Important limitation

The action list is triage, not permission to contact anyone or a promise that a policy can be reinstated. Price classification requires explicit whole words or phrases such as price, pricing, rate, rates, premium increase, or premium dissatisfaction; unrelated words containing those letters are not price signals. Carrier rules and licensed staff control coverage and reinstatement decisions.

## 3. Agency Commission Audit

### Use it for

- Monthly commission reconciliation.
- Negative commission and chargeback review.
- Variable compensation analysis.
- Identifying nonzero premium with zero commission.
- Finding unusual effective commission-rate rows that need explanation.

### Best input

One or more Policy Level Commission Summary exports covering the same agency/entity and compatible reporting periods.

### Starter request

> Audit these commission reports with Agency Commission Audit. Reconcile the report totals, identify negative commission, zero-commission premium, and unusual rate rows, and explain what I should verify. Do not call anything an underpayment without the carrier schedule.

### What you receive

- Written and commissionable premium totals.
- Base, variable, and total commission totals.
- Effective commission rate.
- Product and bundle-type rollups.
- A local exception list with the reason each row was flagged.

### Important limitation

An exception is not proof that the carrier paid incorrectly. A real expected-versus-paid calculation requires the applicable carrier commission schedule, reporting period, agent type, adjustment rules, and any chargeback provisions.

## 4. Agency Owner Review

### Use it for

- Monthly or quarterly operating reviews.
- Book and policy growth.
- Retention and tenure-retention trends.
- Written premium pacing.
- Loss-ratio review.
- New-business product and producer contribution.

### Best input

A Business Metrics Printable View plus, when available, a matching New Business Details export.

### Starter request

> Build my Agency Owner Review from these business-metrics and new-business reports. Tell me what improved, what weakened, the three management questions I should ask, and the next three actions. Use the report's exact periods and do not invent goals.

### What you receive

- An ordered business-metric record by section.
- Current, prior-year, PYE, YTD, 12-month, and 24-month values when supplied.
- New-business policy, item, and premium totals.
- Product and producer contribution.
- A concise owner briefing grounded only in the supplied reports.

### Important limitation

The skill does not invent carrier benchmarks, agency goals, bonus thresholds, or acceptable loss-ratio targets. Supply those separately if you want performance measured against them.

## 5. Agency Cross-Sell

### Use it for

- Provisional monoline review.
- Bundle and multiline opportunity themes.
- Add-item activity.
- Product-mix gaps.
- Preparing a household-verification queue.

### Best input

A complete in-force customer and policy export is best. Policy-level commission and new-business exports can be used for a preliminary review.

### Starter request

> Run Agency Cross-Sell on these reports. Show bundle-type mix, add-item activity, and provisional monoline candidates. Do not create outreach until each household is verified against full in-force data.

### What you receive

- Bundle-type counts.
- Provisional monoline candidate count.
- New-business add-item activity.
- Product mix.
- A local household-verification queue.

### Important limitation

A monthly commission export is not a complete book of business. A monoline policy row does not prove the household has only one policy across every carrier, account, or producer code. Verify every candidate before outreach.

## Safety rules for every skill

1. Nothing sends to staff, clients, or prospects without the agency owner's sign-off.
2. Never invent numbers. Use the source report or state that the number is unavailable.
3. Never change pricing, commission, compensation, accounting, or carrier-system data.
4. Never confirm coverage, quote a rate, promise reinstatement, or bind a policy.
5. Keep raw reports and customer-level action lists local.
6. Treat every output as a review aid for the agency owner or appropriately licensed team.

## If a report is not recognized

Ask the app to show which sheets and headers it found. Confirm that the export contains the fields listed for the intended skill. If the carrier changed its report format, stop rather than guessing and provide a sanitized header list so the field mapping can be updated.

## Good requests are short

You do not need a giant prompt. Name the outcome, identify the file, and state the approval boundary:

> Analyze this report, give me the local review list, explain the three most important findings, and do not send or change anything.

The installed skill supplies the repeatable workflow, calculations, outputs, and safety rules.
