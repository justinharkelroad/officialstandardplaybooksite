---
name: cleanup
title: Pre-index cleanup
description: AI Install pre-index cleanup. Audit the workspace for duplicates, conflicts, and stale files before the memory system is built. Use when the owner says cleanup, pre-index audit, or clean the workspace.
stage: day-2
order: 11
creates: none
---

# Pre-index cleanup

Outcome: the workspace is clean before the master file is built. The master file becomes the table of contents for the business, so every duplicate and conflict gets a deliberate decision first.

## What to do

1. Audit every file in the workspace. Change nothing yet. List:
   1. Duplicate files.
   2. Conflicting facts.
   3. Missing source files.
   4. Files whose names or paths are unclear.
   5. Information that appears stale.
2. For each conflict, ask the owner one question at a time to choose the source of truth.
3. For each duplicate, ask for one decision: keep, archive, merge, or remove.
4. Present the full list of proposed changes grouped by type. Ask for approval one group at a time. Do not accept "yes to all" without restating what will change.
5. Make only the approved changes. Never delete a file because it looks old. Leave the starter files in place.
6. List the exact paths of the current project files and the five Day 1 foundation files.

## Pass condition

- Every duplicate has a deliberate keep, archive, merge, or remove decision.
- Every factual conflict has one approved source of truth.
- No file was deleted or overwritten without the owner's approval.
- You can name the current project files and the Day 1 foundation files by exact path.
