-- AI Install phase receipts.
--
-- Workshop attendees on the fallback (plugin) route finish each step with a
-- one-line receipt printed by their AI and paste it into the portal. Only the
-- receipt line is stored: the step, the result, the file names, and the date.
-- File contents never leave the attendee's computer.
--
-- One row per (access, step). A newer submission for the same step replaces
-- the older one. All reads and writes go through Edge Functions using the
-- service role after verifying portal access or an admin member. RLS stays
-- enabled with no anon/authenticated policies as defense in depth.
--
-- Safe to run twice.

create table if not exists public.ai_install_portal_receipts (
  access_id     uuid not null references public.ai_install_portal_access(id) on delete cascade,
  step          text not null check (char_length(step) between 1 and 64),
  result        text not null check (result in ('PASS', 'FAIL')),
  files         text not null default 'none' check (char_length(files) <= 500),
  receipt_date  date not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (access_id, step)
);

comment on table public.ai_install_portal_receipts is
  'One AI Install phase receipt per portal access row and step. Stores the receipt line only, never file contents.';
comment on column public.ai_install_portal_receipts.step is
  'Phase name from resources/aiinstall/v2/phases. Validated by the Edge Function against the shared step list.';
comment on column public.ai_install_portal_receipts.files is
  'Untrusted file names from the receipt line. Control characters are stripped before storage. Never render as HTML.';

alter table public.ai_install_portal_receipts enable row level security;
revoke all on public.ai_install_portal_receipts from anon, authenticated;
grant all on public.ai_install_portal_receipts to service_role;
