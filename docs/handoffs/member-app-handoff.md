# HANDOFF — Standard Playbook Member App

> Written 2026-07-12, end of day. **The app is LIVE and every AI surface is
> verified against production.** This supersedes
> `member-app-status-handoff.md` (kept for its forensic detail; read it only if
> you need the full story of a specific past bug).
>
> Read §1 and §5 before touching anything. They are where the time goes.

---

## 0. What this is

A members-only personal-growth app at **standardplaybook.com/app**, transplanted
from the AgencyBrain codebase (insurance platform) and rebranded for Justin's
non-insurance coaching clients.

Justin (`justin@hfiagencies.com`) is currently the **only** account. He creates
clients from `/app/admin`; each gets private, RLS-isolated data and can be
switched off/on with a toggle.

---

## 1. Architecture — three deploy pipelines, and people confuse them

| What changed | Who deploys it | How |
|---|---|---|
| **Frontend** (`src/**`, `public/_headers`, `.env`) | **Cloudflare Pages** | Automatic on push to `main`. ~60-90s. |
| **Edge functions** (`supabase/functions/**`) | **Lovable** | Push to `main`, then **ask Lovable in chat** to deploy. It does NOT auto-deploy. |
| **Database** (`supabase/migrations/**`) | Nobody | Paste SQL by hand into **Lovable → Cloud → SQL editor**. |

- **NEVER press Lovable's "Publish" button.** Lovable's build runs plain
  `vite build` without the OG-stamping step, so it would deploy un-stamped HTML
  and **wipe every per-route OG share card**. Cloudflare owns the frontend. The
  button will always sit there looking like you should press it. Ignore it.
- **Frontend env vars live in the COMMITTED `.env`** — Cloudflare Pages has
  *zero* variables set. `VITE_SUPABASE_*` and `VITE_ELEVENLABS_AGENT_ID` all
  reach prod because `.env` is tracked in git and Vite reads it during the Pages
  build. A new `VITE_*` var goes in `.env` + push, **never** the Cloudflare
  dashboard. Only public-by-design values belong there (they ship in the browser
  bundle). Real secrets stay in Lovable → Secrets, which feed edge functions only.
- **Secrets are injected at function-deploy time.** Adding a secret does NOT
  affect already-deployed functions. Add the secret **first**, then ask Lovable
  to deploy. Deploy first and the function ships blind to it and reports "not
  configured" while the secret sits there looking perfectly fine.
- The Supabase project (`puidotfmyrouxezsorlt`) lives **inside Lovable Cloud**.
  It is NOT in Justin's supabase.com dashboard and the Supabase CLI cannot link
  to it. Lovable's Cloud panel is the only door.
- Real Lovable project id: `b1ed6863-6f4d-4305-91a3-17d24e3672c4`.
  (The one in `README.md` is stale and 404s.)

**Local dev:** `bun run dev` (Vite, :8080). Local Supabase on offset ports
(API 56321, DB 56322, Studio 56323) via `supabase start`. Never
`supabase db push/reset/link`. `.env.local` is gitignored and points at local.

---

## 2. Verification doctrine — this is not optional here

**Every regression in this build was caught by a live probe and missed by
inspection.** Reading the code will lie to you in this repo specifically (see
§5). Drive the real thing.

- Use the **Interceptor** skill against the live site. `interceptor open <url>`,
  then `eval --main` for computed styles, network, `navigator.locks`, etc.
- **Control your probes.** Before trusting a probe, run it against a
  known-negative. A grep of `dist/` that finds nothing may mean your code was
  dead-code-eliminated, not that it failed to compile (§5).
- **Test the artifact, not the source.** Assert against `dist/` or the deployed
  URL. But build with the same env the CI has, or the DCE will hide your edits.
- Edge function console logs: **Lovable → Cloud → Logs → select "Function logs"**
  (the default "Edge logs" view shows only HTTP lines, not `console.error`).
  This is the single highest-value debugging surface in the project.

---

## 3. Current state — everything below is verified in production

**Working:** login, auth guard, active-member kill switch, `/app/admin` (create
client, reset password, activate/deactivate), Hub (56-pt weekly ring), Core 4,
Weekly Playbook, Daily Frame, Monthly Missions, Life Targets, Debrief, Flows
(text **and voice**), 90 Day Audio, Bible Flow, sidebar shell, dark/light.

**Every AI surface is proven end to end (2026-07-12):**

| Surface | Key | Evidence |
|---|---|---|
| Flow voice mode | `ELEVEN_API_KEY` (Agents / `convai_write`) | agent connects + speaks |
| Text flow → `analyze_flow_session` | `OPENAI_API_KEY` | real analysis; pulls TELOS context |
| `refine_flow_action_item` | `OPENAI_API_KEY` | sharpened declaration → Weekly Playbook |
| Debrief → coaching report | `ANTHROPIC_API_KEY` | report returned |
| 90 Day Audio (affirmations → track → bucket) | `ANTHROPIC_API_KEY` + `ELEVEN_API_KEY` (TTS) | track generated + downloaded |
| Bible Flow lookup | `API_BIBLE_API_KEY` | FIND + REFERENCE return real MSG passages |

**Voice agent:** `The Flow Master Standard Playbook` =
`agent_3801kx9g44saf0assrct6xjfa8hb`. Four custom tools, all prefixed `sp_`.

> ⚠️ **The unprefixed tools in that ElevenLabs workspace belong to AgencyBrain's
> LIVE production agents. NEVER edit them.** Doing so already broke AgencyBrain's
> voice flows mid-session once. Only touch `sp_*`.

---

## 4. Open items

**#1 — No real client has ever used this app.** THE BIG ONE. Everything was
verified as Justin, in one browser, on one account. Never validated: a second
real user logging in, RLS isolation between two members, the deactivate kill
switch against a live session. **Do this before a paying member touches it.**

**#2 — Housekeeping (small, real):**
- Delete the `ELEVENLABS_API_KEY` secret in Lovable. Nothing reads it (everything
  uses `ELEVEN_API_KEY`). Rotating the wrong one someday would cost an afternoon.
- `Popover`, `DropdownMenu`, `Tooltip` have **no app-scoped copies**. They portal
  exactly like `Select` did, so any new use of them will render marketing-white in
  dark mode. Scope them with `spScopeClass()` or build app-scoped copies (§5).
- `README.md` has a stale Lovable project id that 404s.

**#3 — Test content on Justin's account (he chose to keep it):** a completed
"Operator Install Day" idea flow (`28629665-6878-487b-a6a2-0a2ab81309e5`), its
four action items, a Weekly Playbook entry, and a bumped flow streak.

---

## 5. Landmines — READ THIS SECTION

These each cost real hours. They are non-obvious and they will bite again.

- **A missing `VITE_*` var can silently DELETE the code you're inspecting.**
  `import.meta.env.VITE_X` is inlined at build time. If unset it becomes
  `undefined`, an early `if (!x) throw` becomes always-true, and esbuild
  **dead-code-eliminates everything after it**. Grepping `dist/` for your own
  edit then finds nothing and looks like a broken bundler. This hid the entire
  voice bug for a session. **If an artifact grep can't find code you know you
  wrote, look for an env-var guard above it before you suspect the build.**

- **Radix portals escape the theme scope, and `app.css` only half-fixes it.**
  Dialogs/selects/popovers/toasts render on `<body>`, outside `.member-app`, so
  `bg-background` resolves to the MARKETING token. Measured: identical
  `bg-background` element = `rgb(255,255,255)` outside the scope,
  `rgb(12,12,13)` inside. `app.css` force-darkens the portalled *container* via
  `[data-sp-theme="dark"] [role="dialog"]`, but **`background` does not
  inherit** — so token-styled *children* (select triggers, inputs) stay white
  inside a correct-looking dark dialog. **Rule: every portalled surface needs
  `spScopeClass()`** (`src/app/lib/theme.ts`). App `Select`
  (`@/app/components/ui/select`) and app `dialog`/`card` do it for you — import
  from `@/app/components/ui/`, **never** `@/components/ui/`.

- **PostgREST cannot express `.or()` on a mutation.** It table-qualifies columns
  inside an `OR` but aliases the table on writes, so the qualified name can't
  resolve and Postgres reports **42703 "column ... does not exist"** — on a
  column that plainly does exist. Reads are unaffected, so every probe will tell
  you the column is fine. This killed the Debrief coaching report. Split the
  `OR` into separate single-condition updates. (Scanned: no other `.update()`
  chained with `.or()` remains.)

- **supabase-js: never `await` a Supabase call inside `onAuthStateChange`.** The
  callback runs while the auth Web Lock is held, and awaiting in there never
  releases it. Web Locks are **origin-wide**, so one stranded tab makes *every*
  other tab hang at the auth spinner with zero network requests and no console
  error. Set the session synchronously; defer the query with `setTimeout`.

- **Do NOT refresh a user's Supabase session out-of-band.** Refresh tokens are
  single-use and rotate. Calling `/auth/v1/token` with a token from `localStorage`
  consumes it, and the app's own refresh then fails and **signs the user out
  mid-session.** (Learned the hard way, on Justin, mid-flow.) Read
  `access_token` as-is; let the app own its lifecycle.

- **Route prefixes.** Every member route needs `/app`. A `sed` pass that only
  covered quoted strings once missed template literals — ``navigate(`/flows/start/${slug}`)``
  shipped and 404'd. Grep both forms.

- **Immersive flow surfaces** (`flows/start|session|complete|view`) render
  OUTSIDE `AppShell`, inside `ImmersiveFrame`. Keep them out of the shell or the
  composer gets cut off.

- **Edge functions can't import across function dirs.** Shared code goes in
  `supabase/functions/_shared/` or the bundler fails.

- **RTK garbles literal strings in compressed grep output.** Observed repeatedly:
  identifiers rendered as `n` / `ln` / `lo`. **Before concluding an exact string
  does or doesn't exist, re-verify with `node -e` reading real bytes**, or a
  targeted `rg -c '<exact>'`. This nearly sent me chasing a phantom twice.

---

## 6. Design system (if you touch UI)

- Scoped to `.member-app` in `src/app/app.css`. The marketing site is untouched.
- **Black / white / blue only.** `#0A0A0B` ink, `#F4F2EE` paper, `#2997FF` blue.
  Blue means "done/active"; nothing else gets a hue. Domain tiles are told apart
  by icon, not color.
- Anton display type on headings; squared corners (radius 0, circles excepted);
  1.5px ink borders; uppercase tracked micro-labels on buttons/CTAs.
- Dark mode = inverted editorial. Toggle in header; persisted as `sp-theme`;
  also stamps `data-sp-theme` on `<html>` for portalled surfaces.
- **No emoji anywhere** — line icons only.

---

## 7. Hard rules

- **`/Users/standardmacbook/agencybrain` is READ-ONLY.** Reference it; never
  write to it; never run git-mutating or db commands there. It is a **private**
  repo — and `officialstandardplaybooksite` is **PUBLIC**. Justin has knowingly
  accepted that AgencyBrain-derived code lives in the public repo, but do not
  expand that surface without asking.
- **Never push to `main` without Justin's say-so.** He approves each push.
- **Never** `supabase db push/reset/link`.
- **Never press Lovable's Publish button.**
- Grep gates before shipping: zero hits for
  `agencybrain|myagencybrain|wjqyccbytctqwceuhzhk` and
  `agency_id|membership_tier|staff_users|key_employees|useSubscription` in
  `src/app` + `supabase/functions`.
- Probes against production have **real side effects on Justin's live account**
  (draft sessions, streaks, DB rows). Say so when you leave any behind.

---

## 8. Recent commits (2026-07-12)

| Commit | What |
|---|---|
| `0998f81` | Voice: surface `voice_error`; fix supabase auth-lock deadlock |
| `6f70dce` | Voice: set `VITE_ELEVENLABS_AGENT_ID` (the DCE fix) |
| `533245b` | Voice: allow `blob:` worklets in CSP; stop auto-start reconnect loop |
| `746de59` | Bible Flow: port `resolve_bible_scripture`, wire the client |
| `3745019` | Debrief: fix 42703 `.or()`-on-update claim bug |
| `c33774a` | Debrief: sealed-with-no-analysis is no longer a dead end |
| `9db49ca` | Fix white Selects + unscoped dialogs in dark mode (12 files) |
