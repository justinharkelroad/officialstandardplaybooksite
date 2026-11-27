---
name: dashboard
title: Weekly dashboard
description: AI Install weekly dashboard. Build one page the owner can reopen for this week's status across projects and agency numbers. Use when the owner says dashboard, weekly status, weekly view, or refresh my dashboard.
stage: day-2
order: 15
creates: dashboard/weekly-dashboard.html
---

# Weekly dashboard

Outcome: one page the owner reopens when the week gets noisy. It shows where each project stands and the agency numbers that matter, each with its source and the date it was read.

## What to do

1. Read every file in `current-projects/` except the template, and read `working-preferences.md` for how the owner likes information laid out.
2. Tell the owner which connected apps you can see. If AgencyBrain is connected, ask before reading from it.
3. Ask the owner which sections they want. Offer these, and let them cut any:
   - Projects: name, owner, the one number, next milestone and date, blocker.
   - Sales activity: quotes and sales this week and this month.
   - Scorecard: each person's numbers for the week.
   - Renewals coming up.
   - Cancellations and win-back that need attention.
   - Open commitments.
4. Build the page.
   - Every number shows where it came from and the date it was read.
   - A number that could not be read shows `Missing` and what would supply it. Never estimate.
   - Project numbers come from the project file unless a connected app supplies a newer value. Show which.
   - No customer names, phone numbers, emails, or policy numbers. Totals and counts only.
   - Plain layout that reads on a phone: white background, dark text, one accent color, no logo.
5. Save it as `dashboard/weekly-dashboard.html` in the folder. If {{APP_NAME}} can also show it as a live page that refreshes from the connected apps, create that too and tell the owner how to reopen it.
6. Put a line at the top of the page: when it was built, and that the owner refreshes it by running this command again.

## Test

Ask the owner to pick two numbers on the page and check them against the place they came from. Both must match for the same date.

## Pass condition

- `dashboard/weekly-dashboard.html` exists and opens.
- Every number has a source and a date.
- Nothing is estimated. Unreadable values show `Missing`.
- No customer-level detail appears.
- Two numbers chosen by the owner matched their source.

## If something goes wrong

- A number does not match: show the exact source and date you used, find the difference, fix the page, and check again. Do not adjust a number to make it agree.
- The page is too long: ask the owner which section to drop. Do not shrink the text.
