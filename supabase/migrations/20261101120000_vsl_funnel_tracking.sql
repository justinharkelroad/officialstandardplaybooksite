-- VSL funnel tracking (/start, /decision, /book, /booked, /mirror).
--
-- vsl_events: one row per funnel step (VSL play/unmute/chapter/milestone/
-- reveal, view_content, lead, schedule, initiate_checkout, purchase).
-- Anonymous rows carry only visitor_id; once the visitor gives an email,
-- funnel-track backfills it onto every earlier row from that browser.
--
-- funnel_leads: quiz and booking submissions with every answer.
--
-- Both tables are written only by the funnel-track edge function with the
-- service role. RLS is on with no policies, so the browser can't read or
-- write them directly.

create table if not exists public.vsl_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_id text not null,
  visitor_id text not null,
  email text,
  event text not null,
  video_id text,
  value text,
  offer text,
  url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  fbclid text,
  gclid text,
  referrer text,
  landing_path text,
  user_agent text
);

create unique index if not exists vsl_events_event_id_key on public.vsl_events (event_id);
create index if not exists vsl_events_visitor_idx on public.vsl_events (visitor_id, created_at desc);
create index if not exists vsl_events_email_idx on public.vsl_events (email) where email is not null;
create index if not exists vsl_events_event_idx on public.vsl_events (event, video_id, created_at desc);

alter table public.vsl_events enable row level security;

create table if not exists public.funnel_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('quiz', 'booking')),
  visitor_id text not null,
  event_id text,
  name text,
  email text not null,
  phone text,
  agency text,
  answers jsonb not null default '{}'::jsonb,
  prescription text,
  alternative text,
  offer text,
  route text,
  rule text,
  url text,
  utm jsonb not null default '{}'::jsonb,
  ghl_status text check (ghl_status in ('sent', 'skipped', 'failed'))
);

create index if not exists funnel_leads_email_idx on public.funnel_leads (email, created_at desc);
create index if not exists funnel_leads_visitor_idx on public.funnel_leads (visitor_id);

alter table public.funnel_leads enable row level security;

revoke all on public.vsl_events from anon, authenticated;
revoke all on public.funnel_leads from anon, authenticated;
