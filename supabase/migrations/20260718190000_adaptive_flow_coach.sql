-- Adaptive Flowing depth: one persisted coach probe may temporarily pause the
-- deterministic Flow spine. The official next question remains stored on the
-- session, but clients must not present it until the probe is resolved.

ALTER TABLE public.flow_coach_messages
  ADD COLUMN probe text,
  ADD COLUMN probe_answer text,
  ADD COLUMN resolution text,
  ADD COLUMN working_thesis jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN probe_answered_at timestamptz;

ALTER TABLE public.flow_templates
  ADD COLUMN coach_depth_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN coach_max_probes smallint NOT NULL DEFAULT 0
    CHECK (coach_max_probes BETWEEN 0 AND 5);

CREATE INDEX flow_coach_messages_pending_probe_idx
  ON public.flow_coach_messages (flow_session_id, created_at DESC)
  WHERE probe IS NOT NULL AND probe_answer IS NULL;

UPDATE public.flow_templates
SET
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'hard',
  coach_prompt = $coach$
You are Flowing inside a Prayer Flow. Help the member move from description to honest prayer, surrender, relational responsibility, and one embodied action.
Track the developing arc across the entire current Flow. Look especially for consequential tensions between intent and impact, control and surrender, speed and presence, stated values and practiced behavior, protection and fear, or the story named by the member and the emotion beneath it.
Use the member's spiritual language without claiming to speak for God. Never tell the member what God is saying, doing, promising, or requiring as a fact. Never confuse intensity with certainty.
Challenge with transcript-grounded observations and clearly marked hypotheses: “I notice…”, “There may be…”, or “I wonder whether…”. Do not diagnose, shame, flatter, sermonize, or assign hidden motives.
A probe must earn the interruption: it should investigate the one tension most likely to change the prayer, not merely request elaboration. Prefer depth over breadth and do not repeat a question the fixed Flow will ask later.
$coach$,
  coach_question_notes = jsonb_build_object(
    'trigger', jsonb_build_object('themes', jsonb_build_array('present concern', 'relationship', 'control', 'surrender')),
    'why_pray', jsonb_build_object('themes', jsonb_build_array('emotional charge', 'intent and impact', 'why now')),
    'story', jsonb_build_object('themes', jsonb_build_array('identity story', 'fear', 'control', 'meaning')),
    'feelings', jsonb_build_object('themes', jsonb_build_array('emotion', 'embodied truth')),
    'god_know_1', jsonb_build_object('themes', jsonb_build_array('honesty', 'desire', 'confession')),
    'god_know_2', jsonb_build_object('themes', jsonb_build_array('honesty', 'fear', 'need')),
    'god_know_3', jsonb_build_object('themes', jsonb_build_array('gratitude', 'relationship', 'surrender')),
    'god_know_4', jsonb_build_object('themes', jsonb_build_array('core truth', 'willingness')),
    'dear_god', jsonb_build_object('themes', jsonb_build_array('prayer', 'intent and impact', 'surrender')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'pattern')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'meaning')),
    'actions', jsonb_build_object('themes', jsonb_build_array('commitment', 'measurement', 'relationship'))
  )
WHERE slug = 'prayer';

UPDATE public.flow_templates
SET
  coach_depth_enabled = true,
  coach_max_probes = 3,
  coach_intensity = 'hard',
  coach_prompt = $coach$
You are Flowing inside a Bible Flow. Help the member move from what the passage says, to what they see in their actual life, to the story or behavior being confronted, and finally to a measurable act of obedience or alignment.
Ground every observation in the member's selected passage, current answers, or authorized memory. Do not invent theology, quote unprovided Scripture, or claim divine certainty. Use “this passage may be confronting…” rather than “God is telling you…”.
Track the developing arc across the entire current Flow. Look for consequential tensions between information and formation, stated belief and practiced behavior, control and trust, speed and stillness, protection and release, or insight and execution.
Challenge with transcript-grounded observations and clearly marked hypotheses. Do not diagnose, shame, flatter, sermonize, or assign hidden motives.
A probe must earn the interruption: it should expose the belief, contradiction, cost, or measurable choice the fixed Flow would otherwise miss. Prefer depth over breadth and do not repeat a later fixed question.
$coach$,
  coach_question_notes = jsonb_build_object(
    'scripture', jsonb_build_object('themes', jsonb_build_array('scripture', 'attention')),
    'what_you_see', jsonb_build_object('themes', jsonb_build_array('observation', 'personal meaning')),
    'start_doing', jsonb_build_object('themes', jsonb_build_array('new behavior', 'formation')),
    'start_what', jsonb_build_object('themes', jsonb_build_array('commitment', 'formation')),
    'start_measure', jsonb_build_object('themes', jsonb_build_array('measurement', 'execution')),
    'start_story', jsonb_build_object('themes', jsonb_build_array('identity story', 'belief')),
    'stop_doing', jsonb_build_object('themes', jsonb_build_array('old pattern', 'cost', 'surrender')),
    'stop_what', jsonb_build_object('themes', jsonb_build_array('old pattern', 'choice')),
    'stop_measure', jsonb_build_object('themes', jsonb_build_array('measurement', 'execution')),
    'stop_story', jsonb_build_object('themes', jsonb_build_array('identity story', 'belief')),
    'sustain_doing', jsonb_build_object('themes', jsonb_build_array('existing practice', 'consistency')),
    'sustain_what', jsonb_build_object('themes', jsonb_build_array('existing practice', 'commitment')),
    'sustain_measure', jsonb_build_object('themes', jsonb_build_array('measurement', 'consistency')),
    'sustain_story', jsonb_build_object('themes', jsonb_build_array('identity story', 'belief')),
    'lesson', jsonb_build_object('themes', jsonb_build_array('life lesson', 'pattern')),
    'revelation', jsonb_build_object('themes', jsonb_build_array('breakthrough', 'meaning')),
    'actions', jsonb_build_object('themes', jsonb_build_array('commitment', 'measurement'))
  )
WHERE slug = 'bible';
