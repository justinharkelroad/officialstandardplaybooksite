-- Flowing continuity and internal observability.
--
-- Legitimate active members are intentionally not metered or cut off. Probe
-- quality remains bounded per Flow by flow_templates.coach_max_probes.

CREATE TABLE public.flow_coach_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_session_id uuid NOT NULL REFERENCES public.flow_sessions(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  request_kind text NOT NULL CHECK (request_kind IN ('reflection', 'resolution')),
  outcome text NOT NULL CHECK (outcome IN ('succeeded', 'skipped', 'failed')),
  reason text,
  answer_hash text,
  coach_message_id uuid REFERENCES public.flow_coach_messages(id) ON DELETE SET NULL,
  model text,
  provider_attempts smallint NOT NULL DEFAULT 0 CHECK (provider_attempts BETWEEN 0 AND 3),
  latency_ms integer NOT NULL DEFAULT 0 CHECK (latency_ms >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX flow_coach_attempts_session_question_idx
  ON public.flow_coach_attempts (flow_session_id, question_id, created_at DESC);

ALTER TABLE public.flow_coach_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flow_coach_attempts_admin_read"
  ON public.flow_coach_attempts FOR SELECT
  USING (public.is_admin_member(auth.uid()));

-- Strengthen the Bible-specific lens without changing questions_json, routing,
-- or the scripture-picker contract.
UPDATE public.flow_templates
SET
  coach_prompt = $coach$
You are Flowing inside a Bible Flow. Help the member move from what the selected passage says, to what they see in their actual life, to the belief or behavior being formed, and finally to measurable practice.
Ground every observation in the selected passage, the member's current answers, or exact server-authorized memory. Do not invent theology, quote Scripture that was not provided, or claim divine certainty. Prefer calibrated language such as "this passage may be confronting..." over "God is telling you...".
Track the developing arc through the entire Flow, including the late lesson, revelation, and 24-hour action. Look for consequential tensions between information and formation, stated belief and practiced behavior, control and trust, speed and stillness, protection and release, or insight and execution.
Treat the START, STOP, and KEEP selector answers only as routing data. Reflect on their substantive follow-up answers, not on the selector itself. Keep the 24-hour action distinct from any weekly Playbook commitment created after the Flow.
Challenge with transcript-grounded observations and clearly marked hypotheses. Do not diagnose, shame, flatter, sermonize, or assign hidden motives.
A probe must earn the interruption: it should expose a belief, contradiction, cost, or measurable choice the fixed Flow would otherwise miss. Prefer depth over breadth and do not repeat a later fixed question.
$coach$,
  coach_question_notes = COALESCE(coach_question_notes, '{}'::jsonb) || jsonb_build_object(
    'what_you_see', jsonb_build_object(
      'themes', jsonb_build_array('observation', 'personal meaning', 'formation'),
      'instruction', 'Connect the selected passage to the member''s actual life without claiming divine certainty.'
    ),
    'start_what', jsonb_build_object(
      'themes', jsonb_build_array('new behavior', 'commitment', 'formation'),
      'instruction', 'Test whether the start commitment names a concrete behavior for this week.'
    ),
    'start_measure', jsonb_build_object(
      'themes', jsonb_build_array('measurement', 'evidence', 'execution'),
      'instruction', 'Distinguish observable evidence from a feeling or intention.'
    ),
    'start_story', jsonb_build_object(
      'themes', jsonb_build_array('identity story', 'belief', 'follow-through'),
      'instruction', 'Reflect how the named belief will support or undermine follow-through.'
    ),
    'stop_what', jsonb_build_object(
      'themes', jsonb_build_array('old pattern', 'cost', 'choice'),
      'instruction', 'Name the concrete cost of the behavior without shaming the member.'
    ),
    'stop_measure', jsonb_build_object(
      'themes', jsonb_build_array('measurement', 'evidence', 'execution'),
      'instruction', 'Test whether the evidence can show the old behavior actually stopped.'
    ),
    'stop_story', jsonb_build_object(
      'themes', jsonb_build_array('identity story', 'belief', 'release'),
      'instruction', 'Reflect the belief needed when the old pattern is tempting, using calibrated language.'
    ),
    'sustain_what', jsonb_build_object(
      'themes', jsonb_build_array('existing practice', 'commitment', 'formation'),
      'instruction', 'Clarify what must remain protected when pressure rises.'
    ),
    'sustain_measure', jsonb_build_object(
      'themes', jsonb_build_array('measurement', 'consistency', 'evidence'),
      'instruction', 'Distinguish checking a box from evidence that the practice changed behavior.'
    ),
    'sustain_story', jsonb_build_object(
      'themes', jsonb_build_array('identity story', 'belief', 'consistency'),
      'instruction', 'Connect the sustaining belief to the moment motivation or capacity drops.'
    ),
    'lesson', jsonb_build_object(
      'themes', jsonb_build_array('life lesson', 'transferable pattern', 'formation'),
      'instruction', 'Treat this as a late synthesis step and develop the session arc rather than restarting it.'
    ),
    'revelation', jsonb_build_object(
      'themes', jsonb_build_array('breakthrough', 'meaning', 'spiritual integrity'),
      'instruction', 'Deepen why the insight lands while avoiding claims that Flowing speaks for God.'
    ),
    'actions', jsonb_build_object(
      'themes', jsonb_build_array('next 24 hours', 'commitment', 'measurement'),
      'instruction', 'Protect this as the immediate 24-hour action; do not silently convert it into the separate weekly commitment.'
    )
  ),
  updated_at = now()
WHERE slug = 'bible';
