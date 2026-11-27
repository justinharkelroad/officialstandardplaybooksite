---
name: cold-test
title: Cold memory test
description: AI Install cold memory test. Prove a fresh conversation can find the truth from the master file alone. Use when the owner says cold test, load test, or memory test. Run only in a brand new conversation.
stage: day-2
creates: none
---

# Cold memory test

Outcome: proof that the memory system works without this conversation knowing anything in advance. The memory system is not proven in the conversation that built it.

## Before you start

If this conversation has already discussed the owner's team or projects, stop. Tell the owner to start a completely fresh conversation connected to the same folder and run this command there. Report the result as FAIL with the reason "not a fresh conversation".

## What to do

1. Read `{{MASTER_FILE}}` at the root of the folder and follow its file pointers. Read nothing else first.
2. Ask the owner for one real team member's name. Do not ask anything else about them. Answer: who this person is, what they own, and what current context matters when the owner communicates with them. Cite the workspace file you used.
3. Ask the owner for one real project name. Answer: the one number, current status, blocker, and next milestone. Cite the workspace file you used. If anything is missing, say so.
4. Ask the owner to compare both answers to the source files and tell you whether each one is correct.
5. Change no files during this command.

## Pass condition

- This ran in a fresh conversation.
- You followed the master file pointers without being told the answers.
- The team answer matches the source file.
- The project answer names the correct number, status, blocker, and next milestone.
- Missing information stayed missing.
- You cited the correct local workspace files.

## If the test fails

Diagnose without guessing. Check, in order: whether the correct workspace folder is connected; whether `{{MASTER_FILE}}` is named correctly and sits at the root; whether its pointers match real paths; whether the fact exists in the source file. Report the confirmed problem and the smallest fix. Do not fix it in this conversation. The owner fixes it, then runs this command again in another fresh conversation.
