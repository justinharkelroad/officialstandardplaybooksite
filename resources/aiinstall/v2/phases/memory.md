---
name: memory
title: Memory system and master file
description: AI Install memory system. Build the master index file and the memory folders, then walk the glossary. Use when the owner says memory system, master file, build my index, or glossary walk.
stage: day-2
order: 12
creates: the master file, memory/people/, memory/projects/, memory/context/company.md
---

# Memory system and master file

Outcome: a master file at the root of `MY BIZ BRAIN` that works as an index, plus memory folders that point back to real source files. The master file is an index, not a storage closet. Every line either states a core fact or points to the file that has the detail.

## What to do

1. Read every file in the folder. Read `{{STARTER_FILE}}` for the shape of the master file.
2. Create `{{MASTER_FILE}}` at the root as an index:
   - One line on who the owner is.
   - The team as a table.
   - Active projects with one-line statuses and next milestones.
   - The four safety rules.
   - Key terms, pointing to the glossary.
   - A pointer line for every other file in the folder.
3. Create `memory/` with:
   - `memory/people/`: one file per team member, seeded from `team-members.md`.
   - `memory/projects/`: one file per active project.
   - `memory/context/company.md`: carrier situation, tools, and how the agency runs.
4. Walk `memory/glossary.md` one term at a time. For each term ask the owner to choose KEEP, CORRECT, or REMOVE. For a kept or corrected term, ask how it is actually used in this agency and whether that differs from a carrier, industry, or software definition.
5. After the existing list, interview the owner for internal shorthand, campaign names, team nicknames, carrier abbreviations, scorecard language, and any word that would be misunderstood outside this agency. Do not add a term until the owner approves its exact definition.
6. Audit the master file as an index. For every section, say whether it contains a core fact, a valid pointer, unnecessary detail, a broken path, or unsupported information. Recommend the smallest corrections and make only the ones the owner approves. Do not turn the master file into a copy of the detailed files.
7. Tell the owner to start a fresh conversation and run the cold test.

## Pass condition

- `{{MASTER_FILE}}` exists at the root of the folder.
- It acts as an index, not a copy of every source file.
- Its team and project pointers resolve to real files.
- All four safety rules appear in it.
- `memory/people/`, `memory/projects/`, `memory/context/company.md`, and `memory/glossary.md` exist.
- The glossary reflects the owner's language, not only the starter definitions.
- The index audit finds no broken paths and no unsupported facts.

## If something goes wrong

- The master file is getting long: reduce it to core facts and valid pointers. Move no information and delete nothing. Show which sections stay in the index and which details already live in source files, and wait for approval.
