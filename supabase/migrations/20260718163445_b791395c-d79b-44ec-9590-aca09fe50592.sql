-- enable_flow_coach_for_prayer_and_bible
UPDATE public.flow_templates
SET coach_enabled = true,
    coach_intensity = 'standard'
WHERE slug IN ('prayer', 'bible')
  AND (
    coach_enabled IS DISTINCT FROM true
    OR coach_intensity IS DISTINCT FROM 'standard'
  );