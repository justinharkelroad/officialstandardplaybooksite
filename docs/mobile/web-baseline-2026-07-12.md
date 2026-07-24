# Mobile beta web baseline — 2026-07-12

## Worktree ownership

Before mobile implementation the worktree contained user-owned changes in
`supabase/functions/admin-manage-member/index.ts`,
`supabase/functions/analyze_debrief/index.ts`, `deno.lock`,
`supabase/functions/_shared/member-email.ts`,
`supabase/functions/send-debrief-reminder/`, and
`supabase/migrations/20260712180000_member_emails_and_debrief_reminder.sql`.
The implementation plan itself was also untracked. Mobile work must not alter
or discard any of these changes.

## Baseline commands

- `npm run build`: PASS (Vite 5.4.21; 4,441 modules; 9.59s).
- Key outputs: `dist/index.html`, `assets/index-BWANmFe8.js`,
  `assets/index-BHYhb4qd.css`, `assets/LoginRoute-ZX7R8xuT.js`, and
  `assets/MemberAppRoutes-BdLnRsWe.js`.
- `npm run lint`: PRE-EXISTING TOOLCHAIN FAILURE before source diagnostics.
  ESLint 9.39.2 crashes loading
  `@typescript-eslint/no-unused-expressions` because `allowShortCircuit` is
  missing. Mobile work must introduce no changed-file lint errors once this
  dependency mismatch is repaired.

## Environment contract

Production frontend builds require the names `VITE_SUPABASE_PROJECT_ID`,
`VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and
`VITE_ELEVENLABS_AGENT_ID`. Values are intentionally omitted here. The mobile
startup gate requires the URL, publishable key, and ElevenLabs agent ID. No
server secret is permitted in either frontend build.

## Route and screenshot status

- `/`, `/login`, and `/app` are a single Cloudflare/Vite SPA. The web build
  emits the web route tree and lazy member chunks successfully.
- The mobile entry and its visual evidence are recorded separately so the
  public-site baseline does not get confused with packaged behavior.
- Authenticated viewport screenshots for Hub, Core 4, Playbook, text/voice
  Flow, Debrief, Life Targets, and theta audio still require a designated
  fictional beta account. No production member password is stored in Git.

## Known baseline risks

- The public web bundle is large and intentionally includes marketing assets;
  this is not a mobile bundle acceptance criterion.
- The repository currently carries both npm and Bun lockfiles. Native
  dependencies are installed with npm because the documented verification
  commands use npm; unrelated lockfile cleanup is out of scope.
