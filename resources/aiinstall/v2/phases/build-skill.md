---
name: build-skill
title: Build one custom skill
description: AI Install custom skill. Interview the owner about one repeatable agency process and turn it into a reusable skill. Use when the owner says build a skill, custom skill, teach it my process, or make this repeatable.
stage: day-2
order: 16
creates: one skill folder with a SKILL.md
---

# Build one custom skill

Outcome: one process the owner explains over and over becomes a skill the AI runs the same way every time. One skill, one process. Do not build a second in the same conversation.

## What to do

1. Ask the owner which process they want. If they are unsure, read `working-preferences.md` for their biggest time drains and offer three candidates. A good first skill is something done at least weekly, with clear steps, that ends in a draft or a list. Let the owner choose.
2. Interview the owner one question at a time. The owner may be speaking. Cover:
   1. What starts this process. What does the owner say or receive that means "do this now"?
   2. What goes in: which files, reports, or connected apps.
   3. The steps, in order, the way the owner actually does them.
   4. What comes out, and what "good" looks like. Ask for a real past example if one exists.
   5. What must never happen in this process.
   6. Where the AI must stop and wait for the owner.
3. Choose a short name in lowercase words joined by hyphens, for example `renewal-call-prep`. Confirm it with the owner.
4. Write the skill at `{{SKILLS_DIR}}/<name>/SKILL.md`. It needs:
   - A `name` line and a `description` line at the top. Write the description as the situations in which the owner would want this, in their words.
   - What it is for, in two sentences.
   - Inputs.
   - The steps, numbered.
   - The output and its format.
   - Guardrails: the owner's "never" list from the interview, then the four safety rules.
   - Where to stop for approval.
5. The skill must follow `brand-voice.md` for anything written to people, and must never send anything. It produces drafts and lists for the owner.
6. If the process needs a report, the skill points at the report where it lives. It never copies a raw report into the folder.
7. Show the skill and ask what to correct. Save after approval.
8. If a skill with that name already exists, do not overwrite it. Compare the two, say what differs, and wait.

## Test

Ask the owner for one real, current case. Run the skill on it. The owner grades the result against how they would have done it. For each correction, state the rule behind it and update the skill only after the owner approves the change.

## Pass condition

- The skill file exists at `{{SKILLS_DIR}}/<name>/SKILL.md`.
- It has a name, a description, inputs, numbered steps, an output, guardrails with the four safety rules, and a stopping point.
- It ran on one real case and the owner accepted the result.
- Nothing was sent.

## If something goes wrong

- The result is generic: the steps are too vague. Ask the owner to walk through the real case out loud and rewrite the steps from what they say.
- The process turns out to be two processes: finish the first, and list the second as a follow-up.
