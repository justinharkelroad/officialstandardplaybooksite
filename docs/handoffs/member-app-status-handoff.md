# HANDOFF — Standard Playbook Member App (post-launch state)

> Written 2026-07-12. The app is **LIVE in production**. This doc is for a fresh
> context window picking up the remaining work. Read §0 and §1 before touching
> anything.

## 0. What this is

A members-only personal-growth app at **standardplaybook.com/app**, transplanted
from the AgencyBrain codebase (insurance platform) and rebranded for Justin's
non-insurance coaching clients. It shipped on 2026-07-11/12 (25 commits, all on
`main`, all deployed).

Justin (`justin@hfiagencies.com`) is the only account. He creates clients from
`/app/admin`; each client gets private, RLS-isolated data and can be switched
off/on with a toggle.

**Prior docs (read if you need depth):**
- `docs/handoffs/personal-growth-app-handoff.md` — the original build brief
- `docs/handoffs/member-app-acceptance-report.md` — §9 acceptance evidence
- `BLOCKED.md` — discoveries + Justin-only steps (mostly resolved now)

---

## 1. Architecture — the part people get wrong

Three separate deploy pipelines. Confusing them wastes hours:

| What changed | Who deploys it | How |
|---|---|---|
| **Frontend** (`src/**`, `public/_headers`) | **Cloudflare Pages** | Automatic on push to `main`. ~2 min. |
| **Edge functions** (`supabase/functions/**`) | **Lovable Cloud** | Push to `main`, then **ask Lovable in chat** to deploy. It does NOT auto-deploy. |
| **Database** (`supabase/migrations/**`) | Nobody | Paste SQL by hand into **Lovable Cloud → Database → SQL editor**. |

- **NEVER press Lovable's "Publish" button.** It has wiped OG cards before.
  Cloudflare owns the frontend.
- The Supabase project (`puidotfmyrouxezsorlt`) lives **inside Lovable Cloud**,
  under Lovable's org — it is NOT in Justin's supabase.com dashboard, and the
  Supabase CLI cannot link to it. Lovable's Cloud panel (More → Cloud) is the
  only door: Overview / AI / Emails / Database / Users / Storage / Secrets /
  Jobs / Edge functions / Logs.
- **Secrets are injected at function-deploy time.** Adding a secret does NOT
  affect already-deployed functions — you must ask Lovable to redeploy. This
  cost us an hour; don't relearn it.

**Local dev:** `bun run dev` (Vite, usually :8080). Local Supabase stack on
offset ports (API 56321, DB 56322, Studio 56323) — `supabase start`. Never
`supabase db push/reset/link`. `.env.local` points the app at the local stack
and is gitignored.

**Verification habit that mattered:** puppeteer against the dev server
(`/private/tmp/.../scratchpad/*.mjs` pattern) — log in as
`justin@hfiagencies.com` / `LocalAdmin!234` (local only), drive the UI, assert
computed styles and DB rows. Interceptor's screenshot channel is flaky; DOM +
computed-style probes are the reliable fallback.

---

## 2. Current state

### Working in production (verified)
- Login, auth guard, active-member kill switch
- `/app/admin`: create client, reset password, activate/deactivate (bans the
  auth user → kills refresh + re-login; RLS `is_active_member()` cuts live
  sessions' data access). Client list loads.
- Hub (56-pt weekly ring), Core 4, Weekly Playbook (drag Power Plays, One Big
  Thing), Daily Frame, Monthly Missions, Life Targets (brainstorm → selection →
  quarterly → missions → daily → cascade), Debrief, Flows (text mode), 90 Day
  Audio UI
- Sidebar shell (collapsible, persisted, mobile drawer), dark/light toggle,
  Bold editorial design in black/white/blue, STANDARD logo (auto-inverts)
- 16 tables, RLS on all, 23 edge functions deployed, all API keys set
- Self-signup disabled; `21m.mp3` uploaded to the `binaural-beats` bucket

### Open item #1 — VOICE MODE hang — RESOLVED 2026-07-12

> **The §2 "top suspect" below was WRONG. Left in place for the record; do not
> chase it.** There was never a signed URL to mismatch a transport with. Three
> real causes, all verified with live probes:
>
> 1. **`VITE_ELEVENLABS_AGENT_ID` was never set for the frontend build.**
>    This was the hard blocker. `agentId` (`useFlowAgentSession.ts:1165`) was
>    `undefined`, so `if (!agentId) throw` at :1188 always fired and esbuild
>    **dead-code-eliminated the entire rest of `startConversation`**. Proof: the
>    deployed bundle contains the line-1189 throw but NOT the mic-permission
>    throw 11 lines later, and no agent id anywhere. Voice could never start
>    client-side. **Fixed:** added to the committed `.env`, which is where this
>    app's frontend build vars live (Cloudflare Pages has *no* variables set —
>    `VITE_SUPABASE_*` come from `.env` too). Not a secret: it ships in the
>    public bundle by design, same as the Supabase publishable key.
>    Note this also means any local artifact grep for voice code returns nothing
>    unless the var is set — the DCE will hide your own edits.
> 2. **`ELEVEN_API_KEY` (Lovable secret) lacks the `convai_write` permission.**
>    ElevenLabs 401s both `get_signed_url` and `/token`, so the server returns
>    `voice_session: null` + `voice_error: VOICE_SESSION_FAILED`. Verbatim from
>    the function logs: *"The API key you used is missing the permission
>    convai_write."* *Fix: enable it on the key in ElevenLabs. No redeploy —
>    the secret's value doesn't change.*
> 3. **The client ignored `voice_error` entirely** — it wasn't even on the
>    `StartFlowSessionResponse` type. With no voice session it fell through to
>    connecting with a bare `agentId`, which cannot work now that `enable_auth`
>    is ON, so the SDK sat in `connecting` forever with no error. *Fixed in
>    code: the hook now throws the server's actual message.*
>
> 4. **CSP had no `blob:` in `script-src`.** The ElevenLabs SDK builds its audio
>    processor as an AudioWorklet from a `blob:` URL, and worklets are governed
>    by `script-src`. Proven in the live page: `audioWorklet.addModule(blob)` →
>    `AbortError: Unable to load a worklet's module.` The socket connected and
>    the agent sent `conversation_initiation_metadata`, then the SDK stalled in
>    `connecting` forever because its audio pipeline never loaded.
> 5. **The auto-start effect retried forever and hid the error.** It guarded only
>    on `connectionStartedRef`, which stays false when a connect fails, and
>    `begin` changes identity most renders — so it re-fired every ~2s, called
>    `endSession()` on the still-connecting socket, and cleared the error message
>    before it could render. Observed: 9 `conversation_start` logs sharing one
>    `sessionId`, 8 sockets opened and killed (1006/1005), console clean. This is
>    why four separate bugs presented as one silent "Connecting…".
>
> **ALL RESOLVED. Voice works in production** — agent connects and speaks
> (1 socket, 21 messages, one `conversation_start`). Commits `0998f81`,
> `6f70dce`, `533245b`.

### Original (refuted) analysis — VOICE MODE hangs at "Connecting"

**Symptom:** open a flow → Voice → banner clears, shows "Connecting…" forever.
No console error. (Earlier it said "not configured"; that's fixed.)

**Three blockers were already fixed to get this far:**
1. Agent had `enable_auth: false` → ElevenLabs won't issue a signed URL for a
   public agent. Justin toggled auth ON.
2. `public/_headers` had `Permissions-Policy: microphone=()` (site-wide mic kill)
   and a `connect-src` with no ElevenLabs. Both fixed (commit `bfd4d26`).
3. Functions were deployed before the secrets existed. Redeployed; they now see
   `ELEVEN_API_KEY` / `ELEVEN_FLOW_AGENT_ID`.

**Top suspect (unverified):** transport mismatch in
`src/app/hooks/useFlowAgentSession.ts`:
- `supabase/functions/start_flow_session/index.ts` tries `get_signed_url` first
  and returns `{ signed_url, connection_type: "websocket" }`; only if that fails
  does it try `/token` → `{ conversation_token, connection_type: "webrtc" }`.
- The client (~line 1219) does
  `connectionType: mode === 'voice' ? 'webrtc' : 'websocket'` — i.e. it forces
  **webrtc** while handing the SDK a **signed URL** (a websocket credential).
  A mismatched transport would hang exactly like this.
- **Fix direction:** honor the server's `connection_type` instead of hardcoding
  it (`voiceSession.connection_type` is already returned and logged).

**Second suspect:** dependency skew — `@11labs/react@^0.2.0` (old, deprecated
package name) alongside `@elevenlabs/client@^0.9.1`. The React wrapper may not
speak the current protocol. Consider migrating to `@elevenlabs/react`.

**How to debug:** DevTools → Network → WS tab. Is a WebSocket to
`api.elevenlabs.io` opening? Does it 101 then close? Also Lovable Cloud → Edge
functions → `start_flow_session` → Logs (it console.warns the ElevenLabs status
+ body on failure).

**Voice agent facts:**
- Agent: `The Flow Master Standard Playbook` = `agent_3801kx9g44saf0assrct6xjfa8hb`
- Tools: FOUR custom ones, prefixed `sp_` (`sp_start_flow_session`,
  `sp_submit_flow_answer`, `sp_get_flow_state`, `sp_complete_flow_session`),
  pointed at `https://puidotfmyrouxezsorlt.supabase.co/functions/v1/...`
- ⚠️ **The unprefixed tools in that ElevenLabs workspace belong to AgencyBrain's
  LIVE production agents. NEVER edit them.** Editing them once already broke
  AgencyBrain's voice flows mid-session. Only touch `sp_*`.
- `evaluate_answer_quality` does not exist in this app (never ported) — don't
  add it back to the agent.

### Open item #1b — AUTH DEADLOCK strands the whole app (found 2026-07-12)

`src/app/lib/auth.tsx` awaited a Supabase query (`fetchMemberRow`) **inside** the
`onAuthStateChange` callback. That callback runs while supabase-js holds the
`lock:sb-<project>-auth-token` Web Lock, and awaiting a Supabase call in there
never releases it. Web Locks are **origin-wide**, so one stranded tab poisons
every other tab: they make *zero* Supabase requests and sit on the auth spinner
forever, with no console error.

Observed live on prod: the lock was held `exclusive` indefinitely by a
long-lived tab (confirmed by comparing `clientId`s via `navigator.locks.query()`
— the holder was not the tab under test). Fixed by setting the session
synchronously and deferring the member query out of the lock with `setTimeout`.

**Not reproducible on a fresh local load** — a clean-code control also loaded
fine, so the trigger is almost certainly `TOKEN_REFRESHED` on a long-lived tab,
not `INITIAL_SESSION`. The fix follows Supabase's documented guidance, but it is
**verified in artifact only, not by live repro.** Re-probe after deploy:
`navigator.locks.query()` on `/app` should show no held auth lock.

### RESOLVED 2026-07-12 — voice, auth deadlock, Bible Flow

All verified by live probe against production, not by inspection:

- **Voice mode works.** Signed URL → WebSocket → agent connected and speaking
  (1 socket, 21 messages, one `conversation_start`). Took four stacked causes:
  missing `VITE_ELEVENLABS_AGENT_ID` (DCE'd the code), an ElevenLabs key without
  `convai_write`, a client that ignored `voice_error`, and a CSP with no `blob:`
  for the SDK's AudioWorklet — plus an auto-start effect that looped forever and
  hid all of it. Commits `0998f81`, `6f70dce`, `533245b`.
- **Auth deadlock fixed** (see #1b below).
- **Bible Flow scripture lookup works.** `resolve_bible_scripture` ported +
  deployed, `API_BIBLE_API_KEY` set. FIND and REFERENCE both return real MSG
  passages; the key IS licensed for The Message. Commit `746de59`.
- **Keys verified live:** `ELEVEN_API_KEY` (Agents + Text-to-Speech),
  `OPENAI_API_KEY` (real model output), `API_BIBLE_API_KEY`.

**Cruft:** `ELEVENLABS_API_KEY` exists in Lovable secrets but no code reads it
(everything uses `ELEVEN_API_KEY`). Safe to delete; a rotation of the wrong one
would be a confusing afternoon.

### Open item #2 — RESOLVED 2026-07-12: every AI surface proven

All five keys are now exercised end to end against production. Nothing in the
AI stack is unverified.

| Surface | Key | Status |
|---|---|---|
| Flow voice mode | `ELEVEN_API_KEY` (Agents / convai_write) | agent connects + speaks |
| Text flow → `analyze_flow_session` | `OPENAI_API_KEY` | real analysis; pulls TELOS context |
| `refine_flow_action_item` | `OPENAI_API_KEY` | sharpened declaration → Weekly Playbook |
| Debrief → coaching report | `ANTHROPIC_API_KEY` | report returned |
| 90 Day Audio (affirmations → track → bucket) | `ANTHROPIC_API_KEY` + `ELEVEN_API_KEY` (TTS) | track generated + downloaded |
| Bible Flow scripture lookup | `API_BIBLE_API_KEY` | FIND + REFERENCE return real MSG passages |

Getting here took four stacked bug fixes, none of which were the key itself:
`0998f81` `6f70dce` `533245b` (voice), `3745019` (debrief 42703 claim),
`c33774a` (sealed-debrief dead end), `746de59` (Bible port), `9db49ca`
(dark-mode Selects).

**Cruft:** `ELEVENLABS_API_KEY` exists in Lovable secrets but no code reads it
(everything uses `ELEVEN_API_KEY`). Safe to delete; rotating the wrong one some
day would be a confusing afternoon.

### Open item #3 — never validated end to end
No real client has used the app yet. The acceptance run was done against a local
stack with seeded test users.

---

## 3. Known landmines

- **Marketing components hardcode inline styles.** `src/components/ui/dialog.tsx`
  sets `color: '#1d1d1f'` inline on `DialogTitle` — unreadable in the app's dark
  mode, and inline styles beat CSS. The app has its own token-based copies under
  `src/app/components/ui/`. **App code must import dialogs/cards from
  `@/app/components/ui/`, never `@/components/ui/dialog`.**
- **Radix portals escape the theme scope — and `app.css` only half-fixes it.**
  Dialogs, selects, popovers and toasts render on `<body>`, outside
  `.member-app`, so scoped tokens don't reach them and `bg-background` resolves
  to the MARKETING token. Measured: the same `bg-background` element computes
  `rgb(255,255,255)` outside the scope and `rgb(12,12,13)` inside.
  `app.css` force-darkens the portalled *container* via `[data-sp-theme="dark"]
  [role="dialog"]`, but **`background` does not inherit** — so token-styled
  *children* (select triggers, inputs) stayed white inside a correct-looking dark
  dialog. That's the trap: the dialog looks right, the fields inside it don't.
  **The rule: every portalled surface must carry `spScopeClass()`**
  (`src/app/lib/theme.ts`), which re-applies `member-app [dark]`. App `Select`
  (`@/app/components/ui/select`) does this for you — import from there, never
  `@/components/ui/select`. Fixed in `9db49ca`; `Popover`/`DropdownMenu`/
  `Tooltip` have no app-scoped copy yet, so scope them by hand if you use them.
- **Route prefixes.** Every member route needs `/app`. A `sed` pass that only
  covered quoted strings missed template literals — ``navigate(`/flows/start/${slug}`)``
  shipped and 404'd. Grep both forms when touching routes.
- **Immersive flow surfaces** (`flows/start|session|complete|view`) render
  OUTSIDE `AppShell`, inside `ImmersiveFrame` — they set `min-h-screen` and pin
  a composer to the bottom, so nesting them in the padded `<main>` cut the
  composer off. Keep them out of the shell.
- **Vite's watcher misses python/sed edits.** If a change "doesn't apply,"
  restart the dev server before debugging phantom bugs.
- **Verify the committed artifact, not the working tree.** A chained
  `git add && commit && push` where the push was blocked left a half-commit on
  `main` (file moved, imports not updated) that broke the function bundler.
  Use `git show HEAD:path` to confirm.
- **Edge functions can't import across function dirs.** Shared code goes in
  `supabase/functions/_shared/` or the bundler fails.
- **A missing `VITE_*` var can silently delete the code you're inspecting.**
  `import.meta.env.VITE_X` is inlined at build time; if it's unset it becomes
  `undefined`, an early `if (!x) throw` becomes always-true, and esbuild
  dead-code-eliminates *everything after it*. Grepping `dist/` for your own edit
  then returns nothing and looks like a broken build. This cost real time on the
  voice bug. If an artifact grep can't find code you know you wrote, check for
  an env-var guard above it before you suspect the bundler.
- **The Lovable project id in `README.md` is stale** (404s). The real one is
  `b1ed6863-6f4d-4305-91a3-17d24e3672c4`.

---

## 4. Design system (if you touch UI)

- Scoped to `.member-app` in `src/app/app.css` — the marketing site is untouched.
- **Black / white / blue only.** `#0A0A0B` ink, `#F4F2EE` paper, `#2997FF` blue.
  Blue means "done/active"; nothing else gets a hue. Domain tiles are told apart
  by icon, not color (`src/app/components/icons/appIcons.tsx`).
- Anton display type on every heading; squared corners (radius 0, circles
  excepted); 1.5px ink borders; uppercase tracked micro-labels on buttons/CTAs.
- Dark mode = inverted editorial (ink page, paper type, same blue). Toggle in the
  header; persisted in `localStorage` as `sp-theme`; also stamps
  `data-sp-theme` on `<html>` for portalled surfaces.
- No emoji anywhere — line icons only (lucide + the ported animated flow icons).

---

## 5. Rules that still apply

- **Never push to `main` without Justin's say-so.** He runs the pushes.
- **The AgencyBrain repo (`/Users/standardmacbook/agencybrain`) is READ-ONLY.**
  Reference it; never write to it; never run git-mutating or db commands there.
- **Never** `supabase db push/reset/link` anywhere.
- Grep gates before shipping: zero hits for
  `agencybrain|myagencybrain|wjqyccbytctqwceuhzhk` and
  `agency_id|membership_tier|staff_users|key_employees|useSubscription` in
  `src/app` + `supabase/functions`.
- Verify with live probes (puppeteer/curl/SQL), not by reading code. Every
  regression in this build was caught by a probe and missed by inspection.
