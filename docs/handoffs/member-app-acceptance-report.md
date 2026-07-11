# Acceptance Report — Standard Playbook Member App (feat/member-app)

Run date: 2026-07-11 · Branch: `feat/member-app` (7 commits, **not pushed**) ·
Verified against a **local Supabase stack** (`supabase start` on offset ports
563xx; migrations applied with `supabase migration up`; functions via
`supabase functions serve`; UI via `bun run dev` on :8083 driven by real
Chrome/Interceptor). Companion docs: `BLOCKED.md` (discoveries, flags,
Justin-only steps), `docs/handoffs/personal-growth-app-handoff.md` (the brief).

**Design note:** mid-run Justin directed the app onto the site's current Bold
editorial design system (BoldMockup language) instead of the handoff's "dark
theme" wording. Done: scoped token overrides (`.member-app` in
`src/app/app.css`) re-skin every transplanted component — paper `#F4F2EE`, ink
`#0A0A0B`, Anton display type, squared corners, `#2997FF` accent.

---

## §9.1 Build + dev + homepage

```
$ bun run build            ✓ built in 8.05s        (exit 0)
$ bun run dev              VITE v5.4.21 ready — http://localhost:8083/
```
Homepage probe (real Chrome, main-world eval):
```
{"title":"Insurance Agency Coaching for Owners Who Want More | The Sta",
 "h1":"RAISE YOUR STANDARD","h1font":"Anton","bodyBg":"rgb(11, 11, 12)",
 "sections":11,"imgs":11,"errors":"none"}
```
Bundle-split negative (marketing bundle unaffected): entry chunk built from
`main` = **1,703,236 B**; from this branch = **1,709,273 B** (+6,037 B = route
registration only). The member app lives in its own lazy chunks
(`MemberAppRoutes-*.js`, `LoginRoute-*.js`, `app-*.js`). Only 6 pre-existing
files modified on the whole branch (`git diff --name-status main...HEAD | rg ^M`):
`.gitignore`, `bun.lock`, `package.json`, `src/App.tsx` (the two permitted
routes), `src/integrations/supabase/types.ts` (regenerated), `supabase/config.toml`.

## §9.2 Login rejection + self-signup

- Bad credentials via UI: form shows **"Invalid login credentials"**, no session.
- No signup UI anywhere (login page states "Accounts are created by Justin.
  There is no self-signup.").
- Local stack (`enable_signup = false` in config.toml):
  `POST /auth/v1/signup → 422 {"error_code":"signup_disabled"}`.
- **HOSTED project: `POST https://puidotfmyrouxezsorlt.supabase.co/auth/v1/signup → HTTP 200`** —
  signups are OPEN and the probe created stub user
  `gate-probe-not-real@test.invalid` (`386e494d-00b5-40d7-9832-9d99bb7374f0`).
  ⚠️ On Justin's checklist: flip the dashboard toggle and delete that stub.
  Mitigation until then: no `members` row → `is_active_member()` false → zero
  data access + every member fn 403s.

## §9.3 Admin creates a client; client logs in

Via `/app/admin` UI as justin@hfiagencies.com: "New client" → Client D
(`clientd@test.local`) → toast **"Client created"**, listed immediately.
```
D login: token issued        (password grant on local auth)
```
Edge-fn authorization proofs (`admin-manage-member`):
```
non-admin caller           → 403 {"error":"Admin access required"}
forged body ("is_admin":true, "caller_is_admin":true) → 403
no Authorization header    → 401
admin cannot deactivate own account → 400
```

## §9.4 Client feature journey (Client C unless noted; UI = real Chrome)

| Feature | Evidence |
|---|---|
| Core 4 day | UI toggles BODY→BEING→BALANCE→BUSINESS; ring 2/56 → 5/56; DB row `t|t|t|t` for 2026-07-11 |
| Flow session (text) | Full lifecycle with ZERO ElevenLabs config: `start_flow_session` (grateful) → 14 × `submit_flow_answer` (each `success:true` + next question) → `complete_flow_session` `success:true` → row `status=completed`, title saved; `ai_analysis_json` stayed `null` because analyze 503'd honestly (no fake success) |
| Power Play onto a day | UI New-item dialog → Schedule dialog → Saturday: DB `zone=power_play, scheduled_date=2026-07-11, week_key=2026-W28`; completed via hub checkbox → `completed=t, completed_at` set |
| One Big Thing | Real dnd-kit drag (pointer-event sequence on the drag handle) → DB `zone=one_big_thing` |
| Daily Frame | daily-frame flow completed (12 answers) → `daily_frame_commitments` row created (`business`, `open`) with NO AI keys; hub widget rendered it; widget checkbox → fn `mark_complete` → DB `completed` + `completed_at` |
| Monthly Mission | UI Add Mission (business) → DB `active`, `month_year=2026-07` |
| Quarterly Target | UI wizard: Brain Dump (4 targets) → selection (works WITHOUT AI, "Not analyzed" badges) → Lock In → `life_targets_quarterly` row with all four targets |
| Theta | Wizard pulled saved quarterly targets automatically; targets saved (`theta_targets` row via `theta_audio_state`); tone step renders; generation → toast **"AI isn't configured yet (missing ANTHROPIC_API_KEY)"** |
| Debrief | Clean run as **Client A**: wizard → seal → `completeDebrief` PATCH 200 → `analyze_debrief` 503 caught (toast path) → review `completed`, snapshot `1/56` (her own data). Client C's earlier "Sealing…" hang was traced to my own mid-wizard HMR edits, not product code — the instrumented rerun shows the seal path settling correctly |
| Hub ring | 2/56 → 3 → 5 → debrief snapshot 6/56 = Core4 4 + Flows 1 + Playbook 1: all three sources feed the 56-point ring |

Graceful no-key states demonstrated per surface (all structured 503s):
```
life_targets_measurability → "AI isn't configured yet (missing OPENAI_API_KEY)"   (also shown as UI toast)
refine_flow_action_item    → "AI isn't configured yet (missing OPENAI_API_KEY)"
generate_affirmations      → "AI isn't configured yet (missing ANTHROPIC_API_KEY)" (also UI toast)
generate_theta_track       → "Audio generation isn't configured yet (missing ELEVEN_API_KEY/ELEVENLABS_API_KEY)"
analyze_debrief            → "AI feedback isn't configured yet (missing ANTHROPIC_API_KEY)"
start_flow_session         → 200 with structured voice_error VOICE_NOT_CONFIGURED; text mode proceeds
```

## §9.5 Two-client isolation (real queries, real JWTs)

```
A queries B's rows on core4_entries, focus_items, flow_sessions,
weekly_reviews, life_targets_quarterly, theta_targets,
daily_frame_commitments             → [] on every table
A INSERT with B's user_id           → 42501 RLS violation
A UPDATE own row SET user_id=B      → 42501 (core4_entries AND focus_items)
A INSERT flow_challenge_logs referencing C's session → 42501
```
UI-level: Client A's debrief showed **her** 1/56, not C's 6/56.

## §9.6 Deactivate / reactivate (live session)

Via the admin UI toggle on Client D (holding a live token minted beforehand):
```
toast: "Member deactivated — sessions revoked"
D's LIVE token, own members row  → [{"is_active":false}]  (data tables → [])
D re-login                        → 400 {"error_code":"user_banned"}
D refresh token                   → 400 "Invalid Refresh Token: User Banned"
reactivate via toggle             → login OK, prior data intact
```
Deactivated-member sweep: **all 15 member tables return `[]`** on a live token.
Service-role flow functions are covered too (advisor-driven fix): a
deactivated member's valid flow `session_token` now gets
`403 {"code":"MEMBER_INACTIVE"}` on `submit_flow_answer`/`get_flow_state`
(proved live before/after the toggle).
Design note: the ban blocks re-login/refresh; the thing cutting live data
access is `is_active_member()` in RLS + `verifyFlowSession` — keep both.

## §9.7 Grep gates (each proven with a planted known-bad control first)

a) `rg -i "agencybrain|myagencybrain|wjqyccbytctqwceuhzhk"` — control caught,
   removed. Added code (`src/app`, `supabase/functions`, `supabase/migrations`,
   `src/App.tsx`): **exit 1, zero hits**. Repo-wide hits exist only in
   **pre-existing marketing pages** that sell AgencyBrain (BoldMockup, Privacy,
   PricingSection, …) — `comm -12` of gate hits × branch-changed files = empty.
b) `rg "agency_id|membership_tier|subscription_status|has_agency_access|staff_users|key_employees|useSubscription"`
   over `src/app` + all 17 new fn dirs + `_shared` — control caught; real run
   **exit 1, zero hits**.
c) `rg "service_role" dist/` after build — control planted in a dist JS and
   caught; clean rebuild **exit 1, zero hits**. Bonus sweeps: `sk-ant-|sk-proj-|
   xi-api|SUPABASE_SERVICE_ROLE_KEY` in dist → zero; `.env` files in branch
   history (`--diff-filter=A`) → zero; `.env.local` git-ignored (`git
   check-ignore` passes) and absent from `git ls-files`.
Also: `toISOString().split/.slice` in added code → zero hits.

## §9.8 RLS enabled everywhere

```
ENABLE ROW LEVEL SECURITY statements in 20260711* migrations: 16
pg_class rows with relrowsecurity=true across the 16 new tables: 16
```
`pg_policies` sweep for member-facing policies missing `is_active_member()`:
the only 8 are by design — `members_select_own` (deactivated member must see
their inactive state), 4 admin policies (they gate through
`is_admin_member()`, which itself requires `is_active`), and the
`daily_frame_commitments_service_all` service-role policy.
`storage.buckets`: only `binaural-beats | public=t` (static background audio
by design; no user data).

## §9.9 Per-table schema proof (source → new)

Every source quote below was read directly from the source migration named;
the new DDL is in this repo's `supabase/migrations/20260711...` files. All new
member policies additionally require `public.is_active_member(auth.uid())` —
abbreviated **+active** below.

**members** (NEW — no source table). `20260711170000`: `id uuid PK REFERENCES
auth.users`, `full_name`, `email UNIQUE`, `is_active bool NOT NULL DEFAULT
true`, `is_admin bool NOT NULL DEFAULT false`, timestamps. Policies:
`members_select_own (id = auth.uid())`, admin select/update via
`is_admin_member()` (SECURITY DEFINER — no self-recursion; proved by live query).

**core4_entries** — source `20251223144953`: `CREATE TABLE public.core4_entries
(id uuid PK …, user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE
CASCADE, date date NOT NULL DEFAULT current_date, body/being/balance/
business_completed boolean, *_note text, …, UNIQUE(user_id, date))`; policies
`"Users can view own entries" USING (auth.uid() = user_id)` (+insert/update/
delete same) plus `"Agency owners can view team entries" USING
(is_agency_owner_of_staff(user_id))`. New `20260711170100`: identical columns;
owner policies kept **+active**; the agency-owner policy and the
`get_user_agency_id`/`is_agency_owner_of_staff` helpers **dropped**.

**core4_monthly_missions** — source `20251223144953`: user_id NOT NULL, domain
CHECK (body/being/balance/business), title, items jsonb, weekly_measurable,
status CHECK (active/completed/archived), month_year; policy `"Users can
manage own missions" FOR ALL USING (auth.uid() = user_id)` + agency-owner
SELECT. Source `20260709120000` added partial unique
`(user_id, domain, month_year) WHERE status='active'`. New: same columns +
same partial unique; owner policy **+active**; agency policy dropped.

**focus_items** — source `20251111042528`: `user_id uuid NOT NULL`,
`agency_id uuid NULL REFERENCES agencies`, title, description, priority_level
CHECK, column_status CHECK, column_order, completed_at; owner policies
`auth.uid() = user_id` ×4 + profiles-role-admin policies. Source
`20251217021056` added `team_member_id`; `20251217120341` made user_id
nullable (staff); `20251224123242` added source_type/source_name/
source_session_id (+ mirror columns later); `20260313100000` added zone CHECK
(bench/power_play/queue) + scheduled_date/domain/sub_tag_id/week_key/completed
+ completed_at trigger + `get_power_play_count(p_user_id, p_team_member_id,…)`;
`20260313140000` widened zone CHECK to `one_big_thing` + completion_proof/
completion_feeling; `20260411140000` added scheduled_time. New
`20260711170200`: **user_id NOT NULL restored**; `agency_id`,
`team_member_id`, `source_mirror_analysis_id`, `source_action_index`,
`source_staff_flow_session_id` **dropped**; all playbook columns kept; zone
CHECK includes one_big_thing; completed_at trigger ported verbatim;
`get_power_play_count(p_user_id, p_date, p_exclude_id)` — staff parameter
dropped; owner policies ×4 **+active**; profiles-admin policies dropped.

**playbook_tags** (reworked from `agency_playbook_tags`) — source
`20260313100000`: `agency_id uuid NOT NULL REFERENCES agencies`, domain CHECK,
name, is_active, sort_order, `UNIQUE(agency_id, domain, name)`; SELECT policy
`has_agency_access(auth.uid(), agency_id)`; write policies via profiles
role/agency. New: **no agency_id**, `UNIQUE(domain, name)`; SELECT for any
active member; INSERT/UPDATE/DELETE via `is_admin_member()`. Seeded 13
default tags (Justin to approve).

**flow_profiles / flow_templates / flow_sessions / flow_challenge_logs** —
source `20251208201553` (one migration defines the 4-table family):
flow_profiles user-scoped `UNIQUE(user_id)` with `"users_own_flow_profile"
FOR ALL USING (auth.uid() = user_id)`; flow_templates global with
`"authenticated_can_read_active_templates" (auth.uid() IS NOT NULL AND
is_active)` + profiles-admin manage; flow_sessions user-scoped
`"users_own_flow_sessions" FOR ALL USING (auth.uid() = user_id)`;
flow_challenge_logs `session_id IN (SELECT id FROM flow_sessions WHERE
user_id = auth.uid())`. Plus `20251221202440` (5 profile columns),
`20260518100000` (session_token/current_question_id/agent_metadata),
`20260403101500` (one-in-progress partial unique). New `20260711170300`: all
of the above consolidated; templates readable by **active members** and
managed by admins **+active**; sessions/profiles/logs policies **+active**;
template content seeded by replaying the source's 8 template INSERTs + 9
template-only UPDATE migrations (each verified to touch only flow_templates);
"the agency" wording in the daily-frame template rebranded.

**weekly_reviews** — source `20260313200000`: user_id NOT NULL, `agency_id
uuid NULL`, week_key, core4/flow/playbook/total_points, domain_reflections
jsonb, gratitude_note, next_week_one_big_thing, status CHECK, completed_at,
current_step, `UNIQUE(user_id, week_key)`; policies `auth.uid() = user_id`
(select/insert/update). Plus `20260314060000` coaching_analysis and
`20260711100000` analysis_generation_started_at/completed_at. New
`20260711170400`: same minus **agency_id (dropped)**; policies **+active**;
staff_weekly_reviews **not ported**.

**life_targets_quarterly** — source `20251115002037` (drop+recreate,
user-scoped): user_id NOT NULL, quarter, per-domain target/monthly_missions/
daily_habit/narrative, raw_session_data, `UNIQUE(user_id, quarter)`; policy
`"Users can manage their own life targets" FOR ALL USING/WITH CHECK
(auth.uid() = user_id)` + profiles-admin SELECT. Plus `20251115134331`
(target2/narrative2/primary flags), `20251115194143` (daily_actions),
`20260412120000` (action_pool). New `20260711170500`: full 42-column owner
shape; owner policy **+active**; admin policy dropped.

**life_targets_brainstorm** (off-list discovery) — source `20251115134331`:
user_id NOT NULL, quarter, domain CHECK, target_text, clarity_score CHECK
0-10, rewritten_target, is_selected, is_primary, `UNIQUE(user_id, quarter,
domain, target_text)`; owner FOR ALL policy. New: same + `session_id text`
(source added it later; present in source generated types); **+active**.

**theta_targets / theta_affirmations / theta_tracks** — source `20251113163631`
created 5 public lead-capture tables with `USING (true)` policies; renames
`20251113165655` (faith/family/fitness/finance → body/being/balance/business),
tones `20251113174918` (inspiring/motivational/calm/energizing), tracks
`20251113171332` + `20251114132102` (audio_url dropped — client-side mixing),
hardening `20260710190000` (agency_id + staff_user_id + exactly-one-actor
constraints, session uniques, owner-only SELECT policies) and
`20260710210000` (advisory-lock trigger against concurrent generation). New
`20260711170600`: **user_id NOT NULL** (single-actor — agency/staff columns
never exist), 4B columns, `theta_targets.session_id UNIQUE`,
`theta_affirmations` category/tone CHECKs + order_index 0-4 +
`(session_id, category, order_index)` unique, `theta_tracks` without
audio_url + status CHECK + the advisory-lock trigger verbatim; owner SELECT
policies **+active**; writes go through the edge functions (service role)
which enforce ownership — mirrors the hardened source model.
`theta_voice_tracks`/`theta_final_tracks`/`theta_track_leads` **not ported**
(legacy of the pre-client-side-mixing era; unused by current pages).

**daily_frame_commitments** — source `20260601123000`: `agency_id uuid NOT
NULL`, dual `owner_user_id`/`staff_user_id` + `num_nonnulls(...) = 1` checks,
dual session FKs, per-actor partial unique indexes, agency-validating
trigger, service-role ALL policy + owner SELECT + admin(1:1-tier) SELECT,
`REVOKE UPDATE FROM authenticated`. New `20260711170700`: **single `user_id
NOT NULL`**, one `flow_session_id` FK, `UNIQUE(user_id, frame_date)`,
status/completed_at consistency CHECK kept, simplified trigger (linked flow
session must belong to the same user), service-role ALL + owner SELECT
**+active**, UPDATE still revoked from authenticated (writes only via the
`daily-frame-commitments` function).

## §9.10 Blast radius

```
$ git diff --stat main...HEAD | tail -1
 210 files changed, 42528 insertions(+), 40 deletions(-)
Modified (M) files: .gitignore, bun.lock, package.json, src/App.tsx,
                    src/integrations/supabase/types.ts, supabase/config.toml
All 8 pre-existing edge functions: git diff --quiet → identical (each listed)
Lead-capture tables: untouched (no 20260711* migration references them;
                     types.ts regeneration includes them unchanged)
```
Note: `/app` previously redirected to app.wakeupwarrior.com (`AppRedirect.tsx`,
now unrouted — file intact). The handoff's goal statement mandates `/app`.

## §9.11 Source repo delta

```
baseline HEAD  aec1e708132f1ca34e44630b827485a09f7979f3
end-of-run     12d0da1c47eb73570427f8bee166c9b6017a3564   ← differs
status --porcelain diff vs baseline: EMPTY  (working tree identical)
```
The HEAD move is **Justin's own parallel-session commit** (reflog:
`12d0da1c4 HEAD@{12:24}: commit: fix(coaching): avoid partial-index evidence
upserts`, author Justin — my baseline was captured at ~11:33). This run
executed zero write/git-mutating commands in the source repo; the empty
porcelain delta confirms no tree changes.

## §9.12 Inventory + Justin's runbook

**Migrations added (8):** `20260711170000_member_app_members` · `…170100_core4`
· `…170200_playbook` · `…170300_flows` · `…170400_debrief` ·
`…170500_life_targets` · `…170600_theta` · `…170700_daily_frame`.

**Edge functions added (17):** admin-manage-member · start_flow_session ·
submit_flow_answer · save_flow_agent_responses · complete_flow_session ·
analyze_flow_session · refine_flow_action_item · get_flow_state ·
analyze_debrief · life_targets_daily_actions · life_targets_measurability ·
life_targets_monthly_missions · theta_audio_state · generate_theta_track ·
generate_affirmations · generate_voice_sample (auth ADDED — source had none) ·
daily-frame-commitments. Plus `_shared/{cors,supabaseKeys,memberAuth,
flow_types,flow_agent_runtime,daily_frame,email-template}.ts` and
`theta_audio_state/thetaAudio.ts`. All registered in `config.toml` with the
source's verify_jwt flags.

**Secrets Justin must set (Supabase → Edge Functions → Secrets):**
`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `ELEVEN_API_KEY` **and**
`ELEVENLABS_API_KEY` (same value), `ELEVEN_FLOW_AGENT_ID` (after creating the
ConvAI agent), optional `RESEND_API_KEY`. Frontend voice mode also reads
`VITE_ELEVENLABS_AGENT_ID` at build time (optional; degrades to text).

**Dashboard-only steps:** disable self-signups (and delete stub user
`386e494d-00b5-40d7-9832-9d99bb7374f0`); upload `21m.mp3` to the
`binaural-beats` bucket (export it from AgencyBrain's same-named bucket);
create the ElevenLabs ConvAI agent.

**Ship sequence (in order):**
1. Review + merge/push `feat/member-app` (nothing was pushed by this run).
2. Apply migrations to the hosted project (collision-checked: all 16 table
   names returned PGRST205/absent on hosted; local apply on top of the same
   marketing migrations was clean).
3. Deploy the 17 edge functions; set secrets (step above — set secrets first).
4. Disable signups; upload 21m.mp3; create ConvAI agent.
5. Seed the admin row (SQL editor):
   ```sql
   -- after creating justin@hfiagencies.com via Auth (or use an existing auth user)
   insert into public.members (id, full_name, email, is_admin)
   values ('<justin-auth-user-id>', 'Justin Harkelroad', 'justin@hfiagencies.com', true);
   ```
6. Publish the frontend. NOTE per repo memory: this repo deploys via
   Cloudflare Pages on push (og-stamp pipeline) — do NOT use Lovable Publish.
7. SPA fallback: `dist/` has no rewrite config in-repo; existing client routes
   (e.g. /mirror/score) already rely on the host's SPA fallback, so `/app/*`
   deep links ride the same mechanism — spot-check one deep link after deploy.
8. Approve/adjust the 13 seeded `playbook_tags`; decide if the old
   `/app` → wakeupwarrior redirect needs a new home.

**Deferred/decisions:** `send-debrief-reminder` skipped (future work);
flow-share + Exchange stripped (out of scope); help-content system stubbed;
AI-key happy paths unverified until secrets exist (§7.5 degradation verified
everywhere instead); no AI rate limiting (closed roster, revisit later).

---

## Post-audit hardening (advisor + Cato findings, all closed)

The E5 verification pass ran a commitment-boundary advisor review plus a Cato
audit (note: Cato's codex/GPT-5.4 cross-vendor call timed out at its 120s cap,
so its verdict is a second same-family read, not a true cross-vendor audit —
its "concerns" verdict and every finding are addressed below):

1. **Flow session_token kill switch** (advisor P0): the five session-token flow
   functions run service-role and previously honored a deactivated member's
   live session_token. Fixed in `verifyFlowSession` (members.is_active check).
   Proof: active submit 200 → deactivate → same token
   `403 {"code":"MEMBER_INACTIVE"}` on submit_flow_answer and get_flow_state.
2. **Per-function deactivation proof** (Cato major): a deactivated member's
   still-valid JWT probed against every service-role family:
   daily-frame-commitments, theta_audio_state, life_targets_measurability,
   analyze_debrief, refine_flow_action_item, generate_affirmations,
   generate_voice_sample, start_flow_session, analyze_flow_session —
   **all 9 return 403 "Your access is inactive — contact Justin."**
   (analyze_debrief initially returned its missing-key 503 first; reordered so
   auth precedes configuration checks, then re-proved.)
3. **analyze_flow_session caller scoping** (Cato minor): gateway verify_jwt
   only guarantees *some* JWT; added owner+active check for non-service
   bearers. Proof: active member A passing C's session_id →
   `403 {"error":"Not authorized for this session"}`; fn-to-fn service-key
   path unchanged.
4. **session_token never logged** (Cato minor): `buildFlowRequestLogEnvelope`
   whitelists fields (session_id, question_id, answerLength, …) — the token is
   not among them.
5. **Reassignment/`WITH CHECK` probes** (advisor): A updating own row to
   `user_id = B` → 42501 on core4_entries and focus_items; A inserting
   flow_challenge_logs against C's session → 42501.
6. **pg_policies sweep + bucket audit** (advisor): quoted in §9.8.
7. Hosted collision probe: all 16 new table names absent on
   puidotfmyrouxezsorlt (PGRST205 each).

Cato's remaining recommendation (rerun a true cross-vendor codex audit with
artifact paths wired into the ISA) is logged as an open item — the 120s
tool cap prevented it this run.

Local stack left RUNNING for inspection: API http://127.0.0.1:56321, Studio
http://127.0.0.1:56323, dev server http://localhost:8083 (`supabase stop`
in this repo shuts the stack down; it is isolated from the other local
Supabase projects by the 563xx ports).
