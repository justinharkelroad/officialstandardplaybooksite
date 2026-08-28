# Working Rules

- **The website deploys through Cloudflare from `main`, not through Lovable.**
  After website changes reach `main`, report that the Cloudflare deployment was
  triggered (or that the code is on `main`); never tell Justin to publish,
  update, or republish the website in Lovable.
- **Lovable is only a human-operated handoff for edge-function work.** If an
  edge function needs to be deployed or updated, give Justin a concise,
  copy-paste-ready Lovable instruction naming the exact function, shared files,
  configuration, and verification steps. Codex and subagents must not click
  Lovable Publish/Update/Republish or call a Lovable deployment API.
- **Life Targets state must stay server-authoritative.** Debounced Daily Proof
  selection and idea-pool writes must flush successfully before Back, Continue,
  or quarter-change navigation. A clean/saved indicator must never be inferred
  solely because both browser and database state are empty.
- **Optional Daily Proof completion must be explicit.** Reviewing the Daily Proof
  step with zero selected actions is valid and must persist a reviewed marker;
  do not infer workflow completion only from non-empty action arrays.
- **Quarter and month resets must be actor-scoped below the UI.** Quarter reset
  must derive `auth.uid()` and delete the quarterly row plus all matching Brain
  Dump rows transactionally. Month reset must derive `auth.uid()` and archive
  only that member's active rows for the validated month. Keep downstream
  Weekly work unless the confirmation explicitly includes it.
- **AI Install fulfillment must remain platform-specific and require screenshot
  confirmation.** Codex buyers must receive the Codex pre-work route and a pack
  containing `AGENTS-STARTER.md`, never `CLAUDE-STARTER.md`; Claude buyers must
  receive the Claude route and pack. Keep the four starter-pack setup steps
  distinct from the six readiness checks. After all six checks, require one
  screenshot showing the open `MY BIZ BRAIN` folder with `READY.txt` visible,
  submitted through `/aiinstall/ready`. Keep the ZIP README, pre-work pages,
  purchase email, confirmation form, and fulfillment tests aligned whenever
  this flow changes.
- **AI Install portal email access must be resistant to link scanners.** Never
  put the consumable Supabase Auth action link directly in an attendee email.
  Route the generated hashed token to `/aiinstall/portal` in the URL fragment
  and require an explicit human confirmation before calling `verifyOtp`.
- **Completed Flow transcripts must stay question-driven.** Render and export
  each validated current Coach turn directly beneath the official answer for
  its stable question ID, in reflection/follow-up/member-response/resolution
  order. Never add a detached Coach summary loop or export from unvalidated
  asynchronously cached Coach rows.
