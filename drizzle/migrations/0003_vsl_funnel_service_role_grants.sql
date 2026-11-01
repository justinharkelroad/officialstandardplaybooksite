-- funnel-track writes vsl_events and funnel_leads with the service role.
-- This project doesn't grant new public tables to service_role by default,
-- so grant it explicitly. anon and authenticated keep no access, and RLS
-- stays on with no policies: the browser still can't read or write these.
grant select, insert, update, delete on public.vsl_events to service_role;
grant select, insert, update, delete on public.funnel_leads to service_role;
grant usage, select on sequence public.vsl_events_id_seq to service_role;
