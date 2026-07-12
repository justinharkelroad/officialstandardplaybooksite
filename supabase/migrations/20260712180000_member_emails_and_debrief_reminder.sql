-- Member email ledger + the Sunday debrief-reminder cron.
--
-- Paste this into Lovable -> Cloud -> SQL editor. Replace __SERVICE_ROLE_KEY__
-- at the bottom with the project's service_role key before running.

-- 1. The ledger -------------------------------------------------------------
-- One row per email we ATTEMPT to send a member, written before the network
-- call. 'skipped_no_key' is a first-class outcome so a missing secret shows up
-- as a row instead of silence.

create table if not exists public.member_emails (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members(id) on delete cascade,
  email       text not null,
  kind        text not null check (kind in ('welcome', 'debrief_reminder', 'debrief_report')),
  ref_key     text not null,
  subject     text not null,
  status      text not null default 'pending'
              check (status in ('pending', 'sent', 'failed', 'skipped_no_key')),
  resend_id   text,
  error       text,
  created_at  timestamptz not null default now(),
  sent_at     timestamptz
);

-- The idempotency guard. Overlapping cron runs race on this index, not on a
-- read-then-write check, so exactly one of them wins the send.
create unique index if not exists member_emails_dedupe
  on public.member_emails (member_id, kind, ref_key);

create index if not exists member_emails_recent
  on public.member_emails (created_at desc);

-- Service-role only: RLS on, zero policies. Members never read their mail log.
alter table public.member_emails enable row level security;

-- 2. Extensions -------------------------------------------------------------
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3. The Sunday reminder ----------------------------------------------------
-- Fires hourly across 11:00-14:00 UTC on Sundays. The function itself checks
-- each member's actual America/New_York hour and only sends at 8am local, so
-- this is correct in both EDT (8am = 12:00 UTC) and EST (8am = 13:00 UTC)
-- without anyone editing a cron string twice a year. The extra hours on either
-- side are slack; the ledger's unique index makes the redundancy free.

select cron.unschedule('debrief-reminder-sunday')
where exists (select 1 from cron.job where jobname = 'debrief-reminder-sunday');

select cron.schedule(
  'debrief-reminder-sunday',
  '0 11-14 * * 0',
  $$
  select net.http_post(
    url     := 'https://puidotfmyrouxezsorlt.supabase.co/functions/v1/send-debrief-reminder',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer __SERVICE_ROLE_KEY__'
    ),
    body    := '{}'::jsonb
  );
  $$
);
