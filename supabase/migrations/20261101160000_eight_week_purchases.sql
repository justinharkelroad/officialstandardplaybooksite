-- 8-Week Sales Management Experience purchases and weekly payments.
--
-- Stripe payment links can't stop a weekly subscription after N charges, so
-- the eight-week-billing function records each purchase and each weekly
-- payment, emails the team on purchase, and emails a "cancel now" reminder
-- when the 8th payment clears (an alert if a 9th ever does).
--
-- Written only by the edge function with the service role. RLS on, no
-- policies; anon and authenticated get nothing.

create table if not exists public.eight_week_purchases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_link_id text not null,
  stripe_subscription_id text unique,
  plan text not null check (plan in ('weekly', 'pif')),
  email text,
  full_name text,
  phone text,
  amount_total integer,
  currency text,
  purchased_at timestamptz not null,
  purchase_email_sent_at timestamptz,
  cancel_reminder_sent_at timestamptz
);

create table if not exists public.eight_week_payments (
  stripe_invoice_id text primary key,
  stripe_subscription_id text not null,
  amount_paid integer,
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists eight_week_payments_subscription_idx
  on public.eight_week_payments (stripe_subscription_id);

alter table public.eight_week_purchases enable row level security;
alter table public.eight_week_payments enable row level security;

revoke all on public.eight_week_purchases from anon, authenticated;
revoke all on public.eight_week_payments from anon, authenticated;
grant select, insert, update, delete on public.eight_week_purchases to service_role;
grant select, insert, update, delete on public.eight_week_payments to service_role;
