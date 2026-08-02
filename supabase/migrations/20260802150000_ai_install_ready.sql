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

-- RLS decides which rows are visible, but PostgREST still needs a table-level
-- grant before it will attempt the query at all. Without this the admin list
-- fails with a permission error rather than an empty result, which looks like
-- a broken page instead of a denied read. The grant is deliberately to
-- authenticated only: anon is never given select, and the policy below is what
-- narrows authenticated down to admins.
grant select on public.ai_install_ready_submissions to authenticated;
grant all on public.ai_install_ready_submissions to service_role;

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
--
-- Hosted Supabase rejects direct SQL writes to storage.buckets, so on a hosted
-- project this statement is a no-op and the bucket is created through the
-- storage API instead. It is kept here so a local `supabase start` provisions
-- the same bucket, and it is written to be safe either way.
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('ai-install-ready', 'ai-install-ready', false)
  on conflict (id) do nothing;
exception
  when insufficient_privilege then
    raise notice 'storage.buckets is managed by the platform; create ai-install-ready (private) through the storage API';
end
$$;

drop policy if exists ai_install_ready_screens_admin_read on storage.objects;

create policy ai_install_ready_screens_admin_read
  on storage.objects
  for select
  using (
    bucket_id = 'ai-install-ready'
    and public.is_admin_member(auth.uid())
  );
