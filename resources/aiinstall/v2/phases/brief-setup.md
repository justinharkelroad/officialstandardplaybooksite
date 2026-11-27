---
name: brief-setup
title: Morning brief setup
description: AI Install morning brief setup. Write the approved brain summary and create the scheduled morning brief that runs with the computer off. Use when the owner says morning brief, brief setup, daily brief, or update my brief.
stage: day-2
order: 14
creates: morning-brief/brief-instructions.md and one scheduled task
---

# Morning brief setup

Outcome: a morning brief that arrives every workday whether or not the owner's computer is on.

A scheduled task runs away from this computer. It cannot open the `MY BIZ BRAIN` folder. So the task has to carry what it needs. This command writes a short summary of the brain, gets the owner's approval of the exact text, and puts that text inside the scheduled task. The task then pulls live information from the owner's connected apps each morning.

This is the one AI Install command that creates something outside the folder: one scheduled task. Create nothing else outside the folder.

## What to do

1. Read `{{MASTER_FILE}}`, `working-preferences.md`, `team-members.md`, and every file in `current-projects/` except the template. If `{{MASTER_FILE}}` does not exist, stop and tell the owner to run the memory step first.
2. Draft the brain summary. Keep it under 400 words. Include only:
   - One line on who the owner is and what the agency is.
   - The team as a short list: first name, role, and what each person owns.
   - Each active project: its name, its one number with the date it was last recorded, its next milestone, and its blocker.
   - How the owner wants output delivered, from `working-preferences.md`.
   - The four safety rules, word for word.
3. Leave these out of the summary, always: compensation, commission, discipline or performance notes, personal history, any customer name or policy detail, and anything the owner marked private. If you are unsure whether something is private, leave it out and say so.
4. Show the summary and say plainly: "This text will be stored with the scheduled task, outside your computer. Nothing else from your folder will be." Ask what to remove or change. Do not continue until the owner approves the exact text.
5. Ask three questions, one at a time: what time the brief should arrive, in which time zone, and on which days.
6. Tell the owner which connected apps you can see in this session: calendar, email, and AgencyBrain. List the ones that are missing. The brief works with whatever is connected and says what it could not check.
7. Write the task instructions. They must contain, in this order:
   - The approved summary.
   - What to do each run: read today's calendar; read email from the last day for anything that needs the owner; and, if AgencyBrain is connected, read yesterday's quoting and sales activity, the current scorecard numbers, renewals coming up, cancellations and win-back that need attention, and open commitments.
   - What to produce: the three things that matter most today; where each project's number stands against the last recorded value; one team message worth preparing, as a draft; commitments due; and anything that looks off pace.
   - The rules for every run: name the source and date of every number; if something could not be read, say so and never estimate it; never send, reply, pay, sign, delete, or change anything; drafts are for the owner to review; no customer names unless the owner asked for them.
   - The output format the owner prefers, kept short enough to read on a phone.
8. Save the full task instructions to `morning-brief/brief-instructions.md` in the folder, with the date and the schedule at the top, so the owner has a record of exactly what was sent.
9. Create the scheduled task in {{APP_NAME}} with those instructions and the schedule. If you cannot create it yourself, tell the owner exactly where the scheduling screen is in {{APP_NAME}} and give them the instructions to paste. Do not report the task as created unless you created it or the owner confirms they did.
10. Ask the owner how any scheduled task should treat approvals. Set it to ask before every action that sends, pays, signs, or deletes, unless `working-preferences.md` records a different answer.

## Test

Run the brief once now, in this conversation, using the same instructions and the same connected apps. Ask the owner to grade it: is every number real and sourced, is anything invented, is it short enough, and did it stay inside the approval rules.

## Pass condition

- The owner approved the exact summary text before anything was created.
- The summary contains none of the excluded categories.
- `morning-brief/brief-instructions.md` exists and matches what was put in the task.
- The scheduled task exists, and the owner confirmed the time, time zone, and days.
- The test brief was graded by the owner, with no invented number and nothing sent.

## If something goes wrong

- The brief names a number it could not have read: remove it, and tighten the instructions so every number needs a source. Run the test again.
- The owner's brain changed: run this command again. It replaces the summary inside the task and updates `morning-brief/brief-instructions.md`. Do not create a second task.
- No calendar, email, or AgencyBrain is connected: the brief can only restate the summary. Say that plainly, and tell the owner which connection would add the most.
