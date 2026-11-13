# Prep form notifications for Mary

Request: Mary needs an email at mary@standardplaybook.com when someone completes standardplaybook.com/prep, including who submitted and their answers.

The notification now uses Resend's batch endpoint to deliver separate emails to Mary and the existing info@standardplaybook.com recipient. It retains the contact information, primary carrier and three written answers. Provider rejection returns an operation-specific error instead of a success or provider internals.

This is the email option requested. It does not add prep answers to Agency Brain's CRM, backfill old submissions, or resend historical notifications.

## Evidence and scope

- Current repository source sent `send-booking-notification` only to info@standardplaybook.com.
- The public `/prep` page uses `FitPrep` -> `BookingOnboardingForm` with source `standard-fit-prep`. The shared form also serves `BookingModal` and `StandardFitModal`; all their completed notifications use this function, so Mary receives those notifications too.
- Form sessions autosave into the website's `booking_leads`; completion updates that table and invokes this function. Its timestamp trigger and existing RLS policies are untouched. No CRM table, policy, foreign key, hook, or migration changes are required for email delivery.
- Read-only production CRM verification found Joseph Bullington by exact email, with an Acuity source and three booking/status activities; no prep answers appeared in that contact's activity history at inspection time. This does not establish the state of the separate website database.
- The public website references project `puidotfmyrouxezsorlt`. The connected Supabase tool denied permission to retrieve its deployed function; live source parity and delivery remain unverified. Agency Brain's separate production project is `wjqyccbytctqwceuhzhk` and is not the deployment target for this function.

## Local verification

Run with Node 22.13+ (tested with Node 26.5):

```sh
node --test scripts/booking-notification.test.mjs
git diff --check
```

Three passing tests execute the actual handler with stubbed Deno and provider transport: both separately addressed recipients and every answer; provider rejection without customer-facing internals; preflight and four incomplete/null payloads without mail. No packages, production credentials, database writes or real sends are used.

Four-part self-audit:

1. Portal/auth parity: this is a public website intake notification, with no Brain or Staff route/auth changes and no browser table/RPC additions. Neither portal is linked from the email.
2. Cardinality/row actions: one invocation makes one batch with two independently addressed messages. No grouped CRM records, selection, pagination or row actions change.
3. Mutation/refetch lifecycle: no React Query, modal, autosave or completion-state code changes. Existing frontend invocation handling remains as before; the handler's provider-failure response is verified, but the frontend does not currently surface that response.
4. Dirty/multiple-record cases: null/missing contacts are rejected before sending; a full synthetic submission retains every answer in both messages. No sibling-record merging, trigger or foreign-key changes occur. Recipient fanout is explicitly asserted.

## Justin's deployment handoff

The website's AGENTS.md reserves Edge deployment for a human-operated Lovable handoff. Code on main alone does not update this deployed function. Do not publish Agency Brain for this change.

Copy this into the Standard Playbook website's Lovable project:

> Update only the `send-booking-notification` Edge Function from the latest `justinharkelroad/officialstandardplaybooksite` main. Its exact source is `supabase/functions/send-booking-notification/index.ts`. There are no shared-file, dependency, migration or config changes. Keep the existing `RESEND_API_KEY` and existing JWT/CORS configuration. Confirm the project's Supabase reference is `puidotfmyrouxezsorlt` before deployment; stop if the reference differs. Read the deployed source back and verify it uses `https://api.resend.com/emails/batch`, separately addressed to `mary@standardplaybook.com` and `info@standardplaybook.com`. Coordinate one clearly labeled synthetic submission through a fresh `https://standardplaybook.com/prep` visit with Mary. Verify the form completes, Resend accepts both messages, and Mary confirms receiving the name, email, phone, carrier and all three written answers. Do not replay historical submissions. Report the deployed function version and delivery evidence.

Deployment and inbox receipt have not been performed by Codex. This handoff is the remaining activation step.
