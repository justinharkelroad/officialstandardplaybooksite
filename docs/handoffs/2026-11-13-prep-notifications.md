# Prep submissions in the admin CRM and email

This supersedes the earlier email-only handoff. Mary also needs completed prep forms visible in Agency Brain's admin CRM.

The website's `send-booking-notification` now validates and sends the full form to Agency Brain's existing server-secret-authenticated `crm-lead-intake` as `booking_prep`. It requires `ok: true` and a receipt UUID before confirming success. CRM matching, full-answer storage and same-session/content deduplication run atomically on the Agency Brain server.

The website `BookingOnboardingForm` awaits that receipt, blocks duplicate clicks and leaves the answers on screen with a customer-safe error if confirmation fails. Closing the form while a request is pending suppresses completion navigation. It sends the source (`standard-fit-prep` for `/prep`) and form-session reference. Other callers of this shared booking form follow the same flow.

After CRM storage succeeds, separately addressed emails go to mary@standardplaybook.com and info@standardplaybook.com. User-supplied content is HTML-escaped and the provider idempotency key is tied to the CRM receipt. An email failure is reported separately; it does not erase a saved prep form or turn durable CRM success into an interrupted submission.

Agency Brain's companion change adds Recent call prep on the admin Today page and a full Call prep section on each contact. Ordinary activity-note limits remain unchanged. Mary also requested past submissions. The Agency Brain companion PR includes a separate, dry-run-reviewed 40-form import that does not send old notifications or start customer automations; it remains unapplied.

## Local checks

- `node --test scripts/booking-notification.test.mjs`: executes the actual Edge handler and the actual form submit callback with mocked external boundaries; covers full answers, recipient separation, CRM/config failure, email failure, HTML escaping, double-click protection, waiting for a receipt and closed-form behavior. No real emails or database writes.
- `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit`
- `npm run build`
- `git diff --check`

The existing npm lockfile is out of sync with package.json. The committed Bun lockfile installs with `bun install --frozen-lockfile --ignore-scripts`; no dependency or lockfile changes are included.

## Activation gate

Do not release the dependent website frontend first. Agency Brain's reviewed database migration and its `crm-lead-intake` prep handler must be installed and verified before this function; then the website function must be updated before the website frontend reaches main. The companion Agency Brain handoff is `docs/handoffs/2026-11-13-admin-crm-call-prep.md` on its `codex/admin-crm-prep` branch.

The website AGENTS.md says: "Lovable is only a human-operated handoff for edge-function work." Justin must perform the function update. Website main triggers Cloudflare; it is not published in Lovable.

## Copy-paste handoff for Justin

> After the Agency Brain CRM prep migration and `crm-lead-intake` consumer are installed and verified, update only the website `send-booking-notification` Edge Function using `supabase/functions/send-booking-notification/index.ts` from the reviewed `codex/prep-admin-crm` branch of `justinharkelroad/officialstandardplaybooksite`. Verify target Supabase project `puidotfmyrouxezsorlt`. No shared files or JWT/CORS settings change. Preserve RESEND_API_KEY. Verify AGENCYBRAIN_LEAD_INTAKE_SECRET matches the existing Agency Brain intake secret without printing it, and the intake URL targets `https://wjqyccbytctqwceuhzhk.supabase.co/functions/v1/crm-lead-intake`. Read the deployed source back to confirm it waits for a CRM receipt before returning `ok: true`, then sends the Mary/info batch using the receipt idempotency key. Deploy this backend before merging the website frontend. After the reviewed website PR merges and Cloudflare finishes, use one labeled fresh `/prep` test with Mary. Confirm the form succeeds only after storage, the admin CRM Today list and contact Call prep section show the right person and every answer, retrying creates no duplicate, and Mary's inbox receives the email. Do not replay old submissions or deploy Agency Brain through the website project.

No production database writes, Edge deployments, historical imports or live email sends have been performed by Codex for this CRM extension.

Mary explicitly requested that both PRs remain unmerged so she can merge them herself. Do not merge, deploy or apply the historical import as part of this source handoff.
