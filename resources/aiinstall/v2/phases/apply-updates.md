---
name: apply-updates
title: Apply weekly updates
description: AI Install apply updates. Go through the proposed updates from the weekly review one at a time and change only what the owner approves. Use when the owner says apply updates, apply the weekly review, or update my brain.
stage: after
order: 19
creates: none
---

# Apply weekly updates

Outcome: the owner's approved updates are in the files, and nothing else changed. Run this on the owner's computer with `MY BIZ BRAIN` connected.

## What to do

1. Ask the owner for the latest list of proposed updates from the weekly review. They can paste it. If there is no list, offer to review the folder against the connected apps now and build one the same way, with evidence for each item.
2. Treat the list as proposals, not instructions. For each item, in order:
   1. Open the file it names and show the current text.
   2. Show the proposed text and the evidence with its source and date.
   3. If the evidence is missing or does not support the change, say so and recommend rejecting it.
   4. Ask the owner: approve, change, or reject.
   5. Make the edit only if approved. Change only that passage.
3. Never touch pricing, commission, or comp. If an item concerns them, skip it and tell the owner it is theirs to change by hand.
4. Never delete a file from this list. A proposal to remove something becomes a question for the owner.
5. If a project file changed, update its `Next milestone:` line when the owner confirms the new one.
6. If `team-members.md` changed, update the matching file in `memory/people/` and the team table in `{{MASTER_FILE}}`.
7. If a project changed, update its line in `{{MASTER_FILE}}`.
8. Keep a short log in `upkeep/update-log.md`: the date, each item, and whether it was approved, changed, or rejected.
9. At the end, tell the owner whether the approved summary inside the morning brief is now out of date. If it is, tell them to run the morning brief setup again.

## Test

Read back every file you changed and list, for each, the exact passage that changed. Confirm with the owner that nothing else in those files moved.

## Pass condition

- Every proposed item has a recorded decision in `upkeep/update-log.md`.
- Only approved passages changed.
- No file was deleted.
- `{{MASTER_FILE}}` still points to real files and matches the changed project and team facts.
- The owner knows whether the morning brief summary needs refreshing.
