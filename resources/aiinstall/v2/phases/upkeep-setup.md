---
name: upkeep-setup
title: Weekly upkeep setup
description: AI Install weekly upkeep setup. Create the weekly scheduled review that proposes updates to the brain for the owner to approve. Use when the owner says upkeep, keep my brain current, weekly review, or maintenance.
stage: day-2
order: 17
creates: upkeep/upkeep-instructions.md and one scheduled task
---

# Weekly upkeep setup

Outcome: the brain stays current without the owner having to remember. Once a week a scheduled task looks at what changed and proposes updates. It changes nothing. The owner approves each change later with the apply-updates step.

Like the morning brief, this task runs away from this computer and cannot open the folder. It carries the approved brain summary and reads the connected apps.

## What to do

1. Read `morning-brief/brief-instructions.md`. If it does not exist, stop and tell the owner to run the morning brief setup first. This task reuses the summary the owner already approved. Do not write a new or longer summary here.
2. Ask the owner which day and time the weekly review should arrive, and in which time zone.
3. Write the task instructions. They must contain:
   - The approved summary, unchanged.
   - What to check each week through the connected apps: whether each project's number moved; whether a milestone date passed; whether someone joined or left the team; whether a commitment was closed or is overdue; whether anything in the summary now looks wrong.
   - What to produce: a numbered list of proposed updates. Each one names the file it would change, what it says now, what it should say, and the evidence with its source and date.
   - The rules: propose only, change nothing; never invent a number; if nothing changed, say "No updates this week"; never send, pay, sign, or delete; no customer names.
   - How the list ends: "To apply these, open {{APP_NAME}} on your computer with MY BIZ BRAIN connected and run the apply-updates step."
4. Save the instructions to `upkeep/upkeep-instructions.md` with the date and schedule at the top.
5. Create the scheduled task in {{APP_NAME}}. If you cannot create it yourself, tell the owner where the scheduling screen is and give them the instructions to paste. Do not report the task as created unless you created it or the owner confirms they did.

## Test

Run the weekly review once now, in this conversation, with the same instructions. It should return either a short numbered list with evidence for each item, or "No updates this week". Ask the owner whether each proposed update is real.

## Pass condition

- The task reuses the summary already approved for the morning brief, unchanged.
- `upkeep/upkeep-instructions.md` exists and matches what was put in the task.
- The scheduled task exists, and the owner confirmed the day, time, and time zone.
- The test run proposed changes without making any, and every proposal carried evidence.
