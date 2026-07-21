BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(8);

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, created_at, updated_at
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'delete-flow-test@example.com',
  '',
  now(),
  now()
);

INSERT INTO public.members (id, full_name, email)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Delete Flow Test',
  'delete-flow-test@example.com'
);

INSERT INTO public.flow_profiles (
  user_id, full_name, coach_memory_announced_at
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Delete Flow Test',
  now()
);

INSERT INTO public.flow_sessions (
  id, user_id, flow_template_id, title, responses_json, status, completed_at
)
SELECT
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  id,
  'Flow to forget',
  '{"answer":"private source material"}'::jsonb,
  'completed',
  '2026-07-14T12:00:00Z'
FROM public.flow_templates
WHERE slug = 'grateful';

INSERT INTO public.flow_sessions (
  id, user_id, flow_template_id, title, responses_json, status, completed_at
)
SELECT
  '20000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  id,
  'Flow to keep',
  '{"answer":"unrelated material"}'::jsonb,
  'completed',
  '2026-07-21T12:00:00Z'
FROM public.flow_templates
WHERE slug = 'grateful';

INSERT INTO public.flow_member_insights (
  id, user_id, flow_slug, source_session_id, session_title, kind, content
) VALUES (
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'grateful',
  '20000000-0000-0000-0000-000000000001',
  'Flow to forget',
  'quote',
  'private source material'
);

-- This message belongs to the retained session, but it rendered a memory from
-- the session being deleted and must therefore be removed too.
INSERT INTO public.flow_coach_messages (
  id, flow_session_id, question_id, reflection, memory_refs
) VALUES (
  '40000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  'memory_reference',
  'A reflection containing private source material',
  '[{"id":"30000000-0000-0000-0000-000000000001"}]'::jsonb
), (
  '40000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  'unrelated',
  'A reflection based only on the retained Flow',
  '[]'::jsonb
);

INSERT INTO public.weekly_flow_reflections (
  user_id, week_key, week_start, week_end, timezone,
  range_start_at, range_end_at, source_hash, generation_status,
  source_session_ids, source_count, source_day_count
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '2026-W29', '2026-07-13', '2026-07-19', 'UTC',
  '2026-07-13T00:00:00Z', '2026-07-20T00:00:00Z', 'affected', 'ready',
  ARRAY['20000000-0000-0000-0000-000000000001'::uuid], 1, 1
), (
  '10000000-0000-0000-0000-000000000001',
  '2026-W30', '2026-07-20', '2026-07-26', 'UTC',
  '2026-07-20T00:00:00Z', '2026-07-27T00:00:00Z', 'unaffected', 'ready',
  ARRAY['20000000-0000-0000-0000-000000000002'::uuid], 1, 1
);

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);
SELECT public.delete_my_flow_session(
  '20000000-0000-0000-0000-000000000001'::uuid
);
RESET ROLE;

SELECT is(
  (SELECT count(*) FROM public.flow_sessions WHERE id = '20000000-0000-0000-0000-000000000001'),
  0::bigint,
  'deletes the selected Flow session'
);
SELECT is(
  (SELECT count(*) FROM public.flow_sessions WHERE id = '20000000-0000-0000-0000-000000000002'),
  1::bigint,
  'keeps other Flow sessions'
);
SELECT is(
  (SELECT count(*) FROM public.flow_member_insights WHERE id = '30000000-0000-0000-0000-000000000001'),
  0::bigint,
  'cascades the selected Flow distilled memory'
);
SELECT is(
  (SELECT count(*) FROM public.flow_coach_messages WHERE id = '40000000-0000-0000-0000-000000000001'),
  0::bigint,
  'deletes a later reflection that rendered the selected Flow memory'
);
SELECT is(
  (SELECT count(*) FROM public.flow_coach_messages WHERE id = '40000000-0000-0000-0000-000000000002'),
  1::bigint,
  'keeps unrelated coach reflections'
);
SELECT is(
  (SELECT count(*) FROM public.weekly_flow_reflections WHERE week_key = '2026-W29'),
  0::bigint,
  'deletes a Weekly Reflection synthesized from the selected Flow'
);
SELECT is(
  (SELECT count(*) FROM public.weekly_flow_reflections WHERE week_key = '2026-W30'),
  1::bigint,
  'keeps Weekly Reflections that do not use the selected Flow'
);
SELECT is(
  (SELECT coach_memory_announced_at FROM public.flow_profiles WHERE user_id = '10000000-0000-0000-0000-000000000001'),
  NULL::timestamptz,
  'resets memory disclosure after the final remembered insight is deleted'
);

SELECT * FROM finish();
ROLLBACK;
