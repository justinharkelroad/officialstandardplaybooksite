-- Record whether the team notification email for each funnel lead went out.
alter table public.funnel_leads
  add column if not exists notify_status text check (notify_status in ('sent', 'skipped', 'failed'));
