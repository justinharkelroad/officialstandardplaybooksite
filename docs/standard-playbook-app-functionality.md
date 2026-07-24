# Standard Playbook App — Functionality and Tracking Reference

> Source-of-truth handoff for future development sessions
> Last reviewed from the repository: July 15, 2026
> Scope: the authenticated Standard Playbook member app at `/app` and its shared iOS/Android build—not the public marketing website

## 1. Product summary

Standard Playbook is a private personal-growth and coaching app for existing clients. It turns the Standard Playbook system into a daily, weekly, monthly, and quarterly operating rhythm across four life domains:

- **Body** — physical health, training, nutrition, sleep, and recovery
- **Being** — faith, study, journaling, mindset, and personal development
- **Balance** — marriage, family, friends, and community
- **Business** — revenue actions, team, systems, and marketing

The app combines habit tracking, weekly execution planning, guided AI reflection, quarterly goal planning, weekly reviews, and personalized affirmation audio. The same React member application is used by the website and the Capacitor-based iOS/Android apps.

The product is login-only. Administrators create member accounts; there is no public signup, checkout, subscription management, or in-app purchase flow.

## 2. Navigation and terminology

The current member navigation is:

| Navigation label | Route | Functional area |
|---|---|---|
| Hub | `/app` | Personal Growth dashboard and current priorities |
| Daily | `/app/core4` | Core 4 daily habit completion and weekly score |
| Weekly | `/app/weekly-playbook` | Weekly Playbook, Power Plays, and One Big Thing |
| Monthly | `/app/monthly-missions` | One active monthly mission per Core 4 domain |
| Quarterly | `/app/life-targets` | 90-day targets, missions, habits, and action cascade |
| Flows | `/app/flows` | Guided AI coaching/reflection sessions and library |
| Debrief | `/app/debrief` | Weekly review, scoring, reflection, and AI analysis |
| 90 Day Audio | `/app/theta-talk-track` | Personalized affirmation and theta-audio workflow |
| Admin | `/app/admin` | Member access management; administrators only |

Some code and database names still use the older internal terms `Core 4`, `Weekly Playbook`, `Life Targets`, and `Theta Talk Track`. The navigation labels above are the intended member-facing language.

## 3. The core 56-point weekly score

The app calculates a combined weekly score out of **56 points**:

| Source | Maximum | Scoring rule |
|---|---:|---|
| Daily / Core 4 | 28 | One point for each completed Body, Being, Balance, and Business habit per day: 4 × 7 days |
| Flows | 7 | One point for each calendar day with at least one completed Flow |
| Weekly Playbook | 21 | Up to four completed Power Plays per weekday: 4 × 5 = 20, plus one completed One Big Thing |
| **Total** | **56** | Core 4 + Flow + Playbook |

The score is displayed in Daily, Flows, the Hub, and Debrief-related views. The live score is derived from raw activity. Completing a Debrief stores a weekly score snapshot for historical comparison.

## 4. Hub

The Hub is the member's current operating view. It does not create a separate set of goals; it summarizes and links to records owned by the other areas.

It shows:

- today's Core 4 rhythm and combined weekly progress;
- today's scheduled Power Plays;
- the current-quarter primary target in each domain;
- the current month's active mission in each domain and its weekly measurable;
- today's Daily Frame status and commitment;
- the current Weekly Debrief status;
- whether the current 90 Day Audio session has a completed track;
- prompts to continue the relevant workflow.

The Hub organizes the information as **This Quarter**, **This Month**, **This Week**, and **Reflect & Reinforce**.

## 5. Daily: Core 4 tracking

Daily tracks whether the member completed each Core 4 domain on each date.

### Persisted data

For every member/date pair, the app can store:

- Body complete: yes/no
- Being complete: yes/no
- Balance complete: yes/no
- Business complete: yes/no
- an optional note for each domain

There is only one Core 4 entry per member per date. Future dates cannot be edited from the current UI.

### Derived tracking

The app derives:

- today's score from 0–4;
- the current week's Core 4 score from 0–28;
- a day-by-day weekly activity view;
- current streak of consecutive 4/4 days;
- longest 4/4 streak;
- total Core 4 points from the loaded history;
- combined 56-point weekly progress when Flow and Playbook data are included.

The current Core 4 hook loads the last 90 days of entries for its primary stats view.

## 6. Weekly: Weekly Playbook tracking

Weekly is an execution planner. It tracks work items called `focus_items` and organizes them into four zones:

- **Bench** — unscheduled items waiting to be placed
- **Power Play** — scheduled execution items
- **One Big Thing** — the single weekly priority
- **Queue** — supported by the data model, but not a primary current UI surface

### Data stored for a Playbook item

- title and optional description;
- Core 4 domain and optional sub-tag;
- priority level;
- zone and board position;
- scheduled date and optional time;
- week key;
- complete/incomplete status and completion timestamp;
- completion proof and completion feeling;
- source type, source name, and source Flow session when created from a Flow.

### Workflow rules

- A day can contain up to four Power Plays.
- Monday through Friday Power Plays count toward the 20-point weekly maximum.
- Saturday and Sunday can contain bonus activity but do not expand the 20-point maximum.
- A week can have one One Big Thing worth one point when completed.
- Members can create items, schedule or unschedule them, drag them between supported areas, complete/uncomplete them, and delete them.
- Completed One Big Things can capture proof and feeling.
- Actions declared at the end of a Flow can be added directly to the Bench with source attribution.

Global domain tags are readable by active members and managed by administrators at the database-policy level. The seeded taxonomy includes areas such as Training, Faith, Marriage, Revenue Actions, Systems & Process, and Marketing & Content.

## 7. Monthly Missions

Monthly Missions tracks one active mission per member, Core 4 domain, and calendar month.

Each mission stores:

- domain;
- mission title;
- up to four checklist items in the current editor;
- completion status for each checklist item;
- a weekly measurable;
- month (`YYYY-MM`);
- mission status: active, completed, or archived.

Members can create, edit, complete, or archive a mission. Quarterly planning can seed empty monthly domains and refresh untouched generated missions, while member-edited missions are intended to remain under the member's control.

## 8. Quarterly: 90-day target planning

Quarterly is the full 90-day planning system across Body, Being, Balance, and Business.

### Planning workflow

1. **Brainstorm** targets for each domain.
2. Use AI-assisted **measurability analysis** to receive a clarity score and a more measurable rewrite.
3. **Select** targets and identify the primary target when two are retained in one domain.
4. Review and save the **quarterly targets**.
5. Generate or edit **monthly mission suggestions**.
6. Generate and select optional **daily actions/habits**.
7. Review the complete **cascade** from quarter → month → day.

### Data tracked per quarter

For each of the four domains, the quarterly record can store:

- primary and secondary target;
- narrative/context for each target;
- which of the two targets is primary;
- monthly missions;
- a daily habit;
- selected daily actions;
- a generated action pool.

Brainstorm records separately store the original target, domain, clarity score, rewritten target, selection status, and primary status.

### Additional functionality

- Select and revisit historical quarters.
- Start an empty future/current quarter.
- Move or relabel quarterly plans through supported dialogs.
- Detect month/quarter mismatches.
- View a domain-by-domain cascade.
- Export the current or historical plan as a PDF.
- Send the saved primary quarterly targets into the 90 Day Audio workflow.

## 9. Flows: guided AI coaching and reflection

Flows are structured coaching sessions that can run in **text** or **voice** mode. A member must first create an AI coaching profile so the experience can use relevant personal context.

### Current Flow types

- **Grateful** — turn gratitude into insights and action
- **Idea** — turn an idea into an executable plan
- **War** — define the enemy, obstacles, fronts, and battle plan
- **Irritation** — separate story from facts and reframe a charged situation
- **Discovery** — capture and apply a learning
- **Prayer** — intentional prayer and reflection
- **Bible** — scripture application through Start, Stop, and Sustain commitments
- **Daily Frame** — set gratitude, today's lane, measurable proof, obstacle plan, and commitment

Flow templates are database-driven, so active templates, questions, challenge settings, analysis prompts, and display order can change without rewriting the route structure.

### AI coaching profile data

The optional profile fields include:

- full and preferred name;
- life roles and core values;
- current goals and challenges;
- spiritual beliefs and faith tradition;
- background notes;
- accountability style and feedback preference;
- description of peak state;
- current growth edge;
- typical response to overwhelm.

### Flow session data

A session can persist:

- selected Flow template and domain;
- title;
- current question;
- responses;
- AI analysis/report;
- AI-agent metadata;
- in-progress or completed status;
- completion time;
- challenge history, including original response, AI challenge, member action, and revised response;
- generated PDF reference when applicable.

Only one in-progress draft per member/template is permitted by the database. The Flow Library supports searching and filtering completed sessions and resumable drafts.

### Flow outputs

- Readable completion report and saved library entry
- AI analysis based on the structured responses
- Declared actions that can be sent to Weekly Playbook
- PDF export/download on web
- Native share/save sheet for PDFs on iOS and Android

### Flow scoring

At least one completed Flow on a calendar day earns one Flow point. Multiple completed Flows on the same date remain in the library but still count as one point toward the weekly 7-point maximum.

## 10. Daily Frame

Daily Frame is a special Flow with an additional structured commitment record. It tracks:

- frame date;
- chosen Core 4 lane;
- one gratitude entry for each Core 4 domain;
- current state;
- target outcome;
- measurable proof;
- likely obstacle;
- if-then plan;
- declared commitment;
- status: open, completed, overdue, or missed;
- completion timestamp;
- link back to its originating Flow session.

Only one Daily Frame commitment is stored per member/date. The Hub can display today's progress, details, recent frames, and mark an open commitment complete.

## 11. Debrief: weekly review and analysis

Debrief closes the weekly loop. Members can start or resume it only on Sunday and Monday, while completed historical Debriefs remain available throughout the week.

### Review workflow

- Create or resume the current review.
- Review the week's live Core 4, Flow, Playbook, and total scores.
- Capture a gratitude note.
- Reflect by Core 4 domain.
- Turn reflection actions into new Bench items.
- Define next week's One Big Thing.
- Request AI coaching analysis.
- Complete/seal the Debrief.
- Reopen completed historical Debriefs in read-only form.

### Persisted weekly snapshot

- ISO week key;
- Core 4 points, 0–28;
- Flow points, 0–7;
- Playbook points, 0–21;
- total points, 0–56;
- domain reflections;
- gratitude note;
- next week's One Big Thing;
- wizard step and status;
- completion timestamp;
- AI coaching analysis and its generation timestamps.

### Historical analysis

The Debrief statistics layer derives:

- day-by-day category performance;
- change versus the previous week;
- four-week, year, and overall averages;
- historical weekday averages;
- synthetic historical weekly scores from raw data when a completed Debrief snapshot does not exist.

The backend also includes member-email tracking for welcome, Sunday Debrief reminder, and Debrief report messages.

## 12. 90 Day Audio

90 Day Audio creates a personalized 21-minute theta/binaural track from the member's four quarterly targets.

### Workflow

1. Load the saved primary Body, Being, Balance, and Business quarterly targets, or review/edit target text.
2. Select an affirmation tone: inspiring, motivational, calm, or energizing.
3. Generate AI affirmations.
4. Review, edit, approve, or regenerate the affirmations.
5. Select a voice.
6. Generate voice segments and mix them with the binaural background track.
7. Download on web or share/save through the native operating-system sheet.

### Persisted data

- four target statements and a member-owned session ID;
- affirmations by domain, order, tone, approval state, and edited state;
- track-generation metadata: selected voice, status, duration, completion time, and error state.

The final mixed audio is generated client-side and is **not stored on the server**. The `theta_tracks` table stores generation metadata only. Concurrent billable generation for the same session is blocked by the backend.

## 13. Admin functionality

Admin is visible only to active members with `is_admin = true`.

Administrators can:

- list member names, emails, active state, and admin state;
- create a member login with name, email, and temporary password;
- activate or deactivate a member;
- reset a member's password.

Deactivation acts as a kill switch: login/data access is blocked and live sessions are revoked, while the member's stored data is retained. Administrators cannot deactivate their own account through the current switch control.

The current admin UI is account/access management, not a coaching analytics dashboard. It does not expose a cross-member view of private Core 4 entries, Flows, targets, or Debriefs.

## 14. Authentication, permissions, and data ownership

- Authentication uses Supabase email/password sessions.
- Access also requires a matching active row in `public.members`.
- There is no self-signup UI.
- Most member data tables use Row Level Security and require `user_id = auth.uid()` plus active-member status.
- Flow templates and Playbook tags are shared reference data; member-created records remain user-owned.
- Sensitive AI/service credentials remain in server-side Edge Functions and must not be placed in web or native bundles.
- Signing out or switching members clears member-specific browser state used by the personal-growth workflows.

## 15. Web and native app behavior

The web and native apps share `MemberAppRoutes` and `AppShell`, so functionality and navigation should remain aligned.

Native-specific adaptations currently include:

- iOS/Android safe-area and keyboard handling;
- native microphone permissions for voice Flows;
- app lifecycle awareness;
- Android hardware-back behavior;
- network/offline status banner;
- external links opened through the native browser adapter;
- native share/save behavior for generated files;
- light/dark status-bar synchronization;
- privacy-safe beta diagnostics containing app/build/network events but not answers, transcripts, passwords, or auth tokens.

The native app is a companion for existing clients. It intentionally contains no marketing pages, pricing, checkout, subscription selector, upgrade prompt, or external purchase instruction.

## 16. AI and backend services

The frontend relies on Supabase Edge Functions for protected or AI-backed work, including:

- starting and running Flow sessions;
- Flow AI challenges and analysis;
- voice-agent session support;
- Daily Frame commitment writes;
- Weekly Debrief analysis;
- quarterly target brainstorming/measurability;
- monthly mission and daily-action generation;
- affirmation generation and saving;
- theta voice-track generation;
- admin member management;
- member notification emails.

Frontend pushes do not automatically deploy Edge Functions or database migrations. Web frontend deployment, Supabase functions, Supabase SQL, and native store builds have separate release paths.

## 17. What the member app does not currently track

The authenticated Standard Playbook app is a personal coaching/execution product. It does **not** currently provide first-class tracking for:

- agency sales KPIs, quotes, premium, policies, or close rate;
- leads, pipeline stages, marketing ROI, renewals, cancellations, or winbacks;
- employee scorecards, producer call scores, or team leaderboards;
- program billing, subscriptions, invoices, or purchases;
- calendar appointments or call booking;
- public community posts or member-to-member messaging;
- coach/admin visibility into every member's private journal/Flow content through the current UI;
- server storage of final mixed 90 Day Audio files.

Those capabilities may exist in other Standard Playbook/Agency Brain products or the marketing site, but they are outside this member app's current route and data model.

## 18. Main persisted data map

| Table | Purpose |
|---|---|
| `members` | Member identity, active access, and admin flag |
| `core4_entries` | Daily four-domain completion and notes |
| `core4_monthly_missions` | Monthly domain missions and checklist items |
| `focus_items` | Bench items, Power Plays, and One Big Thing |
| `playbook_tags` | Shared domain sub-tags |
| `flow_profiles` | Personal context and AI coaching preferences |
| `flow_templates` | Database-driven Flow definitions |
| `flow_sessions` | Flow answers, analysis, status, and reports |
| `flow_challenge_logs` | AI challenge/revision history |
| `daily_frame_commitments` | Structured Daily Frame result and completion |
| `weekly_reviews` | Debrief content and weekly score snapshots |
| `life_targets_brainstorm` | Brainstormed and AI-refined quarterly targets |
| `life_targets_quarterly` | Quarterly targets, missions, habits, and action pools |
| `theta_targets` | Four target statements for an audio session |
| `theta_affirmations` | Generated/edited/approved affirmations |
| `theta_tracks` | Audio-generation metadata; not final audio storage |
| `member_emails` | Welcome, Debrief reminder, and report delivery ledger |

## 19. Code map for the next session

Start with these files:

- Route inventory: [`src/app/MemberAppRoutes.tsx`](../src/app/MemberAppRoutes.tsx)
- Shared web/native shell: [`src/app/components/AppShell.tsx`](../src/app/components/AppShell.tsx)
- Hub: [`src/app/pages/PersonalGrowthDashboard.tsx`](../src/app/pages/PersonalGrowthDashboard.tsx)
- Daily/Core 4: [`src/app/pages/Core4.tsx`](../src/app/pages/Core4.tsx)
- Weekly Playbook: [`src/app/pages/WeeklyPlaybook.tsx`](../src/app/pages/WeeklyPlaybook.tsx)
- Monthly Missions: [`src/app/pages/MonthlyMissions.tsx`](../src/app/pages/MonthlyMissions.tsx)
- Quarterly workflow: [`src/app/pages/LifeTargets.tsx`](../src/app/pages/LifeTargets.tsx)
- Flows: [`src/app/pages/Flows.tsx`](../src/app/pages/Flows.tsx)
- Debrief: [`src/app/pages/WeeklyDebrief.tsx`](../src/app/pages/WeeklyDebrief.tsx)
- 90 Day Audio: [`src/app/pages/ThetaTalkTrackCreate.tsx`](../src/app/pages/ThetaTalkTrackCreate.tsx)
- Admin: [`src/app/pages/AdminPage.tsx`](../src/app/pages/AdminPage.tsx)
- Authentication: [`src/app/lib/auth.tsx`](../src/app/lib/auth.tsx)
- Generated database types: [`src/integrations/supabase/types.ts`](../src/integrations/supabase/types.ts)
- Member-app migrations: [`supabase/migrations/20260711170000_member_app_members.sql`](../supabase/migrations/20260711170000_member_app_members.sql) through `20260711170700_member_app_daily_frame.sql`
- Native architecture/status: [`docs/mobile-app-beta-implementation-plan.md`](mobile-app-beta-implementation-plan.md)

## 20. Short handoff prompt

Paste this into a new session with this file attached:

> Read `docs/standard-playbook-app-functionality.md` first. Treat it as the functional map of the authenticated Standard Playbook member app. Verify any implementation-sensitive detail against the linked source files before changing code. Preserve the four-domain model, the 56-point scoring rules, member-owned data boundaries, active-member kill switch, and shared web/native route structure. Clearly distinguish frontend changes from Supabase Function, database migration, and native-store deployment work.
