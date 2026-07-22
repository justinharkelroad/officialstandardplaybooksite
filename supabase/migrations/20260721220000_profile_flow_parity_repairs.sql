-- Restore the guidance and controls that the conversational Flow composer can
-- actually present, and retain the narrative behind canonical role/value tags.

ALTER TABLE public.flow_profiles
  ADD COLUMN IF NOT EXISTS life_roles_context text,
  ADD COLUMN IF NOT EXISTS core_values_context text;

UPDATE public.flow_templates
SET questions_json = $questions$[
  {
    "id":"preferred_name",
    "type":"text",
    "prompt":"Your Flow can only coach as deeply as the profile behind it. The more honest you are here, the more useful every future Flow becomes. What should I call you?",
    "required":true,
    "placeholder":"Your first name or nickname."
  },
  {
    "id":"life_roles",
    "type":"textarea",
    "prompt":"Let's name the roles you carry. For example: spouse, parent, business owner, employee, coach, student, caregiver, leader, creative, or athlete, plus any others that are true for you. Which roles are yours, which carries the most weight, and which has been getting the least of you lately?",
    "required":false,
    "placeholder":"Name the roles, including any not listed, then tell me which one you have been shortchanging."
  },
  {
    "id":"core_values",
    "type":"textarea",
    "prompt":"Which five values really govern your decisions? Examples include Faith, Family, Growth, Impact, Freedom, Health, Wealth, Adventure, Connection, Excellence, Integrity, and Service, but use your own words too. When two values collide in real life, which one tends to win?",
    "required":false,
    "placeholder":"Name your top five and what happens when two of them compete."
  },
  {
    "id":"current_goals",
    "type":"textarea",
    "prompt":"Across Body, Being, Balance, and Business, what is the one result in the next 90 days that would change the most for you? Make it concrete and include how you will know it happened.",
    "required":false,
    "placeholder":"One concrete result with a finish line you can recognize."
  },
  {
    "id":"current_challenges",
    "type":"textarea",
    "prompt":"What recurring pattern keeps getting in the way of that result? Name the loop, not a one-time obstacle.",
    "required":false,
    "placeholder":"What happens repeatedly, and what tends to trigger it?"
  },
  {
    "id":"peak_state",
    "type":"textarea",
    "prompt":"Think about your most recent great day. What routine, environment, relationships, and choices were actually present when you operated at your best?",
    "required":false,
    "placeholder":"The observable conditions and choices behind your best days."
  },
  {
    "id":"growth_edge",
    "type":"textarea",
    "prompt":"What growth area do you already know you are avoiding? Name the honest one, even if it is not the impressive answer.",
    "required":false,
    "placeholder":"The work you keep sliding past."
  },
  {
    "id":"overwhelm_response",
    "type":"textarea",
    "prompt":"When pressure piles up, what do you actually do by default? For example: shut down, overwork, get controlling, go quiet, numb out, or something else. No judgment; name the real behavior.",
    "required":false,
    "placeholder":"Your actual default under pressure."
  },
  {
    "id":"accountability_style",
    "type":"select",
    "prompt":"What style of accountability helps you listen and act?",
    "required":false,
    "options":[
      "Direct challenge - Tell me the hard truth",
      "Gentle nudge - Lead with encouragement",
      "Questions to discover - Help me figure it out myself"
    ]
  },
  {
    "id":"feedback_preference",
    "type":"select",
    "prompt":"When feedback genuinely helps you change, how should it begin?",
    "required":false,
    "options":[
      "Blunt truth first - Don't sugarcoat it",
      "Encouragement then truth - Acknowledge before challenging",
      "Questions that let me discover it - Socratic approach"
    ]
  },
  {
    "id":"spiritual_beliefs",
    "type":"textarea",
    "prompt":"If faith or a spiritual tradition shapes how you live, what should your coach understand about it? This is optional; you can skip it.",
    "required":false,
    "placeholder":"Your faith or spiritual context, in your own words."
  },
  {
    "id":"background_notes",
    "type":"textarea",
    "prompt":"If your Flow coach could know one more thing that would save you both the most time, what should it know? It might be about family, health, this season, or how to speak to you when you drift.",
    "required":false,
    "placeholder":"The context that makes the rest of your answers make sense."
  }
]$questions$::jsonb,
updated_at = now()
WHERE slug = 'profile-builder';

UPDATE public.flow_templates
SET questions_json = $questions$[
  {"id":"preferred_name","type":"text","prompt":"Before we revisit the whole picture, what should I call you now? If that has not changed, say same as before.","required":true,"placeholder":"Your current first name or nickname."},
  {"id":"life_roles","type":"textarea","prompt":"Let's revisit the roles you carry. Examples include spouse, parent, business owner, employee, coach, student, caregiver, leader, creative, or athlete, plus any others true for you. What is true now, what changed in weight, and which role is getting the least of you? You can say same as before.","required":false,"placeholder":"Give the current picture, name what changed, or say same as before."},
  {"id":"core_values","type":"textarea","prompt":"Which five values govern your decisions now? Examples include Faith, Family, Growth, Impact, Freedom, Health, Wealth, Adventure, Connection, Excellence, Integrity, and Service, but use your own words too. What moved, and which value wins when two collide? You can say same as before.","required":false,"placeholder":"Give the current top five and what changed, or say same as before."},
  {"id":"current_goals","type":"textarea","prompt":"Looking at your previous goal, did you hit it: yes, no, or partly? Then name the one concrete result for the next 90 days and how you will know it happened. You can say same as before if it truly still fits.","required":false,"placeholder":"First the honest scorecard, then the next measurable result."},
  {"id":"current_challenges","type":"textarea","prompt":"Did the recurring pattern from your current profile show up this cycle? Is it broken, weaker, wearing a new disguise, or the same? Name the loop as it is today, or say same as before.","required":false,"placeholder":"The pattern now, not merely the pattern then."},
  {"id":"peak_state","type":"textarea","prompt":"Did the routine, environment, relationships, or choices behind your best days change this cycle? Describe what your best looks like now, or say same as before.","required":false,"placeholder":"The observable conditions behind your best days now."},
  {"id":"growth_edge","type":"textarea","prompt":"Is the old growth edge still the edge, or did a deeper one show up underneath it? Name the current edge, or say same as before.","required":false,"placeholder":"The work you are avoiding now."},
  {"id":"overwhelm_response","type":"textarea","prompt":"Under pressure this cycle, did your default shift? For example: shutting down, overworking, getting controlling, going quiet, or numbing out. Describe the real behavior now, or say same as before.","required":false,"placeholder":"Your default under pressure now."},
  {"id":"accountability_style","type":"select","prompt":"What accountability style works for you now?","required":false,"options":["Keep my current setting","Direct challenge - Tell me the hard truth","Gentle nudge - Lead with encouragement","Questions to discover - Help me figure it out myself"]},
  {"id":"feedback_preference","type":"select","prompt":"How do you want feedback now?","required":false,"options":["Keep my current setting","Blunt truth first - Don't sugarcoat it","Encouragement then truth - Acknowledge before challenging","Questions that let me discover it - Socratic approach"]},
  {"id":"spiritual_beliefs","type":"textarea","prompt":"If faith or a spiritual tradition shapes how you live, what should your coach understand now? You can say same as before or skip this question.","required":false,"placeholder":"What is true now, same as before, or skip."},
  {"id":"background_notes","type":"textarea","prompt":"What changed in your family, health, responsibilities, or season that your Flow coach should understand for the next 90 days? You can say same as before.","required":false,"placeholder":"The new context, or same as before."}
]$questions$::jsonb,
updated_at = now()
WHERE slug = 'profile-reprofile';

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
      'life_roles_context', 'core_values_context', 'current_goals',
      'current_challenges', 'peak_state', 'growth_edge',
      'overwhelm_response', 'spiritual_beliefs', 'background_notes'
    )
      AND length(entry.value) > 6000
  ) THEN
    RAISE EXCEPTION 'Profile response is too long' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.flow_profiles (
    user_id, preferred_name, life_roles, life_roles_context,
    core_values, core_values_context, current_goals, current_challenges,
    peak_state, growth_edge, overwhelm_response, accountability_style,
    feedback_preference, spiritual_beliefs, background_notes,
    guided_interview_confirmed_at, guided_interview_session_id,
    guided_interview_version, updated_at
  ) VALUES (
    v_actor_id, v_preferred_name, v_roles,
    nullif(btrim(p_profile->>'life_roles_context'), ''),
    v_values, nullif(btrim(p_profile->>'core_values_context'), ''),
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
    life_roles_context = EXCLUDED.life_roles_context,
    core_values = EXCLUDED.core_values,
    core_values_context = EXCLUDED.core_values_context,
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
