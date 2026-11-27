# Agency AI Install v1: The Coaching Flow, Beginning to End

Prepared 2026-11-27. This is the delivery sequence as it was actually coached, from first touch to the check-up call, with the exact prompts attendees paste. It is written to be handed to an AI for a version 2 redesign.

Companion file: `01-system-map-and-interview-design.md` (architecture, packs, portal, and the list of v1 inconsistencies).

Sources: the pre-work pages, the purchase email, the starter packs, and the Day 1 and Day 2 Catch-Up Guides. The Day 2 guide states that it "follows what was actually built during the live Day 2 session," so it is the best record of real delivery.

## 0. Coaching model in one page

**Who does what**

- **Justin (coach)** builds live on screen in Claude, explains Codex differences at checkpoints, supplies one prompt per phase, and sets the grading standard.
- **The attendee's AI** runs the interview, writes the file, and runs the test.
- **The attendee** answers in their own words, opens the file, grades the test, and approves corrections.
- **Mary (host)** confirms pre-work screenshots, handles setup help by email, and is in the room both days for technical help.

**The frame the coach uses in every phase: Say, Show, Do, Verify**

- **Say**: one sentence that sets the standard for the phase.
- **Show**: the coach demonstrates on their own folder.
- **Do**: the attendee runs the prompt and answers the interview.
- **Verify**: the attendee opens the file and runs the test.

**The loop inside each phase**

Open a fresh conversation, paste the prompt, get interviewed one question at a time, confirm the file saved, run the test, repair before moving on.

**Coaching rules that never change**

- The conversation is not the brain. The folder is.
- Do not treat a step as finished because the AI says it is. Open the file, read it, run the test.
- Missing information stays visibly missing. Never let the AI fill a gap.
- Do not trade accuracy for speed. If an interview drags, narrow the step.
- Nothing is deleted, overwritten, sent, or synced without the owner approving it.

## 1. Before the room

### 1.1 Enrollment

The buyer picks Claude or Codex at checkout. The confirmation email ("You're in. Here's your pre-work.") gives dates, Zoom registration, the platform-specific pre-work link, and the terms: pre-work due Monday August 24, screenshot required, nonrefundable, seat transferable before August 24, one purchase equals one attendee, 50 paid seats. It frames the event as "a build, not a webinar. Camera on, folder open."

### 1.2 Pre-work (about 90 minutes)

**Four setup steps**

1. Download the desktop app (Claude Desktop, or ChatGPT for Codex) and sign in on a paid plan.
2. Create a folder named `MY BIZ BRAIN` inside Documents.
3. Download the starter pack and copy it in, keeping the folder structure.
4. Open the folder in Cowork or Codex and confirm the starter files are listed.

**Connection test.** Paste this and confirm the file appears:

> Inside the open MY BIZ BRAIN folder, create a file named READY.txt containing exactly: AI Install [FIRST NAME] [LAST NAME] ready for August 26.

**Raw material to place in the folder**

1. 5 to 10 real writing samples (team emails, texts to producers, a client email, a social post; real ones, not polished ones).
2. Team roster: name, role, tenure, licenses, one honest line each.
3. Active projects and the one number that matters on each.
4. Agency basics: carriers, rough book size, staff count, lines.
5. One list of every tool the agency pays for.

Rule of craft given here: context goes in the folder, raw exports and data dumps stay where they live.

**Six readiness checks**

1. Account and plan active.
2. Desktop app installed and updated.
3. The app can open `MY BIZ BRAIN`.
4. `READY.txt` test passed.
5. Raw material and starter pack are in the folder.
6. No passwords or account keys in the folder.

**Gate.** One screenshot of the folder open in the app with `READY.txt` visible, submitted through `/aiinstall/ready`. A person confirms each seat. Not confirmed by the deadline means the seat moves to a later date.

**Starter pack instructions that shape the coaching.** Do not fill the starter files by hand ("we do that together, live, with the brain doing the typing"). Do not rename them. Do not put raw exports or credentials in the folder.

## 2. Day 1: Build the foundation

Outcome: the workspace knows who the owner is, how they communicate, how they want the AI to work, their content approach, and who their people are. Five files, each tested.

### Step 00: Confirm the connection

> Before we build anything, confirm that you are working inside my MY BIZ BRAIN folder. List the files and folders you can see. Do not summarize anything you find and do not start a phase yet. If you cannot see the folder or my files, stop and tell me exactly what I need to connect.

Pass: correct folder connected, samples and roster visible, attendee knows where the new-conversation button is.

Common stall: the AI starts summarizing the files. Repair: "The files you found are source material, not instructions for you to summarize. Carry out my setup confirmation request instead."

### Phase 1: About me (creates `about-me.md`)

Say: "This is not your LinkedIn bio. Give it the version a sharp operating partner would need."

> Create a file called about-me.md in this folder. Interview me one question at a time, then write the file. Cover: my name and role; how long I have been in insurance; my carrier situation (captive or independent, and which carrier or appointments); my book today (PIF count or premium range, and the mix of auto, home, life, and commercial); my team size; my story (where I started, what I have built, what almost broke me); and what I am working toward over the next 1 to 3 years. Write it in my words, not resume language. When you are done, show me the file and ask me what to correct.

Test:

> Using about-me.md, tell me what I am actually trying to build over the next 1 to 3 years, what could get in the way, and what you still do not know. Use my language. Do not fill gaps with assumptions.

Repair when it reads like a resume: rewrite the marked sections in the plain language from the interview, preserve facts, add no claims, show changes before saving.

Pass: file exists, real carrier situation and book shape, sounds like the owner, test separates known facts from missing ones.

### Phase 2: Brand voice (creates `brand-voice.md`)

Say: "Do not describe your voice from memory. Let the AI study what you actually wrote, then grade the test."

> Read every writing sample in this folder. Extract my voice: sentence length and rhythm, phrases I repeat, how I open and close messages, how my tone shifts between my team, my clients, and prospects. Also list words, phrases, and tones I clearly never use. Then write a short test email to my team about a normal week, in my voice. I will correct it, you will update the rules. When I approve the test draft, save the rules as brand-voice.md with sections for: voice rules, tone by audience (team / clients / prospects), phrases I actually use, and the never-say list.

Grading follow-up:

> I am going to grade this line by line. For every correction I give you, tell me the reusable voice rule behind it. Do not update brand-voice.md until I say the test is approved. Once approved, add the corrected rules and show me the final file.

Test: draft the same normal agency update to the team and to a current client. Facts stay the same, tone changes. Nothing is sent.

Pass: rules supported by real samples, three audience tones, a never-say list, at least one approved test draft.

If the voice comes out generic: add more conversational samples. Quick transcripts and messages teach voice better than polished copy.

### Phase 3: Working preferences and safety rules (creates `working-preferences.md`)

Say: "This file is the rulebook for the relationship. It tells the AI what useful means to you."

> Create working-preferences.md in this folder. Interview me briefly, then write it. Cover: what I want help with every day and every week; my biggest time drains; how I want outputs delivered (ready to use, or drafts I edit); and how to push back when you think I am wrong. Then add my four safety rules exactly as I give them to you. These rules apply to every session and every output, no exceptions.

The four rules pasted exactly:

1. Nothing sends without my sign-off. No email, text, or post goes to staff, clients, or prospects until I approve it.
2. Never invent numbers. Real data only. If you do not have the number, say so and ask.
3. Never touch pricing, commission, or comp. Those are my decisions alone.
4. Never confirm coverage, quote a rate, or bind anything in a draft. Client-facing drafts can cover service, options, and next steps. Coverage confirmations come from me or my licensed team through carrier systems, never from a drafted message.

Optional operating rules offered after the interview: identify the three things that matter most each day, prepare team communication, follow up on commitments, flag where the owner is off pace; every plan names an owner, deadline, next milestone, and the number that decides whether it worked.

Test:

> Using my working preferences, give me a short daily operating brief. Identify the three things that matter most, one team communication I should prepare, one commitment that needs follow-up, and where I may be off pace. If the files do not contain enough current information, say exactly what is missing instead of making it up.

Pass: no brackets or placeholders left, all four rules appear exactly, the test respects output style and approval boundaries.

### Phase 4: Content strategy (creates `content-strategy.md`)

Say: "Build the content system you will actually use, not the one you wish you had."

> Create content-strategy.md in this folder. Keep it as short as my real content program. Cover: the platforms I actually use; my audiences (prospects, clients, referral partners, recruits); my 3 to 5 core topics; my honest posting cadence; and whether I am better on camera or in writing. If I am better on camera, set up the repurposing frame: one weekly video becomes social posts, a client email, and follow-up snippets.

Valid alternative for owners who do not post:

> I do not have an active content program today. Create a short and truthful content-strategy.md that records that decision, what would cause me to revisit it, and which audience I would start with. Do not invent a posting cadence.

Test: propose the smallest content action the owner could realistically complete this week, based only on `content-strategy.md` and `brand-voice.md`.

### Phase 5: Team members (creates `team-members.md`)

Say: "A name and a title are not enough. The AI needs role, licenses, ownership, communication style, strengths, development areas, and current context."

Show: compare a message drafted before and after the file exists.

> Read my team roster in this folder. Create team-members.md with a section per person: name, role (LSP, CSR, office manager, producer), tenure, licenses held (P&C, L&H, or none yet), what they own day to day, how I communicate with them, one strength, one development area, and one line of current context. Ask me to fill anything the roster does not cover. Then prove it works: draft a message from me to [PERSON] about [REAL CURRENT TOPIC], and let me grade it.

For larger teams: create the structure first, interview one person at a time, show each section for approval, keep a visible list of completed and incomplete people.

Test: using the team, voice, and preferences files together, draft a message to a real person about a real topic. Not sent.

Privacy note given here: keep a private owner workspace separate from a team-facing workspace when files contain compensation, discipline, or personal history.

### Save the session (creates `SESSION-HANDOFF.md`)

> Create a handoff file called SESSION-HANDOFF.md inside this workspace so a fresh conversation can resume this build without relying on this chat history. Read the workspace and summarize only verified information under these headings: 1. Purpose of the brain 2. Work completed in this session 3. Files and folder structure created or changed 4. Business context learned 5. Decisions made 6. Instructions and operating rules 7. Current capabilities 8. Tests run and what passed or failed 9. Incomplete work 10. Exact current state 11. Where the next conversation should resume. For every completed phase, name the file that proves completion. Clearly separate facts from assumptions and missing information. Do not start another phase. End with: "Wait for the next phase prompt before beginning additional phase work." Show me the handoff for review before saving it.

Resume prompt for any later conversation:

> Read SESSION-HANDOFF.md and verify that the files it names actually exist. Give me a concise status with: completed phases, failed or incomplete tests, current blockers, and the exact next step. Do not begin new phase work until I give you the next phase prompt.

### Day 1 completion check (read-only, fresh conversation)

The AI confirms the six files exist, all four safety rules appear, each phase was tested, lists anything missing or contradictory, cites a file for every answer, and ends with exactly `DAY 1 COMPLETE` or `DAY 1 NOT COMPLETE`. If not complete: repair only the failing phase, rerun its test, update the handoff, rerun the check.

Closing instruction: keep using the five files for real work before Day 2, and correct them whenever output misses.

## 3. Day 2: Make it run

Finish line: two or more real project files; the platform master file at the root; memory folders that point to real sources; a fresh conversation passes the cold memory test; five report skills installed with a 5/5 receipt; one skill tested on a small sample with known answers; handoff updated.

### Step 00: Verify the Day 1 handoff

Fresh conversation. The AI reads the handoff and the five files, reports which exist, which were tested, anything contradictory, and the exact next phase. It changes nothing.

### Step 06: Active Projects (creates files in `current-projects/`)

Say: "This is where the brain stops being a biography and starts carrying current work. A project is not a topic."

A project needs a real outcome, an owner, one useful number with a current value or a "missing" label, a deadline or decision window, a blocker, and a dated next milestone. Examples offered: retention campaign, cross-sell push, life production push, win-back, hiring, renewal season prep, book acquisition, office move. The coach is explicit: do not let the AI choose priorities.

Choosing projects:

> Read about-me.md, working-preferences.md, and team-members.md. Help me identify the two or three active projects that deserve files first. A project must have: 1. A real outcome 2. A current owner 3. A useful success number 4. A deadline or decision window 5. A next milestone. Ask me one question at a time. Look for the work creating the most operating friction, financial exposure, missed follow-up, or team confusion. Recommend the smallest set that would remove the most friction. Do not create any project file until I approve the list.

Build prompt, run once per project:

> Create a file in current-projects/ for this project: [NAME IT]. Interview me, then write it with these sections: what it is and why it matters; current status; the one number that matters and where it stands today; milestones and deadlines; who is involved; open decisions; what is blocking it. End the file with "Next milestone:" on its own line so it is always visible at a glance.

Deepening interview when a project file is vague (ten forced-clarity points): the specific finishing result; why now; the one number; its current value, target, source, and reporting period; who owns the next move; the deadline and what created it; the next decision only the owner can make; the blocker; the earliest sign it is off pace; the exact next milestone and date.

If the owner cannot pick the number: the AI asks what decision the project should improve, offers at most three measures with tradeoffs, recommends one, waits.

If a project needs a report: the raw report stays outside the folder; the AI analyzes it by path for one approved question and writes only the distilled finding into the project file.

Test: a project review listing project, owner, status, number, milestone, deadline, blocker, and open decision, flagging incomplete files.

### Step 07: Pre-index cleanup

> Before building the master index, audit the files in this workspace. List: 1. Duplicate files 2. Conflicting facts 3. Missing source files 4. Files whose names or paths are unclear 5. Information that appears stale. Ask me one question at a time to choose the source of truth for each conflict. Do not merge, rename, delete, or rewrite anything until I approve the audit.

Coaching: do not answer "yes to all." Approve one group at a time. Never let the AI delete a file because it looks old.

### Step 08: Memory system (creates `CLAUDE.md` or `AGENTS.md`, plus `memory/`)

Say: "The master file is an index, not a storage closet."

> Build my memory system. First, read every file in this folder. Then create CLAUDE.md at the root as an INDEX, not a dump: one line on who I am; my team as a table; my active projects with one-line statuses; my four safety rules; key terms; and a pointer line for every other file in the folder. Every line must either state a core fact or point to the file with the detail. Then create memory/ with people/ (one file per team member, seeded from team-members.md), projects/ (one file per active project), and context/company.md (my carrier situation, tools, and how the agency runs). The glossary.md from my starter pack is already in memory/. Read it, then walk me through it so I can cut, correct, and add terms. When done, tell me to start a fresh session for the load test.

(The Codex prompt is identical with `AGENTS.md`.)

Glossary walk: one term at a time, KEEP, CORRECT, or REMOVE; then an interview for internal shorthand, campaign names, team nicknames, carrier abbreviations, and scorecard language. No term is added until its exact definition is approved.

Index audit afterward: for every section, the AI labels it a core fact, a valid pointer, unnecessary detail, a broken path, or unsupported information, and recommends the smallest corrections.

### Step 09: Cold memory test

A completely fresh conversation. No pasted chat, no explanation.

> Before answering, read the workspace master file and follow its file pointers. Who is [TEAM MEMBER], what do they own, and what current context matters when I communicate with them? Cite the workspace file you used.

> What is the one number, current status, blocker, and next milestone for [PROJECT]? Cite the workspace file you used. If anything is missing, say so.

Failed test repair: diagnose without guessing (right folder, master file name and location, pointer paths, whether the fact exists in the source), fix only the confirmed problem, test again in another fresh conversation.

### Step 10: Install the Standard Agency Intelligence skills

Download the platform skills ZIP from the portal, unzip, copy `STANDARD-SKILLS` and the installer files into the root of `MY BIZ BRAIN`, start a fresh conversation.

> Install all five Standard Agency Intelligence skills from the STANDARD-SKILLS folder for this platform and this MY BIZ BRAIN project only. Run install-standard-skills.py with the available Python interpreter. If Python is unavailable, stop and explain that the validated installer could not run. Do not manually overwrite any existing skill folder. Do not create READY.txt unless all five skills validate. Do not upload, move, or alter any source agency report.

Coaching: "Do not treat a friendly success message as proof." Open `SKILLS-INSTALLED.md` and confirm all five names, the right destination, and 5/5 self-tests. The receipt proves the self-tests passed. It does not prove a new carrier export maps correctly.

### Step 11: Known-record report test

Start with a small sample whose expected result the owner already knows. The raw report stays in a separate local folder.

> Analyze the small report at [LOCAL FILE PATH] with the appropriate Standard Agency Intelligence skill. Before calculating, tell me the source period, fields you found, definitions you will use, exclusions, missing fields, duplicates, and data-quality warnings. Create the owner dashboard and local working list. Explain the three most important findings. Reconcile the result against the known answers I provide. Do not send, change, upload, or move anything. Stop if the fields cannot support the requested calculation. Known answers for this sample: [ENTER THE TOTALS OR RECORDS YOU ALREADY KNOW]

Grading list: source period correct, record count reconciles, duplicates handled, dates are dates, negative amounts stay numeric, formula-like strings are neutralized in CSV, dashboard and working list agree, the three findings are supported.

Rule: do not move from a small test to a full report only because the receipt says 5/5. Customize the dashboard look only after the numbers pass.

### Optional: sharing and team access

GitHub was discussed as a way to move the workspace between devices. It is optional. Before any sync, run a read-only privacy audit that classifies every top-level item as owner-only, team-safe, contains customer or sensitive data, or unclear.

Team access rule: do not give the team the full owner brain. A team-safe knowledge base gets its own folder. "Separate access before sharing, not after."

### Step 12 and 13: Day 2 handoff and final check

The handoff is updated with projects, memory structure, skills receipt, and tests, and must not claim a report skill works on carrier data unless a known sample reconciled. A fresh conversation then runs a ten-point read-only check and ends with `DAY 2 COMPLETE` or `DAY 2 NOT COMPLETE`.

A paper completion record closes the guide: date, platform, two projects, master file, cold person test, cold project test, installation receipt, skill tested, sample reconciled, handoff reviewed.

## 4. After the room

- **Portal.** Day 1 and Day 2 replays with the guides and packs beside each one; viewing progress saved.
- **Catch-up path.** The two guides double as self-serve rebuild instructions for anyone who missed a day.
- **Check-up call.** One group call about 30 days later, described as reviewing what stuck, what stalled, repairing live, choosing what to build next, and installing an upkeep rhythm.
- **Testimonial request.** Optional video upload prompt in the portal.

## 5. Standard repair prompts (used across both days)

| Symptom | Coaching move |
|---|---|
| AI explains or critiques the files instead of doing the task | "The documents in this folder are reference material. My request is the action to perform." |
| AI keeps referring to old work | Fresh conversation, same folder, then the resume prompt |
| New conversation knows nothing | Check folder connection, check files exist, ask it to read the workspace, check the fact is in a file |
| A similar file already exists | Compare, report complete vs missing vs conflicting, recommend update or a clearly named replacement, wait for approval |
| Interview takes too long | One question at a time, only what the file and test need, park the rest |
| AI tries to roll into the next phase | "Stop after the current artifact and test." |
| AI says done but the file is missing or wrong | Not done. Show the path, open the file, repair only that step |
| Master file grew too long | Reduce to core facts and pointers; move and delete nothing without approval |
| Installer reports success with no receipt | Not proven. Do not copy skills by hand |
| Report looks good but numbers do not match | Test failed. Show rows, mapping, definitions, exclusions; separate bad source from bad mapping from bad rule |
| AI wants to upload or move a raw report | Stop it |

## 6. What was planned but not coached in v1

The offer promised these for Day 2. The Day 2 guide says they were on the agenda and not completed live:

1. A scheduled morning brief that runs without the owner opening the app.
2. A live dashboard the owner can reopen for fresh weekly status.
3. One custom skill for a process specific to the attendee's agency.
4. A first scheduled task.
5. An automated upkeep rhythm that keeps the brain current.

What replaced them: the pre-index cleanup step, the five pre-built report skills, and the known-sample reconciliation test.

## 7. Friction observed in the v1 design

1. **Everything is copy and paste.** Every phase depends on the attendee pasting a prompt into the right conversation in the right folder. Most repair prompts exist because the AI wandered off task.
2. **The coach cannot see the room.** Files stay on each attendee's computer by design. Progress is visible only by screen share or self-report. The portal tracks video percent, not phase completion.
3. **Fresh-conversation discipline is manual.** Attendees must remember to start a new conversation per phase and to write and read a handoff file to carry state.
4. **Upkeep is unsolved.** Files go stale unless the owner corrects them. The only maintenance instruction is "correct them whenever the output misses."
5. **The brain is single-device.** GitHub is the only offered way to reach it from another device, and the guide concedes it "feels too technical."
6. **Skills depend on a local Python install** and on carrier export formats that can change.
7. **Team access is a warning, not a feature.** There is a rule against sharing the owner brain and no built path for a team-safe version.
8. **Interviews are typed, one question at a time,** for an audience that would rather talk.
9. **Pre-work readiness is proven by a screenshot** reviewed by a person.
10. **Platform split doubles the surface.** Two packs, two pre-work pages, two master file names, two skill install paths.

## 8. Questions for the version 2 analysis

These are stated as needs, not as tool recommendations. The analysis should map current capabilities in Claude, Codex, and other tools released since August 2026 against each one. Verify each tool's real capabilities from its current documentation before designing around it.

1. Can the interview be run by voice, with the AI still producing the same named files and tests?
2. Can a phase be packaged as an installable skill or command, so the attendee starts "Phase 3" instead of pasting a prompt?
3. Can completion checks (file exists, test passed, safety rules present) report back to the portal so the coach sees the room in real time without seeing private file contents?
4. Can the morning brief, weekly dashboard, and scheduled upkeep now be delivered reliably inside the two days? What must be true about calendar, email, and CRM connections for that?
5. Can the brain connect directly to AgencyBrain data (scorecards, call scoring, renewals, cancel audit, win-back) so project numbers stop being typed or exported by hand?
6. Can the report skills run without a local Python install, and can field mappings update when a carrier changes an export?
7. Can memory upkeep be automated with owner approval (proposed edits after each working session rather than manual correction)?
8. Can the brain be reached from a phone or second device without GitHub?
9. Can a team-safe workspace be generated from the owner brain with the private material excluded by rule?
10. Can one pack and one set of instructions serve both platforms, or should v2 pick a primary platform?
11. What should the pre-work gate become if the app can verify its own readiness?
12. Which of the six-step loop's manual disciplines (fresh conversation, handoff file, cold test) are still necessary, and which does current tooling handle natively?
