---
name: resume
title: Resume the build
description: AI Install resume. Read the session handoff, verify the files it names, and report the exact next step. Use when the owner says resume, where was I, or pick up the build in a new conversation.
stage: any
order: 9
creates: none
---

# Resume the build

Outcome: a fresh conversation is back on the right step in one message. Change no files.

## What to do

1. Read `SESSION-HANDOFF.md`. If it has a different name, such as one with a session number, ask the owner for the exact file name, read that file, and recommend whether it should become the current `SESSION-HANDOFF.md` or stay as a dated archive. Do not rename anything without approval.
2. Verify that every file the handoff names actually exists.
3. Give a concise status:
   - Completed phases, each with the file that proves it.
   - Failed or incomplete tests.
   - Current blockers.
   - Anything the handoff claims that the folder does not support.
   - The exact next command to run.
4. Do not begin the next phase. Wait for the owner to run its command.

## Pass condition

- You found and read the real handoff.
- Every file it names was checked against the folder.
- The status names one exact next step.
- No file was changed.

## If the handoff is missing or wrong

Do not rely on any earlier conversation. Inspect the workspace directly. Report which foundation files exist, which required information appears to be missing, and what must be repaired before the next phase. Change nothing until the owner approves a repair list.
