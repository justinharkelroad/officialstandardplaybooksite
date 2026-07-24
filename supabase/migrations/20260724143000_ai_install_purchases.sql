-- The Agency AI Install — Stripe fulfillment and transactional email ledger.
--
-- Both tables are service-role only: RLS is enabled with no public policies.
-- Stripe webhook retries are expected, so the Checkout Session and email kind
-- constraints are the durable idempotency boundary.

create table if not exists public.ai_install_purchases (
  id                         uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id    text,
  stripe_payment_link_id      text not null,
  last_stripe_event_id        text not null,
  email                       text not null,
  full_name                   text,
  business_name               text,
  phone                       text,
  tool_choice                 text not null default 'undecided'
                              check (tool_choice in ('claude', 'codex', 'undecided')),
  tool_choice_raw             text,
  amount_total                integer,
  currency                    text,
  payment_status              text not null,
  purchased_at                timestamptz not null,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.ai_install_purchases enable row level security;

create index if not exists ai_install_purchases_email_idx
  on public.ai_install_purchases (lower(email));

create index if not exists ai_install_purchases_recent_idx
  on public.ai_install_purchases (purchased_at desc);

create table if not exists public.ai_install_email_sends (
  id              uuid primary key default gen_random_uuid(),
  purchase_id     uuid not null references public.ai_install_purchases(id) on delete cascade,
  kind            text not null check (kind in ('purchase_confirmation')),
  recipient_email text not null,
  subject         text not null,
  status          text not null default 'pending'
                  check (status in ('pending', 'sending', 'sent', 'failed', 'skipped_no_key')),
  attempt_count   integer not null default 0,
  resend_id       text,
  error           text,
  last_attempt_at timestamptz,
  sent_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (purchase_id, kind)
);

alter table public.ai_install_email_sends enable row level security;

create index if not exists ai_install_email_sends_status_idx
  on public.ai_install_email_sends (status, created_at desc);

