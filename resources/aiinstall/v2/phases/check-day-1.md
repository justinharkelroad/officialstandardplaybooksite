---
name: check-day-1
title: Day 1 completion check
description: AI Install Day 1 completion check. Read-only check that the five foundation files exist and were tested. Use when the owner says check day 1, day 1 complete, or am I ready for day 2. Run in a fresh conversation.
stage: day-1
order: 8
creates: none
---

# Day 1 completion check

Outcome: a read-only verdict on whether the Day 1 foundation is finished. Do not change, create, or move any file.

## What to do

1. Confirm each of these files exists: `about-me.md`, `brand-voice.md`, `working-preferences.md`, `content-strategy.md`, `team-members.md`, and `SESSION-HANDOFF.md`.
2. Confirm that all four safety rules appear in `working-preferences.md`.
3. For each of the five phases, state whether the file was tested and what the test showed. Use only what the workspace and the handoff record.
4. List anything that is missing, incomplete, or contradictory. Identify missing information instead of filling it in.
5. Cite the file you used for every answer.
6. End the body of your reply with exactly one of these two lines, then the receipt:
   - `DAY 1 COMPLETE`
   - `DAY 1 NOT COMPLETE`

Do not return `DAY 1 COMPLETE` if any file is missing, any safety rule is absent, or any phase is untested.

## Pass condition

- All six files exist.
- All four safety rules appear in `working-preferences.md`.
- Every one of the five phases is recorded as tested.
- Nothing is contradictory.

## If the result is DAY 1 NOT COMPLETE

Tell the owner to repair only the phase that is missing or failing, run that phase's test again, update the handoff, and run this check again in a fresh conversation.
