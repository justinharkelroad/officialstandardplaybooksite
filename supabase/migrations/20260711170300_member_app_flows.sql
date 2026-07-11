-- ============================================================
-- Flows — profiles, templates, sessions, challenge logs
-- Ported from the source platform 20251208201553 (+ 20251221202440 profile columns,
-- 20260518100000 session columns, 20260403101500 one-in-progress index).
-- DISCOVERY logged in handoff report: flow_sessions requires this 4-table
-- family; handoff §4 listed only flow_sessions.
-- Rework: member-active gate on every user policy; templates admin-managed.
-- Template seed data is appended below this DDL by replaying the source
-- template INSERT/UPDATE migrations verbatim (flow_templates-only changes).
-- ============================================================

CREATE TABLE public.flow_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  preferred_name text,
  life_roles text[],
  core_values text[],
  current_goals text,
  current_challenges text,
  spiritual_beliefs text,
  faith_tradition text,
  background_notes text,
  accountability_style text,
  feedback_preference text,
  peak_state text,
  growth_edge text,
  overwhelm_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.flow_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text,
  questions_json jsonb NOT NULL DEFAULT '[]',
  ai_challenge_enabled boolean DEFAULT true,
  ai_challenge_intensity text DEFAULT 'gentle',
  ai_analysis_prompt text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.flow_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_template_id uuid NOT NULL REFERENCES public.flow_templates(id),
  title text,
  domain text,
  responses_json jsonb NOT NULL DEFAULT '{}',
  ai_analysis_json jsonb,
  status text DEFAULT 'in_progress',
  completed_at timestamptz,
  pdf_url text,
  session_token uuid NOT NULL DEFAULT gen_random_uuid(),
  current_question_id text,
  agent_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.flow_challenge_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.flow_sessions(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  original_response text,
  ai_challenge text,
  user_action text,
  revised_response text,
  created_at timestamptz DEFAULT now()
);

-- Deferred FK from playbook migration (flow_sessions did not exist yet there)
ALTER TABLE public.focus_items
  ADD CONSTRAINT focus_items_source_session_id_fkey
  FOREIGN KEY (source_session_id) REFERENCES public.flow_sessions(id) ON DELETE SET NULL;

CREATE INDEX idx_flow_profiles_user ON public.flow_profiles(user_id);
CREATE INDEX idx_flow_sessions_user ON public.flow_sessions(user_id);
CREATE INDEX idx_flow_sessions_template ON public.flow_sessions(flow_template_id);
CREATE INDEX idx_flow_sessions_status ON public.flow_sessions(status);
CREATE INDEX idx_flow_sessions_created ON public.flow_sessions(created_at DESC);
CREATE INDEX idx_flow_sessions_session_token ON public.flow_sessions(session_token);

-- Only one in-progress draft per user/template (source 20260403101500)
CREATE UNIQUE INDEX flow_sessions_one_in_progress_per_template
  ON public.flow_sessions (user_id, flow_template_id)
  WHERE status = 'in_progress';

ALTER TABLE public.flow_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_challenge_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flow_profiles_all_own"
  ON public.flow_profiles FOR ALL
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "flow_templates_select_active_members"
  ON public.flow_templates FOR SELECT
  USING (public.is_active_member(auth.uid()) AND is_active = true);

CREATE POLICY "flow_templates_admin_manage"
  ON public.flow_templates FOR ALL
  USING (public.is_admin_member(auth.uid()))
  WITH CHECK (public.is_admin_member(auth.uid()));

CREATE POLICY "flow_sessions_all_own"
  ON public.flow_sessions FOR ALL
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "flow_challenge_logs_all_own"
  ON public.flow_challenge_logs FOR ALL
  USING (
    public.is_active_member(auth.uid())
    AND session_id IN (SELECT id FROM public.flow_sessions WHERE user_id = auth.uid())
  );

CREATE TRIGGER update_flow_profiles_updated_at
  BEFORE UPDATE ON public.flow_profiles
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

CREATE TRIGGER update_flow_sessions_updated_at
  BEFORE UPDATE ON public.flow_sessions
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

-- ============================================================
-- TEMPLATE SEED DATA (replayed from source migrations, appended below)
-- ============================================================

-- Seed: Grateful (source 20251208201553)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, display_order)
VALUES (
  'Grateful',
  'grateful',
  'Transform moments of gratitude into deeper insights and actionable growth.',
  '🙏',
  '#22c55e',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this Gratitude Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "What domain of CORE 4 are you Stacking?",
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "required": true
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who/What are you stacking?",
      "required": true,
      "interpolation_key": "trigger",
      "placeholder": "Describe the person, event, or thing you are grateful for..."
    },
    {
      "id": "why_grateful",
      "type": "textarea",
      "prompt": "In this moment, why has {trigger} triggered you to feel grateful?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "Take your time. Speak or type freely about why this makes you grateful..."
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What is the story you are telling yourself, created by this trigger, about {trigger} and the situation?",
      "required": true,
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "Describe the single word feelings that arise for you when you tell yourself that story?",
      "required": true,
      "placeholder": "e.g., Happy, Peaceful, Blessed, Content..."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "Describe the specific thoughts and actions that arise for you when you tell yourself this story?",
      "required": true
    },
    {
      "id": "facts",
      "type": "textarea",
      "prompt": "What are the non-emotional FACTS about the situation with {trigger} that triggered you to feel grateful?",
      "required": true
    },
    {
      "id": "want_for_you",
      "type": "textarea",
      "prompt": "Empowered by your gratitude trigger with {trigger} and the original story \"{story}\" you are telling yourself, what do you truly want for you in and beyond this situation?",
      "required": true
    },
    {
      "id": "want_for_trigger",
      "type": "textarea",
      "prompt": "What do you want for {trigger} in and beyond this situation?",
      "required": true
    },
    {
      "id": "want_for_both",
      "type": "textarea",
      "prompt": "What do you want for {trigger} and YOU in and beyond this situation?",
      "required": true
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Stepping back from what you have created so far, why has this gratitude trigger been extremely positive?",
      "required": true
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "Looking at how positive this gratitude trigger has been, what is the singular lesson on life you are taking from this Stack?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Gratitude Stack with, and why do you feel that way?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate ACTIONS are you committed to taking leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  updated_at = now();

-- Seed (source 20251209134253)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, ai_challenge_intensity, is_active, display_order)
VALUES (
  'Idea',
  'idea',
  'Transform productive ideas into actionable plans with clarity and purpose.',
  '💡',
  '#eab308',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this Idea Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "What domain of CORE 4 are you Stacking?",
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "required": true
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who/What are you stacking?",
      "required": true,
      "interpolation_key": "trigger",
      "placeholder": "Describe the idea, project, or opportunity..."
    },
    {
      "id": "idea_activated",
      "type": "textarea",
      "prompt": "In this moment, what Idea has {trigger} activated in you?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "Describe the idea that has come to mind..."
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What is the story you are telling yourself about this new idea?",
      "required": true,
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "Describe the single word feelings that arise for you when you tell yourself that story?",
      "required": true,
      "placeholder": "e.g., Excited, Inspired, Driven..."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "Describe the specific thoughts and actions that arise for you when you tell yourself this story?",
      "required": true
    },
    {
      "id": "positive_benefits",
      "type": "textarea",
      "prompt": "If this productive idea is executed on, what are the positive benefits to your world and those you are connected to?",
      "required": true
    },
    {
      "id": "negative_effects",
      "type": "textarea",
      "prompt": "If this productive idea is not executed on, what are the possible negative side effects to your world and those you are connected to?",
      "required": true
    },
    {
      "id": "fact_1",
      "type": "textarea",
      "prompt": "What is the first measurable FACT?",
      "required": true
    },
    {
      "id": "fact_1_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_1_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "fact_2",
      "type": "textarea",
      "prompt": "What is the second measurable FACT?",
      "required": true
    },
    {
      "id": "fact_2_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_2_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "fact_3",
      "type": "textarea",
      "prompt": "What is the third measurable FACT?",
      "required": true
    },
    {
      "id": "fact_3_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_3_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "fact_4",
      "type": "textarea",
      "prompt": "What is the fourth measurable FACT?",
      "required": true
    },
    {
      "id": "fact_4_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_4_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Stepping back from this Idea Stack, why has this productive idea been extremely positive?",
      "required": true
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "Looking at how positive this productive idea has been, what is the singular lesson about life you are taking from this Stack?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Idea Stack with, and why do you feel that way?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate actions are you committed to taking leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  'gentle',
  true,
  2
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();
-- Seed (source 20251209134654)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, ai_challenge_intensity, is_active, display_order)
VALUES (
  'War',
  'war',
  'Attack your goals with precision by identifying obstacles and creating actionable battle plans.',
  '⚔️',
  '#ef4444',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this WAR Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "What domain of the CORE 4 are you Stacking?",
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "required": true
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who/What are you Stacking?",
      "required": true,
      "interpolation_key": "trigger",
      "placeholder": "Describe the goal, target, or challenge you are going to war with..."
    },
    {
      "id": "idea_activated",
      "type": "textarea",
      "prompt": "In this moment, what Idea has {trigger} activated in you?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "What specific vision or target has emerged?"
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What is the story you are telling yourself about this new idea?",
      "required": true,
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "Describe the single word feelings that arise for you when you tell yourself that story?",
      "required": true,
      "placeholder": "e.g., Powerful, Inspired, Determined..."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "Describe the specific thoughts and actions that arise for you when you tell yourself this story?",
      "required": true
    },
    {
      "id": "positive_benefits",
      "type": "textarea",
      "prompt": "If this productive idea is executed on, what are the positive benefits to your world and those you are connected to?",
      "required": true
    },
    {
      "id": "negative_effects",
      "type": "textarea",
      "prompt": "If this productive idea is not executed on, what are the possible negative side effects to your world and those you are connected to?",
      "required": true
    },
    {
      "id": "fact_1",
      "type": "textarea",
      "prompt": "What is the first measurable FACT?",
      "required": true
    },
    {
      "id": "fact_1_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_1_obstacle",
      "type": "textarea",
      "prompt": "What obstacle(s) can you see getting in the way of accomplishing this measurable Fact?",
      "required": true
    },
    {
      "id": "fact_1_overcome",
      "type": "textarea",
      "prompt": "What action(s) can you take to overcome that Obstacle and who else will be involved?",
      "required": true
    },
    {
      "id": "fact_1_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "fact_2",
      "type": "textarea",
      "prompt": "What is the second measurable FACT?",
      "required": true
    },
    {
      "id": "fact_2_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_2_obstacle",
      "type": "textarea",
      "prompt": "What obstacle(s) can you see getting in the way of accomplishing this measurable Fact?",
      "required": true
    },
    {
      "id": "fact_2_overcome",
      "type": "textarea",
      "prompt": "What action(s) can you take to overcome that Obstacle and who else will be involved?",
      "required": true
    },
    {
      "id": "fact_2_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "fact_3",
      "type": "textarea",
      "prompt": "What is the third measurable FACT?",
      "required": true
    },
    {
      "id": "fact_3_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_3_obstacle",
      "type": "textarea",
      "prompt": "What obstacle(s) can you see getting in the way of accomplishing this measurable Fact?",
      "required": true
    },
    {
      "id": "fact_3_overcome",
      "type": "textarea",
      "prompt": "What action(s) can you take to overcome that Obstacle and who else will be involved?",
      "required": true
    },
    {
      "id": "fact_3_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "fact_4",
      "type": "textarea",
      "prompt": "What is the fourth measurable FACT?",
      "required": true
    },
    {
      "id": "fact_4_why",
      "type": "textarea",
      "prompt": "Why do you feel selecting this FACT is significant?",
      "required": true
    },
    {
      "id": "fact_4_obstacle",
      "type": "textarea",
      "prompt": "What obstacle(s) can you see getting in the way of accomplishing this measurable Fact?",
      "required": true
    },
    {
      "id": "fact_4_overcome",
      "type": "textarea",
      "prompt": "What action(s) can you take to overcome that Obstacle and who else will be involved?",
      "required": true
    },
    {
      "id": "fact_4_title",
      "type": "text",
      "prompt": "What is a simple TITLE you could give this FACT?",
      "required": true
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Stepping back from this WAR Stack, why has this productive idea been extremely positive?",
      "required": true
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "Looking at how positive this productive idea has been, what is the singular lesson on life you are taking from this Stack?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this War Stack with, and why do you feel that way?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate actions are you committed to taking leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  'gentle',
  true,
  3
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();
-- Seed (source 20251209135227)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, ai_challenge_intensity, is_active, display_order)
VALUES (
  'Irritation',
  'irritation',
  'Transform irritation into clarity by reframing your story and finding the positive path forward.',
  '😤',
  '#f97316',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this Irritation Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "What domain of CORE 4 are you Stacking?",
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "required": true
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who/What are you Stacking?",
      "required": true,
      "interpolation_key": "trigger",
      "placeholder": "Describe the person, situation, or thing causing irritation..."
    },
    {
      "id": "why_irritated",
      "type": "textarea",
      "prompt": "In this moment, why has {trigger} triggered you to feel irritated?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "Be honest about what is bothering you..."
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What is the story you are telling yourself, created by this trigger, about {trigger} and the situation?",
      "required": true,
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "Describe the single word FEELINGS that arise for you when you tell yourself that story?",
      "required": true,
      "placeholder": "e.g., Hurt, Frustrated, Disappointed..."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "Describe the specific thoughts and actions that arise for you when you tell yourself this story?",
      "required": true
    },
    {
      "id": "evidence_true",
      "type": "textarea",
      "prompt": "What evidence do you have to support this story as absolutely true?",
      "required": true
    },
    {
      "id": "facts",
      "type": "textarea",
      "prompt": "What are the non-emotional FACTS about the situation with {trigger} that triggered you to feel irritated?",
      "required": true
    },
    {
      "id": "ignore_consequence",
      "type": "textarea",
      "prompt": "If you ignore this current irritation, how will it lead to anger and eventually rage?",
      "required": true
    },
    {
      "id": "want_for_you",
      "type": "textarea",
      "prompt": "Regardless of your irritation trigger with {trigger} and the original story \"{story}\" that you are telling yourself, what do you truly want for you in and beyond this situation?",
      "required": true,
      "interpolation_key": "want_for_you"
    },
    {
      "id": "want_for_trigger",
      "type": "textarea",
      "prompt": "What do you want for {trigger} in and beyond this situation?",
      "required": true
    },
    {
      "id": "want_for_both",
      "type": "textarea",
      "prompt": "What do you want for {trigger} and YOU in and beyond this situation?",
      "required": true
    },
    {
      "id": "story_check",
      "type": "select",
      "prompt": "Let us look at your original story \"{story}\" and what you say you want \"{want_for_you}\" - If you keep telling yourself this original story, will it ultimately give you what you want?",
      "options": ["YES", "NO"],
      "required": true
    },
    {
      "id": "ready_to_let_go",
      "type": "select",
      "prompt": "Are you ready to let go of the original story and expand your mind and reality around this trigger and create a new power story that will assure you get what you want?",
      "options": ["YES", "NO"],
      "required": true
    },
    {
      "id": "desired_story",
      "type": "textarea",
      "prompt": "Letting go of the original story \"{story}\" and reviewing what you want \"{want_for_you}\" and knowing you can ultimately create any story you desire, what is your new DESIRED VERSION of the story?",
      "required": true,
      "interpolation_key": "desired_story",
      "ai_challenge": true
    },
    {
      "id": "desired_evidence",
      "type": "textarea",
      "prompt": "What evidence can you see to prove this desired story is accurate so you can weaponize yourself to move forward today?",
      "required": true
    },
    {
      "id": "desired_story_check",
      "type": "select",
      "prompt": "Stepping back and reviewing what you want \"{want_for_you}\" - will telling yourself this desired story \"{desired_story}\" give you what you want?",
      "options": ["YES", "NO"],
      "required": true
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Stepping back from what you have created so far, why has this irritation been extremely positive?",
      "required": true
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "Looking at how positive this irritation trigger has been, what is the singular lesson on life you are taking from this Stack?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Irritation Stack with, and why do you feel that way?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "feelings_now",
      "type": "text",
      "prompt": "Compared to how you felt when you started this Irritation Stack, what singular words would you use to describe how you feel now completing it?",
      "required": true,
      "placeholder": "e.g., Hopeful, Clear, Peaceful..."
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate actions are you committed to take leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  'gentle',
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();
-- Seed (source 20251209135424)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, ai_challenge_intensity, is_active, display_order)
VALUES (
  'Discovery',
  'discovery',
  'Capture key learnings and insights, then apply them intentionally to your life domains.',
  '🔍',
  '#8b5cf6',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this Discovery Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "What domain of CORE 4 are you Stacking?",
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "required": true
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who/What are you stacking?",
      "required": true,
      "interpolation_key": "trigger",
      "placeholder": "Describe the experience, training, event, or insight source..."
    },
    {
      "id": "discovery_activated",
      "type": "textarea",
      "prompt": "In this moment, what Discovery has {trigger} activated in you?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "What have you discovered or realized?"
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What is the story you are telling yourself about this discovery?",
      "required": true,
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "Describe the single word feelings that arise for you when you tell yourself that story?",
      "required": true,
      "placeholder": "e.g., Inspired, Enlightened, Motivated..."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "Describe the specific thoughts and actions that arise for you when you tell yourself this story?",
      "required": true
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Stepping back from what you have discovered, why has this discovery been extremely positive?",
      "required": true
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "Looking at how positive this discovery trigger has been, what is the singular lesson about life you are taking from this Stack?",
      "required": true,
      "interpolation_key": "lesson"
    },
    {
      "id": "apply_category",
      "type": "select",
      "prompt": "What Category of life would you like to apply this discovery?",
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "required": true,
      "interpolation_key": "apply_category"
    },
    {
      "id": "apply_lesson",
      "type": "textarea",
      "prompt": "The lesson you learned was \"{lesson}\" - How does this lesson apply to your {apply_category} domain?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Discovery Stack with, and why do you feel that way?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate actions are you committed to taking leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  'gentle',
  true,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();
-- Seed (source 20251209140043)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, ai_challenge_intensity, is_active, display_order)
VALUES (
  'Prayer',
  'prayer',
  'Invite God into your situation through intentional prayer and reflection.',
  '🙏',
  '#3b82f6',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this Prayer Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who or what are you stacking?",
      "required": true,
      "interpolation_key": "trigger",
      "placeholder": "Describe the situation, event, person, or circumstance..."
    },
    {
      "id": "why_pray",
      "type": "textarea",
      "prompt": "In this moment, why has {trigger} triggered you to pray?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "What is drawing you to prayer right now?"
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What is the story you are telling yourself, created by this trigger, about {trigger} and the situation?",
      "required": true,
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "Describe the single word feelings that arise for you when you tell yourself that story?",
      "required": true,
      "placeholder": "e.g., Excited, Loved, Hopeful, Peaceful..."
    },
    {
      "id": "god_know_1",
      "type": "textarea",
      "prompt": "I want GOD to know...",
      "required": true,
      "placeholder": "Share what is on your heart..."
    },
    {
      "id": "god_know_2",
      "type": "textarea",
      "prompt": "I want GOD to know...",
      "required": true,
      "placeholder": "Continue sharing with God..."
    },
    {
      "id": "god_know_3",
      "type": "textarea",
      "prompt": "I want GOD to know...",
      "required": true,
      "placeholder": "What else do you want God to know?"
    },
    {
      "id": "god_know_4",
      "type": "textarea",
      "prompt": "I want GOD to know...",
      "required": true,
      "placeholder": "One more thing for God..."
    },
    {
      "id": "dear_god",
      "type": "textarea",
      "prompt": "Dear GOD,",
      "required": true,
      "placeholder": "Write your prayer freely... praise, thanks, requests, whatever is on your heart..."
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What is the singular lesson on life you are taking from this Prayer Stack?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Prayer Stack with, and why do you feel that way?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate actions are you committed to taking leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  'gentle',
  true,
  6
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();
-- Seed (source 20251209140318)
INSERT INTO flow_templates (name, slug, description, icon, color, questions_json, ai_challenge_enabled, ai_challenge_intensity, is_active, display_order)
VALUES (
  'Bible',
  'bible',
  'Study scripture intentionally and apply God''s word to your life through START, STOP, and SUSTAIN reflections.',
  '📖',
  '#059669',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "What are you going to title this Bible Stack?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "scripture",
      "type": "textarea",
      "prompt": "What scripture did you read today?",
      "required": true,
      "placeholder": "Paste or type the scripture passage you read..."
    },
    {
      "id": "what_you_see",
      "type": "textarea",
      "prompt": "In this moment, what did you SEE while reading?",
      "required": true,
      "ai_challenge": true,
      "placeholder": "What stood out to you? What is God showing you?"
    },
    {
      "id": "start_doing",
      "type": "select",
      "prompt": "From what you have seen... is there anything you must START doing?",
      "options": ["YES", "NO"],
      "required": true
    },
    {
      "id": "start_what",
      "type": "textarea",
      "prompt": "What does GOD want you to START doing this week?",
      "required": false,
      "placeholder": "If you answered YES above, describe what God wants you to start..."
    },
    {
      "id": "start_measure",
      "type": "textarea",
      "prompt": "How will you measure that you did that?",
      "required": false,
      "placeholder": "How will you know you followed through?"
    },
    {
      "id": "start_story",
      "type": "textarea",
      "prompt": "What story must you tell yourself to assure that you do it?",
      "required": false,
      "placeholder": "What mindset or belief will drive you?"
    },
    {
      "id": "stop_doing",
      "type": "select",
      "prompt": "From what you have seen... is there anything you must STOP doing?",
      "options": ["YES", "NO"],
      "required": true
    },
    {
      "id": "stop_what",
      "type": "textarea",
      "prompt": "What does GOD want you to STOP doing this week?",
      "required": false,
      "placeholder": "If you answered YES above, describe what God wants you to stop..."
    },
    {
      "id": "stop_measure",
      "type": "textarea",
      "prompt": "How will you measure that you did that?",
      "required": false,
      "placeholder": "How will you know you followed through?"
    },
    {
      "id": "stop_story",
      "type": "textarea",
      "prompt": "What story must you tell yourself to assure that you do it?",
      "required": false,
      "placeholder": "What mindset or belief will drive you?"
    },
    {
      "id": "sustain_doing",
      "type": "select",
      "prompt": "From what you have seen... is there anything you must SUSTAIN doing?",
      "options": ["YES", "NO"],
      "required": true
    },
    {
      "id": "sustain_what",
      "type": "textarea",
      "prompt": "What does GOD want you to SUSTAIN doing this week?",
      "required": false,
      "placeholder": "If you answered YES above, describe what God wants you to sustain..."
    },
    {
      "id": "sustain_measure",
      "type": "textarea",
      "prompt": "How will you measure that you did that?",
      "required": false,
      "placeholder": "How will you know you followed through?"
    },
    {
      "id": "sustain_story",
      "type": "textarea",
      "prompt": "What story must you tell yourself to assure that you do it?",
      "required": false,
      "placeholder": "What mindset or belief will drive you?"
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "Looking at how positive this Bible Study has been, what is the singular lesson about life you are taking from this Stack?",
      "required": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Scripture Study with?",
      "required": true,
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What immediate actions are you committed to taking leaving this Stack?",
      "required": true,
      "ai_challenge": true
    }
  ]'::jsonb,
  true,
  'gentle',
  true,
  7
)
ON CONFLICT (slug) DO UPDATE SET
  questions_json = EXCLUDED.questions_json,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();
-- Seed: Daily Frame (source 20260601123000)
INSERT INTO public.flow_templates (
  name,
  slug,
  description,
  icon,
  color,
  questions_json,
  ai_challenge_enabled,
  ai_analysis_prompt,
  is_active,
  display_order
)
VALUES (
  'Daily Frame',
  'daily-frame',
  'Set the frame for today. Name gratitude, choose the lane, and declare one measurable commitment.',
  'DF',
  '#f59e0b',
  '[
    {
      "id": "title",
      "type": "text",
      "prompt": "Give today a short title.",
      "required": true,
      "placeholder": "Monday reset, Renewal sprint, Calm and clear..."
    },
    {
      "id": "current_state",
      "type": "textarea",
      "prompt": "What is your current state this morning?",
      "required": true,
      "placeholder": "Name the facts, the energy, and what needs attention."
    },
    {
      "id": "gratitude_body",
      "type": "text",
      "prompt": "Body gratitude: what are you grateful for in your body or energy today?",
      "required": true
    },
    {
      "id": "gratitude_being",
      "type": "text",
      "prompt": "Being gratitude: what are you grateful for in your mindset, faith, or identity today?",
      "required": true
    },
    {
      "id": "gratitude_balance",
      "type": "text",
      "prompt": "Balance gratitude: what are you grateful for in your people, home, or margin today?",
      "required": true
    },
    {
      "id": "gratitude_business",
      "type": "text",
      "prompt": "Business gratitude: what are you grateful for in your business or work today?",
      "required": true
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "Which Core 4 lane is today mainly about?",
      "options": ["BODY", "BEING", "BALANCE", "BUSINESS"],
      "required": true
    },
    {
      "id": "target_outcome",
      "type": "textarea",
      "prompt": "What is the big target or outcome for today?",
      "required": true
    },
    {
      "id": "measurable_proof",
      "type": "textarea",
      "prompt": "What measurable proof will tell you this was a win?",
      "required": true,
      "placeholder": "Make it pass/fail enough that tomorrow-you can score it quickly."
    },
    {
      "id": "likely_obstacle",
      "type": "textarea",
      "prompt": "What is the most likely obstacle?",
      "required": true
    },
    {
      "id": "if_then_plan",
      "type": "textarea",
      "prompt": "Create the if-then plan.",
      "required": true,
      "placeholder": "If ___ happens, then I will ___."
    },
    {
      "id": "declared_commitment",
      "type": "textarea",
      "prompt": "Declare the final measurable commitment for today.",
      "required": true,
      "placeholder": "Today I will..."
    }
  ]'::jsonb,
  false,
  'Return a compact Daily Frame Card with today_lane, gratitude_snapshot, todays_win, proof, likely_obstacle, if_then_plan, declared_action, and coach_check_tomorrow. Keep it practical and brief.',
  true,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  questions_json = EXCLUDED.questions_json,
  ai_challenge_enabled = EXCLUDED.ai_challenge_enabled,
  ai_analysis_prompt = EXCLUDED.ai_analysis_prompt,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Template update (source 20251209213722)

-- Update Grateful template
UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  '"Welcome to your Gratitude Flow. To begin, give this reflection a title that captures what you''re grateful for today."'
)
WHERE slug = 'grateful';

UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{14,prompt}',
  '"You''ve just completed a powerful gratitude reflection. One last question: What is ONE specific action you will take within the next 24 hours to express this gratitude, honor your values, or pursue your goal?"'
)
WHERE slug = 'grateful';

-- Update Idea template
UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  '"Welcome to your Idea Flow. To begin, give this idea a title that captures its essence."'
)
WHERE slug = 'idea';

UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{9,prompt}',
  '"You''ve just completed a powerful idea exploration. One last question: What is ONE specific action you will take within the next 24 hours to move this idea forward?"'
)
WHERE slug = 'idea';

-- Update War template
UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  '"Welcome to your War Flow. To begin, give this challenge a title that captures what you''re facing."'
)
WHERE slug = 'war';

UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{9,prompt}',
  '"You''ve just completed a powerful strategic planning session. One last question: What is ONE specific action you will take within the next 24 hours to begin your campaign?"'
)
WHERE slug = 'war';

-- Update Irritation template
UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  '"Welcome to your Irritation Flow. To begin, give this frustration a title that captures what''s bothering you."'
)
WHERE slug = 'irritation';

UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{9,prompt}',
  '"You''ve just completed a powerful irritation transformation. One last question: What is ONE specific action you will take within the next 24 hours to address this situation constructively?"'
)
WHERE slug = 'irritation';

-- Update Discovery template
UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  '"Welcome to your Discovery Flow. To begin, give this learning a title that captures what you''ve discovered."'
)
WHERE slug = 'discovery';

UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{9,prompt}',
  '"You''ve just completed a powerful discovery integration. One last question: What is ONE specific action you will take within the next 24 hours to apply this learning?"'
)
WHERE slug = 'discovery';

-- Update Prayer template
UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{0,prompt}',
  '"Welcome to your Prayer Flow. To begin, give this prayer intention a title."'
)
WHERE slug = 'prayer';

UPDATE flow_templates 
SET questions_json = jsonb_set(
  questions_json,
  '{9,prompt}',
  '"You''ve just completed a meaningful prayer reflection. One last question: What is ONE specific action you will take within the next 24 hours to live out this prayer?"'
)
WHERE slug = 'prayer';

-- Template update (source 20251222180915)
UPDATE flow_templates 
SET questions_json = '[
  {
    "id": "title",
    "type": "text",
    "prompt": "What are you going to title this Bible Stack?",
    "required": true,
    "interpolation_key": "stack_title"
  },
  {
    "id": "scripture",
    "type": "textarea",
    "prompt": "What scripture did you read today?",
    "required": true,
    "placeholder": "Paste or type the scripture passage you read..."
  },
  {
    "id": "what_you_see",
    "type": "textarea",
    "prompt": "In this moment, what did you SEE while reading?",
    "required": true,
    "placeholder": "What stood out to you? What is God showing you?",
    "ai_challenge": true
  },
  {
    "id": "start_doing",
    "type": "select",
    "prompt": "From what you have seen... is there anything you must START doing?",
    "required": true,
    "options": ["YES", "NO"]
  },
  {
    "id": "start_what",
    "type": "textarea",
    "prompt": "What does GOD want you to START doing this week?",
    "required": false,
    "placeholder": "If you answered YES above, describe what God wants you to start...",
    "show_if": { "question_id": "start_doing", "equals": "YES" }
  },
  {
    "id": "start_measure",
    "type": "textarea",
    "prompt": "How will you measure that you did that?",
    "required": false,
    "placeholder": "How will you know you followed through?",
    "show_if": { "question_id": "start_doing", "equals": "YES" }
  },
  {
    "id": "start_story",
    "type": "textarea",
    "prompt": "What story must you tell yourself to assure that you do it?",
    "required": false,
    "placeholder": "What mindset or belief will drive you?",
    "show_if": { "question_id": "start_doing", "equals": "YES" }
  },
  {
    "id": "stop_doing",
    "type": "select",
    "prompt": "From what you have seen... is there anything you must STOP doing?",
    "required": true,
    "options": ["YES", "NO"]
  },
  {
    "id": "stop_what",
    "type": "textarea",
    "prompt": "What does GOD want you to STOP doing this week?",
    "required": false,
    "placeholder": "If you answered YES above, describe what God wants you to stop...",
    "show_if": { "question_id": "stop_doing", "equals": "YES" }
  },
  {
    "id": "stop_measure",
    "type": "textarea",
    "prompt": "How will you measure that you did that?",
    "required": false,
    "placeholder": "How will you know you followed through?",
    "show_if": { "question_id": "stop_doing", "equals": "YES" }
  },
  {
    "id": "stop_story",
    "type": "textarea",
    "prompt": "What story must you tell yourself to assure that you do it?",
    "required": false,
    "placeholder": "What mindset or belief will drive you?",
    "show_if": { "question_id": "stop_doing", "equals": "YES" }
  },
  {
    "id": "sustain_doing",
    "type": "select",
    "prompt": "From what you have seen... is there anything you must SUSTAIN doing?",
    "required": true,
    "options": ["YES", "NO"]
  },
  {
    "id": "sustain_what",
    "type": "textarea",
    "prompt": "What does GOD want you to SUSTAIN doing this week?",
    "required": false,
    "placeholder": "If you answered YES above, describe what God wants you to sustain...",
    "show_if": { "question_id": "sustain_doing", "equals": "YES" }
  },
  {
    "id": "sustain_measure",
    "type": "textarea",
    "prompt": "How will you measure that you did that?",
    "required": false,
    "placeholder": "How will you know you followed through?",
    "show_if": { "question_id": "sustain_doing", "equals": "YES" }
  },
  {
    "id": "sustain_story",
    "type": "textarea",
    "prompt": "What story must you tell yourself to assure that you do it?",
    "required": false,
    "placeholder": "What mindset or belief will drive you?",
    "show_if": { "question_id": "sustain_doing", "equals": "YES" }
  },
  {
    "id": "lesson",
    "type": "textarea",
    "prompt": "Looking at how positive this Bible Study has been, what is the singular lesson about life you are taking from this Stack?",
    "required": true
  },
  {
    "id": "revelation",
    "type": "textarea",
    "prompt": "What is the most significant REVELATION or INSIGHT you are leaving this Scripture Study with?",
    "required": true,
    "ai_challenge": true
  },
  {
    "id": "actions",
    "type": "textarea",
    "prompt": "What immediate actions are you committed to taking leaving this Stack?",
    "required": true,
    "ai_challenge": true
  }
]'::jsonb
WHERE slug = 'bible';
-- Template update (source 20251224114138)
-- Update "stack" terminology to "flow" in flow_templates questions_json
UPDATE flow_templates 
SET questions_json = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(questions_json::text, 'stack_title', 'flow_title'),
        'are you Stacking', 'are you Flowing with'
      ),
      'are you stacking', 'are you flowing with'
    ),
    'from this Stack', 'from this Flow'
  ),
  'this Gratitude Stack', 'this Gratitude Flow'
)::jsonb
WHERE questions_json::text ILIKE '%stack%';
-- Template update (source 20251224114953)
-- Remove incorrectly added 'with' from flow_templates questions_json
UPDATE flow_templates 
SET questions_json = REPLACE(
  REPLACE(questions_json::text, 'are you Flowing with', 'are you Flowing'),
  'are you flowing with', 'are you flowing'
)::jsonb
WHERE questions_json::text ILIKE '%flowing with%';
-- Template update (source 20260201194819)
-- Fix Discovery flow apply_category question
-- The question is currently type "textarea" but should be "select" for domain selection
UPDATE flow_templates 
SET questions_json = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'id' = 'apply_category' THEN 
        jsonb_build_object(
          'id', 'apply_category',
          'type', 'select',
          'prompt', 'What Category of life would you like to apply this discovery?',
          'options', jsonb_build_array('BALANCE', 'BODY', 'BEING', 'BUSINESS'),
          'required', true,
          'interpolation_key', 'apply_category'
        )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(questions_json) AS elem
),
updated_at = now()
WHERE slug = 'discovery';
-- Template update (source 20260516120000)
-- Repair migration: restore the four flow prompts clobbered by 20251209213722.
--
-- That earlier migration intended to add a closing wrap-up to the LAST question
-- of each flow but hardcoded array index 9, which was only "the last question"
-- in an early prototype. By the time the templates were seeded, index 9 was a
-- mid-flow question for Idea, War, Irritation, and Prayer — so the wrap-up text
-- overwrote critical questions:
--
--   - Idea       idx 9 = fact_1            ("What is the first measurable FACT?")
--   - War        idx 9 = fact_1            ("What is the first measurable FACT?")
--   - Irritation idx 9 = ignore_consequence ("If you ignore this current irritation, how will it lead to anger and eventually rage?")
--   - Prayer     idx 9 = dear_god          ("Dear GOD,") — the free-form prayer centerpiece
--
-- Discovery's index 9 was already repaired by 20260201194819.
-- Grateful's index 14 (= actions) was correctly the last question, so its
-- wrap-up edit was correct and is left in place.
--
-- Strategy: target by question id (robust against any array reorder via the
-- admin editor), and overwrite ONLY the prompt field — every other field
-- (id, type, required, placeholder, ai_challenge, interpolation_key) is
-- preserved by spreading the original element.

UPDATE flow_templates
SET questions_json = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'id' = 'fact_1' THEN
        elem || jsonb_build_object('prompt', 'What is the first measurable FACT?')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(questions_json) AS elem
),
updated_at = now()
WHERE slug = 'idea';

UPDATE flow_templates
SET questions_json = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'id' = 'fact_1' THEN
        elem || jsonb_build_object('prompt', 'What is the first measurable FACT?')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(questions_json) AS elem
),
updated_at = now()
WHERE slug = 'war';

UPDATE flow_templates
SET questions_json = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'id' = 'ignore_consequence' THEN
        elem || jsonb_build_object(
          'prompt',
          'If you ignore this current irritation, how will it lead to anger and eventually rage?'
        )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(questions_json) AS elem
),
updated_at = now()
WHERE slug = 'irritation';

UPDATE flow_templates
SET questions_json = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'id' = 'dear_god' THEN
        elem || jsonb_build_object('prompt', 'Dear GOD,')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(questions_json) AS elem
),
updated_at = now()
WHERE slug = 'prayer';

-- Template update (source 20260516130000)
-- Restore the dear_god question to the Prayer flow.
--
-- Investigation on 2026-05-16 found the Prayer flow had 12 questions in prod
-- instead of the seeded 13 — the dear_god question (the free-form "Dear GOD,"
-- open prayer, the centerpiece of the flow) had been deleted, most likely via
-- the admin flow editor. Without it, users went straight from god_know_4 to
-- lesson, skipping the actual open prayer.
--
-- This migration reinserts the question immediately after god_know_4 using a
-- fractional-index sort trick, and guards against double-insertion with a
-- NOT EXISTS check on the dear_god id.

UPDATE flow_templates
SET questions_json = (
  SELECT jsonb_agg(elem ORDER BY ord)
  FROM (
    SELECT elem, idx::numeric AS ord
    FROM jsonb_array_elements(questions_json) WITH ORDINALITY AS x(elem, idx)
    UNION ALL
    SELECT
      jsonb_build_object(
        'id', 'dear_god',
        'type', 'textarea',
        'prompt', 'Dear GOD,',
        'required', true,
        'placeholder', 'Write your prayer freely... praise, thanks, requests, whatever is on your heart...'
      ) AS elem,
      (
        SELECT (idx::numeric) + 0.5
        FROM jsonb_array_elements(questions_json) WITH ORDINALITY AS y(e, idx)
        WHERE e->>'id' = 'god_know_4'
      ) AS ord
  ) sorted
),
updated_at = now()
WHERE slug = 'prayer'
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(questions_json) e
    WHERE e->>'id' = 'dear_god'
  );

-- Template update (source 20260517100000)
-- supabase/migrations/20260517100000_rewrite_all_flow_prompts_voice_first.sql
--
-- Voice-first rewrite of all 7 Flow templates.
--
-- See: /MY BIZ BRAIN/current-projects/flows-voice-rewrite/
--   - 00-voice-persona.md       (the Standard Playbook Coach character)
--   - 01-script-grateful.md     (per-question rationale)
--   - 02-script-prayer.md
--   - 03-script-bible.md
--   - 04-script-discovery.md
--   - 05-script-irritation.md
--   - 06-script-idea.md
--   - 07-script-war.md
--   - codex-prompt-flows-voice-rewrite.md  (deploy instructions)
--
-- Changes per flow:
--   - questions_json:  full replacement with voice-clean prompts + new placeholders
--   - description:     rewritten in Coach voice
--   - name:            only "Grateful" → "Gratitude Flow" (cosmetic)
--
-- Schema is unchanged. The 9 allowed question fields are preserved
-- (id, type, prompt, required, options, placeholder, interpolation_key,
--  ai_challenge, show_if).
--
-- ai_challenge: true is newly added to:
--   - Every `lesson` question across all 7 flows (was only on revelation + actions)
--   - Bible's start_what/start_measure/stop_what/stop_measure/sustain_what/sustain_measure
--   - Idea's four fact_N questions (Q10, Q13, Q16, Q19)
--   - War's four fact_N and four fact_N_obstacle questions
--   - Irritation's feelings_now (Q22)
--
-- Reversible: restore prior questions_json from the immediately preceding
-- migration baseline (20260516120000 + 20260516130000 are the most recent
-- pre-this-migration touches).

BEGIN;

-- ============================================================
-- 1. GRATITUDE FLOW (slug: grateful) — display renamed
-- ============================================================
UPDATE flow_templates SET
  name = $$Gratitude Flow$$,
  description = $$Slow down. Sit with what you're grateful for. Walk out with one move that honors it.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your Gratitude Flow. Let's slow down for a second. Give it a title. What are you grateful for today?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "Which Core 4 are we Flowing on? Business, Being, Body, or Balance?",
      "required": true,
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"]
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "OK. Who or what are you grateful for today?",
      "required": true,
      "placeholder": "The person, event, or thing that's hitting your gratitude right now.",
      "interpolation_key": "trigger"
    },
    {
      "id": "why_grateful",
      "type": "textarea",
      "prompt": "What is it about {trigger} that lit this gratitude up in you?",
      "required": true,
      "placeholder": "Take your time. What specifically about this is hitting you?",
      "ai_challenge": true
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What story are you telling yourself about this?",
      "required": true,
      "placeholder": "The narrative running in your head about what this means.",
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "When you tell yourself that story, what's the one word that names what you feel?",
      "required": true,
      "placeholder": "One word. Happy. Peaceful. Blessed. Whatever lands."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "When you tell yourself that story, what does it make you think? And what does it make you do?",
      "required": true,
      "placeholder": "Both sides. What's the inner script, and what's the outer behavior?"
    },
    {
      "id": "facts",
      "type": "textarea",
      "prompt": "Step out of the emotion for a second. What are the actual facts about {trigger}?",
      "required": true,
      "placeholder": "Just the observable truths. No story, no interpretation."
    },
    {
      "id": "want_for_you",
      "type": "textarea",
      "prompt": "Holding {trigger} in mind, what do you truly want for yourself in and beyond this?",
      "required": true,
      "placeholder": "Not what you should want. What you actually want."
    },
    {
      "id": "want_for_trigger",
      "type": "textarea",
      "prompt": "And what do you want for {trigger}, in and beyond this?",
      "required": true
    },
    {
      "id": "want_for_both",
      "type": "textarea",
      "prompt": "And for both of you, in and beyond this?",
      "required": true
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Step back from the whole thing for a second. Why has this gratitude been such a gift?",
      "required": true,
      "placeholder": "Zoom out. What did this give you?"
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking away with?",
      "required": true,
      "placeholder": "One. Not three. The one that matters.",
      "ai_challenge": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation you're leaving this Flow with? And why does it land that way for you?",
      "required": true,
      "placeholder": "The thing you didn't know you were going to find.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "One specific action in the next 24 hours to honor this gratitude. Declare it.",
      "required": true,
      "placeholder": "What you'll actually do. Not what you'll think about doing.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'grateful';

-- ============================================================
-- 2. IDEA FLOW (slug: idea)
-- ============================================================
UPDATE flow_templates SET
  description = $$Take the idea seriously. Get specific. Walk out with a measurable plan.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your Idea Flow. Give this idea a name. What is it?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "Which Core 4 is this idea inside of? Business, Being, Body, or Balance?",
      "required": true,
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"]
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "What's the idea, project, or opportunity?",
      "required": true,
      "placeholder": "The thing that lit up. Give it a working name.",
      "interpolation_key": "trigger"
    },
    {
      "id": "idea_activated",
      "type": "textarea",
      "prompt": "What's the actual idea? Get specific.",
      "required": true,
      "placeholder": "What you actually want to build, do, or try. The clearer, the better.",
      "ai_challenge": true
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What story are you telling yourself about this idea?",
      "required": true,
      "placeholder": "The narrative running in your head about what this could become.",
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "When you tell yourself that story, what's the one word that names what you feel?",
      "required": true,
      "placeholder": "One word. Excited. Inspired. Driven. Whatever lands."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "When you tell yourself that story, what does it make you think? And what does it make you do?",
      "required": true,
      "placeholder": "Both sides. The inner script, the outer behavior."
    },
    {
      "id": "positive_benefits",
      "type": "textarea",
      "prompt": "If you actually execute this, what changes? For you, and for the people around you?",
      "required": true,
      "placeholder": "Specific. What gets better. For you, for them."
    },
    {
      "id": "negative_effects",
      "type": "textarea",
      "prompt": "And if you don't? What's the cost? To you, and to the people around you?",
      "required": true,
      "placeholder": "What stays broken. What you'll regret."
    },
    {
      "id": "fact_1",
      "type": "textarea",
      "prompt": "What's the first measurable fact? A number you can count.",
      "required": true,
      "placeholder": "Concrete. Numeric where possible. What gets measured.",
      "ai_challenge": true
    },
    {
      "id": "fact_1_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this metric tells you. Why it's the right one to track."
    },
    {
      "id": "fact_1_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "fact_2",
      "type": "textarea",
      "prompt": "What's the second measurable fact?",
      "required": true,
      "placeholder": "Different from the first. Another angle on the same idea.",
      "ai_challenge": true
    },
    {
      "id": "fact_2_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this metric tells you that the first one doesn't."
    },
    {
      "id": "fact_2_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "fact_3",
      "type": "textarea",
      "prompt": "What's the third measurable fact?",
      "required": true,
      "placeholder": "Another angle. Not a duplicate.",
      "ai_challenge": true
    },
    {
      "id": "fact_3_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this one tells you."
    },
    {
      "id": "fact_3_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "fact_4",
      "type": "textarea",
      "prompt": "What's the fourth measurable fact?",
      "required": true,
      "placeholder": "Last one. The final angle.",
      "ai_challenge": true
    },
    {
      "id": "fact_4_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this one tells you that the others don't."
    },
    {
      "id": "fact_4_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Step back from this whole thing. Why is this idea worth your energy?",
      "required": true,
      "placeholder": "Zoom out. Why is this one worth your attention right now?"
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking away with?",
      "required": true,
      "placeholder": "One. Not three. The one that matters.",
      "ai_challenge": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation you're leaving this Flow with? And why does it land that way for you?",
      "required": true,
      "placeholder": "The thing under the lesson. The thing you didn't expect to find.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "One specific action in the next 24 hours to move this idea forward. Declare it.",
      "required": true,
      "placeholder": "What you'll actually do this week. Not what you'll plan to do.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'idea';

-- ============================================================
-- 3. WAR FLOW (slug: war)
-- ============================================================
UPDATE flow_templates SET
  description = $$Name what you're up against. Build the plan. Run your game.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your War Flow. Give this a title. What are you going to war with?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "Which Core 4 is this war inside of? Business, Being, Body, or Balance?",
      "required": true,
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"]
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "What's the goal, target, or challenge?",
      "required": true,
      "placeholder": "Name the enemy. Be specific. What are you fighting?",
      "interpolation_key": "trigger"
    },
    {
      "id": "idea_activated",
      "type": "textarea",
      "prompt": "What's the vision? What does winning actually look like?",
      "required": true,
      "placeholder": "The specific outcome. The actual finish line.",
      "ai_challenge": true
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What story are you telling yourself about this war?",
      "required": true,
      "placeholder": "The narrative running in your head about what this fight means.",
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "When you tell yourself that story, what's the one word that names what you feel?",
      "required": true,
      "placeholder": "One word. Powerful. Determined. Ready. Whatever lands."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "When you tell yourself that story, what does it make you think? And what does it make you do?",
      "required": true,
      "placeholder": "Both sides. The inner script, the outer behavior."
    },
    {
      "id": "positive_benefits",
      "type": "textarea",
      "prompt": "If you win this, what changes? For you, and for the people around you?",
      "required": true,
      "placeholder": "Specific. The actual stakes of winning."
    },
    {
      "id": "negative_effects",
      "type": "textarea",
      "prompt": "And if you lose this? What's the cost?",
      "required": true,
      "placeholder": "What gets worse. What you'll regret. Don't soften it."
    },
    {
      "id": "fact_1",
      "type": "textarea",
      "prompt": "What's the first measurable fact? A number you can count.",
      "required": true,
      "placeholder": "Concrete. Numeric where possible.",
      "ai_challenge": true
    },
    {
      "id": "fact_1_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "Why this metric is the right one for this war."
    },
    {
      "id": "fact_1_obstacle",
      "type": "textarea",
      "prompt": "What's getting in the way of this one?",
      "required": true,
      "placeholder": "Be honest. What's actually in the way.",
      "ai_challenge": true
    },
    {
      "id": "fact_1_overcome",
      "type": "textarea",
      "prompt": "What's the move to overcome it? And who else is in the foxhole with you?",
      "required": true,
      "placeholder": "The plan. And the people."
    },
    {
      "id": "fact_1_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "fact_2",
      "type": "textarea",
      "prompt": "What's the second measurable fact?",
      "required": true,
      "placeholder": "Different from the first. Another angle on the same war.",
      "ai_challenge": true
    },
    {
      "id": "fact_2_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this metric tells you that the first one doesn't."
    },
    {
      "id": "fact_2_obstacle",
      "type": "textarea",
      "prompt": "What's getting in the way of this one?",
      "required": true,
      "placeholder": "Be honest. What's actually in the way.",
      "ai_challenge": true
    },
    {
      "id": "fact_2_overcome",
      "type": "textarea",
      "prompt": "What's the move to overcome it? And who else is in the foxhole with you?",
      "required": true,
      "placeholder": "The plan. And the people."
    },
    {
      "id": "fact_2_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "fact_3",
      "type": "textarea",
      "prompt": "What's the third measurable fact?",
      "required": true,
      "placeholder": "Another angle. Not a duplicate.",
      "ai_challenge": true
    },
    {
      "id": "fact_3_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this one tells you."
    },
    {
      "id": "fact_3_obstacle",
      "type": "textarea",
      "prompt": "What's getting in the way of this one?",
      "required": true,
      "placeholder": "Be honest.",
      "ai_challenge": true
    },
    {
      "id": "fact_3_overcome",
      "type": "textarea",
      "prompt": "What's the move to overcome it? Who else is in the foxhole?",
      "required": true,
      "placeholder": "The plan. The people."
    },
    {
      "id": "fact_3_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "fact_4",
      "type": "textarea",
      "prompt": "What's the fourth measurable fact?",
      "required": true,
      "placeholder": "Last one. The final angle.",
      "ai_challenge": true
    },
    {
      "id": "fact_4_why",
      "type": "textarea",
      "prompt": "Why does this one matter?",
      "required": true,
      "placeholder": "What this one tells you that the others don't."
    },
    {
      "id": "fact_4_obstacle",
      "type": "textarea",
      "prompt": "What's getting in the way of this one?",
      "required": true,
      "placeholder": "Be honest.",
      "ai_challenge": true
    },
    {
      "id": "fact_4_overcome",
      "type": "textarea",
      "prompt": "What's the move? Who's in the foxhole?",
      "required": true,
      "placeholder": "The plan. The people."
    },
    {
      "id": "fact_4_title",
      "type": "text",
      "prompt": "Give it a title. One short phrase.",
      "required": true,
      "placeholder": "How you'll refer to it. Short."
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Step back from this war. Why is this worth fighting for?",
      "required": true,
      "placeholder": "Zoom out. Why is this war worth your energy?"
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking out of this war with?",
      "required": true,
      "placeholder": "One. The transferable principle.",
      "ai_challenge": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation you're leaving this Flow with? And why does it land that way for you?",
      "required": true,
      "placeholder": "The thing under the plan. The thing you didn't expect to see.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "What's the first move in the next 24 hours? Declare it.",
      "required": true,
      "placeholder": "The specific tactical move. Not the strategy. The next move.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'war';

-- ============================================================
-- 4. IRRITATION FLOW (slug: irritation)
-- ============================================================
UPDATE flow_templates SET
  description = $$Stop the spiral. Surface the story. Build the one that actually serves you.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your Irritation Flow. Take a breath. Give this a title. What's bothering you?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "Which Core 4 is this living inside of? Business, Being, Body, or Balance?",
      "required": true,
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"]
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who or what is irritating you?",
      "required": true,
      "placeholder": "The person, situation, or thing. Name it.",
      "interpolation_key": "trigger"
    },
    {
      "id": "why_irritated",
      "type": "textarea",
      "prompt": "What is it about {trigger} that's actually getting to you?",
      "required": true,
      "placeholder": "Be honest. What's the real charge here?",
      "ai_challenge": true
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What story are you telling yourself about this?",
      "required": true,
      "placeholder": "The narrative running in your head about what this means.",
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "When you tell yourself that story, what's the one word that names what you feel?",
      "required": true,
      "placeholder": "One word. Hurt. Frustrated. Disappointed. Whatever's true."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "When you tell yourself that story, what does it make you think? And what does it make you do?",
      "required": true,
      "placeholder": "Both sides. The inner script, the outer behavior."
    },
    {
      "id": "evidence_true",
      "type": "textarea",
      "prompt": "What evidence do you actually have that this story is true?",
      "required": true,
      "placeholder": "Build the case. Like a witness on the stand."
    },
    {
      "id": "facts",
      "type": "textarea",
      "prompt": "Step out of the emotion. What are the actual facts about {trigger}?",
      "required": true,
      "placeholder": "Just the observables. No story, no interpretation."
    },
    {
      "id": "ignore_consequence",
      "type": "textarea",
      "prompt": "Let's play this forward. If you sit on this and ignore it, where does it end up? Anger? Rage? Resentment?",
      "required": true,
      "placeholder": "Walk it forward. Where does this go if you don't address it."
    },
    {
      "id": "want_for_you",
      "type": "textarea",
      "prompt": "Regardless of all that, what do you truly want for yourself, in and beyond this?",
      "required": true,
      "placeholder": "Not what's fair. Not what they deserve. What you actually want.",
      "interpolation_key": "want_for_you"
    },
    {
      "id": "want_for_trigger",
      "type": "textarea",
      "prompt": "And what do you want for {trigger}?",
      "required": true
    },
    {
      "id": "want_for_both",
      "type": "textarea",
      "prompt": "And for both of you?",
      "required": true
    },
    {
      "id": "story_check",
      "type": "select",
      "prompt": "Look at the story you've been telling yourself. And look at what you said you want. If you keep telling yourself that story, will it actually give you that?",
      "required": true,
      "options": ["YES", "NO"]
    },
    {
      "id": "ready_to_let_go",
      "type": "select",
      "prompt": "Are you ready to let that story go and build a new one that actually serves you?",
      "required": true,
      "options": ["YES", "NO"]
    },
    {
      "id": "desired_story",
      "type": "textarea",
      "prompt": "Let the old story go. You can write any story you choose. What's the new one?",
      "required": true,
      "placeholder": "The version that actually serves you. Write it like it's already true.",
      "interpolation_key": "desired_story",
      "ai_challenge": true
    },
    {
      "id": "desired_evidence",
      "type": "textarea",
      "prompt": "What evidence can you see that this new story is true? What grounds it in reality?",
      "required": true,
      "placeholder": "Concrete. Observable. Not faith. Proof."
    },
    {
      "id": "desired_story_check",
      "type": "select",
      "prompt": "Step back. The new story you just wrote. Will it give you what you actually want?",
      "required": true,
      "options": ["YES", "NO"]
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Step back. Why has this irritation actually been a gift?",
      "required": true,
      "placeholder": "Zoom out. What did this give you that comfort never could?"
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking out of this Flow with?",
      "required": true,
      "placeholder": "One. The transferable principle.",
      "ai_challenge": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation you're leaving this Flow with? And why does it land that way for you?",
      "required": true,
      "placeholder": "The thing under the lesson. The thing you didn't know you were going to find.",
      "ai_challenge": true
    },
    {
      "id": "feelings_now",
      "type": "text",
      "prompt": "Compared to where you started this Flow, what's one word for how you feel now?",
      "required": true,
      "placeholder": "One word. Hopeful. Clear. Lighter. Whatever's true.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "One specific action in the next 24 hours that honors the new story. Declare it.",
      "required": true,
      "placeholder": "What you'll actually do. Not what you'll think about doing.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'irritation';

-- ============================================================
-- 5. DISCOVERY FLOW (slug: discovery)
-- ============================================================
UPDATE flow_templates SET
  description = $$Take what you saw. Land it where it counts. Walk out with one move.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your Discovery Flow. Give this learning a title. What did you see?",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "domain",
      "type": "select",
      "prompt": "Which Core 4 is this discovery coming from? Business, Being, Body, or Balance?",
      "required": true,
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"]
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "What was the source? Where did this learning come from?",
      "required": true,
      "placeholder": "The experience, training, conversation, or moment that opened it up.",
      "interpolation_key": "trigger"
    },
    {
      "id": "discovery_activated",
      "type": "textarea",
      "prompt": "What did you actually discover?",
      "required": true,
      "placeholder": "The thing that landed. The thing that clicked.",
      "ai_challenge": true
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What story are you telling yourself about this discovery?",
      "required": true,
      "placeholder": "The narrative you're building around what this means.",
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "When you tell yourself that story, what's the one word that names what you feel?",
      "required": true,
      "placeholder": "One word. Inspired. Enlightened. Motivated. Whatever lands."
    },
    {
      "id": "thoughts_actions",
      "type": "textarea",
      "prompt": "When you tell yourself that story, what does it make you think? And what does it make you do?",
      "required": true,
      "placeholder": "Both sides. What's the inner script, and what's the outer behavior?"
    },
    {
      "id": "why_positive",
      "type": "textarea",
      "prompt": "Step back from this. Why has this discovery been worth your attention?",
      "required": true,
      "placeholder": "Zoom out. What did this open up for you?"
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking away with?",
      "required": true,
      "placeholder": "One. The transferable principle.",
      "interpolation_key": "lesson",
      "ai_challenge": true
    },
    {
      "id": "apply_category",
      "type": "select",
      "prompt": "Which Core 4 do you want to land this in? Business, Being, Body, or Balance?",
      "required": true,
      "options": ["BALANCE", "BODY", "BEING", "BUSINESS"],
      "interpolation_key": "apply_category"
    },
    {
      "id": "apply_lesson",
      "type": "textarea",
      "prompt": "Take that lesson. How does it actually land in {apply_category}?",
      "required": true,
      "placeholder": "Specific. What changes in your {apply_category} because of this."
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation you're leaving this Flow with? And why does it land that way for you?",
      "required": true,
      "placeholder": "The thing under the lesson. The thing you didn't expect to find.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "One specific action in the next 24 hours to land this lesson in {apply_category}. Declare it.",
      "required": true,
      "placeholder": "What you'll actually do this week in {apply_category}. Not what you'll think about doing.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'discovery';

-- ============================================================
-- 6. PRAYER FLOW (slug: prayer) — no domain question by design
-- ============================================================
UPDATE flow_templates SET
  description = $$Bring God in. Lay it down. Walk out clearer.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your Prayer Flow. Take a breath. Give this prayer a title.",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "trigger",
      "type": "textarea",
      "prompt": "Who or what are you bringing to God today?",
      "required": true,
      "placeholder": "The person, situation, or circumstance on your heart.",
      "interpolation_key": "trigger"
    },
    {
      "id": "why_pray",
      "type": "textarea",
      "prompt": "What about {trigger} is drawing you to prayer right now?",
      "required": true,
      "placeholder": "Why this, why now. Be honest with God.",
      "ai_challenge": true
    },
    {
      "id": "story",
      "type": "textarea",
      "prompt": "What story are you carrying into this prayer?",
      "required": true,
      "placeholder": "The narrative in your head about what this all means.",
      "interpolation_key": "story"
    },
    {
      "id": "feelings",
      "type": "text",
      "prompt": "When you sit with that story, what's the one word for what you feel?",
      "required": true,
      "placeholder": "One word. Hopeful. Loved. Heavy. Whatever's true."
    },
    {
      "id": "god_know_1",
      "type": "textarea",
      "prompt": "I want God to know...",
      "required": true,
      "placeholder": "Share what is on your heart."
    },
    {
      "id": "god_know_2",
      "type": "textarea",
      "prompt": "I want God to know...",
      "required": true,
      "placeholder": "Continue. There is more here."
    },
    {
      "id": "god_know_3",
      "type": "textarea",
      "prompt": "I want God to know...",
      "required": true,
      "placeholder": "What else does God need to hear?"
    },
    {
      "id": "god_know_4",
      "type": "textarea",
      "prompt": "I want God to know...",
      "required": true,
      "placeholder": "One more thing. The truest one."
    },
    {
      "id": "dear_god",
      "type": "textarea",
      "prompt": "Dear God,",
      "required": true,
      "placeholder": "Praise. Thanks. Requests. Confessions. Whatever's true."
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking out of this prayer with?",
      "required": true,
      "placeholder": "One. Not three. The one that matters.",
      "ai_challenge": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation God showed you in this? And why does it land that way?",
      "required": true,
      "placeholder": "The thing under the lesson. The thing you didn't expect.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "One specific action in the next 24 hours that honors this prayer. Declare it.",
      "required": true,
      "placeholder": "What you'll actually do. Not what you'll pray about doing.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'prayer';

-- ============================================================
-- 7. BIBLE FLOW (slug: bible) — no domain question by design
-- ============================================================
UPDATE flow_templates SET
  description = $$Read the Word. See what God is showing you. Walk out with one move that honors it.$$,
  questions_json = $$[
    {
      "id": "title",
      "type": "text",
      "prompt": "Welcome to your Bible Flow. Take a breath. Give this study a title.",
      "required": true,
      "interpolation_key": "stack_title"
    },
    {
      "id": "scripture",
      "type": "textarea",
      "prompt": "What scripture did you read?",
      "required": true,
      "placeholder": "The passage. Paste it in or type it out."
    },
    {
      "id": "what_you_see",
      "type": "textarea",
      "prompt": "What did you see in this scripture? What's God showing you?",
      "required": true,
      "placeholder": "Not what you think you should have seen. What actually landed.",
      "ai_challenge": true
    },
    {
      "id": "start_doing",
      "type": "select",
      "prompt": "From what you saw, is there anything you have to start doing?",
      "required": true,
      "options": ["YES", "NO"]
    },
    {
      "id": "start_what",
      "type": "textarea",
      "prompt": "What is God calling you to start this week?",
      "required": false,
      "placeholder": "Specific action. Not 'be a better person.' What exactly will you start?",
      "ai_challenge": true,
      "show_if": {"question_id": "start_doing", "equals": "YES"}
    },
    {
      "id": "start_measure",
      "type": "textarea",
      "prompt": "How will you know you actually did it?",
      "required": false,
      "placeholder": "Specific evidence. Not 'I'll feel it.' What's the proof?",
      "ai_challenge": true,
      "show_if": {"question_id": "start_doing", "equals": "YES"}
    },
    {
      "id": "start_story",
      "type": "textarea",
      "prompt": "What story do you have to tell yourself to make sure you do it?",
      "required": false,
      "placeholder": "The belief that holds the action in place when motivation runs out.",
      "show_if": {"question_id": "start_doing", "equals": "YES"}
    },
    {
      "id": "stop_doing",
      "type": "select",
      "prompt": "Is there anything you have to stop doing?",
      "required": true,
      "options": ["YES", "NO"]
    },
    {
      "id": "stop_what",
      "type": "textarea",
      "prompt": "What is God calling you to stop this week?",
      "required": false,
      "placeholder": "Specific behavior. Name the thing you keep doing that has to end.",
      "ai_challenge": true,
      "show_if": {"question_id": "stop_doing", "equals": "YES"}
    },
    {
      "id": "stop_measure",
      "type": "textarea",
      "prompt": "How will you know you actually stopped?",
      "required": false,
      "placeholder": "Specific evidence. What's the proof you didn't fall back into it?",
      "ai_challenge": true,
      "show_if": {"question_id": "stop_doing", "equals": "YES"}
    },
    {
      "id": "stop_story",
      "type": "textarea",
      "prompt": "What story do you have to tell yourself to actually stop?",
      "required": false,
      "placeholder": "The belief that holds the line when the urge to fall back hits.",
      "show_if": {"question_id": "stop_doing", "equals": "YES"}
    },
    {
      "id": "sustain_doing",
      "type": "select",
      "prompt": "Is there anything you have to keep doing?",
      "required": true,
      "options": ["YES", "NO"]
    },
    {
      "id": "sustain_what",
      "type": "textarea",
      "prompt": "What is God calling you to keep doing this week?",
      "required": false,
      "placeholder": "Specific. The practice that has to stay.",
      "ai_challenge": true,
      "show_if": {"question_id": "sustain_doing", "equals": "YES"}
    },
    {
      "id": "sustain_measure",
      "type": "textarea",
      "prompt": "How will you know you actually kept it up?",
      "required": false,
      "placeholder": "Specific evidence. What's the proof you didn't slip?",
      "ai_challenge": true,
      "show_if": {"question_id": "sustain_doing", "equals": "YES"}
    },
    {
      "id": "sustain_story",
      "type": "textarea",
      "prompt": "What story do you have to tell yourself to keep going?",
      "required": false,
      "placeholder": "The belief that powers the practice on the days you don't feel like it.",
      "show_if": {"question_id": "sustain_doing", "equals": "YES"}
    },
    {
      "id": "lesson",
      "type": "textarea",
      "prompt": "What's the one lesson about life you're walking out of this study with?",
      "required": true,
      "placeholder": "One. Not three. The one that matters.",
      "ai_challenge": true
    },
    {
      "id": "revelation",
      "type": "textarea",
      "prompt": "What's the deepest revelation God showed you in this Word? And why does it land that way?",
      "required": true,
      "placeholder": "The thing under the lesson. The thing the Word is opening in you.",
      "ai_challenge": true
    },
    {
      "id": "actions",
      "type": "textarea",
      "prompt": "One specific action in the next 24 hours that honors what God showed you. Declare it.",
      "required": true,
      "placeholder": "What you'll actually do. Not what you'll study about doing.",
      "ai_challenge": true
    }
  ]$$::jsonb
WHERE slug = 'bible';

COMMIT;

-- Template update (source 20260517223500)
UPDATE flow_templates
SET
  name = 'Grateful',
  updated_at = now()
WHERE slug = 'grateful';

