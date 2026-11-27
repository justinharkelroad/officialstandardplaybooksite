---
name: team-pack
title: Team-safe pack
description: AI Install team pack. Build a separate, team-safe copy of the parts of the brain the team should have, with private material left out. Use when the owner says team pack, share with my team, team version, or team-safe.
stage: after
order: 20
creates: team-pack/ folder
---

# Team-safe pack

Outcome: a separate folder the owner can hand to the team, holding only what the team should have. The team never receives the owner's brain. Separate access before sharing, not after.

## What to do

1. Run a read-only sharing audit of the folder. Classify every top-level file and folder as one of:
   1. Owner-only.
   2. Team-safe.
   3. Contains customer or sensitive data.
   4. Unclear, needs the owner's decision.
2. These are always owner-only and never go in the pack, whatever the owner says in this conversation: `about-me.md`; `team-members.md` and everything in `memory/people/` (they hold strengths, development areas, and private context about individuals); anything about compensation, commission, pay, discipline, or performance; `SESSION-HANDOFF.md`; the `morning-brief/` and `upkeep/` folders; any file holding a customer name, policy number, phone number, or email; any password or key.
3. Show the audit as a table. Ask the owner to decide each "unclear" item, one at a time.
4. Propose the pack contents. A typical pack holds:
   - The team-facing voice rules from `brand-voice.md`: tone for clients and prospects, phrases to use, the never-say list. Leave out how the owner talks to the team.
   - `glossary.md`.
   - The four safety rules, written for a team member: nothing sends without the owner's sign-off, never invent numbers, never touch pricing, commission, or comp, never confirm coverage, quote a rate, or bind anything in a draft.
   - Any process or skill the owner marks team-safe.
   - Any project file the owner chooses to share, with open decisions and private notes removed.
5. List every file that will be in the pack and every file that will not, and wait for the owner to approve the list.
6. Build `team-pack/` inside the folder. Write new files there. Do not move or change any original.
7. Write `team-pack/{{MASTER_FILE}}` as the index for the team workspace: what this pack is, the safety rules, and a pointer line for every file in it.
8. Search the finished pack for the owner-only items in step 2 and for anything that looks like compensation, a development note, or customer detail. Report what you searched for and what you found. Remove anything found and tell the owner.
9. Tell the owner the last step is theirs: copy `team-pack/` out of `MY BIZ BRAIN` to wherever the team will use it. Do not share, upload, sync, or send it yourself.

## Test

Ask the owner to name one thing the team must never see. Search `team-pack/` for it and show the result. Then open two files in the pack at random and read them with the owner.

## Pass condition

- The owner approved the exact list of included and excluded files before the pack was built.
- `team-pack/` exists, and none of the always-owner-only files are in it.
- No original file was moved or changed.
- The search in step 8 was run and its result shown.
- Nothing was shared, uploaded, or sent.

## If something goes wrong

- The owner wants to include something from the always-owner-only list: do not add it. Explain that the pack is built so it can be handed over without review, and offer to write a new, team-safe version of that information instead.
