# Agency AI Install v2: Current Tools Mapped to the Twelve Needs

Researched 2026-11-27. Companion to `01-system-map-and-interview-design.md` and `02-coaching-flow-end-to-end.md`. The twelve needs are the questions at the end of file 02.

Evidence grades used below:

- **Vendor doc**: read on the vendor's own help or docs page on 2026-11-27.
- **Press**: third-party coverage only.
- **Not verified**: the vendor pages read do not say. Test before designing around it.

All four products are moving fast. Two are research previews with waitlists. Re-check plans and availability before any of this goes into a sales page.

## 1. The one finding that reshapes v2

v1 rests on one premise: **the brain is a folder on the owner's computer.** Every new proactive feature released since August runs **in the cloud**, and none of them can freely read that folder.

| Product | Can it read the local `MY BIZ BRAIN` folder? | Grade |
|---|---|---|
| Claude Cowork, live session on desktop | Yes. Native. | Vendor doc |
| Claude Cowork, session from web or phone | Only while Claude Desktop is open on the computer that holds the folder | Vendor doc |
| Claude Cowork scheduled tasks | No by default. They "run remotely" and use connectors, skills, plugins, and "the files saved to your Claude account." A "Require this computer" folder option exists but the page says it is offered only to organizations with Computer access turned on, and then the computer must be awake | Vendor doc |
| Claude Duet | No. "It can't see all of your projects or the files on your computer, and it can read your work in Claude but can't change it" | Vendor doc |
| OpenAI dots | Only through a connected computer that stays online with the ChatGPT app open. Folder-level scoping is not described | Vendor doc |
| Codex scheduled tasks | Local projects need "the computer on and the app running" | Vendor doc |

So the morning brief that v1 promised and did not deliver is now easy to build, but only against data the cloud can reach: connectors, account-stored files, and the product's own memory.

**The v2 design decision this forces:** keep the local folder as the private source of truth, and add a deliberate "cloud-readable layer" that the proactive agents work from. Three ways to build that layer, to be chosen in the v2 spec:

1. **Connector-first.** The brief reads live systems (calendar, email, AgencyBrain) and needs only a small standing-instructions block, not the whole folder.
2. **Published summary.** One step in the build writes a short, owner-approved summary of the brain (master file plus project one-liners) into a cloud location the agent can read, such as a Drive folder or the Claude account's files. The private files stay local.
3. **Computer-awake mode.** The scheduled task requires the owner's computer to be on. Simplest to explain, least reliable in practice.

Option 1 plus option 2 together fit the v1 privacy stance ("separate access before sharing, not after") and do not depend on a laptop being open at 6 AM.

## 2. What each product is

### Claude Cowork (Anthropic)

The surface v1 was taught on. Changes since August that matter:

- **Scheduled tasks run in the cloud** on every paid plan (Pro, Max, Ultra, Team, Enterprise) and run "even when your computer is asleep or the Claude Desktop app is closed." Vendor doc.
- **Web and mobile.** Tasks can be started, steered, and reviewed from web and phone; sessions follow the account. Vendor doc.
- **Projects.** A Cowork project holds local folders, standing instructions, links, and "a project-scoped memory store that persists across sessions." The docs say projects "live on your computer" and are not shared. A changelog note mentions local projects "moving to claude.ai" for some accounts, so sync status is unsettled. Vendor doc, with a conflict.
- **Plugins.** A plugin bundles skills, connectors, and sub-agents into one package. The changelog references personal plugin marketplaces and skills "uploaded as a .zip or .skill file." Whether an individual Pro user can install a third party's custom plugin without an admin is **not verified**.
- **Artifacts.** Work on desktop and web. The changelog shows live artifacts calling connector tools and having a Refresh control, which is the building block for a reopenable dashboard. Mobile is not listed. Vendor doc, partial.
- **Voice.** The Claude composer has dictation and a voice mode. Voice inside Cowork tasks is **not verified**.
- **Runtime.** Cowork runs in a workspace VM with preinstalled Node.js packages. Whether Python is available there for skills is **not verified**.

### Claude Duet (Anthropic)

Announced October 21, 2026. A separate app (iOS, Android, claude.ai) where Claude acts as a proactive agent that messages the user first.

- **Access.** Research preview, waitlist, Pro, Max, and Ultra. The announcement says US only; the help article lists the US, India, Indonesia, Brazil, and Japan. Not on Enterprise. Vendor docs conflict.
- **Does.** A morning brief built from email and calendar that can start first steps such as drafting replies for review. Follows up on quiet threads. Checks connected accounts "every few hours." Finished work such as a dashboard, deck, or model lands in a **Make** tab.
- **Connects to.** Gmail, Google Calendar, Drive, Slack, QuickBooks, HubSpot, Docusign, Calendly, and more through the Claude Marketplace. Uses the account's skills and supports plugins. Whether it can use a custom connector the user added is **not verified**.
- **Asks first.** Before sending a message, making a payment, signing a document, or deleting anything. Will not trade securities, move money between accounts, or make phone calls or send texts to other people.
- **Input.** Typed or recorded voice messages.
- **Limits.** Cannot read local files. Usage counts against normal plan limits, including background work. Anthropic says it may "misread a thread or miscalibrate what's urgent." No API or SDK is described.

### OpenAI dots (works with Codex)

"Codex Dots" is not a product name. **dots** are always-on agents in ChatGPT, announced September 29, 2026, that can delegate to **Codex**.

- **Access.** First dot included with Pro and Business Premium. The help center adds selected Plus users, Business Standard, and Enterprise. Pro and Plus exclude the EEA, Switzerland, and the UK. Vendor docs conflict on plans.
- **Does.** Background "proactive research" with read-only tools. Reminders and recurring checks, managed under Scheduled (example given: "review your calendar each morning"). Each dot has its own cloud computer. Can be messaged in Slack and Teams.
- **Voice.** The user can start a voice call with a dot. The dot cannot call the user.
- **Local.** With a connected computer it can "create Work or Codex tasks, use local skills," and reach files. The computer must be online with the app open.
- **Memory.** Keeps its own notes, and "you currently cannot view, delete, or directly modify individual dot memories." This is the opposite of v1's inspectable-files principle.
- **Rules.** Custom Rules per action type: act without asking, act if pre-approved, ask first, or hand off. Password changes and money transfers always stay with the user.

### Codex in the ChatGPT desktop app

- **ChatGPT Work vs Codex.** Work is the agent for "longer, multi-step work and finished deliverables" and can use local files on desktop. Codex "remains dedicated to software development and technical work" and works in local folders. v2 should check which of the two a non-technical owner should be pointed at; v1 used Codex.
- **Voice.** "ChatGPT Voice is available in Work on web, iOS, and Android, and in Work and Codex in the ChatGPT desktop app," and can start and coordinate tasks. Vendor doc.
- **Skills.** Project-local skills live in `.agents/skills` and can be invoked by name (type `@` in the desktop app). They can include scripts. Required runtime is not stated.
- **Plugins.** A personal marketplace file at `~/.agents/plugins/marketplace.json`; sources can be a Git URL, `owner/repo`, or a local folder. Workspace publishing needs an admin.
- **Phone.** Pair a phone to the desktop by QR code; the desktop must be awake and online.
- **Memories.** Off by default; generated in the background from past chats. OpenAI's own guidance: "Treat memories as a helpful recall layer, not as the only source for rules that must always apply." `AGENTS.md` stays the home for rules.

### Meta Muse

A consumer and small-business agent with real-time voice, avatars, and smartwatch access (voice launched November 5, 2026). Small-business connectors reported for Meta ad accounts, Instagram analytics, Shopify, QuickBooks, HighLevel, Slack, Stripe, and Zoom. Free tier plus reported $20 and $100 plans. US and Canada. **All press; no Meta page was read.** No evidence of a local-folder model or of scheduled business briefings. Treat Muse as something attendees will ask about, not as a build platform for v2.

## 3. The twelve needs, mapped

| # | Need | Status today | What v2 can do |
|---|---|---|---|
| 1 | Voice interviews | **Available on Codex.** ChatGPT Voice works in Codex and Work on desktop. Claude has voice mode in the composer; inside Cowork tasks is not verified | Run the Phase 1, 3, 5, and 6 interviews by voice. Test Cowork voice on a real attendee setup before promising it on the Claude track |
| 2 | Phases as installable commands | **Available on both.** Skills and plugins exist on both platforms | Ship one "AI Install" plugin per platform with a skill per phase (prompt, test, pass condition, repair). Replaces most copy and paste. Individual install on Claude Pro is confirmed in the docs (Section 5) |
| 3 | Completion reporting to the portal | **No native feature.** | Build a small portal connector with one write action: "report phase result." The phase skill calls it with pass or fail and file names only, never contents. This is new engineering on our side |
| 4 | Morning brief, dashboard, scheduled upkeep | **Available**, with the local-folder limit in Section 1 | Brief: Cowork cloud scheduled task or Duet on Claude; dots Scheduled on OpenAI. Dashboard: a Cowork artifact fed by connectors. Design both against the cloud-readable layer |
| 5 | Direct AgencyBrain data | **Partly proven.** An AgencyBrain connector is live in the Claude account this research ran in, with read tools for scorecards, call scoring, renewals, cancel audit, win-back, and producer performance, plus draft tools | Make "connect AgencyBrain" a pre-work step so project numbers come from the system. Confirmed in the AgencyBrain repo: self-serve for owners on Plus or higher, or Boardroom members on any plan, on Claude and on ChatGPT and Codex (Section 5, item 6) |
| 6 | Report skills without local Python | **Not verified.** Cowork's VM ships Node.js packages; Python there is unconfirmed | Either test the v1.2.0 installer inside the Cowork VM, or port the analyzer to JavaScript. If AgencyBrain data covers the same questions, the export-based skills become the fallback, not the main path |
| 7 | Automated memory upkeep | **Partly available.** Cowork project memory persists across sessions. Codex memories exist but are off by default. dots memory cannot be inspected | Keep files as the source of truth. Add a weekly scheduled "propose updates" task that drafts edits for the owner to approve. Do not rely on dots memory for anything that must be auditable |
| 8 | Phone or second device | **Available with a condition.** Cowork sessions follow the account; Codex pairs by QR code. Both need the desktop app open to touch local files | Drop GitHub from the curriculum. Teach "start from your phone" and set the expectation that local files need the computer on |
| 9 | Team-safe workspace | **No native sharing** of Cowork projects. Anthropic's guidance is to package shared material as a skill or plugin | Generate a team plugin from the owner brain: voice rules, glossary, safety rules, team-safe processes. Private files are excluded by rule at build time |
| 10 | One pack for both platforms | **Closer than v1.** Claude's desktop app now lists `AGENTS.md` support (in the Code tab; Cowork not verified). Skill folders still differ: `.claude/skills` vs `.agents/skills` | One content source, two thin plugin wrappers built by script. This also fixes the v1 problem of portal ZIPs having no source in the repo |
| 11 | A better pre-work gate | **Buildable** once need 2 and need 3 exist | A "readiness check" skill verifies app, folder, starter files, and connectors, then reports to the portal. Replaces the screenshot and the browser-only checklist |
| 12 | Which manual disciplines remain | **Mixed.** | Handoff file: largely replaced by project instructions and project memory on Cowork. Fresh conversation per phase: still useful, and a skill can enforce it. Cold test: keep it. It is the proof step, and no tool replaces proof |

## 4. What this means for the offer

1. **The undelivered Day 2 items are now the easy part.** Morning brief, dashboard, and scheduled upkeep are native features on both platforms. v2 can lead with them instead of ending on them.
2. **The hard part moved to connections.** The value now depends on which systems are connected (calendar, email, AgencyBrain) more than on how much is typed into files. Pre-work should include connector setup.
3. **Plan requirements go up.** Duet and dots are gated: waitlists, higher tiers, country limits. A v2 that depends on either cannot promise every attendee will have access. Plain scheduled tasks exist on both platforms and are the safe base to teach (see the parity table in Section 5).
4. **The four safety rules need a fifth layer.** v1 rules govern drafts. Proactive agents can send, pay, sign, and delete with approval. v2 must teach the approval settings on each product (Duet's ask-first list, dots Custom Rules, Cowork scheduled-task approvals) as part of Phase 3.
5. **The privacy promise needs rewording.** v1 said the files stay on the owner's computer. Any cloud brief sends some context to the cloud. The honest v2 line is that the owner chooses exactly what the cloud layer contains.

## 5. Checks run on 2026-11-27

These were run after the first draft of this file. Where a result changes a row in Section 3, the result here is the current one.

### Settled

1. **Individual plugin install on Claude: yes.** Anthropic's plugin docs say plugins are "available to all paid plans (Pro, Max, Ultra, Team, Enterprise)." An individual goes to Customize > Plugins > Add > Upload plugin and selects a `.zip` or `.plugin` file. A second route, Add > Add marketplace, takes a Git repo URL. Limits: 5,000 files and 200 MB. An installed plugin is saved to the account, so it is also available in Cowork and Claude Code. Sharing by link is Team and Enterprise only. Anthropic does not review uploaded plugins. Vendor doc; not clicked through in the app.
2. **How a phase would be started in Cowork.** A plugin command runs by typing `/plugin-name:command`, or the owner describes the task and Claude loads the matching skill. Vendor doc.
3. **A plugin can carry a connector, but does not connect it.** A remote connector listed in the plugin shows on the plugin's Connectors tab, and each user adds it and signs in. "Adding a plugin doesn't add a connector to your account or sign you in to anything." So "connect AgencyBrain" stays its own build step. Vendor doc.
4. **The v1.2.0 installer works and its check is real.** Run on a scratch copy of the Claude pre-work pack on this Mac (Python 3.14.6): self-tests passed 5/5, five skills landed in `.claude/skills`, and the receipt was written. Control: with one skill folder deleted, the installer stopped with an error and wrote no receipt. The installer and analyzer import only the Python standard library, so there are no packages to install. Hands-on.

### Partly settled

5. **Python on the owner's computer may not be needed on Claude.** In chat and Cowork, a skill's folder is "copied into the code execution sandbox" and scripts run on what that environment provides. Code execution must be turned on in Settings > Capabilities. The Python version in that sandbox is not stated, and the installer was not run there. Since the analyzer is standard-library only, the odds are good. One run inside a real Cowork task settles it.
### Settled after reading the AgencyBrain repository (origin/main, 2026-11-27)

6. **The AgencyBrain connector is a shipped, self-serve product feature on both platforms.** Source: `supabase/functions/agencybrain-mcp/` and the Settings setup guide on `origin/main`.
   - **What it is.** One hosted server (a Supabase Edge Function) that speaks the standard connector protocol over HTTP with OAuth sign-in. Nothing is installed on the owner's computer.
   - **Who can connect.** Only the agency owner. Plans: AgencyBrain Plus and Pro, 1:1 Coaching, and Boardroom members on any plan. Core is refused. Managers, key employees, and staff can never authorize. Eligibility is rechecked on every request, so a downgrade or suspension cuts access at once.
   - **How an owner connects.** In AgencyBrain, Settings has a "Claude & ChatGPT" section with a connector address to copy. In Claude: Settings > Connectors > Add custom connector, paste, sign in as the owner, Allow. In ChatGPT or Codex: Customize > Plugins > Add > Add custom MCP server, paste, OAuth, Allow. "ChatGPT and Codex share one Plugins screen, so adding it once works in both." There is also a Codex command-line path.
   - **Privacy control.** Customer details (names, phones, emails, policy numbers) are off by default per connection and the owner can turn them on or revoke the connection in Settings.
   - **What it can do.** Read tools across quotes, sales, producers, lead-source ROI, renewals, cross-sale, scorecards, Phone Hub, Cancel Audit, Winback, payouts, training, the weekly briefing, and Mission Control commitments. Draft tools that save a proposal the owner must review and turn on inside AgencyBrain (comp plan, scorecard, sequence, call scoring template, roleplay, training course, lead form, sales process, setup changes). 67 tools are live in the session this research ran in. Nothing goes live without the owner.
   - **Limits.** 30 tool calls per minute per connection. Access tokens last one hour and refresh for 30 days.
   - **Usage so far.** An internal review dated 2026-11-25 counted 30 approved connections across 21 agencies in the first four days. That figure is from that document, not re-queried.
   - **Muse.** A separate Muse connector exists in the repo as a local test package only. Its README says it "is not a directory-approved connector and must not be described as one."
   - **What this means for v2.** "Connect AgencyBrain" can be a pre-work step with an existing in-product guide. The gate is the attendee's AgencyBrain plan (Plus or higher, or Boardroom members on any plan), not anything technical. Attendees who are not AgencyBrain customers, or are on Core, need the v1 export-based skills as their path.

7. **A scheduled task cannot read the local folder while the laptop is closed. This is answered by the docs and did not need a hands-on test.** On Claude, cloud scheduled tasks use connectors, skills, plugins, and files saved to the Claude account; pointing one at a local folder turns on "Require this computer," and then it "runs only while your computer is awake and Claude Desktop is open." On Codex, scheduled tasks on a local project need "the computer on and the app running." Both platforms behave the same way here. What remains unknown is narrower: the smoothest way to get an owner-approved summary of the brain into a place the cloud task can read.

### Reported by Justin

8. **Voice works in Cowork.** Confirmed by use, 2026-11-27.
9. **Claude Duet access: yes.** Justin's account is off the waitlist, so the AgencyBrain-in-Duet test can be run.

### Still open

Each needs a person in the app, about 15 to 30 minutes.

10. Can Claude Duet use the AgencyBrain custom connector? Likely yes: asked directly on 2026-11-27, Duet said a remote connector with a public address added to the Claude account works, and a connector that only runs on the laptop does not. AgencyBrain's connector is the hosted kind. Still to do: one real AgencyBrain question answered inside Duet.
11. For a non-technical owner on the OpenAI track, is ChatGPT Work or Codex the right surface for a local folder?
12. Does a live Cowork artifact refresh on its own or only on a manual Refresh? The article that covers this could not be located.

### Correction: platform parity on scheduled work

An earlier summary of this research said only Claude had a confirmed proactive feature. That was wrong. **Codex has scheduled tasks**, and Codex cloud tasks "can continue while your computer is asleep." The accurate comparison:

| | Claude | OpenAI |
|---|---|---|
| Scheduled tasks exist | Yes | Yes |
| Run with the laptop closed | Yes, cloud scheduled tasks on every paid plan | Yes for Codex cloud tasks; needs a cloud environment set up first. Plans for scheduled tasks are not stated on the page read |
| Read the local folder on a schedule | Only with the computer awake | Only with the computer on and the app running |
| AgencyBrain connector | Yes | Yes, one install covers ChatGPT and Codex |
| Always-on agent that messages first | Duet (waitlist preview) | dots (Pro, Business Premium, selected Plus) |

Neither platform is ahead in a way that forces the v2 choice. The platform decision can be made on teaching simplicity.

## 6. Sources

Vendor pages read 2026-11-27:

- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)
- [Introducing Claude Duet](https://claude.com/resources/articles/claude-duet)
- [Claude Duet Safety, Privacy, and Security](https://claude.com/resources/articles/claude-duet-safety-privacy-and-security)
- [Use Claude Cowork on web, desktop, and mobile](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile)
- [Schedule recurring tasks in Claude Cowork](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)
- [Organize work with projects](https://claude.com/docs/cowork/guide/projects)
- [Cowork changelog](https://claude.com/docs/cowork/changelog)
- [Claude Cowork and chat are one Claude](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)
- [Introducing dots](https://openai.com/index/introducing-dots/)
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)
- [Dots privacy, security, and safety FAQs](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs)
- [Meet dots](https://developers.openai.com/codex/dots)
- [Codex scheduled tasks](https://developers.openai.com/codex/app/automations.md)
- [Codex plugins](https://developers.openai.com/codex/plugins)
- [Package your plugin](https://developers.openai.com/plugins/build/plugins.md)
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)
- [ChatGPT and Codex changelog](https://developers.openai.com/codex/changelog?type=codex-app)
- [Claude plugins overview](https://claude.com/docs/plugins/overview)
- [Plugin structure and testing](https://claude.com/docs/plugins/build)
- [Plugin feature support across platforms](https://claude.com/docs/plugins/platform-support)
- [Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude)
- [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Create custom skills](https://claude.com/docs/skills/how-to)

Press coverage (not vendor-confirmed):

- [CNBC on the Claude Duet preview](https://www.cnbc.com/2026/10/21/anthropic-preview-of-claude-duet-personal-ai-agent-take-on-muse-dots.html)
- [TechCrunch on Claude Duet](https://techcrunch.com/2026/10/22/claude-duet-app-is-anthropics-bet-on-agents/)
- [MacStories first look at dots](https://www.macstories.net/stories/openais-dots-a-first-look/)
- [TechCrunch on Muse video chat and voice](https://techcrunch.com/2026/11/05/meta-says-us-users-can-now-video-chat-with-their-muse-ai-avatar/)
- [TechCrunch on Muse for smartwatches](https://techcrunch.com/2026/11/10/metas-ai-agent-muse-lands-on-apple-watch-and-wear-os/)
- [The Keyword on Muse small-business connectors](https://www.thekeyword.co/news/meta-muse-small-business-connectors)

Reading limits: parts of the OpenAI docs pages and the older half of the Cowork changelog came back as tool summaries, not full text. The Codex changelog could be read only from November 6 forward.
