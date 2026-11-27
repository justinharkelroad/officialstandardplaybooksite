---
name: check-day-2
title: Day 2 completion check
description: AI Install Day 2 completion check. Read-only check of projects, memory system, and cold tests. Use when the owner says check day 2, day 2 complete, or final check. Run in a fresh conversation.
stage: day-2
creates: none
---

# Day 2 completion check

Outcome: a read-only verdict on whether the Day 2 build is finished. Do not change files. Do not begin another build.

## What to do

1. Read `SESSION-HANDOFF.md` and verify that every file it names actually exists.
2. Confirm whether each of these is true, citing the file you used:
   1. At least two project files exist in `current-projects/`, not counting the template.
   2. Each project has an outcome, an owner, a useful number or a `Missing` label, a deadline, a blocker, and a dated next milestone.
   3. `{{MASTER_FILE}}` exists at the workspace root.
   4. `memory/` contains `people/`, `projects/`, `context/company.md`, and `glossary.md`.
   5. The master file index has no broken pointers and no unsupported facts.
   6. A fresh-conversation person test passed.
   7. A fresh-conversation project test passed.
   8. `SESSION-HANDOFF.md` records the current Day 2 state.
3. List anything missing, incomplete, unsupported, or untested.
4. End the body of your reply with exactly one of these two lines, then the receipt:
   - `DAY 2 COMPLETE`
   - `DAY 2 NOT COMPLETE`

Do not return `DAY 2 COMPLETE` if any of the eight items is false or untested.

## Pass condition

- All eight items above are true and supported by a file.

## If the result is DAY 2 NOT COMPLETE

Tell the owner to repair only the missing step, rerun that step's test, update the handoff, and run this check again in a fresh conversation.
