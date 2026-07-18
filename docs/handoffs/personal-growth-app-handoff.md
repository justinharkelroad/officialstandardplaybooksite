# HANDOFF — Standard Playbook Member App (Personal Growth transplant)

> **For the executing agent:** this document is your complete brief. It was produced from a verified code audit of both repos on 2026-07-11. Where this doc cites a file path and line behavior, it was confirmed by direct reads — but re-verify any schema claim against the source migration before writing your own (that rule has caught real errors already, including one in the audit that produced this doc).

## 0. The Goal (read this twice)

Build a **members-only personal-growth app inside THIS repo** (`officialstandardplaybooksite` — the Standard Playbook marketing site) by **transplanting the "Personal Growth" feature set from the AgencyBrain codebase**, rebranded as Standard Playbook, for **non-insurance coaching clients**.

Done means: Justin can log into `standardplaybook.com/app` admin, create a client login (name + email + password), that client logs in and uses all 8 features below with their own private data, and Justin can flip that client's access **off** (and back on, with data intact) from the same admin screen. The public marketing site is byte-for-byte unaffected.

## 1. The Two Repos

| Role | Path | Rules |
|---|---|---|
| **TARGET (you work here)** | `/Users/standardmacbook/officialstandardplaybooksite` | All writes, commits, migrations, edge functions happen here. **Work on a branch (`feat/member-app`), never push, never touch `main` directly** — this repo auto-feeds the live marketing site via Lovable. |
| **SOURCE (read-only)** | `/Users/standardmacbook/agencybrain` | **READ ONLY — enforced by rules below, not just intent.** It is a live production insurance platform with uncommitted work in its tree. |

You are started inside the TARGET repo. The source repo is on the same machine.

**SOURCE-REPO CONTAINMENT (hard rules — violating any of these is run-ending):**
1. **FIRST ACTION of your session:** snapshot the source repo's state as your baseline:
   `git -C /Users/standardmacbook/agencybrain rev-parse HEAD > /tmp/ab-baseline-sha.txt && git -C /Users/standardmacbook/agencybrain status --porcelain > /tmp/ab-baseline-status.txt`
   The source tree is EXPECTED to be dirty (uncommitted work belonging to other sessions). Your acceptance check is that your run *added no delta* vs this baseline — never that the tree is clean.
2. In the source repo, these commands are **FORBIDDEN in every form**: `git checkout`, `git restore`, `git stash`, `git add`, `git commit`, `git push`, `git clean`, `git reset`, any Edit/Write of any file. If you think you need to "fix" something in the source to make a copy work — you don't; copy the file into the TARGET and fix it there.
3. **NEVER run `supabase db push`, `supabase db reset`, `supabase link`, or ANY `--linked` Supabase command, in EITHER repo, under ANY circumstance.** Migrations are files on disk only; Justin applies them. (This clause exists because the source repo's CLI may be linked to the production insurance database.)
4. When porting edge functions, **never copy `supabase/config.toml`, `.temp/`, or any file containing the source project's ref/URL/keys.** The source Supabase project ref is `wjqyccbytctqwceuhzhk` — if that string (or `myagencybrain`) appears anywhere in the TARGET repo when you're done, you have wired the new app to the production insurance database. Grep gate in §9 covers this.

Target repo facts: Vite + React 18 + TypeScript + shadcn/ui + Tailwind (same stack family as source), Lovable-managed deploy (push → Justin publishes in Lovable), existing Supabase project wired at `src/integrations/supabase/client.ts` (verify the project ref there; expected `puidotfmyrouxezsorlt`). `supabase/` already exists with `config.toml`, 8 marketing edge functions (acuity/meta/notification senders — **do not touch them**), and a migrations dir. Use `bun` (bun.lock present).

## 2. What You Are Transplanting (the 8 features + 1 widget)

Source paths are in the SOURCE repo under `src/`. Each feature = components + host page(s) + hooks + tables + edge functions.

| Feature | Source pages | Source components/hooks | Data |
|---|---|---|---|
| **Hub dashboard** | `pages/PersonalGrowthDashboard.tsx` | `components/personal-growth/` (PersonalGrowthPod, TodayRhythmHero, domainTokens.ts) | reads all below; renders the 56-pt weekly score ring |
| **Core 4** (daily habits: Body/Being/Balance/Business) | `pages/Core4.tsx` | `components/core4/` (Core4Card etc., SKIP TeamCore4Overview), `hooks/useCore4Stats` | `core4_entries`, user-scoped |
| **Flows** (AI reflection sessions) | `pages/flows/` (8 pages) | `components/flows/` (~17 files), `hooks/useFlowStats` | `flow_sessions` + flow edge fns |
| **Weekly Playbook / Power Plays** | `pages/WeeklyPlaybook.tsx` | `components/playbook/` (~12 files incl. TodaysPowerPlays, playbook-constants.ts), `hooks/useFocusItems`, `usePlaybookTags`, `usePlaybookStats` | `focus_items` (user-scoped), `agency_playbook_tags` (needs rework, §4) |
| **The Debrief** (Sunday/Monday weekly review + AI analysis) | `pages/WeeklyDebrief.tsx` | — | `weekly_reviews`; edge fn `analyze_debrief` |
| **Monthly Missions** | `pages/MonthlyMissions.tsx` | Core4MonthlyMissions component | `core4_monthly_missions` |
| **Quarterly / Life Targets** | `pages/LifeTargets*.tsx` (8 pages) | `hooks/useQuarterlyTargets` | `life_targets_quarterly`; life_targets edge fns |
| **90 Day Audio (Theta Talk Track)** | `pages/ThetaTalkTrack.tsx`, `ThetaTalkTrackCreate.tsx` | Theta components (~22 files incl. `ThetaTargetsInput.tsx`), `hooks/useThetaTargets` | `theta_targets`, `theta_tracks` (+ related theta tables), user-scoped |
| **Daily Frame widget** (on hub) | — | `components/daily-frame/DailyFrameWidget.tsx` (SKIP TeamDailyFrameWidget) | `daily_frame_commitments` (needs rework, §4); edge fn `daily-frame-commitments` |

**Scoring invariant that must survive:** the hub's weekly score = 56 points: Core 4 = 28 (4 domains × 7 days), Flows = 7, Weekly Playbook = 21 (20 Power Plays + 1 One Big Thing). The logic lives in `TodayRhythmHero` / `usePlaybookStats` / `useCore4Stats` — transplant it intact.

**Theta audio mechanics:** `generate_theta_track` calls ElevenLabs per-affirmation and returns segments for **client-side mixing** over a static background file `21m.mp3` (find it in the source repo's `public/` and copy it). There is no server-side storage of finished tracks — keep that design.

## 3. What You Must NOT Bring Over (drop list)

- **The entire 4-user-type auth engine** (`src/lib/auth.tsx`, 706 lines: profiles/key_employees/staff_users/user_roles). Replaced by §5.
- **Everything `staff_*` / `Staff*` / `Team*`**: staff tables, staff hooks (`useStaffFocusItems`), staff components (StaffCore4Card, TeamCore4Overview, TeamDailyFrameWidget), staff edge fns (`get_staff_core4_entries`, `get_staff_flows`, `manage_staff_flow_session`, `save_staff_flow_profile`, `analyze_staff_flow_session`). This app is single-user-per-account, no teams.
- **All tier/gating machinery**: `personalGrowthAccess.ts`, `featureGates.ts`, `tierAccess.ts`, `useSubscription`, `MembershipGateModal`, `UpgradeGatePage`. There are no tiers here — a member is either active or deactivated.
- **AgencyBrain nav/sidebar/branding**: build a simple app shell instead (§6). Grep gate: the final build must contain **zero occurrences of "AgencyBrain", "Agency Brain", or "myagencybrain"** in `src/` and `supabase/functions/` you add.
- **agency_id anything** — see §4.
- Flow-share features (`create_flow_share`, `revoke_flow_share`) are optional; skip in v1 unless trivially portable.

## 4. Database (new migrations in TARGET repo's Supabase project)

Create migrations in `supabase/migrations/` here. **Do not run anything against the source repo's database.** The existing lead-capture tables in this project (booking_leads, mirror scores, etc.) must be untouched.

New tables (port each schema from the source repo's migration that defines it, then simplify):

| Table | Source scoping (verified) | Action |
|---|---|---|
| `members` (NEW) | — | `id uuid PK` = `auth.users.id`, `full_name`, `email`, `is_active boolean NOT NULL DEFAULT true`, `is_admin boolean NOT NULL DEFAULT false`, timestamps. This is the profile + kill switch. |
| `core4_entries` | user-scoped (`user_id`, UNIQUE(user_id, date)) | port nearly as-is; drop the owner-visibility/agency RLS variants |
| `core4_monthly_missions` | user-scoped | port; drop staff mirror |
| `focus_items` | **user-scoped** (`user_id NOT NULL`, `agency_id` nullable — confirmed in source migration `20251111042528…`; ignore any claim it's agency-scoped) | port; drop `agency_id`, `team_member_id`, `mirror_source` columns; keep zone/scheduled_date/domain/sub_tag_id/week_key/completed from `20260313100000_weekly_playbook_schema.sql` |
| `playbook_tags` (from `agency_playbook_tags`) | agency-scoped in source | **rework:** global default tag set, admin-managed (Justin edits), readable by all active members. Drop `agency_id`. |
| `flow_sessions` | verify source schema before porting | port owner-side only; strip agency/staff columns |
| `weekly_reviews` | verify source schema | port user-scoped |
| `life_targets_quarterly` | verify source schema | port user-scoped |
| `theta_targets`, `theta_tracks` (+ `theta_affirmations` etc. as actually used by the ported pages) | user-scoped (confirmed) | port |
| `daily_frame_commitments` | **agency-scoped in source** (`agency_id NOT NULL`, dual `owner_user_id`/`staff_user_id`, source `20260601123000_daily_frame.sql`) | **rework:** single `user_id NOT NULL`, UNIQUE(user_id, frame_date); drop agency + staff columns and the num_nonnulls checks |

**RLS on every new table:** enable RLS; member policies are `auth.uid() = user_id` (or `= id` for `members`) **AND the user must be active** — gate via a `SECURITY DEFINER` helper like `is_active_member(auth.uid())` so a deactivated member's session can't read/write anything. Admin policies check `members.is_admin`. No `has_agency_access`, no `profiles`, no `staff_users` — those concepts don't exist here.

Regenerate `src/integrations/supabase/types.ts` for this project after migrations (`supabase gen types typescript`), and don't let the source repo's types.ts leak in.

## 5. Auth Model (simple, closed)

- Supabase email + password auth. **Self-signup disabled** (`config.toml` / dashboard: disable signups; also no signup UI). Accounts exist only if Justin creates them.
- `/login` page: email + password → session. After login, check `members.is_active` — if false, sign out immediately and show "Your access is inactive — contact Justin."
- **Admin screen** at `/app/admin`, visible only when `members.is_admin`:
  - Create client: full name, email, password → calls a new edge function `admin-manage-member` (service role) that creates the auth user (email_confirm: true, no confirmation email) + `members` row.
  - Reset password (same edge function, service role `updateUserById`).
  - **Activate/Deactivate toggle per client** — flips `members.is_active`. Deactivated = cannot log in or fetch data (RLS gate above); data retained; reactivation restores everything.
  - **Deactivation must also kill live sessions:** an already-issued JWT stays valid until expiry, so `admin-manage-member` must additionally call `auth.admin.signOut(userId, 'global')` (or ban the user) on deactivate. The acceptance test is "an ALREADY-LOGGED-IN client loses data access on deactivate," not merely "cannot log in again."
  - **Recursion trap:** `is_active_member()` MUST be a `SECURITY DEFINER` function; if the RLS policy on `members` references `members` directly you get infinite recursion at query time. Test it with a real query, don't reason about it.
- The `admin-manage-member` edge function must verify the CALLER is an active admin (read JWT, check `members.is_admin`) before any service-role action — never trust the request body for authorization.
- Seed: create Justin's own account as `is_admin = true` (coordinate the email with him; justin@hfiagencies.com unless he says otherwise).

## 6. App Shell, Routing, Branding

- All member surface under `/app/*`; login at `/login`. **Lazy-load** the entire `/app` tree (`React.lazy`) so the marketing bundle is unaffected.
- Keep new code walled off: `src/app/` (or `src/members/`) for pages/components/hooks you add; shared shadcn primitives can be used from the existing `src/components/ui/`. Copy any missing ui primitives from the source repo's `src/components/ui/` — they're stock shadcn.
- Routes: `/app` (hub dashboard), `/app/core4`, `/app/flows/*`, `/app/weekly-playbook`, `/app/debrief`, `/app/monthly-missions`, `/app/life-targets/*`, `/app/theta-talk-track` (+ `/create`), `/app/admin`. An auth guard component wraps them all (session + is_active; admin route additionally is_admin).
- **Branding:** use THIS repo's existing Tailwind tokens (`tailwind.config.ts` — primary `#2997FF`, dark theme) and existing fonts. The app is called **Standard Playbook**. Keep the Core 4 domain taxonomy and taglines from source `domainTokens.ts` (they're brand-appropriate: "Move, fuel, and rest the machine," etc., including the LatinCross icon on Being — deliberate, keep it).
- **Do not modify any existing marketing page, route, or the 8 existing edge functions.** Adding the `/login` + `/app/*` routes to the router and (optionally) one "Member Login" header link is the only permitted touch to existing files — keep those diffs minimal.

## 7. Edge Functions to Port (into TARGET `supabase/functions/`)

Owner-side only, strip agency/staff/tier checks, re-point auth at the §5 model (JWT → members.is_active):

- Flows: `start_flow_session`, `submit_flow_answer`, `save_flow_agent_responses`, `complete_flow_session`, `analyze_flow_session`, `refine_flow_action_item`, `get_flow_state`
- Debrief: `analyze_debrief`
- Life Targets: `staff_life_targets` → rename/simplify (it serves the owner path too — port the logic, drop the staff branches and the tier gate in `access.ts`), `life_targets_daily_actions`, `life_targets_measurability`, `life_targets_monthly_missions`
- Theta: `theta_audio_state`, `generate_theta_track`, `generate_affirmations`, `generate_voice_sample`
- Daily Frame: `daily-frame-commitments`
- New: `admin-manage-member` (§5)

Register every new function in `supabase/config.toml` (deploy gate pattern: functions must match config).

In Deno, date handling uses `Intl.DateTimeFormat("en-CA", { timeZone })` — the source functions already do this; preserve it. In React code, never extract a local date via `.toISOString().split('T')[0]` — the transplanted code follows `format(date, 'yyyy-MM-dd')` (date-fns); preserve that too.

## 7.5 AI Integration Map (verified against source code — every feedback/generation feature and what powers it)

This is the connective tissue Justin asked to be explicit about. Three AI providers + one email provider. Env var names below are the EXACT strings the source functions read — keep them identical so ported code works unchanged.

| Feature experience | Edge function(s) | Provider | Env vars (exact) | Notes |
|---|---|---|---|---|
| **Flows — voice conversation mode** | `start_flow_session` (mints signed URL / token) | **ElevenLabs Conversational AI (convai)** | `ELEVEN_API_KEY`, `ELEVEN_FLOW_AGENT_ID` (fallback `ELEVEN_AGENT_ID`) | ⚠️ Requires a **ConvAI agent configured in the ElevenLabs dashboard** — that agent (its prompt/voice) is an ElevenLabs-account artifact, not code. Justin must create/duplicate one for Standard Playbook and provide its agent ID. Until then, text-mode Flows must still work. |
| **Flows — AI feedback/analysis after a session** | `analyze_flow_session`, `refine_flow_action_item`, `submit_flow_answer` path | **OpenAI** (`gpt-5.4-mini` default) | `OPENAI_API_KEY` | Produces the session analysis + action items that feed the Playbook. |
| **The Debrief — weekly AI coaching analysis** | `analyze_debrief` | **Anthropic Claude** (source uses `claude-opus-4-7` / `claude-haiku-4-5-20251001`) | `ANTHROPIC_API_KEY` | The weekly written coaching feedback. Keep the models the source uses. |
| **Quarterly / Life Targets — AI assistance** | `life_targets_measurability`, `life_targets_monthly_missions`, `life_targets_daily_actions` | **OpenAI** | `OPENAI_API_KEY` | Measurability coaching, monthly-mission generation, daily-action cascade. |
| **90 Day Audio — affirmation writing** | `generate_affirmations` | **Anthropic Claude** | `ANTHROPIC_API_KEY` | Writes the personalized affirmations from the user's theta targets. |
| **90 Day Audio — voice synthesis** | `generate_theta_track`, `generate_voice_sample` | **ElevenLabs TTS** (`/v1/text-to-speech`) | `ELEVEN_API_KEY` (one source path also reads `ELEVENLABS_API_KEY` — set BOTH to the same value to be safe) | Segments returned for client-side mixing over the static `21m.mp3` (copy that file from source `public/`). |
| **Reminder emails (optional v1)** | `send-debrief-reminder` pattern | **Resend** | `RESEND_API_KEY` | Skip in v1 unless trivial; if skipped, list as future work. |
| Internal function-to-function calls | various | — | `LOCAL_FUNCTIONS_URL` (present in source for local dev) | Preserve the pattern; document it. |

**Secrets Justin must set on the TARGET Supabase project (you cannot set them — list in final report):** `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `ELEVEN_API_KEY` (+ `ELEVENLABS_API_KEY` duplicate), `ELEVEN_FLOW_AGENT_ID`, optional `RESEND_API_KEY`. (`SUPABASE_URL` / service keys are injected automatically by Supabase.)

**Build honestly around missing keys:** every AI call must fail with a clear user-facing message ("AI feedback isn't configured yet") — never a silent hang or a fake success. Acceptance §9 requires demonstrating features degrade gracefully with keys absent AND work with keys present (if Justin has set them by then).

## 8. Build Order (work in this sequence)

1. Migrations + RLS + `members` table + regenerate types. Prove RLS with SQL: user A cannot read user B's rows; deactivated user reads nothing.
2. Auth: `/login`, guard, `admin-manage-member` fn, `/app/admin` screen. Prove the full loop: create test client → log in as them → deactivate → login blocked → reactivate → data intact.
3. Shell + hub dashboard with Core 4 first (simplest feature), then Weekly Playbook + Daily Frame, then Debrief + Monthly Missions + Life Targets, then Flows, then Theta last (needs both API keys).
4. Branding/copy pass + the "AgencyBrain" grep gate.
5. Full acceptance run (§9).

Commit in meaningful increments in the TARGET repo. **Do not push or publish** — Justin pushes and publishes via Lovable. Never commit secrets.

## 8.5 Verification Environment + Stopping Conditions

**Where you verify:** run a local Supabase stack (`supabase start`, requires Docker) in the TARGET repo, apply your migrations there, and run every data/auth/RLS acceptance test against it with two seeded members. **If Docker/`supabase start` is unavailable, STOP: write `BLOCKED.md` describing exactly what you could not verify, mark those criteria BLOCKED, and continue only with build-level checks. NEVER mark an isolation, deactivation, or RLS criterion as passed "by code review."** Asserted-but-unverified passes are the one unforgivable output of this run.

**Stopping condition (anti-rogue clause):** if a transplanted feature turns out to require a table, hook, edge function, or dependency NOT on the lists in this document — STOP on that feature, append the discovery to `BLOCKED.md`, and move to the next feature. Do not invent tables. Do not add npm dependencies beyond what the transplanted code already imports. Do not modify marketing-site routes or build config beyond the two permitted touches (§6). Anything listed as "Justin decides" in §12 is STOP-and-log, never decide-and-proceed.

**SPA fallback note:** deep links like `/app/core4` need the deploy target's SPA rewrite (Lovable handles SPA routing for this site's existing client routes — verify by checking how existing non-root marketing routes behave in the built `dist/`; if `dist/` relies on a fallback config, confirm `/app/*` is covered). Flag in the report if unresolved — do not reconfigure the site's build to chase it.

## 9. Acceptance Criteria (all must be demonstrated with evidence — quoted command output — not asserted)

1. `bun run build` succeeds; `bun run dev` serves; marketing homepage renders identically (screenshot/diff).
2. `/login` rejects bad credentials. Self-signup is dead: signup UI absent AND a direct `curl` to the project's `/auth/v1/signup` endpoint fails (if it succeeds, flag it — disabling signups is a dashboard setting only Justin can flip; it's on his checklist).
3. Admin can create a client from `/app/admin`; that client can log in.
4. Client completes: a Core 4 day, a Flow session (text mode), dragging a Power Play onto a day + One Big Thing, a Daily Frame, a Monthly Mission, a Quarterly Target, generating a Theta track (if keys set), and the hub score ring reflects Core4/Flows/Playbook contributions. With keys absent, each AI surface shows the graceful "not configured" state (§7.5).
5. Two test clients cannot see each other's data (prove via second account's actual queries, not by reading the policy).
6. Deactivate: an already-authenticated client session loses data access AND cannot re-login; reactivate restores everything with data intact.
7. **Grep gates (prove each with a known-bad control first — plant a violation, watch it caught, remove it):**
   a. `rg -i "agencybrain|myagencybrain|wjqyccbytctqwceuhzhk" src/ supabase/` → 0 hits in added code (source project ref = wiring the new app to the insurance prod DB).
   b. `rg "agency_id|membership_tier|subscription_status|has_agency_access|staff_users|key_employees|useSubscription" <your added dirs>` → 0 hits (any hit = an unrewritten query from the transplant).
   c. `rg "service_role" dist/` after build → 0 hits (service key must never reach the client bundle).
8. RLS is ENABLED on every new table (assert `ENABLE ROW LEVEL SECURITY` count == new-table count in migrations), not merely policied.
9. Per-table schema proof: final report quotes the source `CREATE TABLE` + policies for every transplanted table next to your new version — per-table, not summarized (the audit producing this doc caught a wrong per-bucket claim; don't trust lists, including this document's).
10. No modifications to: existing marketing pages, the 8 pre-existing edge functions, lead-capture tables. `git diff --stat` on your branch confirms the blast radius.
11. Source repo delta vs baseline is empty: `git -C /Users/standardmacbook/agencybrain rev-parse HEAD` matches `/tmp/ab-baseline-sha.txt` AND `git -C /Users/standardmacbook/agencybrain status --porcelain` diffs empty against `/tmp/ab-baseline-status.txt`.
12. Final report lists: every migration, every edge function added, all secrets Justin must set (§7.5 list), the Supabase dashboard steps only he can do (disable signups; set secrets; create the ElevenLabs ConvAI agent), and the push + Lovable-publish step — with actual command output for 1–11.

## 10. Known Gotchas (learned the hard way — do not rediscover these)

- **Re-verify schema claims against actual migrations.** The audit that produced this doc caught a subagent confidently misclassifying `focus_items` as agency-scoped. Read the CREATE TABLE + policies yourself.
- **The source repo is huge and insurance-shaped.** If a component you're copying imports something insurance-flavored (LQS, metrics, call scoring), you took the wrong component or need to cut that import — the PG features themselves have zero insurance dependencies (verified).
- **Hooks are where agency coupling hides**, not components. When porting a hook, strip `agency_id` filters and staff branches; the component layer mostly won't need edits.
- **Optimistic-toggle rule** (source repo production bug): never re-derive a toggle's next value inside `mutationFn` from a cache that `onMutate` already flipped — pass the explicit target value through mutation variables. The ported Core 4 / checklist-style code respects this; keep it.
- **Re-entrancy guards must be synchronous refs** (`useRef`), early-return at the top of handlers — not state-based AND-clauses. Preserve any `busyRef` patterns you find.
- **Radix Checkbox in a native `<label>` double-fires** — keep the `<div>`-row pattern from source.
- **Lovable deploy quirk:** Justin publishes manually in Lovable after your commits are pushed by him. Nothing is live until he does. Don't claim "deployed."
- **Prove your gates with a known-bad control** before trusting them (e.g., seed one "AgencyBrain" string in a scratch file and confirm the grep gate catches it, then remove).

## 11. Out of Scope (do not build)

- Stripe / payments / pricing of any kind.
- Self-serve signup, email invitations, password-reset emails (admin resets passwords directly).
- Teams, staff portals, coaching-group features, The Exchange community.
- Data migration from AgencyBrain (members start fresh — deliberate decision).
- Any change to the AgencyBrain product or its database.
- Marketing site redesign.

## 12. Open Items for Justin (surface these in your final report — for the agent these are STOP-and-log, never decide-and-proceed)

- Set secrets on this Supabase project: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `ELEVEN_API_KEY` (+`ELEVENLABS_API_KEY`), `ELEVEN_FLOW_AGENT_ID`, optional `RESEND_API_KEY` (§7.5).
- Create/duplicate the **ElevenLabs ConvAI agent** for Standard Playbook Flows voice mode and supply its agent ID.
- **Disable self-signups** in the Supabase dashboard (Auth settings) — code cannot do this.
- Confirm his admin login email; merge the branch, push, and Publish in Lovable when accepted.
- Decide the default `playbook_tags` seed list (agent proposes one from source defaults in the report).
