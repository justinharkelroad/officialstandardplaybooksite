# Agency AI Install v2: Build Spec

Written 2026-11-27. Built on files 01 (system map), 02 (coaching flow), and 03 (current tools). This is a spec to review, not work in progress. Nothing here has been built.

## 1. What v2 is, in one paragraph

Same product, same core idea: the owner builds a brain as a folder of files they own. v2 changes how it is delivered and what it ends with. Prompts become installable commands. Interviews are spoken. Numbers come from AgencyBrain instead of being typed. The two days end with the things v1 promised and did not deliver: a morning brief that runs with the laptop closed, a dashboard, one custom skill, and a weekly upkeep routine. The coach can see who has finished each phase.

## 2. What stays exactly as it is

- The `MY BIZ BRAIN` folder and its file layout (file 01, section 4).
- The six-step loop and the rule that a phase is done only when the file exists and the test passes.
- The four safety rules, word for word.
- The cold memory test.
- Owner-only by default; team access is a separate, generated package.
- Both platforms supported. File 03 found no gap between them that forces a choice.

## 3. Decisions

Confirmed by Justin on 2026-11-27, including the Python exception in D4.

| # | Decision | Default in this spec | Why |
|---|---|---|---|
| D1 | Platform stance | Claude and Codex, equal, from one content source | Parity on scheduled work and on the AgencyBrain connector |
| D2 | Proactive feature taught | Plain scheduled tasks on both platforms. Duet and dots shown as optional | Duet is a waitlist preview; dots are plan-gated. Scheduled tasks are available to every attendee |
| D3 | AgencyBrain | A pre-work step for owners on Plus or higher, or Boardroom members on any plan. Everyone else uses the export-based report skills | Connector eligibility is owner-only, Plus, Pro, 1:1 Coaching, or Boardroom |
| D4 | Report skill language | Keep the v1.2.0 Python analyzer for now; do not port | It passed 5/5 on a clean run and uses only the standard library. Porting to TypeScript is 2 to 3 days with no attendee-visible gain. This is an exception to the TypeScript-only rule, approved by Justin 2026-11-27 |
| D5 | Pre-work gate | Keep the `READY.txt` screenshot through `/aiinstall/ready`, and add an automated readiness check beside it | The repo's working rules require the screenshot. Removing it means editing that rule first |
| D6 | Completion reporting | Ship the simple version first (a receipt code the attendee pastes into the portal), then the connector version | The simple version is about half a day of work; the connector is 3 to 5 days |

## 4. The four new building blocks

### 4.0 Delivery: the AgencyBrain connector first, the plugin as fallback

Decided by Justin on 2026-11-27, after the first plugin build. This changes how section 4.1 is delivered, not what the phases contain.

**Primary route: the AgencyBrain connector.** Attendees connect AgencyBrain during pre-work. The connector then serves the AI Install phases itself, the same way it already serves the comp plan and scorecard guides. The owner says "start phase 1" and the AI fetches the phase guide from the connector and runs it.

Why this is the primary route:

- One setup step. No ZIP upload and no second install.
- One version everywhere. The same connector works in Claude, ChatGPT, and Codex, and likely Duet.
- Updates are instant. A phase changed on the server is live for every attendee on their next session.
- The coach can see the room. The connector already records which owner called which tool, so phase progress is visible without anyone pasting a receipt.

**Fallback route: the plugin in 4.1.** AI Install must still work for a buyer who cannot connect AgencyBrain (not a customer, or on Core). They install the plugin built from the same phase files and run the same phases. They do not get live AgencyBrain numbers in projects, the brief, or the dashboard.

**The upsell moment.** A buyer on the fallback route sees, live in the room, what connected attendees get: numbers that fill themselves in and a brief built on real data. That is a natural point to offer AgencyBrain Plus. It should be stated plainly on the pre-work page ("connected owners get X") and never hidden until the call.

**What must be built in the AgencyBrain repository** (new work, not yet started):

| Piece | What it does |
|---|---|
| `get_ai_install_guide` | With no phase named, returns the list of phases and the order. With a phase and the app in use, returns that phase's full guide: interview, test, pass condition, repair, and the shared operating rules |
| `report_ai_install_phase` | Records phase name, pass or fail, and file names for the connected owner. No file contents |
| Phase content | Generated from the same source files in this repository, so the connector and the plugin can never drift. The build script gains a third output for this |
| Coach view | A way for the coach to see phase results per attendee. Where it lives (AgencyBrain admin or the AI Install portal) is open item O7 |

**Status, 2026-11-27.**

- `get_ai_install_guide` is built and committed locally in the AgencyBrain repository on branch `ai-install-connector-guide` (not pushed, not deployed). It is read-only and needs no database change. It also hands the starter files to the readiness step, so a connected owner downloads nothing.
- It ships closed. Two gates are checked on every call: a fleet switch (`AI_INSTALL_GUIDE_ENABLED`, off by default) and a per-agency grant (`ai_install` in the existing agency feature access table). Without the grant, the tool refuses and points the owner to the workshop page. Reason: without it, every connected agency would get the paid workshop content for free. Enrolling a buyer means adding that grant for their agency.
- The phase content is generated by this repository's build script and copied into AgencyBrain. The copy step is manual today.
- Update, later on 2026-11-27: the guide tool is merged to AgencyBrain main (pull request 3046). The six new steps are written (morning brief setup, weekly dashboard, build one custom skill, weekly upkeep setup, apply updates, team pack), bringing the total to 20. They are in the plugin build here and committed locally on an AgencyBrain branch, `ai-install-connector-new-steps`, not yet pushed. None of the 20 steps has been run in a real AI app.
- One change from section 4.4: the team pack is built as a separate folder (`team-pack/`) the owner copies out, not as a generated plugin. A folder is simpler to hand over and to inspect. The same exclusion rules apply.
- `report_ai_install_phase` is **not** built. It needs a new table, which is a production database change that requires Justin's approval, and its shape depends on open item O7 (where the coach view lives). Until then, the connector's existing audit log shows that an owner called the guide tool, but not which phase or whether it passed.

**What changes elsewhere in this spec:**

- Pre-work step 3 becomes "connect AgencyBrain, or if you cannot, install the plugin."
- Completion reporting (4.4, D6): connected attendees are tracked by the connector. The pasted receipt remains for fallback attendees only.
- The platform-separation guards still apply to the plugin. The connector route needs the app named at call time so the guide uses the right master file name.

### 4.1 The AI Install plugin (fallback route, one per platform)

One package the attendee installs once. It replaces every pasted prompt in the Day 1 and Day 2 guides. Built and committed on 2026-11-27; not yet installed in a real app.

**Contents**

| Command | Replaces | Produces |
|---|---|---|
| `ready` | Pre-work connection test | `READY.txt`, plus a readiness report (app, folder, starter files, connectors) |
| `phase-1-about-me` through `phase-5-team` | Day 1 phase prompts | The five foundation files |
| `phase-6-project` | Active Projects prompt and its deepening interview | One file in `current-projects/` per run |
| `cleanup` | Pre-index audit | An approved cleanup list |
| `memory` | Memory system prompt and glossary walk | Master file and `memory/` |
| `cold-test` | The two cold test prompts | Pass or fail, with the files cited |
| `handoff` / `resume` | Session handoff prompts | `SESSION-HANDOFF.md` |
| `check-day-1` / `check-day-2` | Completion checks | `DAY N COMPLETE` or `NOT COMPLETE` |
| `brief-setup` | New | The morning brief scheduled task (4.3) |
| `dashboard` | New | The weekly dashboard |
| `build-skill` | New | One custom skill from the owner's own process |
| `upkeep-setup` / `apply-updates` | New | The weekly upkeep task and its approval step |
| `team-pack` | New | A team-safe package (4.4) |

Each command carries four parts taken straight from the v1 guides: the interview prompt, the test, the pass condition, and the repair prompts. The repair prompts become built-in behavior, for example "one question at a time" and "stop after this file."

**Packaging**

- One content source in the repo: `resources/aiinstall/v2/phases/<name>.md`.
- A build script emits two packages: a Claude plugin (`.claude-plugin/plugin.json`, uploaded as a ZIP through Customize > Plugins) and a Codex plugin (installed from a marketplace source).
- The master file name (`CLAUDE.md` or `AGENTS.md`) and skill folder (`.claude/skills` or `.agents/skills`) are set by the build script.
- Found during the build (2026-11-27): Codex plugins have no commands folder. On Claude each phase is a command, run as `/ai-install:phase-1-about-me`. On Codex each phase is a skill, run as `$phase-1-about-me`. The content is identical.
- Every command ends by printing a one-line receipt (`AII-R1|command|PASS or FAIL|files|date`) for the portal. It carries file names only.
- The build fails if a Claude package references `AGENTS.md` or the reverse. This carries over the v1 platform-separation rule.
- The report skills and starter files move into the same source tree. This fixes the v1 problem of portal ZIPs having no source in the repo.

### 4.2 Voice interviews

Phases 1, 3, 5, and 6 are run by voice. The command is started by typing or clicking; the owner then talks. Phase 2 stays text-based because it reads writing samples.

No build work beyond wording the interview prompts for speech: shorter questions, one at a time, read back the answer before moving on.

### 4.3 The cloud layer: brief, dashboard, upkeep

The problem from file 03: scheduled tasks run in the cloud and cannot read the local folder with the laptop closed.

**The design.** The scheduled task does not read the folder. It carries what it needs.

1. `brief-setup` reads the local brain and writes a short **brain summary**: who the owner is in one line, the team table, active projects with their one number and next milestone, the four safety rules, and the owner's output preferences. No compensation, discipline notes, or customer data.
2. The owner reads and approves the summary.
3. The command creates the scheduled task with the approved summary written into the task's own instructions. The task then pulls live data from connectors each morning: calendar, email, and AgencyBrain.
4. When the brain changes, `brief-setup` is run again and replaces the summary.

This keeps the v1 privacy promise honest: the owner sees and approves the exact text that leaves the computer.

**Morning brief content.** The three things that matter most today, what is off pace against each project's number, one team message to prepare, commitments due, and renewals or cancellations that need attention. Every number names its source. Missing data is stated as missing.

**Dashboard.** One page the owner reopens: project status, scorecard numbers, renewals, cancel audit, and win-back, pulled from AgencyBrain. On Claude this is an artifact fed by the connector. Whether it refreshes on its own is not verified (open item O3); the spec assumes a Refresh button.

**Weekly upkeep.** A scheduled task that reviews the week through connectors and produces a list of **proposed** changes to the brain (a project status that moved, a new team member, a stale milestone). It cannot write to the local folder. The owner opens a desktop session and runs `apply-updates`, which shows each proposed change for approval and then edits the files. This replaces the v1 instruction to "correct them whenever the output misses."

**Attendees without AgencyBrain access.** The brief runs on calendar and email plus the brain summary. Project numbers show the last value the owner recorded, with its date.

### 4.4 Coach visibility and the team pack

**Completion reporting, version A (ship first).** Each `check` and phase command ends by printing a short receipt: phase name, pass or fail, and file names. The attendee pastes it into a new field on the portal. The admin table gains a column per phase. File contents never leave the computer. About half a day of work.

**Completion reporting, version B.** A small portal connector with one action, "report phase result," called by the command. Sign-in uses the portal's existing password login. This follows the same pattern as the AgencyBrain connector. It removes the paste step and gives the coach a live room view. 3 to 5 days, and only worth it after version A proves the coach uses the data.

**Team pack.** `team-pack` generates a separate plugin from the owner brain: voice rules, glossary, the four safety rules, and processes the owner marks team-safe. Private files are excluded by rule, and the command lists exactly what is included before it builds. The owner hands the package to the team. This replaces the GitHub section of the Day 2 guide.

## 5. The v2 attendee journey

### Pre-work (about 90 minutes)

1. Install the desktop app and sign in on a paid plan.
2. Create `MY BIZ BRAIN` and copy in the starter files.
3. Install the AI Install plugin.
4. Connect calendar and email.
5. If on AgencyBrain Plus or higher, or a Boardroom member on any plan: connect AgencyBrain using the guide in AgencyBrain Settings.
6. Gather the five raw-material items (unchanged from v1).
7. Run `ready`. It creates `READY.txt` and reports what is connected.
8. Submit the screenshot through `/aiinstall/ready` (unchanged).

### Day 1: Build the brain (4 hours)

| Block | Minutes | Content |
|---|---|---|
| Open | 15 | Connection check, the working rule |
| Phase 1 About me | 30 | Voice interview, test |
| Phase 2 Voice | 40 | Sample analysis, line-by-line grading |
| Phase 3 Rules | 35 | Voice interview, four safety rules, **approval settings for anything that can send, pay, sign, or delete** |
| Break | 10 | |
| Phase 4 Content | 20 | Short or "no program" version |
| Phase 5 Team | 40 | Voice interview, message test |
| Phase 6 first project | 30 | One project, with its number pulled from AgencyBrain where connected |
| Close | 20 | Handoff, `check-day-1`, receipts into the portal |

v1 did not reach Phase 6 on Day 1. v2 can only if commands and voice save the time expected. If Phase 6 slips, it opens Day 2 and the dashboard block shrinks to a demo.

### Day 2: Make it run (4 hours)

| Block | Minutes | Content |
|---|---|---|
| Open | 15 | `resume`, status |
| Second project | 25 | `phase-6-project` |
| Cleanup and memory | 45 | `cleanup`, `memory`, glossary walk |
| Cold test | 15 | `cold-test` in a fresh conversation |
| Break | 10 | |
| Morning brief | 40 | `brief-setup`, approve the summary, run it once live |
| Dashboard | 25 | `dashboard` |
| Custom skill | 35 | `build-skill` on one real agency process |
| Upkeep | 15 | `upkeep-setup` |
| Close | 15 | `check-day-2`, receipts, what runs tomorrow morning |

The five report skills move out of the live agenda. They stay in the portal as a self-serve track for owners without AgencyBrain access.

### After

- The first brief arrives the next morning.
- The first upkeep proposal arrives within a week.
- The check-up call reviews real briefs and real upkeep lists.

## 6. Repository work

Website and portal changes deploy through Cloudflare from `main`. Edge function changes are handed to Justin as a Lovable instruction; no agent publishes them.

| # | Work | Where | Estimate |
|---|---|---|---|
| W1 | Phase content source: move every prompt, test, pass condition, and repair from the two guides into one file per phase | `resources/aiinstall/v2/phases/` | 1 day |
| W2 | Plugin build script: emit Claude and Codex packages, enforce platform separation, include starter files and report skills | `scripts/build-aiinstall-v2-plugins.ts` | 1 day |
| W3 | New commands: `brief-setup`, `dashboard`, `build-skill`, `upkeep-setup`, `apply-updates`, `team-pack`, `ready` | Same source tree | 2 to 3 days |
| W4 | Pre-work pages: plugin install step, connector steps, remove hard-coded August dates in favor of a cohort config | `src/pages/AIInstallPrework.tsx`, `AIInstallReady.tsx`, purchase email | 1 day |
| W5 | Portal: phase receipt field and admin columns (version A) | `AIInstallPortal.tsx`, `AIInstallPortalAdmin.tsx`, `ai-install-portal` function, one migration | Half a day, plus the Lovable handoff |
| W6 | Portal resources: replace the four ZIPs with the two plugin packages; keep the PDFs until rewritten | `src/lib/aiInstallPortalResources.ts`, portal-assets sync | Half a day |
| W7 | Guides: rewrite the Day 1 and Day 2 guides around commands | New PDFs | 1 day |
| W8 | Landing page and email copy: match what v2 delivers | `AIInstall.tsx`, `ai-install-purchase.ts` | Half a day |
| W9 | Portal connector (version B) | New edge function | 3 to 5 days, later |

W1 through W8 total about 8 to 9 working days. W9 is separate and optional.

**v1 inconsistencies this closes** (file 01, section 9): one pack instead of two (item 3), pack source in the repo (4), one meaning for `READY.txt` (5), one screenshot instruction (6), dates in config (7), a server-side readiness signal (8), and a link between the portal and the build (10).

## 7. Acceptance checks

Each must be shown to pass on a clean test account on both platforms before v2 is sold. A check that cannot fail is not a check: break each one on purpose once and watch it fail.

1. A new user installs the plugin from the pre-work page with no admin rights, and every command appears.
2. The Claude package contains no `AGENTS.md` reference and the Codex package contains no `CLAUDE.md` reference. The build fails when one is added on purpose.
3. `phase-1-about-me` run by voice produces `about-me.md`, and its test separates known facts from missing ones.
4. `cold-test` in a fresh conversation answers a person question and a project question from the files and cites them. It fails when the master file is renamed.
5. `brief-setup` shows the summary for approval before creating anything, and the created task contains only the approved text.
6. The morning brief runs with the laptop closed and arrives on the phone.
7. With AgencyBrain connected, the brief's project numbers match AgencyBrain for the same day. With it disconnected, the brief says the numbers are missing and invents nothing.
8. Nothing is sent, paid, signed, or deleted by any scheduled task without an approval prompt.
9. `apply-updates` changes no file the owner did not approve.
10. `team-pack` output contains none of the files marked private. Add a compensation note on purpose and confirm it is excluded.
11. A phase receipt pasted into the portal shows in the admin table for that attendee only.
12. The `ready` command plus the screenshot both land before a seat shows as confirmed.

## 8. What the offer can say, and cannot

**Can say, once the acceptance checks pass:** voice-led build; installable commands instead of prompts; live AgencyBrain numbers for owners on Plus or higher, or Boardroom members on any plan; a morning brief that runs with the laptop closed; a weekly dashboard; one custom skill; a weekly upkeep routine with owner approval.

**Cannot say:** that files never leave the computer (the approved summary does); that every attendee gets AgencyBrain data (plan-gated); that Duet or dots are included (optional, access varies); that the brain updates itself (it proposes, the owner approves); any revenue or productivity result.

## 9. Open items

| # | Item | Who | Blocks |
|---|---|---|---|
| O1 | Can Claude Duet use the AgencyBrain connector? **Likely yes.** Asked in Duet on 2026-11-27, it said a remote connector with a public address, added as a custom connector on the Claude account, works, and that connectors load when a session starts. AgencyBrain's connector is that kind. Not yet shown with a real AgencyBrain answer inside Duet | Justin, one AgencyBrain question in Duet | Only the optional Duet segment |
| O2 | ChatGPT Work or Codex as the surface for non-technical owners on the OpenAI track | 30-minute hands-on | W4 wording for the Codex pre-work page |
| O3 | Does a live Cowork dashboard refresh on its own? | 15-minute hands-on | Dashboard copy only |
| O4 | Do plugin commands load inside a cloud scheduled task? | 15-minute hands-on | Nothing, by design: the brief task carries its own instructions |
| O5 | Does the report-skill installer pass inside the Cowork sandbox with no local Python? | 15-minute hands-on | Whether the self-serve report track needs a Python note |
| O7 | Where the coach sees phase progress for connected attendees: AgencyBrain admin, or the AI Install portal reading it from AgencyBrain | Justin | The coach view only |
| O8 | Should buying AI Install grant temporary connector access to a buyer on Core, or is the plugin fallback plus the upsell the intended path? Current answer: fallback plus upsell | Justin | Nothing; recorded so it is a choice, not an accident |
| O6 | Next cohort date, price, and seat count. **TBD (Justin, 2026-11-27): the waitlist is still being built.** The landing page stays in waitlist mode, and W4 and W8 are written with the date, price, and seat count read from one cohort config that is empty until set | Justin | Final copy in W4 and W8 only |

## 10. Build order

1. **Decisions.** Done 2026-11-27.
2. **W1 and W2.** Content source and build script. After this, v1 can already be delivered as commands. 2 days.
3. **W3.** New commands, starting with `brief-setup`, since it carries the main new promise. 2 to 3 days.
4. **Dry run.** Justin runs the full two days alone on a clean folder on each platform and times every block against section 5. 1 day.
5. **W5 and W6.** Portal changes. 1 day.
6. **W4, W7, W8.** Pages, guides, copy. 2 to 3 days.
7. **Acceptance checks.** All twelve, both platforms. 1 day.
8. **W9** only if the coach uses the receipt data in the first v2 cohort.
