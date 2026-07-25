BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(13);

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, created_at, updated_at
) VALUES
(
  '11000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'life-targets-a@example.com',
  '',
  now(),
  now()
),
(
  '11000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'life-targets-b@example.com',
  '',
  now(),
  now()
);

INSERT INTO public.members (id, full_name, email) VALUES
(
  '11000000-0000-0000-0000-000000000001',
  'Life Targets A',
  'life-targets-a@example.com'
),
(
  '11000000-0000-0000-0000-000000000002',
  'Life Targets B',
  'life-targets-b@example.com'
);

INSERT INTO public.life_targets_quarterly (user_id, quarter) VALUES
('11000000-0000-0000-0000-000000000001', '2026-Q3'),
('11000000-0000-0000-0000-000000000002', '2026-Q3');

INSERT INTO public.life_targets_brainstorm (
  user_id, quarter, domain, target_text, session_id
) VALUES
(
  '11000000-0000-0000-0000-000000000001',
  '2026-Q3',
  'body',
  'Actor A first idea',
  '21000000-0000-0000-0000-000000000001'
),
(
  '11000000-0000-0000-0000-000000000001',
  '2026-Q3',
  'business',
  'Actor A second session idea',
  '21000000-0000-0000-0000-000000000002'
),
(
  '11000000-0000-0000-0000-000000000002',
  '2026-Q3',
  'body',
  'Actor B idea',
  '22000000-0000-0000-0000-000000000001'
);

INSERT INTO public.core4_monthly_missions (
  user_id, domain, title, month_year
) VALUES
('11000000-0000-0000-0000-000000000001', 'body', 'A Body', '2026-07'),
('11000000-0000-0000-0000-000000000001', 'being', 'A Being', '2026-07'),
('11000000-0000-0000-0000-000000000001', 'balance', 'A Balance', '2026-07'),
('11000000-0000-0000-0000-000000000001', 'business', 'A Business', '2026-07'),
('11000000-0000-0000-0000-000000000002', 'body', 'B Body', '2026-07');

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);
SELECT public.reset_my_life_targets_quarter('2026-Q3');
RESET ROLE;

SELECT is(
  (SELECT count(*) FROM public.life_targets_quarterly
   WHERE user_id = '11000000-0000-0000-0000-000000000001'),
  0::bigint,
  'quarter reset deletes the caller quarterly row'
);
SELECT is(
  (SELECT count(*) FROM public.life_targets_quarterly
   WHERE user_id = '11000000-0000-0000-0000-000000000002'),
  1::bigint,
  'quarter reset keeps another member quarterly row'
);
SELECT is(
  (SELECT count(*) FROM public.life_targets_brainstorm
   WHERE user_id = '11000000-0000-0000-0000-000000000001'),
  0::bigint,
  'quarter reset deletes every caller Brain Dump session for the quarter'
);
SELECT is(
  (SELECT count(*) FROM public.life_targets_brainstorm
   WHERE user_id = '11000000-0000-0000-0000-000000000002'),
  1::bigint,
  'quarter reset keeps another member Brain Dump'
);
SELECT is(
  (SELECT count(*) FROM public.core4_monthly_missions
   WHERE user_id = '11000000-0000-0000-0000-000000000001'
     AND status = 'active'),
  4::bigint,
  'quarter reset preserves the independent This Month cadence'
);

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);
SELECT public.reset_my_core4_month('2026-07');
RESET ROLE;

SELECT is(
  (SELECT count(*) FROM public.core4_monthly_missions
   WHERE user_id = '11000000-0000-0000-0000-000000000001'
     AND status = 'active'),
  0::bigint,
  'month reset clears every active caller mission'
);
SELECT is(
  (SELECT count(*) FROM public.core4_monthly_missions
   WHERE user_id = '11000000-0000-0000-0000-000000000001'
     AND status = 'archived'),
  4::bigint,
  'month reset archives caller missions for recovery-safe history'
);
SELECT is(
  (SELECT count(*) FROM public.core4_monthly_missions
   WHERE user_id = '11000000-0000-0000-0000-000000000002'
     AND status = 'active'),
  1::bigint,
  'month reset keeps another member active mission'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.reset_my_life_targets_quarter(text)', 'EXECUTE'),
  'authenticated members can execute quarter reset'
);
SELECT ok(
  NOT has_function_privilege('anon', 'public.reset_my_life_targets_quarter(text)', 'EXECUTE'),
  'anonymous callers cannot execute quarter reset'
);
SELECT ok(
  has_function_privilege('authenticated', 'public.reset_my_core4_month(text)', 'EXECUTE'),
  'authenticated members can execute month reset'
);
SELECT ok(
  NOT has_function_privilege('anon', 'public.reset_my_core4_month(text)', 'EXECUTE'),
  'anonymous callers cannot execute month reset'
);
SELECT has_column(
  'public',
  'life_targets_quarterly',
  'daily_proof_reviewed_at',
  'Daily Proof completion has an explicit server marker'
);

SELECT * FROM finish();
ROLLBACK;
