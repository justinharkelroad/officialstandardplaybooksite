-- Complete the Flowing rollout across every active member Flow. Each Flow gets
-- its own coaching charter and question-level lens; this is not a blanket
-- toggle of the Prayer/Bible behavior.

-- Keep title capture separate from the first substantive question. The prior
-- prompts caused members to answer the topic in the title field and then see
-- essentially the same question again.
UPDATE public.flow_templates
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  to_jsonb('Welcome to your Gratitude Flow. Take a breath. Give this gratitude a short title.'::text),
  false
)
WHERE slug = 'grateful';

UPDATE public.flow_templates
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  to_jsonb('Welcome to your Idea Flow. Take a breath. Give this idea a short title.'::text),
  false
)
WHERE slug = 'idea';

UPDATE public.flow_templates
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  to_jsonb('Welcome to your War Flow. Take a breath. Give this war a short title.'::text),
  false
)
WHERE slug = 'war';

UPDATE public.flow_templates
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  to_jsonb('Welcome to your Irritation Flow. Take a breath. Give this irritation a short title.'::text),
  false
)
WHERE slug = 'irritation';

UPDATE public.flow_templates
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  to_jsonb('Welcome to your Discovery Flow. Take a breath. Give this discovery a short title.'::text),
  false
)
WHERE slug = 'discovery';

UPDATE public.flow_templates
SET
  coach_enabled = true,
  coach_depth_enabled = true,
  coach_max_probes = 2,
  coach_intensity = 'standard',
  coach_prompt = $daily_frame_coach$
You are Flowing inside a Daily Frame. Help the member turn their present state and priorities into one owned, measurable commitment for today.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between capacity and avoidance, priority and urgency, outcome and activity, intention and evidence, or commitment and the obstacle most likely to break it.
Respect the member's actual energy and constraints. Do not shame rest, reward productivity theater, manufacture urgency, or turn every gratitude answer into a performance problem.
Challenge with transcript-grounded observations and clearly marked hypotheses. A probe must earn the interruption by clarifying the real priority, obstacle, tradeoff, or execution decision. Do not repeat a later fixed question and do not probe a simple title, category, or selector response.
$daily_frame_coach$,
  coach_question_notes = jsonb_build_object(
    'current_state', jsonb_build_object('themes', jsonb_build_array('capacity', 'emotion', 'honest starting point')),
    'gratitude_body', jsonb_build_object('themes', jsonb_build_array('body', 'capacity', 'care')),
    'gratitude_being', jsonb_build_object('themes', jsonb_build_array('identity', 'presence', 'values')),
    'gratitude_balance', jsonb_build_object('themes', jsonb_build_array('relationship', 'connection', 'support')),
    'gratitude_business', jsonb_build_object('themes', jsonb_build_array('work', 'opportunity', 'stewardship')),
    'target_outcome', jsonb_build_object('themes', jsonb_build_array('priority', 'outcome', 'tradeoff')),
    'measurable_proof', jsonb_build_object('themes', jsonb_build_array('evidence', 'measurement', 'definition of done')),
    'likely_obstacle', jsonb_build_object('themes', jsonb_build_array('friction', 'pattern', 'constraint')),
    'if_then_plan', jsonb_build_object('themes', jsonb_build_array('contingency', 'agency', 'execution')),
    'declared_commitment', jsonb_build_object('themes', jsonb_build_array('commitment', 'ownership', 'today'))
  )
WHERE slug = 'daily-frame';

UPDATE public.flow_templates
SET
  coach_enabled = true,
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'standard',
  coach_prompt = $grateful_coach$
You are Flowing inside a Gratitude Flow. Help the member move from naming what is good to understanding why it matters, how it changes them, and how gratitude can become an embodied response.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between receiving and controlling, appreciation and action, abundance and fear of loss, stated gratitude and relational behavior, or gratitude and the story it is rewriting.
Keep gratitude honest. Do not force positivity, manufacture pain, minimize grief, flatter the member, or turn gratitude into moral performance. Mixed emotions are allowed.
Challenge with transcript-grounded observations and clearly marked hypotheses. A probe must earn the interruption by uncovering meaning, a contradiction, a relationship truth, or an action the fixed Flow would otherwise miss. Do not repeat a later fixed question.
$grateful_coach$,
  coach_question_notes = jsonb_build_object(
    'trigger', jsonb_build_object('themes', jsonb_build_array('object of gratitude', 'specificity', 'relationship')),
    'why_grateful', jsonb_build_object('themes', jsonb_build_array('meaning', 'impact', 'why now')),
    'story', jsonb_build_object('themes', jsonb_build_array('story', 'identity', 'receiving')),
    'feelings', jsonb_build_object('themes', jsonb_build_array('emotion', 'embodied response')),
    'thoughts_actions', jsonb_build_object('themes', jsonb_build_array('behavior', 'expression', 'alignment')),
    'facts', jsonb_build_object('themes', jsonb_build_array('evidence', 'reality', 'specificity')),
    'want_for_you', jsonb_build_object('themes', jsonb_build_array('desire', 'growth', 'receiving')),
    'want_for_trigger', jsonb_build_object('themes', jsonb_build_array('care', 'relationship', 'generosity')),
    'want_for_both', jsonb_build_object('themes', jsonb_build_array('mutual good', 'connection', 'future')),
    'why_positive', jsonb_build_object('themes', jsonb_build_array('meaning', 'reframe', 'integration')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'pattern')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'meaning')),
    'actions', jsonb_build_object('themes', jsonb_build_array('expression', 'commitment', 'next 24 hours'))
  )
WHERE slug = 'grateful';

UPDATE public.flow_templates
SET
  coach_enabled = true,
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'hard',
  coach_prompt = $idea_coach$
You are Flowing inside an Idea Flow. Help the member turn excitement into disciplined clarity, tested assumptions, and a concrete next move without draining the idea of possibility.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between possibility and proof, novelty and commitment, ambition and capacity, identity and validation, upside and cost, or strategy and the next executable decision.
Do not flatter the idea, confuse enthusiasm with evidence, invent market facts, or push scale before the member has named the real problem and commitment.
Challenge with transcript-grounded observations and clearly marked hypotheses. A probe must earn the interruption by exposing an assumption, tradeoff, cost, test, or decision that could materially change the idea. Do not repeat a later fixed question.
$idea_coach$,
  coach_question_notes = jsonb_build_object(
    'trigger', jsonb_build_object('themes', jsonb_build_array('idea', 'problem', 'opportunity')),
    'idea_activated', jsonb_build_object('themes', jsonb_build_array('origin', 'why now', 'signal')),
    'story', jsonb_build_object('themes', jsonb_build_array('identity story', 'ambition', 'validation')),
    'feelings', jsonb_build_object('themes', jsonb_build_array('emotion', 'energy', 'fear')),
    'thoughts_actions', jsonb_build_object('themes', jsonb_build_array('behavior', 'momentum', 'avoidance')),
    'positive_benefits', jsonb_build_object('themes', jsonb_build_array('upside', 'beneficiary', 'value')),
    'negative_effects', jsonb_build_object('themes', jsonb_build_array('cost', 'tradeoff', 'risk')),
    'fact_1', jsonb_build_object('themes', jsonb_build_array('assumption', 'evidence', 'truth')),
    'fact_1_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'evidence', 'causality')),
    'fact_1_title', jsonb_build_object('themes', jsonb_build_array('principle', 'clarity', 'decision')),
    'fact_2', jsonb_build_object('themes', jsonb_build_array('assumption', 'evidence', 'truth')),
    'fact_2_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'evidence', 'causality')),
    'fact_2_title', jsonb_build_object('themes', jsonb_build_array('principle', 'clarity', 'decision')),
    'fact_3', jsonb_build_object('themes', jsonb_build_array('assumption', 'evidence', 'truth')),
    'fact_3_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'evidence', 'causality')),
    'fact_3_title', jsonb_build_object('themes', jsonb_build_array('principle', 'clarity', 'decision')),
    'fact_4', jsonb_build_object('themes', jsonb_build_array('assumption', 'evidence', 'truth')),
    'fact_4_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'evidence', 'causality')),
    'fact_4_title', jsonb_build_object('themes', jsonb_build_array('principle', 'clarity', 'decision')),
    'why_positive', jsonb_build_object('themes', jsonb_build_array('meaning', 'opportunity', 'integration')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'pattern')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'decision')),
    'actions', jsonb_build_object('themes', jsonb_build_array('test', 'commitment', 'next 24 hours'))
  )
WHERE slug = 'idea';

UPDATE public.flow_templates
SET
  coach_enabled = true,
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'hard',
  coach_prompt = $war_coach$
You are Flowing inside a War Flow. Help the member convert a meaningful challenge into a reality-based plan, responsible resolve, and measurable action without glorifying aggression.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between courage and reactivity, what is controllable and what is not, a worthy fight and ego protection, a target and its measurement, resolve and needed support, or urgency and judgment.
Use the Flow's war metaphor without escalating hostility or harm. Do not dehumanize an opponent, endorse retaliation, invent certainty, or treat domination as success. If the member signals intent to harm themselves or another person, prioritize immediate safety rather than strategic coaching.
Challenge with transcript-grounded observations and clearly marked hypotheses. A probe must earn the interruption by changing the target, plan, obstacle, support, or next decision. Do not repeat a later fixed question.
$war_coach$,
  coach_question_notes = jsonb_build_object(
    'trigger', jsonb_build_object('themes', jsonb_build_array('challenge', 'target', 'stakes')),
    'idea_activated', jsonb_build_object('themes', jsonb_build_array('why now', 'trigger', 'urgency')),
    'story', jsonb_build_object('themes', jsonb_build_array('identity story', 'courage', 'ego')),
    'feelings', jsonb_build_object('themes', jsonb_build_array('emotion', 'reactivity', 'resolve')),
    'thoughts_actions', jsonb_build_object('themes', jsonb_build_array('behavior', 'agency', 'pattern')),
    'positive_benefits', jsonb_build_object('themes', jsonb_build_array('worthy outcome', 'beneficiary', 'stakes')),
    'negative_effects', jsonb_build_object('themes', jsonb_build_array('cost', 'collateral', 'tradeoff')),
    'fact_1', jsonb_build_object('themes', jsonb_build_array('objective', 'measurement', 'truth')),
    'fact_1_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'stakes', 'evidence')),
    'fact_1_obstacle', jsonb_build_object('themes', jsonb_build_array('obstacle', 'constraint', 'risk')),
    'fact_1_overcome', jsonb_build_object('themes', jsonb_build_array('plan', 'support', 'agency')),
    'fact_1_title', jsonb_build_object('themes', jsonb_build_array('objective name', 'clarity', 'focus')),
    'fact_2', jsonb_build_object('themes', jsonb_build_array('objective', 'measurement', 'truth')),
    'fact_2_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'stakes', 'evidence')),
    'fact_2_obstacle', jsonb_build_object('themes', jsonb_build_array('obstacle', 'constraint', 'risk')),
    'fact_2_overcome', jsonb_build_object('themes', jsonb_build_array('plan', 'support', 'agency')),
    'fact_2_title', jsonb_build_object('themes', jsonb_build_array('objective name', 'clarity', 'focus')),
    'fact_3', jsonb_build_object('themes', jsonb_build_array('objective', 'measurement', 'truth')),
    'fact_3_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'stakes', 'evidence')),
    'fact_3_obstacle', jsonb_build_object('themes', jsonb_build_array('obstacle', 'constraint', 'risk')),
    'fact_3_overcome', jsonb_build_object('themes', jsonb_build_array('plan', 'support', 'agency')),
    'fact_3_title', jsonb_build_object('themes', jsonb_build_array('objective name', 'clarity', 'focus')),
    'fact_4', jsonb_build_object('themes', jsonb_build_array('objective', 'measurement', 'truth')),
    'fact_4_why', jsonb_build_object('themes', jsonb_build_array('reasoning', 'stakes', 'evidence')),
    'fact_4_obstacle', jsonb_build_object('themes', jsonb_build_array('obstacle', 'constraint', 'risk')),
    'fact_4_overcome', jsonb_build_object('themes', jsonb_build_array('plan', 'support', 'agency')),
    'fact_4_title', jsonb_build_object('themes', jsonb_build_array('objective name', 'clarity', 'focus')),
    'why_positive', jsonb_build_object('themes', jsonb_build_array('meaning', 'responsibility', 'integration')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'pattern')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'decision')),
    'actions', jsonb_build_object('themes', jsonb_build_array('commitment', 'measurement', 'next 24 hours'))
  )
WHERE slug = 'war';

UPDATE public.flow_templates
SET
  coach_enabled = true,
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'hard',
  coach_prompt = $irritation_coach$
You are Flowing inside an Irritation Flow. Help the member separate the triggering event from interpretation, emotion, evidence, cost, desired outcome, responsible boundary, and their own next action.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between what happened and the story assigned to it, a valid feeling and an unverified conclusion, control and responsibility, judgment and need, avoidance and boundary, or release and unresolved action.
Validate emotion without automatically validating the member's explanation of another person's motives. Do not diagnose, inflame resentment, encourage retaliation, force forgiveness, or manufacture equal blame. If the situation includes abuse, coercion, or credible danger, prioritize safety and support rather than pressuring the member to reframe it positively.
Challenge mind-reading, absolutes, and contradictions with transcript-grounded observations and clearly marked hypotheses. A probe must earn the interruption by exposing the exact event, assumption, need, boundary, cost, or member-owned responsibility the fixed Flow would otherwise miss. Do not repeat a later fixed question.
$irritation_coach$,
  coach_question_notes = jsonb_build_object(
    'trigger', jsonb_build_object('themes', jsonb_build_array('person or event', 'specific behavior', 'trigger')),
    'why_irritated', jsonb_build_object('themes', jsonb_build_array('meaning', 'need', 'why now')),
    'story', jsonb_build_object('themes', jsonb_build_array('interpretation', 'mind-reading', 'identity story')),
    'feelings', jsonb_build_object('themes', jsonb_build_array('emotion', 'embodied truth', 'intensity')),
    'thoughts_actions', jsonb_build_object('themes', jsonb_build_array('reaction', 'behavior', 'cost')),
    'evidence_true', jsonb_build_object('themes', jsonb_build_array('evidence', 'assumption', 'certainty')),
    'facts', jsonb_build_object('themes', jsonb_build_array('observable facts', 'specificity', 'reality')),
    'ignore_consequence', jsonb_build_object('themes', jsonb_build_array('cost', 'boundary', 'stakes')),
    'want_for_you', jsonb_build_object('themes', jsonb_build_array('need', 'agency', 'desired outcome')),
    'want_for_trigger', jsonb_build_object('themes', jsonb_build_array('relationship', 'accountability', 'desired outcome')),
    'want_for_both', jsonb_build_object('themes', jsonb_build_array('mutual good', 'boundary', 'repair')),
    'story_check', jsonb_build_object('themes', jsonb_build_array('accuracy', 'responsibility', 'reframe')),
    'ready_to_let_go', jsonb_build_object('themes', jsonb_build_array('release', 'unfinished action', 'willingness')),
    'desired_story', jsonb_build_object('themes', jsonb_build_array('new story', 'agency', 'truth')),
    'desired_evidence', jsonb_build_object('themes', jsonb_build_array('evidence', 'behavior', 'boundary')),
    'desired_story_check', jsonb_build_object('themes', jsonb_build_array('credibility', 'alignment', 'choice')),
    'why_positive', jsonb_build_object('themes', jsonb_build_array('meaning', 'growth', 'integration')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'pattern')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'responsibility')),
    'feelings_now', jsonb_build_object('themes', jsonb_build_array('emotional shift', 'remaining charge', 'truth')),
    'actions', jsonb_build_object('themes', jsonb_build_array('boundary', 'repair', 'next 24 hours'))
  )
WHERE slug = 'irritation';

UPDATE public.flow_templates
SET
  coach_enabled = true,
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'standard',
  coach_prompt = $discovery_coach$
You are Flowing inside a Discovery Flow. Help the member turn an observation into integrated understanding and a concrete change in how they see, decide, or act.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between observation and interpretation, novelty and truth, awareness and behavior, insight and application, stated learning and an old pattern, or inspiration and the friction of implementation.
Do not overstate the insight, flatter the member for noticing it, invent evidence, or treat awareness alone as transformation.
Challenge with transcript-grounded observations and clearly marked hypotheses. A probe must earn the interruption by exposing why the discovery matters, what belief it changes, where it applies, or what could prevent embodiment. Do not repeat a later fixed question.
$discovery_coach$,
  coach_question_notes = jsonb_build_object(
    'trigger', jsonb_build_object('themes', jsonb_build_array('observation', 'discovery', 'specificity')),
    'discovery_activated', jsonb_build_object('themes', jsonb_build_array('origin', 'why now', 'signal')),
    'story', jsonb_build_object('themes', jsonb_build_array('old story', 'new meaning', 'identity')),
    'feelings', jsonb_build_object('themes', jsonb_build_array('emotion', 'embodied response', 'surprise')),
    'thoughts_actions', jsonb_build_object('themes', jsonb_build_array('behavior', 'pattern', 'alignment')),
    'why_positive', jsonb_build_object('themes', jsonb_build_array('meaning', 'possibility', 'integration')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'transfer')),
    'apply_category', jsonb_build_object('themes', jsonb_build_array('context', 'domain', 'application')),
    'apply_lesson', jsonb_build_object('themes', jsonb_build_array('application', 'friction', 'behavior')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'changed belief')),
    'actions', jsonb_build_object('themes', jsonb_build_array('commitment', 'experiment', 'next 24 hours'))
  )
WHERE slug = 'discovery';

-- Fail loudly if a future seed or renamed template makes this rollout partial.
DO $$
DECLARE
  configured_count integer;
BEGIN
  SELECT count(*)
  INTO configured_count
  FROM public.flow_templates
  WHERE slug IN (
    'daily-frame',
    'grateful',
    'idea',
    'war',
    'irritation',
    'discovery',
    'prayer',
    'bible'
  )
    AND is_active = true
    AND coach_enabled = true
    AND coach_depth_enabled = true
    AND coach_max_probes > 0
    AND nullif(btrim(coach_prompt), '') IS NOT NULL;

  IF configured_count <> 8 THEN
    RAISE EXCEPTION
      'Adaptive Flowing rollout incomplete: expected 8 configured active templates, found %',
      configured_count;
  END IF;
END
$$;