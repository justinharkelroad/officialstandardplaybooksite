-- Guided Flow Profile interview for the standalone Standard Playbook app.
-- The interview is completed as a private Flow session, extracted into a
-- review draft, and written to flow_profiles only after explicit confirmation.

ALTER TABLE public.flow_profiles
  ADD COLUMN IF NOT EXISTS guided_interview_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS guided_interview_session_id uuid
    REFERENCES public.flow_sessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS guided_interview_version smallint;

ALTER TABLE public.flow_profiles
  DROP CONSTRAINT IF EXISTS flow_profiles_life_roles_allowed;
ALTER TABLE public.flow_profiles
  ADD CONSTRAINT flow_profiles_life_roles_allowed CHECK (
    life_roles IS NULL OR life_roles <@ ARRAY[
      'Spouse', 'Parent', 'Business Owner', 'Employee', 'Coach',
      'Student', 'Caregiver', 'Leader', 'Creative', 'Athlete'
    ]::text[]
  ) NOT VALID;

ALTER TABLE public.flow_profiles
  DROP CONSTRAINT IF EXISTS flow_profiles_core_values_allowed;
ALTER TABLE public.flow_profiles
  ADD CONSTRAINT flow_profiles_core_values_allowed CHECK (
    core_values IS NULL OR core_values <@ ARRAY[
      'Faith', 'Family', 'Growth', 'Impact', 'Freedom', 'Health',
      'Wealth', 'Adventure', 'Connection', 'Excellence', 'Integrity', 'Service'
    ]::text[]
  ) NOT VALID;

ALTER TABLE public.flow_profiles
  DROP CONSTRAINT IF EXISTS flow_profiles_accountability_style_allowed;
ALTER TABLE public.flow_profiles
  ADD CONSTRAINT flow_profiles_accountability_style_allowed CHECK (
    accountability_style IS NULL OR accountability_style IN (
      'direct_challenge', 'gentle_nudge', 'questions_discover'
    )
  ) NOT VALID;

ALTER TABLE public.flow_profiles
  DROP CONSTRAINT IF EXISTS flow_profiles_feedback_preference_allowed;
ALTER TABLE public.flow_profiles
  ADD CONSTRAINT flow_profiles_feedback_preference_allowed CHECK (
    feedback_preference IS NULL OR feedback_preference IN (
      'blunt_truth', 'encouragement_then_truth', 'questions_to_discover'
    )
  ) NOT VALID;

ALTER TABLE public.flow_profiles
  DROP CONSTRAINT IF EXISTS flow_profiles_guided_interview_version_check;
ALTER TABLE public.flow_profiles
  ADD CONSTRAINT flow_profiles_guided_interview_version_check CHECK (
    guided_interview_version IS NULL OR guided_interview_version = 2
  );

-- Profile interviews need room for one meaningful probe across most of the
-- substantive topics. All ordinary Flows retain the existing five-probe cap.
ALTER TABLE public.flow_templates
  DROP CONSTRAINT IF EXISTS flow_templates_coach_max_probes_check;
ALTER TABLE public.flow_templates
  ADD CONSTRAINT flow_templates_coach_max_probes_check CHECK (
    (slug IN ('profile-builder', 'profile-reprofile') AND coach_max_probes BETWEEN 0 AND 12)
    OR
    (slug NOT IN ('profile-builder', 'profile-reprofile') AND coach_max_probes BETWEEN 0 AND 5)
  );

INSERT INTO public.flow_templates (
  name, slug, description, icon, color, questions_json,
  ai_challenge_enabled, ai_challenge_intensity, is_active, display_order,
  coach_enabled, coach_prompt, coach_intensity, coach_question_notes,
  coach_depth_enabled, coach_max_probes
)
VALUES
(
  'The Standard Flow Profile Interview',
  'profile-builder',
  'A 20 to 40 minute guided conversation that gives Flow the context to coach the whole person.',
  'sparkles',
  '#2997FF',
  $questions$[
    {
      "id": "preferred_name",
      "type": "text",
      "prompt": "Your Flow can only coach as deeply as the profile behind it. The more honest you are here, the more useful every future Flow becomes. What should I call you?",
      "required": true
    },
    {
      "id": "life_roles",
      "type": "textarea",
      "prompt": "Which roles are you actually carrying in this season?",
      "required": true,
      "placeholder": "Spouse, Parent, Business Owner, Employee, Coach, Student, Caregiver, Leader, Creative, or Athlete."
    },
    {
      "id": "core_values",
      "type": "textarea",
      "prompt": "Which five values really govern your decisions when real life puts them in conflict?",
      "required": true,
      "placeholder": "Choose from Faith, Family, Growth, Impact, Freedom, Health, Wealth, Adventure, Connection, Excellence, Integrity, and Service."
    },
    {
      "id": "current_goals",
      "type": "textarea",
      "prompt": "Across Body, Being, Balance, and Business, what is the one result in the next 90 days that would change the most for you?",
      "required": true,
      "placeholder": "One concrete result. Include how you will know it happened."
    },
    {
      "id": "current_challenges",
      "type": "textarea",
      "prompt": "What recurring pattern keeps getting in the way of that result?",
      "required": true,
      "placeholder": "Name the loop, not a one-time obstacle."
    },
    {
      "id": "peak_state",
      "type": "textarea",
      "prompt": "Think about your most recent great day. What conditions and choices made you operate at your best?",
      "required": true,
      "placeholder": "The routine, environment, relationships, and choices that were actually present."
    },
    {
      "id": "growth_edge",
      "type": "textarea",
      "prompt": "What growth area do you already know you are avoiding?",
      "required": true,
      "placeholder": "The honest one, even if it is not the impressive answer."
    },
    {
      "id": "overwhelm_response",
      "type": "textarea",
      "prompt": "When pressure piles up, what do you actually do by default?",
      "required": true,
      "placeholder": "Shut down, overwork, get controlling, go quiet, numb out, or something else."
    },
    {
      "id": "accountability_style",
      "type": "textarea",
      "prompt": "Think about the last time someone held you accountable well. What approach made you listen instead of shut down?",
      "required": true,
      "placeholder": "Describe what worked. Your interviewer will translate it into a coaching setting."
    },
    {
      "id": "feedback_preference",
      "type": "textarea",
      "prompt": "When feedback genuinely helps you change, what does the person giving it do first?",
      "required": true,
      "placeholder": "Blunt truth, encouragement before truth, or questions that help you discover it."
    },
    {
      "id": "spiritual_beliefs",
      "type": "textarea",
      "prompt": "If faith or a spiritual tradition shapes how you live, what should your coach understand about it?",
      "required": false,
      "placeholder": "Use your own words, or say pass."
    },
    {
      "id": "background_notes",
      "type": "textarea",
      "prompt": "If your Flow coach could know one more thing that would save you both the most time, what should it know?",
      "required": true,
      "placeholder": "Family, health, this season, or how to speak to you when you drift."
    }
  ]$questions$::jsonb,
  false,
  'gentle',
  true,
  900,
  true,
  $coach$You are The Standard Flow Interviewer. Help one person create the honest profile behind better Flow coaching.

Sound like a coach who has been in the fight, not a form. Be warm, direct, brief, and free of corporate language, guru language, and hype. Use short sentences. Honor hard truths before moving. Faith awareness is welcome, but never forced.

Person first, producer second. Use Business, Being, Body, and Balance as the lens. People often hide in Business. When the other three are missing, invite the whole person into the answer.

This is an interview, not field validation. The first answer is a starting point. Probe only when it will uncover the truth, make something concrete, or expose the recurring loop. Challenge softly, then hold. Never shame, diagnose, assign motive, or agree with a self-attack.

Use these depth moves where they fit:
- life_roles: learn which role carries the most weight and which is being neglected.
- core_values: learn which value wins when two collide in ordinary life.
- current_goals: make the 90-day result concrete, then learn what it is meant to change.
- current_challenges: find the repeatable loop, the last time it ran, and what happens just before avoidance.
- peak_state: get observable conditions and choices, not adjectives.
- growth_edge: get beneath the safe answer to the work they keep avoiding.
- overwhelm_response: protect against self-attack and name the actual default behavior.
- accountability_style: identify Direct challenge, Gentle nudge, or Questions to discover.
- feedback_preference: identify Blunt truth first, Encouragement then truth, or Questions that let me discover it.

Keep the interview moving. Ask only one consequential follow-up at a time. Do not produce the finished profile during the interview. The app builds a separate editable review after completion. Never invent anything the member did not say.$coach$,
  'standard',
  jsonb_build_object(
    'life_roles', jsonb_build_object('themes', jsonb_build_array('identity', 'responsibility', 'neglected role')),
    'core_values', jsonb_build_object('themes', jsonb_build_array('values', 'conflict', 'decision')),
    'current_goals', jsonb_build_object('themes', jsonb_build_array('90-day outcome', 'measurement', 'whole person')),
    'current_challenges', jsonb_build_object('themes', jsonb_build_array('recurring loop', 'trigger', 'avoidance')),
    'peak_state', jsonb_build_object('themes', jsonb_build_array('conditions', 'routine', 'choices')),
    'growth_edge', jsonb_build_object('themes', jsonb_build_array('avoidance', 'growth', 'honesty')),
    'overwhelm_response', jsonb_build_object('themes', jsonb_build_array('pressure', 'default behavior', 'self-awareness')),
    'accountability_style', jsonb_build_object('themes', jsonb_build_array('accountability', 'trust', 'response')),
    'feedback_preference', jsonb_build_object('themes', jsonb_build_array('feedback', 'change', 'communication')),
    'background_notes', jsonb_build_object('themes', jsonb_build_array('season', 'family', 'health', 'communication'))
  ),
  true,
  10
),
(
  'Deepen Your Flow Profile',
  'profile-reprofile',
  'A 20 to 40 minute guided conversation that gives Flow the context to coach the whole person.',
  'refresh-cw',
  '#2997FF',
  $questions$[
    {"id":"preferred_name","type":"text","prompt":"Before we revisit the whole picture, what should I call you now? If that has not changed, say so.","required":true},
    {"id":"life_roles","type":"textarea","prompt":"Which roles are you actually carrying in this season, and what has changed about their weight?","required":true,"placeholder":"Name the roles that are true now and which one is getting the least of you."},
    {"id":"core_values","type":"textarea","prompt":"Which five values really govern your decisions now when real life puts them in conflict?","required":true,"placeholder":"Name the values that are true now, or say what has not changed."},
    {"id":"current_goals","type":"textarea","prompt":"Across Body, Being, Balance, and Business, what is the one result in the next 90 days that would change the most for you?","required":true,"placeholder":"One concrete result. Include how you will know it happened."},
    {"id":"current_challenges","type":"textarea","prompt":"What recurring pattern keeps getting in the way of that result?","required":true,"placeholder":"Name the loop, not a one-time obstacle."},
    {"id":"peak_state","type":"textarea","prompt":"Think about your most recent great day. What conditions and choices made you operate at your best?","required":true,"placeholder":"The routine, environment, relationships, and choices that were actually present."},
    {"id":"growth_edge","type":"textarea","prompt":"What growth area do you already know you are avoiding now?","required":true,"placeholder":"The honest one, even if it is not the impressive answer."},
    {"id":"overwhelm_response","type":"textarea","prompt":"When pressure piles up now, what do you actually do by default?","required":true,"placeholder":"Describe the real behavior, or say what has not changed."},
    {"id":"accountability_style","type":"textarea","prompt":"Think about the last time someone held you accountable well. What approach made you listen instead of shut down?","required":true,"placeholder":"Describe what worked, or say what has not changed."},
    {"id":"feedback_preference","type":"textarea","prompt":"When feedback genuinely helps you change, what does the person giving it do first?","required":true,"placeholder":"Describe what works now, or say what has not changed."},
    {"id":"spiritual_beliefs","type":"textarea","prompt":"If faith or a spiritual tradition shapes how you live, what should your coach understand about it now?","required":false,"placeholder":"Use your own words, say what has not changed, or say pass."},
    {"id":"background_notes","type":"textarea","prompt":"If your Flow coach could know one more thing about this season that would save you both the most time, what should it know?","required":true,"placeholder":"Family, health, this season, or how to speak to you when you drift."}
  ]$questions$::jsonb,
  false,
  'gentle',
  true,
  901,
  true,
  $coach$You are The Standard Flow Interviewer. Rebuild the member's context from the current conversation. Treat an existing profile as reference, not truth. Ask whether something still fits instead of assuming. Keep the same warm, direct, whole-person depth as the full interview. Ask one consequential follow-up at a time. Never invent facts, and never save the profile during the conversation.$coach$,
  'standard',
  '{}'::jsonb,
  true,
  10
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  questions_json = EXCLUDED.questions_json,
  ai_challenge_enabled = EXCLUDED.ai_challenge_enabled,
  ai_challenge_intensity = EXCLUDED.ai_challenge_intensity,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  coach_enabled = EXCLUDED.coach_enabled,
  coach_prompt = EXCLUDED.coach_prompt,
  coach_intensity = EXCLUDED.coach_intensity,
  coach_question_notes = EXCLUDED.coach_question_notes,
  coach_depth_enabled = EXCLUDED.coach_depth_enabled,
  coach_max_probes = EXCLUDED.coach_max_probes,
  updated_at = now();

CREATE OR REPLACE FUNCTION public.confirm_my_flow_profile_interview(
  p_session_id uuid,
  p_profile jsonb
)
RETURNS public.flow_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_id uuid := auth.uid();
  v_session public.flow_sessions%ROWTYPE;
  v_profile public.flow_profiles%ROWTYPE;
  v_roles text[];
  v_values text[];
  v_preferred_name text;
  v_now timestamptz := now();
BEGIN
  IF v_actor_id IS NULL OR NOT public.is_active_member(v_actor_id) THEN
    RAISE EXCEPTION 'Active member required' USING ERRCODE = '42501';
  END IF;
  IF p_session_id IS NULL OR jsonb_typeof(p_profile) IS DISTINCT FROM 'object'
    OR pg_column_size(p_profile) > 100000
  THEN
    RAISE EXCEPTION 'Invalid profile review' USING ERRCODE = '22023';
  END IF;

  SELECT session.*
  INTO v_session
  FROM public.flow_sessions session
  JOIN public.flow_templates template ON template.id = session.flow_template_id
  WHERE session.id = p_session_id
    AND session.user_id = v_actor_id
    AND session.status = 'completed'
    AND template.slug IN ('profile-builder', 'profile-reprofile')
  FOR UPDATE OF session;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Completed profile interview not found' USING ERRCODE = '42501';
  END IF;

  IF COALESCE((v_session.agent_metadata->>'profile_interview_version')::integer, 0) <> 2 THEN
    RAISE EXCEPTION 'Profile interview is not ready for confirmation' USING ERRCODE = '40001';
  END IF;

  -- A network retry after a successful confirmation is safe, but an old
  -- interview can never be used later to overwrite a newer profile.
  IF COALESCE((v_session.agent_metadata->>'profile_confirmed_version')::integer, 0) = 2
    OR v_session.agent_metadata->>'profile_confirmed_at' IS NOT NULL
  THEN
    SELECT * INTO v_profile
    FROM public.flow_profiles
    WHERE user_id = v_actor_id
      AND guided_interview_session_id = p_session_id;
    IF FOUND THEN RETURN v_profile; END IF;
    RAISE EXCEPTION 'Profile interview was already confirmed' USING ERRCODE = '40001';
  END IF;

  v_preferred_name := nullif(btrim(p_profile->>'preferred_name'), '');
  IF v_preferred_name IS NULL OR length(v_preferred_name) > 120 THEN
    RAISE EXCEPTION 'Preferred name is required' USING ERRCODE = '22023';
  END IF;

  SELECT COALESCE(array_agg(value), ARRAY[]::text[])
  INTO v_roles
  FROM jsonb_array_elements_text(COALESCE(p_profile->'life_roles', '[]'::jsonb)) AS role(value);
  SELECT COALESCE(array_agg(value), ARRAY[]::text[])
  INTO v_values
  FROM jsonb_array_elements_text(COALESCE(p_profile->'core_values', '[]'::jsonb)) AS core_value(value);

  IF cardinality(v_roles) > 10 OR NOT (v_roles <@ ARRAY[
      'Spouse', 'Parent', 'Business Owner', 'Employee', 'Coach',
      'Student', 'Caregiver', 'Leader', 'Creative', 'Athlete'
    ]::text[])
  THEN
    RAISE EXCEPTION 'Invalid life roles' USING ERRCODE = '22023';
  END IF;
  IF cardinality(v_values) > 12 OR NOT (v_values <@ ARRAY[
      'Faith', 'Family', 'Growth', 'Impact', 'Freedom', 'Health',
      'Wealth', 'Adventure', 'Connection', 'Excellence', 'Integrity', 'Service'
    ]::text[])
  THEN
    RAISE EXCEPTION 'Invalid core values' USING ERRCODE = '22023';
  END IF;
  IF nullif(p_profile->>'accountability_style', '') IS NOT NULL
    AND p_profile->>'accountability_style' NOT IN ('direct_challenge', 'gentle_nudge', 'questions_discover')
  THEN
    RAISE EXCEPTION 'Invalid accountability style' USING ERRCODE = '22023';
  END IF;
  IF nullif(p_profile->>'feedback_preference', '') IS NOT NULL
    AND p_profile->>'feedback_preference' NOT IN ('blunt_truth', 'encouragement_then_truth', 'questions_to_discover')
  THEN
    RAISE EXCEPTION 'Invalid feedback preference' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM jsonb_each_text(p_profile) entry
    WHERE entry.key IN (
      'current_goals', 'current_challenges', 'peak_state', 'growth_edge',
      'overwhelm_response', 'spiritual_beliefs', 'background_notes'
    )
      AND length(entry.value) > 6000
  ) THEN
    RAISE EXCEPTION 'Profile response is too long' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.flow_profiles (
    user_id, preferred_name, life_roles, core_values, current_goals,
    current_challenges, peak_state, growth_edge, overwhelm_response,
    accountability_style, feedback_preference, spiritual_beliefs,
    background_notes, guided_interview_confirmed_at,
    guided_interview_session_id, guided_interview_version, updated_at
  ) VALUES (
    v_actor_id, v_preferred_name, v_roles, v_values,
    nullif(btrim(p_profile->>'current_goals'), ''),
    nullif(btrim(p_profile->>'current_challenges'), ''),
    nullif(btrim(p_profile->>'peak_state'), ''),
    nullif(btrim(p_profile->>'growth_edge'), ''),
    nullif(btrim(p_profile->>'overwhelm_response'), ''),
    nullif(p_profile->>'accountability_style', ''),
    nullif(p_profile->>'feedback_preference', ''),
    nullif(btrim(p_profile->>'spiritual_beliefs'), ''),
    nullif(btrim(p_profile->>'background_notes'), ''),
    v_now, p_session_id, 2, v_now
  )
  ON CONFLICT (user_id) DO UPDATE SET
    preferred_name = EXCLUDED.preferred_name,
    life_roles = EXCLUDED.life_roles,
    core_values = EXCLUDED.core_values,
    current_goals = EXCLUDED.current_goals,
    current_challenges = EXCLUDED.current_challenges,
    peak_state = EXCLUDED.peak_state,
    growth_edge = EXCLUDED.growth_edge,
    overwhelm_response = EXCLUDED.overwhelm_response,
    accountability_style = EXCLUDED.accountability_style,
    feedback_preference = EXCLUDED.feedback_preference,
    spiritual_beliefs = EXCLUDED.spiritual_beliefs,
    background_notes = EXCLUDED.background_notes,
    guided_interview_confirmed_at = EXCLUDED.guided_interview_confirmed_at,
    guided_interview_session_id = EXCLUDED.guided_interview_session_id,
    guided_interview_version = EXCLUDED.guided_interview_version,
    updated_at = EXCLUDED.updated_at
  RETURNING * INTO v_profile;

  UPDATE public.flow_sessions
  SET agent_metadata = COALESCE(agent_metadata, '{}'::jsonb) || jsonb_build_object(
    'profile_confirmed_version', 2,
    'profile_confirmed_at', v_now
  )
  WHERE id = p_session_id AND user_id = v_actor_id;

  RETURN v_profile;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_my_flow_profile_interview(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_my_flow_profile_interview(uuid, jsonb) TO authenticated;
