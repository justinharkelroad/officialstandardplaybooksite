-- Allow password-reset sends to use the existing service-role-only email
-- ledger for delivery visibility, idempotency, and per-account rate limiting.

alter table public.member_emails
  drop constraint if exists member_emails_kind_check;

alter table public.member_emails
  add constraint member_emails_kind_check
  check (kind in ('welcome', 'debrief_reminder', 'debrief_report', 'password_reset'));
