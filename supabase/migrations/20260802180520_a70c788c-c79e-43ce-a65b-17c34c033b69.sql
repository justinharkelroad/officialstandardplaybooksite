create table if not exists public.ai_install_ready_submissions (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  platform          text not null check (platform in ('claude', 'codex')),
  screenshot_path   text not null,
  screenshot_type   text,
  screenshot_bytes  integer,
  submitted_at      timestamptz not null default now(),
  notified_at       timestamptz,
  notify_error      text,
  created_at        timestamptz not null default now()
);

grant select on public.ai_install_ready_submissions to authenticated;
grant all on public.ai_install_ready_submissions to service_role;

alter table public.ai_install_ready_submissions enable row level security;

create index if not exists ai_install_ready_submitted_idx
  on public.ai_install_ready_submissions (submitted_at desc);

create index if not exists ai_install_ready_email_idx
  on public.ai_install_ready_submissions (lower(email));

create index if not exists ai_install_ready_platform_idx
  on public.ai_install_ready_submissions (platform, submitted_at desc);

drop policy if exists ai_install_ready_admin_select
  on public.ai_install_ready_submissions;

create policy ai_install_ready_admin_select
  on public.ai_install_ready_submissions
  for select
  using (public.is_admin_member(auth.uid()));

drop policy if exists ai_install_ready_screens_admin_read on storage.objects;

create policy ai_install_ready_screens_admin_read
  on storage.objects
  for select
  using (
    bucket_id = 'ai-install-ready'
    and public.is_admin_member(auth.uid())
  );