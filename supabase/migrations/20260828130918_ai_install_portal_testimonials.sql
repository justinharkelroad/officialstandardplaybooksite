-- Optional, private video testimonials for the Agency AI Install portal.
-- Attendees never receive table access: authenticated portal and admin edge
-- functions validate each request, then use the service role for metadata and
-- signed storage operations.

alter table public.ai_install_portal_access
  add column if not exists testimonial_prompt_dismissed_at timestamptz,
  add column if not exists testimonial_submitted_at timestamptz;

create table public.ai_install_portal_settings (
  id                          text primary key default 'default'
                              check (id = 'default'),
  testimonial_prompt_enabled boolean not null default true,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

insert into public.ai_install_portal_settings (id, testimonial_prompt_enabled)
values ('default', true)
on conflict (id) do nothing;

alter table public.ai_install_portal_settings enable row level security;
revoke all on public.ai_install_portal_settings from anon, authenticated;
grant all on public.ai_install_portal_settings to service_role;

create table public.ai_install_portal_testimonials (
  id                    uuid primary key default gen_random_uuid(),
  access_id             uuid not null references public.ai_install_portal_access(id) on delete cascade,
  user_id               uuid not null references auth.users(id) on delete cascade,
  storage_path          text not null unique,
  original_filename     text not null,
  content_type          text not null,
  size_bytes            bigint not null check (size_bytes > 0 and size_bytes <= 524288000),
  status                text not null default 'pending'
                        check (status in ('pending', 'uploaded', 'failed')),
  consent_granted_at    timestamptz not null,
  consent_text_version  text not null default '2026-08-28',
  submitted_at          timestamptz,
  notification_sent_at  timestamptz,
  notification_error    text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index ai_install_portal_testimonials_access_idx
  on public.ai_install_portal_testimonials (access_id, created_at desc);

create index ai_install_portal_testimonials_submitted_idx
  on public.ai_install_portal_testimonials (submitted_at desc)
  where status = 'uploaded';

alter table public.ai_install_portal_testimonials enable row level security;
revoke all on public.ai_install_portal_testimonials from anon, authenticated;
grant all on public.ai_install_portal_testimonials to service_role;

alter table public.ai_install_portal_events
  drop constraint if exists ai_install_portal_events_event_type_check;

alter table public.ai_install_portal_events
  add constraint ai_install_portal_events_event_type_check
  check (event_type in (
    'portal_visit',
    'video_play',
    'video_complete',
    'download',
    'sign_out',
    'testimonial_skip',
    'testimonial_upload'
  ));

-- Keep the bucket private and restrict it to common phone/browser video types.
-- Some hosted projects manage storage.buckets outside migration permissions;
-- in that case the platform handoff creates the same bucket through Storage.
do $$
begin
  insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
  ) values (
    'ai-install-testimonials',
    'ai-install-testimonials',
    false,
    524288000,
    array['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v']
  )
  on conflict (id) do update set
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
exception
  when insufficient_privilege then
    raise notice 'storage.buckets is managed by the platform; create ai-install-testimonials through Storage';
end
$$;
