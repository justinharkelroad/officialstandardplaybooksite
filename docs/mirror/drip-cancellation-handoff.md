# Mirror Drip — Cancellation + Acuity Webhook Handoff

**Status:** Spec locked. Ready for build.
**Repo:** `/Users/standardmacbook/officialstandardplaybooksite`
**Cloud:** Lovable Cloud (Supabase under the hood) — project ref `puidotfmyrouxezsorlt`
**Branch:** `main` (last commit at handoff time: `da244ac`)

This is the bridge doc for picking up the next phase of /mirror work in a fresh context window. Read this first — it has everything you need.

---

## TL;DR

The /mirror lead magnet is **fully shipped and live**. A submission today: saves to Supabase, sends an internal notification to Justin, and queues 7 (or 5 for Elite) tier-specific drip emails on Resend with `scheduled_at` over 9 days.

**What's missing:** there's no way to stop a lead's drip when they convert (book a call, become a client). Once Resend has the scheduled sends queued, the only way to cancel them is to manually find each message in Resend's dashboard and cancel one by one. We also throw away the Resend message IDs after queuing — they're logged but not persisted — so even if we wrote a script we'd have to scrape the dashboard.

**Scope of this build:** Option B + Acuity webhook from the recommendation conversation.

1. Persist every scheduled drip send so we can cancel later.
2. Build a cancellation Edge Function that takes an email and stops all that lead's pending future drip emails.
3. Wire an Acuity webhook so booking a Mirror call automatically cancels the drip — no manual step required.
4. (Bonus: tiny `/mirror/admin` view to list submissions + drip status. Build only if time permits — Phase 2 candidate.)

---

## What already exists (do not rebuild)

### Routes
- `/mirror` — `src/pages/BoldMirror.tsx` (landing page, ad lead magnet)
- `/mirror/score` — `src/pages/BoldMirrorScore.tsx` (32-question assessment + capture form)
- `/mirror/results` — `src/pages/BoldMirrorResults.tsx` (tier reveal + diagnostic + CTA)

### Database
- Table `mirror_submissions` is live in Lovable's `puidotfmyrouxezsorlt` project. Schema:

```
id uuid pk
created_at timestamptz default now()
email text not null
full_name text not null
phone text not null
carrier text not null check in (allstate, state_farm, farmers, american_family, independent, other)
total_score int not null
tier text not null check in (foundation, developing, established, advanced, elite)
weakest_pillar text not null check in (culture_team, systems_rhythm, training_scripts, marketing_lead_flow, owner_command)
pillar_scores jsonb
question_scores jsonb
utm_source / utm_medium / utm_campaign / utm_content text
device_type text
user_agent text
```

RLS is enabled with two open policies — `Anyone can insert mirror submissions` and `Anyone can read mirror submissions by id`. Migration files are at `supabase/migrations/20260509221111_*.sql` and `supabase/migrations/20260509223314_*.sql`.

### Edge Functions
- `send-mirror-notification` — `supabase/functions/send-mirror-notification/index.ts` (~1,300 lines, single self-contained file). Currently:
  - Sends internal notification to `justin@hfiagencies.com` via Resend
  - Fans out 7-email drip via Resend `scheduled_at` (5 for Elite), sequential 250ms paced, with 429 retry/backoff
  - **Does NOT persist Resend message IDs** — that's the gap this build closes
  - Resend SDK pinned at `npm:resend@4.0.0` (not 2.0.0 like the older booking/directive functions — 4.0.0 supports `scheduled_at`)

### Other notification functions (reference patterns)
- `supabase/functions/send-booking-notification/index.ts`
- `supabase/functions/send-directive-notification/index.ts`
- `supabase/functions/send-walkthrough-notification/index.ts`
- `supabase/functions/send-websites-inquiry/index.ts`

All registered in `supabase/config.toml`.

---

## Build spec

### 1) New table: `mirror_drip_sends`

Tracks every scheduled (or sent) drip email so we can cancel pending ones later.

```sql
CREATE TABLE public.mirror_drip_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submission_id UUID NOT NULL REFERENCES public.mirror_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  weakest_pillar TEXT NOT NULL,
  day_offset INT NOT NULL,                -- 0, 1, 2, 3, 4, 6, 9
  scheduled_at TIMESTAMP WITH TIME ZONE,  -- null for day 0 (sent immediately)
  resend_id TEXT,                          -- Resend's email id, used to cancel later
  status TEXT NOT NULL DEFAULT 'queued'    -- queued | sent | cancelled | failed
    CHECK (status IN ('queued', 'sent', 'cancelled', 'failed')),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,                      -- e.g. 'acuity_booking' | 'manual' | 'admin_action'
  send_error TEXT
);

ALTER TABLE public.mirror_drip_sends ENABLE ROW LEVEL SECURITY;

-- Admin-only read; no public read (this is internal data)
-- For now no policies — only the service role / edge functions can touch it.

CREATE INDEX mirror_drip_sends_email_status_idx ON public.mirror_drip_sends(email, status);
CREATE INDEX mirror_drip_sends_submission_idx ON public.mirror_drip_sends(submission_id);
CREATE INDEX mirror_drip_sends_scheduled_at_idx ON public.mirror_drip_sends(scheduled_at);
```

**Important:** Lovable Cloud does not auto-apply migrations from `supabase/migrations/*.sql`. To create this table:
- Go to Lovable → Cloud → Database → SQL editor → paste + run, OR
- Ask the Lovable AI in-app: *"Apply the schema in `supabase/migrations/<new-file>.sql`"*

The migration file should still be committed to the repo for documentation + future syncing.

### 2) Modify `send-mirror-notification` to persist sends

After each successful Resend `emails.send` call in `sendOneDrip`, insert a row into `mirror_drip_sends` with the returned `resend_id`. After a failed call, insert a row with `status = 'failed'` and the error.

The edge function will need a **service-role Supabase client** to write the row (RLS is enabled and there's no public insert policy). Pattern:

```ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);
```

Both env vars are already injected by Lovable Cloud — no setup needed.

For the `submission_id`, the function already receives it on the request body as `s.id`. Use that as the foreign key.

For the Day 0 send (immediate), the row should be inserted with `status = 'sent'` and `scheduled_at = null` (Resend confirms it sent in the same call).

### 3) New Edge Function: `cancel-mirror-drip`

**Path:** `supabase/functions/cancel-mirror-drip/index.ts`
**Pattern:** model after `send-mirror-notification` (single file, Deno, Resend SDK 4.0.0, service-role Supabase).
**Auth:** `verify_jwt = false` (called from frontend admin page + from Acuity webhook EF). Add to `supabase/config.toml`.

**Request body:**
```ts
interface CancelRequest {
  email: string;        // case-insensitive lookup
  reason?: string;      // 'acuity_booking' | 'manual' | 'admin_action' | string
}
```

**Behavior:**
1. Lowercase + trim the email.
2. Query `mirror_drip_sends` where `email = $1 AND status = 'queued' AND scheduled_at > now()`.
3. For each row, call Resend's `DELETE https://api.resend.com/emails/{resend_id}` to cancel the scheduled send.
   - **Sequential, 250ms paced** to stay under Resend's 5 req/sec cap (same pattern as the drip fan-out).
   - Resend REST API needs `Authorization: Bearer <RESEND_API_KEY>` header.
   - On success (2xx), update the row to `status = 'cancelled'`, `cancelled_at = now()`, `cancel_reason = <reason>`.
   - On 404 (already sent or never existed at Resend), still mark `cancelled` with reason `not_found_at_resend` (doesn't matter — it's not going to fire).
   - On other errors, log + update row to `status = 'failed'`, `send_error = <details>`. Don't throw — keep going.
4. Return a JSON summary: `{ ok: true, email, cancelled: N, failed: N, results: [...] }`.

**CORS:** same headers as `send-mirror-notification` (copy verbatim).

**Edge case:** if the email isn't in the table at all, return `{ ok: true, cancelled: 0, failed: 0, results: [] }` — not an error. The booking might be from someone who never took the assessment.

### 4) New Edge Function: `acuity-mirror-webhook`

**Path:** `supabase/functions/acuity-mirror-webhook/index.ts`
**Pattern:** single file, Deno.
**Auth:** `verify_jwt = false`. Acuity won't sign requests with a JWT — they post raw form data.

**Acuity webhook config (do this in Acuity, not in code):**
- Acuity → Integrations → Webhooks → Add a new endpoint
- Event types: `appointment.scheduled` (and optionally `appointment.rescheduled` — both should cancel the drip; rescheduled means they're still committed to the call)
- Endpoint URL: `https://puidotfmyrouxezsorlt.supabase.co/functions/v1/acuity-mirror-webhook`
- **Filter by appointment type if Acuity supports it** — only the `MIRROR` booking type should trigger this. If filtering at Acuity isn't possible, filter inside the EF on the `appointmentType` field in the payload.

**Acuity payload shape (POST form-encoded):**

Acuity's "Send a webhook" feature sends `application/x-www-form-urlencoded` with these fields (verify in Acuity docs — the format has been stable but worth confirming):
```
action=appointment.scheduled
id=12345678
calendarID=...
appointmentTypeID=...
```

The webhook just notifies — to get full details (including the booker's email), the EF must call back to Acuity's API:
- `GET https://acuityscheduling.com/api/v1/appointments/{id}` with HTTP basic auth (Acuity user ID + API key from Acuity → Integrations → API)
- Response includes `email`, `firstName`, `lastName`, `appointmentTypeID`, `type` (display name), `datetime`, etc.

**Required Acuity secrets** (add to Lovable → Cloud → Secrets):
- `ACUITY_USER_ID` — the numeric user ID (from Acuity → Integrations → API)
- `ACUITY_API_KEY` — the API key

**Behavior:**
1. Verify request method is POST. Otherwise 405.
2. Parse form data → extract `action` and `id`.
3. Bail early if `action` isn't `appointment.scheduled` or `appointment.rescheduled`. Return 200 with `{ ok: true, ignored: true, action }`.
4. GET the appointment from Acuity's API using basic auth (`btoa("${ACUITY_USER_ID}:${ACUITY_API_KEY}")` in `Authorization: Basic ...`).
5. **Confirm appointment type matches the Mirror booking type.** Easiest filter: check that `type` (display string) contains `"Mirror"` case-insensitively, OR hardcode the `appointmentTypeID` once you find it (preferred for safety — get it from Acuity's appointment-types API or by inspecting one Mirror booking).
6. Extract `email`. Lowercase + trim.
7. Invoke the `cancel-mirror-drip` Edge Function via internal HTTP call:
   ```
   POST https://puidotfmyrouxezsorlt.supabase.co/functions/v1/cancel-mirror-drip
   Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
   Body: { email, reason: 'acuity_booking' }
   ```
   (Or import the cancellation logic directly inline for simplicity — your call.)
8. Return 200 with `{ ok: true, email, cancelled: N }`.

**Acuity needs a 200 response within ~10 seconds** or it'll retry.

**Idempotency:** the cancellation function is idempotent — calling it twice on the same email just no-ops the second time (no `queued` rows left to cancel). So Acuity retries are safe.

### 5) Register both functions in `supabase/config.toml`

Add:
```toml
[functions.cancel-mirror-drip]
verify_jwt = false

[functions.acuity-mirror-webhook]
verify_jwt = false
```

### 6) (Optional Phase 2) `/mirror/admin` page

Skip on first pass unless explicitly requested. If you build it:
- New route in `src/App.tsx` — `/mirror/admin` → `BoldMirrorAdmin.tsx`
- Brand: same paper / ink / blue / Anton system used elsewhere — see `BOLD_REBRAND_HANDOFF.md`
- Auth gate: simplest = a single password set as env var, checked client-side (insecure but ok for internal tool); more robust = Supabase auth (overkill for this)
- Lists submissions joined to `mirror_drip_sends` aggregated, with a "Stop drip" button per row that POSTs to `cancel-mirror-drip`
- Show: name, email, tier, weakest pillar, score, day-of-drip-active, last sent, next scheduled

---

## Lovable Cloud quirks to remember (we hit all of these)

These tripped us up during the original build. The next agent will hit them too if they don't read this.

1. **Migrations don't auto-apply from `supabase/migrations/*.sql`.** Create the new table in Lovable's SQL editor (or via the AI agent) AFTER committing the migration file to the repo. The committed file is documentation; the actual schema is applied through the UI.

2. **Edge functions don't auto-deploy from repo subdirectories.** Keep all EF code in one `index.ts` — no `templates/`, no `data/`, no `lib/`. Inline everything. The current `send-mirror-notification/index.ts` is ~1,300 lines for this reason — it works.

3. **Edge functions need explicit redeploy after every code change.** Pushing to git won't redeploy. Use the Lovable AI prompt:
   > Redeploy the `<function-name>` edge function from `supabase/functions/<function-name>/index.ts` (commit `<hash>` on `main`).

4. **Resend rate limit is 5 req/sec.** Any new flow that fires multiple Resend calls (the cancellation function will fire one DELETE per pending email — could be 6 in a row) MUST throttle. Use the same 250ms `sleep` pattern in `send-mirror-notification`.

5. **Use the service-role key for table writes.** RLS blocks writes by default; the EF needs `SUPABASE_SERVICE_ROLE_KEY` (auto-injected by Lovable) to insert/update.

6. **Lovable's project ref is `puidotfmyrouxezsorlt`** — used in URLs throughout: `https://puidotfmyrouxezsorlt.supabase.co/functions/v1/<name>` and `https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/<bucket>/<file>`.

---

## Open questions for Justin

Don't block on these — flag and proceed with reasonable defaults:

1. **Acuity API credentials.** Justin will need to grab `ACUITY_USER_ID` + `ACUITY_API_KEY` from Acuity → Integrations → API and set them in Lovable Cloud → Cloud → Secrets. The `acuity-mirror-webhook` won't function without them.

2. **Acuity webhook URL.** Justin (or the next agent) needs to add the webhook in Acuity → Integrations → Webhooks pointing at the deployed function URL. Acuity needs the function deployed and Active first.

3. **Mirror appointment type filter.** Confirm whether Acuity's webhook UI lets you filter by appointment type, OR whether the function should filter on `type` / `appointmentTypeID` internally. Default assumption: filter inside the function on the `type` field containing `"Mirror"` case-insensitively.

4. **Reschedule behavior.** When a lead reschedules an existing Mirror call, should the drip stay cancelled (current default) or restart? Default: stay cancelled — they're still committed to the conversation.

5. **Phase 2 admin page.** Build `/mirror/admin` now or wait until Justin asks? Default: wait. Justin can use the cancellation EF via Lovable's SQL editor or a one-off API call until then.

---

## Acceptance criteria

The build is shippable when:

- [ ] `mirror_drip_sends` table exists in Lovable's project DB with the schema above
- [ ] `send-mirror-notification` writes a row to `mirror_drip_sends` for every drip send (including Day 0 immediate). Verified: a fresh test submission produces 7 rows for non-Elite, 5 for Elite, with `resend_id` populated and `scheduled_at` set on rows where `day_offset > 0`
- [ ] `cancel-mirror-drip` deployed + Active. Verified: hitting it with a real email lowers all that lead's `queued` rows to `cancelled` AND those Resend message IDs no longer appear as scheduled in the Resend dashboard
- [ ] `acuity-mirror-webhook` deployed + Active. Verified: a real Mirror booking on Acuity triggers a webhook → cancellation fires → Resend dashboard confirms scheduled sends are gone for that lead
- [ ] All cancellation paths tested with both: a lead with full 6 pending sends, AND a lead whose Day 0/1 already sent (only Days 2-9 cancelled, Days 0-1 stay `sent`)
- [ ] `supabase/config.toml` updated with both new functions, `verify_jwt = false`
- [ ] No TypeScript errors. Existing `send-mirror-notification` flow still works end-to-end (no regression)
- [ ] Optional: `/mirror/admin` page if scoped in
- [ ] Brevo references stay fully removed — this is a Resend-only flow

---

## File map for this build

```
NEW:
supabase/migrations/<timestamp>_mirror_drip_sends.sql
supabase/functions/cancel-mirror-drip/index.ts
supabase/functions/acuity-mirror-webhook/index.ts

MODIFIED:
supabase/functions/send-mirror-notification/index.ts  ← persist sends to new table
supabase/config.toml                                   ← register both new functions

OPTIONAL (Phase 2):
src/App.tsx                                            ← add /mirror/admin route
src/pages/BoldMirrorAdmin.tsx                          ← new admin page
```

---

## How to start the new context window

Suggested cold-open prompt:

> Read `docs/mirror/drip-cancellation-handoff.md` first. The /mirror lead magnet is fully shipped — submission triggers an internal notification + 7-email Resend drip. We need to add cancellation: persist drip Resend IDs to a new `mirror_drip_sends` table, build a `cancel-mirror-drip` Edge Function that nukes a lead's pending sends by email, and wire an Acuity webhook (`acuity-mirror-webhook`) so booking a Mirror call automatically stops the drip. Full spec in the handoff doc. Start with the migration + the modification to `send-mirror-notification`, then the cancellation EF, then the webhook. Verify each piece end-to-end before moving on.
