-- The Agency AI Install private replay and resource portal.
--
-- Portal attendees authenticate through Supabase Auth but are intentionally
-- separate from public.members. All reads and writes go through Edge Functions
-- using the service role after verifying either portal access or an admin
-- member. RLS stays enabled with no anon/authenticated policies as defense in
-- depth.

create table public.ai_install_portal_access (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null unique references auth.users(id) on delete cascade,
  email                     text not null,
  full_name                 text,
  platform                  text not null default 'both'
                            check (platform in ('claude', 'codex', 'both')),
  source                    text not null default 'manual'
                            check (source in ('manual', 'purchase')),
  is_active                 boolean not null default true,
  expires_at                timestamptz,
  first_login_at            timestamptz,
  last_login_at             timestamptz,
  login_count               integer not null default 0 check (login_count >= 0),
  last_magic_link_sent_at   timestamptz,
  magic_link_send_count     integer not null default 0 check (magic_link_send_count >= 0),
  last_magic_link_error     text,
  created_by                uuid references auth.users(id) on delete set null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create unique index ai_install_portal_access_email_idx
  on public.ai_install_portal_access (lower(email));

create index ai_install_portal_access_active_idx
  on public.ai_install_portal_access (is_active, created_at desc);

alter table public.ai_install_portal_access enable row level security;
revoke all on public.ai_install_portal_access from anon, authenticated;
grant all on public.ai_install_portal_access to service_role;

create table public.ai_install_portal_progress (
  access_id           uuid not null references public.ai_install_portal_access(id) on delete cascade,
  content_id          text not null check (content_id in ('day-1', 'day-2')),
  max_progress        smallint not null default 0 check (max_progress between 0 and 100),
  started_at          timestamptz,
  completed_at        timestamptz,
  last_viewed_at      timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  primary key (access_id, content_id)
);

alter table public.ai_install_portal_progress enable row level security;
revoke all on public.ai_install_portal_progress from anon, authenticated;
grant all on public.ai_install_portal_progress to service_role;

create table public.ai_install_portal_events (
  id                  uuid primary key default gen_random_uuid(),
  access_id           uuid not null references public.ai_install_portal_access(id) on delete cascade,
  user_id             uuid not null references auth.users(id) on delete cascade,
  event_type          text not null
                      check (event_type in (
                        'portal_visit',
                        'video_play',
                        'video_complete',
                        'download',
                        'sign_out'
                      )),
  content_id          text,
  progress_percent    smallint check (progress_percent between 0 and 100),
  occurred_at         timestamptz not null default now()
);

create index ai_install_portal_events_access_idx
  on public.ai_install_portal_events (access_id, occurred_at desc);

create index ai_install_portal_events_type_idx
  on public.ai_install_portal_events (event_type, occurred_at desc);

alter table public.ai_install_portal_events enable row level security;
revoke all on public.ai_install_portal_events from anon, authenticated;
grant all on public.ai_install_portal_events to service_role;

-- Private resource bucket. Hosted Supabase can reject SQL writes to the
-- storage schema, so the checked-in sync script also creates this bucket
-- through the Storage API before uploading the protected assets.
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('ai-install-portal', 'ai-install-portal', false)
  on conflict (id) do update set public = false;
exception
  when insufficient_privilege then
    raise notice 'storage.buckets is managed by the platform; run the AI Install portal asset sync';
end
$$;
