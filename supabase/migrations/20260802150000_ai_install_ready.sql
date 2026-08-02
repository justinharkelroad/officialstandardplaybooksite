-- The Agency AI Install: READY pre-work confirmations.
--
-- Pre-work confirmation currently lives in browser localStorage on the
-- pre-work pages, so there is no central count of who is actually ready. At 50
-- seats that gate is the only thing protecting the room, and right now it is
-- invisible. This table is the central record.
--
-- Writes come from the submit-ai-install-ready edge function using the service
-- role. Reads are admin-only through is_admin_member(), the same guard the
-- member app already uses. There is deliberately no anon or authenticated
-- write policy: submissions carry a screenshot and an email address and must
-- go through the edge function so they can be validated.

create table if not exists public.ai_install_ready_submissions (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  platform          text not null check (platform in ('claude', 'codex')),
  -- Object path inside the private ai-install-ready bucket. Never a public URL.
  screenshot_path   text not null,
  screenshot_type   text,
  screenshot_bytes  integer,
  submitted_at      timestamptz not null default now(),
  notified_at       timestamptz,
  notify_error      text,
  created_at        timestamptz not null default now()
);

alter table public.ai_install_ready_submissions enable row level security;

-- Mary sorts the room by track, so platform and date are the access patterns.
create index if not exists ai_install_ready_submitted_idx
  on public.ai_install_ready_submissions (submitted_at desc);

create index if not exists ai_install_ready_email_idx
  on public.ai_install_ready_submissions (lower(email));

create index if not exists ai_install_ready_platform_idx
  on public.ai_install_ready_submissions (platform, submitted_at desc);

-- Admins read the list. Nobody else reads anything, and nothing writes through
-- the API: inserts happen with the service role inside the edge function.
drop policy if exists ai_install_ready_admin_select
  on public.ai_install_ready_submissions;

create policy ai_install_ready_admin_select
  on public.ai_install_ready_submissions
  for select
  using (public.is_admin_member(auth.uid()));

-- Private bucket. Screenshots are proof of setup and often show a buyer's own
-- machine, so this is never public and is read through signed URLs only.
insert into storage.buckets (id, name, public)
values ('ai-install-ready', 'ai-install-ready', false)
on conflict (id) do nothing;

drop policy if exists ai_install_ready_screens_admin_read on storage.objects;

create policy ai_install_ready_screens_admin_read
  on storage.objects
  for select
  using (
    bucket_id = 'ai-install-ready'
    and public.is_admin_member(auth.uid())
  );
