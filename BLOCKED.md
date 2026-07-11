# BLOCKED / Discoveries — Member App Transplant (feat/member-app)

Running log per handoff §8.5: everything that could not be verified locally, every
off-list discovery (stop-and-log), and every step only Justin can perform.
Nothing here is asserted as passing without evidence in the final report.

## Blocked (cannot verify or obtain in this environment)

1. **`21m.mp3` background track is unobtainable.** The handoff says "find it in
   the source repo's `public/`" — verified absent (no audio files under source
   `public/`). The client actually downloads it from a Supabase Storage bucket
   `binaural-beats` (see source `ThetaAudioMixer.tsx:85,126`); the source
   project's bucket is not publicly listable and prod
   `myagencybrain.com/21m.mp3` 404s (favicon control 200s, so the probe is
   valid). **Justin must export `21m.mp3` from the AgencyBrain Supabase
   Storage bucket `binaural-beats` and upload it to the same-named bucket in
   this project** (bucket is created by migration `20260711170600`, public).
   Local verification used a generated placeholder tone instead.
2. **Hosted-project auth settings.** Local stack has `enable_signup = false`
   (config.toml) and the signup curl proof passed locally (422
   `signup_disabled`). The HOSTED project's "Allow new users to sign up"
   toggle is dashboard-only — Justin must switch it off; the prod signup curl
   in the acceptance report documents the pre-flip state.
3. **AI-key-present paths.** No `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` /
   `ELEVEN_API_KEY` were available or set locally, deliberately: acceptance
   demonstrates the graceful "not configured" degradation. The keys-present
   happy paths (real flow analysis, debrief coaching text, affirmation +
   audio generation, ConvAI voice mode) remain unverified until Justin sets
   secrets on the Supabase project.
4. **ElevenLabs ConvAI voice mode** requires a ConvAI agent created in the
   ElevenLabs dashboard (`ELEVEN_FLOW_AGENT_ID`). Not verifiable locally; text
   mode is the verified path.

## Off-list discoveries (handoff said stop-and-log)

1. **Flows schema is a 4-table family**, not just `flow_sessions`: source
   migration `20251208201553` defines `flow_profiles`, `flow_templates`,
   `flow_sessions`, `flow_challenge_logs` with FKs between them. Ported all
   four (flows cannot function otherwise). Template content replayed from the
   source's template-only INSERT/UPDATE migrations (verified each touches only
   `flow_templates`).
2. **`life_targets_brainstorm` table** (source `20251115134331`) is required by
   the Life Targets brainstorm/selection pages. Ported user-scoped.
3. **`staff_life_targets` does not serve the owner path** (handoff §7 said it
   does). Verified: it hard-403s non-staff callers (`index.ts:142-144`). Owner
   pages hit `life_targets_quarterly` directly + 3 AI edge functions. So it was
   NOT ported/renamed; nothing is lost.
4. **`/app` route was already taken** by a redirect to `app.wakeupwarrior.com`
   (`AppRedirect.tsx`). The handoff's goal statement mandates `/app` for the
   member app, so the redirect was displaced (file remains, no longer routed).
   If the WUW redirect must survive, Justin picks a new path for it.
5. **`app_config` voice-routing lookup** in `start_flow_session` (off-list
   table): stripped; voice mode defaults to the signed-url path.
6. **`banner_dismissals` table** (hub Debrief banner): not ported; dismissal is
   localStorage-only now.
7. **`help_videos` table + Help modal/PDF system**: not ported; `HelpButton`
   renders nothing. Future work if Justin wants in-app help content.
8. **`fix_quarter_months` edge fn** (quarter-repair utility) and
   **`resolve_bible_scripture` edge fn** (Bible flow scripture lookup): not on
   the handoff's port list; their invocation paths fail soft (see feature
   agents' reports). Bible flow manual text entry still works.
9. **theta_voice_tracks / theta_final_tracks / theta_track_leads** tables:
   legacy of the old public lead-capture flow (source `20251114132102` moved to
   client-side mixing, zero server storage). Not ported; current pages don't
   use them.

10. **`evaluate_answer_quality` edge fn** (flow-answer pushback scorer) is called
    by the source client but was not on the handoff's port list. Ported client
    now deterministically returns "no pushback" (the safe default all call
    sites already handled). Restore the invoke if that fn is ever ported.
11. **`resolve_bible_scripture` edge fn** not on the port list: Bible flow's
    Find/Reference lookup modes fail soft with a clear message; Paste mode is
    the default and fully works.

## Flags raised by the acceptance run

1. **Hosted self-signup is OPEN.** `POST /auth/v1/signup` on
   `puidotfmyrouxezsorlt.supabase.co` returned HTTP 200 and created an
   unconfirmed stub user `gate-probe-not-real@test.invalid`
   (id `386e494d-00b5-40d7-9832-9d99bb7374f0`). Exactly the §9.2 flag: only the
   dashboard toggle can close this. Justin: disable signups AND delete that
   stub auth user. Mitigation already in place: a signup-only user has no
   `members` row, so `is_active_member()` denies every table and every ported
   edge function 403s them.
2. **Ban ≠ token invalidation (by design, documented).** Deactivation bans the
   auth user (blocks re-login + refresh) — but an already-issued access token
   stays cryptographically valid until expiry. The thing that actually cuts a
   live session's data access is the RLS `is_active_member()` gate plus the
   same check inside `verifyFlowSession` (service-role flow functions). Do not
   "optimize away" the RLS gate believing the ban covers it.
3. **Source repo HEAD moved during the run — external.** Baseline
   `aec1e708…` → `12d0da1c…` is a commit authored by Justin at 12:24
   ("fix(coaching): avoid partial-index evidence upserts") from a parallel
   session. Working-tree porcelain delta vs baseline is EMPTY and this run
   executed zero mutating commands in the source repo.
4. **No rate limiting on AI functions.** Any active member can invoke the
   OpenAI/Anthropic/ElevenLabs-backed functions at will. Acceptable for a
   closed roster; consider per-member quotas later.
5. **Interceptor screenshot timeouts.** Two screenshots timed out over
   WebSocket (known extension issue); verification fell back to DOM/computed-
   style probes per the skill's documented fallback. One full-page screenshot
   (hub, Bold reskin) was captured successfully.

## Justin's checklist (from §12 + discoveries)

- [ ] Set Supabase secrets: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
      `ELEVEN_API_KEY` **and** `ELEVENLABS_API_KEY` (same value),
      `ELEVEN_FLOW_AGENT_ID`, optional `RESEND_API_KEY`.
- [ ] Create/duplicate the ElevenLabs ConvAI agent for Standard Playbook Flows
      voice mode; supply its agent ID as `ELEVEN_FLOW_AGENT_ID`.
- [ ] Disable self-signups in the Supabase dashboard (Auth → disable sign ups).
- [ ] Upload `21m.mp3` to the `binaural-beats` storage bucket.
- [ ] Confirm admin email (justin@hfiagencies.com assumed) — the admin `members`
      row must be seeded once in prod (SQL in final report §"Admin seed").
- [ ] Approve/adjust the default `playbook_tags` seed list (migration
      `20260711170200`).
- [ ] Merge/push `feat/member-app`, deploy edge functions, apply migrations,
      then Publish in Lovable. NOTE from repo memory: this repo deploys via
      Cloudflare Pages on push — do NOT use Lovable Publish if the OG-cards
      pipeline is active; follow the deploy-pipeline doc.
- [ ] `send-debrief-reminder` emails: skipped in v1 (listed as future work).
