# Agency AI Install v1: System Map and Interview Design

Prepared 2026-11-27 from the repository, the downloadable packs, and the three portal PDFs. Everything here describes what was actually built. Section 9 lists where the pieces disagree with each other.

Companion file: `02-coaching-flow-end-to-end.md` (the delivery sequence, with the prompts).

## 1. What the product is

A two-day live Zoom build (August 26 and 27, 2026, 1 to 5 PM Eastern, $997) where an insurance agency owner builds an "AI co-working brain" in Claude (Cowork) or Codex.

The core design idea: **the brain is a folder of files, not a chatbot.** The owner creates a folder named `MY BIZ BRAIN` on their own computer. Every phase of the workshop ends with one named Markdown file saved in that folder. The AI app is pointed at the folder, so every new conversation starts with the same context.

The working rule repeated in every guide: **Fresh conversation. Same folder. One job. One saved result.**

## 2. Surfaces we built

| Surface | Route or location | Purpose |
|---|---|---|
| Landing page | `/aiinstall` | Originally the $997 sales page. Now a waitlist page ("first live build complete, next date announced to the waitlist first"). Waitlist signups save to `booking_leads` and forward to the AgencyBrain CRM as a warm lead. |
| Checkout | Stripe payment link | Captures contact info and a Claude / Codex / undecided choice as a custom field. |
| Purchase webhook and email | `stripe-ai-install-webhook`, `_shared/ai-install-purchase.ts` | Records the purchase, sends the "You're in. Here's your pre-work." email with dates, Zoom registration, platform-specific pre-work link, starter pack link, and policy terms. |
| Pre-work pages | `/aiinstall/prework/claude`, `/aiinstall/prework/codex` | Four setup steps, the `READY.txt` test prompt, five raw-material items to gather, six readiness checks. Checklist progress is stored only in the browser. |
| Pre-work confirmation form | `/aiinstall/ready` | Name, email, platform, one screenshot (up to 10 MB) showing `MY BIZ BRAIN` open with `READY.txt` visible. Stored in a private bucket; notification email goes to the workshop host with a 7-day signed link. |
| Ready list (admin) | `/aiinstall/ready/list` | Admin view of who submitted the screenshot. |
| Attendee portal | `/aiinstall/portal` | Private hub: pre-work pack, Day 1 and Day 2 replays (Vimeo), build guides, skills library, optional video testimonial request. |
| Portal admin | `/aiinstall/portal/admin` | Grant seats (single or bulk CSV, up to 100), issue one-time activation codes, revoke or reactivate, reset activity, review testimonials, see engagement per attendee. |

## 3. The attendee journey as mapped

1. Waitlist or ad to landing page.
2. Stripe checkout with platform choice.
3. Confirmation email with pre-work link for the chosen platform.
4. Pre-work (about 90 minutes): install app, create folder, copy starter pack, connect folder, run `READY.txt` test, gather raw material, complete six checks.
5. Screenshot submitted through `/aiinstall/ready`. Seat is confirmed by a human reply.
6. Day 1 live: five foundation files plus session handoff.
7. Day 2 live: active projects, memory system and master file, report skills, known-sample test.
8. Portal access afterward: replays, guides, packs.
9. Group check-up call (September 24, 2026, 1 to 2 PM).

## 4. The brain architecture (what the folder ends up containing)

```
MY BIZ BRAIN/
  CLAUDE.md  or  AGENTS.md        master file: an index, not a dump
  about-me.md                     Phase 1
  brand-voice.md                  Phase 2
  working-preferences.md          Phase 3 (includes the four safety rules)
  content-strategy.md             Phase 4
  team-members.md                 Phase 5
  SESSION-HANDOFF.md              bridge between conversations
  current-projects/
    <one file per active project> Phase 6
  memory/
    glossary.md                   pre-loaded with about 30 insurance terms
    people/<one file per person>  seeded from team-members.md
    projects/<one per project>
    context/company.md            carrier situation, tools, how the agency runs
  gathered-materials/             writing samples, roster, tools list
  STANDARD-SKILLS/                versioned skill source bundle
  .claude/skills or .agents/skills   installed skill copies
  SKILLS-INSTALLED.md             installer receipt ("5/5 skills passed")
  READY.txt                       pre-work connection proof
```

Design principles encoded in the files:

- **Index, not dump.** The master file states a core fact or points to the file with the detail. Nothing else.
- **Context, not databases.** Samples, lists, and summaries go in the folder. Raw exports stay outside; the AI is pointed at them by path when needed.
- **Missing beats invented.** Unknown values are written as "Missing" with the source needed to fill them.
- **The handoff is a bridge, not the memory.** The files are the memory.
- **Owner brain is private by default.** A team-facing knowledge base is a separate folder.

## 5. The four safety rules

Pre-written in the starter files and marked non-negotiable. They appear in `working-preferences.md`, the master file, and every skill.

1. Nothing sends to staff, clients, or prospects without the owner's sign-off.
2. Never invent numbers. Real data only, or say it is missing.
3. Never touch pricing, commission, or comp.
4. Never confirm coverage, quote a rate, or bind anything in a draft.

The skill pack adds: raw reports and customer-level lists stay local, every output is a review aid, source workbooks are never changed.

## 6. The interview process

### 6.1 The pattern

There is no questionnaire or intake form. The interview is run **by the AI, inside the attendee's own folder**, triggered by one pasted prompt per phase. The human coach supplies the prompt and the grading standard; the AI asks the questions and does the typing.

Every phase follows the same six-step loop:

1. **Open** a fresh conversation connected to the same folder.
2. **Build**: paste the one prompt for that phase.
3. **Interview**: the AI asks one question at a time; the owner answers in normal words.
4. **Save**: confirm the named file exists in the folder.
5. **Test**: give the AI real work that should now be better because the file exists.
6. **Repair**: correct the result and update the file before moving on.

Definition of done: the file exists and the test passes. "The AI said it finished" does not count.

### 6.2 What each interview covers

| Phase | File | Interview coverage | Source material used | Proof test |
|---|---|---|---|---|
| 1 | `about-me.md` | Name and role; years in insurance; carrier situation; book (PIF or premium range, line mix); team size; story (start, what was built, what almost broke them); 1 to 3 year direction | Owner's spoken answers | AI states the 1 to 3 year goal, obstacles, and what it still does not know, without filling gaps |
| 2 | `brand-voice.md` | No interview. The AI reads 5 to 10 real writing samples and extracts rhythm, repeated phrases, openers and closers, tone by audience, never-say list. Owner grades a test email line by line; each correction becomes a reusable rule | Writing samples | Same update drafted to team and to a client; tone must change, facts must not |
| 3 | `working-preferences.md` | Daily and weekly help wanted; biggest time drains; output style (ready to use vs drafts); how to push back; then the four safety rules pasted exactly | Owner's answers plus starter file | Short daily operating brief that names what is missing instead of inventing |
| 4 | `content-strategy.md` | Real platforms; audiences; 3 to 5 core topics; honest cadence; camera vs writing. A "no content program" version is a valid answer | Owner's answers | Smallest realistic content action for this week |
| 5 | `team-members.md` | Per person: role, tenure, licenses, daily ownership, how the owner communicates with them, one strength, one development area, one line of current context. Larger teams go one person at a time with approval per person | Team roster | Message to a real person about a real current topic, graded by the owner |
| 6 | `current-projects/*.md` | Outcome, why now, the one number (current value, target, source, period), owner of next move, deadline and what created it, next owner-only decision, blocker, earliest off-pace sign, next dated milestone | Owner's answers; optional report analyzed outside the folder | Project review across all files with no unsupported facts |
| 7 | (cleanup) | AI audits duplicates, conflicts, missing sources, unclear names, stale info; asks one question at a time to pick the source of truth | Whole folder | Every conflict has one approved source of truth |
| 8 | Master file plus `memory/` | Glossary walk: KEEP, CORRECT, or REMOVE per term, then interview for internal shorthand, campaign names, nicknames, scorecard language | All prior files | Master-index audit: no broken paths, no unsupported facts |
| 9 | (cold test) | None. A brand new conversation is asked about one real person and one real project with no hints | Master file pointers | Answers match source files and cite them |

### 6.3 Interview guardrails written into the prompts

- One question at a time.
- Write in the owner's words, not resume language.
- Show the file and ask what to correct before saving.
- Separate facts, estimates, assumptions, and missing information.
- Do not choose the owner's priorities or a vanity metric for them. Offer at most three candidate measures and recommend one.
- If the interview drags, narrow scope: ask only what the file and its pass test need; park the rest in a follow-up list.
- Do not overwrite existing files without a compare-and-approve step.

## 7. The downloads and ZIPs

### 7.1 Public pre-work starter packs (`public/aiinstall/`, built by `scripts/build-aiinstall-starter-packs.sh`)

| ZIP | Contents |
|---|---|
| `ai-install-claude-starter-pack.zip` | `README-START-HERE.md`, `CLAUDE-STARTER.md`, `working-preferences-STARTER.md`, `memory/glossary.md`, `current-projects/_project-template.md` |
| `ai-install-codex-starter-pack.zip` | Same, with `AGENTS-STARTER.md` instead of `CLAUDE-STARTER.md` |
| `ai-install-starter-pack.zip` and `starter-pack.zip` | Legacy shared pack with both starter files and a "choose one" README; kept so old links still work |

The build script fails if a Claude pack contains `AGENTS-STARTER.md` or the reverse, and checks the README links to `/aiinstall/ready`.

### 7.2 Portal assets (`resources/aiinstall/portal-assets/`, synced to a private Supabase bucket, served by 5-minute signed URLs after access and platform checks)

| Asset | Contents |
|---|---|
| Claude and Codex **Pre-work Pack** ZIPs | Everything in the public pack **plus** `STANDARD-SKILLS/` (five skills and a shared analyzer), `INSTALL-STANDARD-SKILLS.md`, `install-standard-skills.py`, `STANDARD-AGENCY-INTELLIGENCE-GUIDE.md` |
| Claude and Codex **Skills Library** ZIPs | The skill bundle alone, in a folder named `STANDARD AGENCY INTELLIGENCE SKILLS - CLAUDE` or `- CODEX`, with a `README-INSTALL-SKILLS.md` |
| `ai-install-day-1-guide.pdf` (20 pages) | "Day 1 Catch-Up Guide": setup, Phases 1 to 5, session handoff, troubleshooting, completion check |
| `ai-install-day-2-guide.pdf` (27 pages) | "Day 2 Catch-Up Guide": Steps 00 and 06 to 13 |
| `standard-playbook-skills.pdf` (10 pages) | Skill pack reference, version 1.2.0 |

### 7.3 Starter file roles

| File | Role |
|---|---|
| `CLAUDE-STARTER.md` / `AGENTS-STARTER.md` | Skeleton of the master file. Sections: who I am, agency at a glance, team table, active projects table, four safety rules, how I talk, key terms, file map. Not filled by hand; the AI builds the real one from the other files |
| `working-preferences-STARTER.md` | Bracketed prompts for daily and weekly help, output style, pushback style; safety rules pre-written |
| `memory/glossary.md` | About 30 terms in three groups (book and production, retention and money, people and structure) plus an "our language" section |
| `current-projects/_project-template.md` | What it is, the one number, status, milestones, who, open decisions, blockers, `Next milestone:` line |

### 7.4 Standard Agency Intelligence skill pack (v1.2.0)

Five local skills, each a `SKILL.md`, a `references/report-contract.md`, and a thin `scripts/analyze.py` that calls a shared Python analyzer (`_shared/report_core.py`, `_shared/report_artifacts.py`).

| Skill | Input | Output focus |
|---|---|---|
| Agency Quote Conversion | Quotes Detail export | Quote-to-bind, producer and product scorecards, top unbound quotes |
| Agency Retention Rescue | BOB Termination Audit | Payment-rescue, price-conversation, likely non-saveable, owner-review queues |
| Agency Commission Audit | Policy Level Commission Summary | Reconciled totals, negative and zero-commission rows, unusual rates |
| Agency Owner Review | Business Metrics Printable View (plus optional New Business Details) | Operating brief: what improved, what weakened, three questions, three actions |
| Agency Cross-Sell | In-force export (commission or new-business as a preliminary) | Provisional monoline candidates and a household-verification queue |

Each run writes to a `standard-analysis-runs` folder beside the source report: `OWNER-REPORT.html`, `OWNER-REPORT.pdf`, `ACTION-LIST.xlsx`, `summary.json`, `action-list.csv`, `run-manifest.json` (with source file hashes).

The installer detects the platform from the starter file, copies skills into `.claude/skills` or `.agents/skills`, runs a behavioral self-test, and writes `SKILLS-INSTALLED.md`. It refuses to overwrite an existing install unless `--replace` is passed, and then backs up the prior copy.

## 8. Portal mechanics

- **Access model.** An approved email identifies the seat. Sign-in is by password. First visit and password recovery use a one-time activation code that an admin issues and shares outside email. Email-link access is disabled (the old endpoint returns 410).
- **Platform entitlement.** Each seat is `claude`, `codex`, or `both`; that decides which packs appear.
- **Layout.** "00 Start here" (checklist link plus pre-work pack), then Day 1 replay with Day 1 guide and skills PDF, then Day 2 replay with Day 2 guide and the platform skills ZIP.
- **Tracking.** Portal visits, sign-outs, video play, progress in 10 percent steps, completion, testimonial skip or upload. Admin sees sessions, Day 1 and Day 2 percent watched, and whether the READY screenshot was submitted.
- **Testimonial.** Optional overlay with a short video from Justin and a vertical video upload (up to 500 MB) with a consent checkbox. Admin can switch the request on or off.

## 9. Where v1 disagrees with itself

These are the drift points a v2 analysis should resolve first.

1. **Promised vs delivered on Day 2.** The offer and the purchase email promise a scheduled morning brief, a live weekly dashboard, one custom agency skill, a first scheduled task, and an upkeep rhythm. The Day 2 guide states those "were not completed in the live Day 2 build." The current landing page still lists "A morning brief and live dashboard" under what the first build produced.
2. **Phase numbering.** The offer describes Day 1 as Phases 1 to 6 and Day 2 as Phases 7 and 8. The Day 1 guide covers Phases 1 to 5; Active Projects (6) moved to Day 2. Starter files say the master file and glossary are handled in "Phase 7"; the Day 2 guide calls that Step 08, with Step 07 being a cleanup audit that did not exist in the original plan.
3. **Two different pre-work packs.** The public ZIP on the pre-work page has five files and no skills. The portal "Pre-work Pack" adds the skill bundle and tells the attendee to install skills during pre-work, while the Day 2 guide installs them on Day 2 from a separate Skills Library ZIP.
4. **Portal pack has no source in the repo.** The public packs are built from `resources/aiinstall/starter-pack/` by a script. The portal ZIPs, including all skill code, exist only as committed binaries.
5. **`READY.txt` means three things.** The marketing brief says its content is "AI Install pre-work connection confirmed." The pre-work page prompt writes "AI Install [FIRST NAME] [LAST NAME] ready for August 26." The skills install instruction says not to create `READY.txt` unless all five skills validate.
6. **Screenshot instructions conflict.** The pre-work page says to reply to the welcome email with the screenshot and also submit the form. The pack README says to use the form and not to email it.
7. **Hard-coded cohort dates.** August 24 and 26 are written into the pre-work pages, the confirmation form, the test prompt, the legacy README, and the purchase email.
8. **Readiness is self-reported.** The six checks live in browser storage. The only server-side signal is the screenshot, which a person reviews by eye.
9. **Skills require Python on the attendee's computer.** The Day 2 guide carries a repair prompt for "Python is too old or unavailable," which signals this was a real friction point for a non-technical audience.
10. **No link between the portal and the brain.** The portal knows what was watched and downloaded. It knows nothing about whether any phase file exists or any test passed. Completion checks ("DAY 1 COMPLETE") happen only inside the attendee's own chat.
