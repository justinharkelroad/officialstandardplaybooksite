---
name: ready
title: Pre-work readiness check
description: Run the AI Install pre-work readiness check. Use when the owner says ready, readiness check, pre-work check, or wants to confirm their MY BIZ BRAIN setup before the workshop.
stage: prework
creates: READY.txt
---

# Pre-work readiness check

Confirm this computer is ready for the workshop. Change nothing except creating `READY.txt`.

## What to do

1. List the files and folders you can see in the connected folder. If the folder is not named `MY BIZ BRAIN`, stop and say so.
2. Check each item below and report it as OK or NOT YET, with one plain sentence on what to do for each NOT YET:
   - The starter files are present: `{{STARTER_FILE}}`, `working-preferences-STARTER.md`, `memory/glossary.md`, `current-projects/_project-template.md`.
   - Raw material is present: 5 to 10 writing samples, a team roster, a list of active projects, agency basics, and a list of paid tools. A `gathered-materials` folder is fine.
   - Nothing in the folder looks like a password, account key, API key, or login credential. If anything does, name the file and stop. Do not print the value.
   - No raw book exports or large report dumps are in the folder.
3. Ask the owner for their first and last name.
4. Create `READY.txt` in the folder containing exactly: `AI Install <FIRST NAME> <LAST NAME> ready.`
5. Tell the owner which connectors you can see in this session (calendar, email, AgencyBrain). Do not call any of them. If AgencyBrain is not connected, say that owners on AgencyBrain Plus or higher, and Boardroom members, can connect it from AgencyBrain Settings, and that it is optional.
6. Tell the owner the last step: take one screenshot showing `MY BIZ BRAIN` open in {{APP_NAME}} with `READY.txt` visible, and submit it at https://standardplaybook.com/aiinstall/ready.

## Pass condition

- The connected folder is `MY BIZ BRAIN`.
- All four starter files are present.
- All five kinds of raw material are present.
- No credentials and no raw exports are in the folder.
- `READY.txt` exists with the owner's name.

## If something goes wrong

- You cannot see the folder: tell the owner to reconnect `Documents > MY BIZ BRAIN` in {{APP_NAME}} and run this command again. Do not create `READY.txt` anywhere else.
- Starter files are missing: tell the owner to copy the starter pack into the folder, keeping the `memory` and `current-projects` folders.
