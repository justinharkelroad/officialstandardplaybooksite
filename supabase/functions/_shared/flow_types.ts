export interface FlowQuestion {
  id: string;
  type: "text" | "textarea" | "select";
  prompt: string;
  required: boolean;
  options?: string[];
  placeholder?: string | null;
  interpolation_key?: string;
  ai_challenge?: boolean;
  show_if?: { question_id: string; equals: string };
}

export interface FlowTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  questions_json: FlowQuestion[];
  ai_challenge_enabled?: boolean;
  ai_challenge_intensity?: string;
  ai_analysis_prompt?: string | null;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FlowSession {
  id: string;
  user_id: string;
  flow_template_id: string;
  title: string | null;
  domain: string | null;
  status: "in_progress" | "awaiting_completion" | "completed" | "abandoned";
  responses_json: Record<string, string>;
  ai_analysis_json?: Record<string, unknown> | null;
  session_token: string;
  current_question_id: string | null;
  agent_metadata: Record<string, unknown>;
  started_at: string;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  flow_template?: FlowTemplate;
}

export interface FlowToolError {
  error: {
    code: string;
    message: string;
  };
}
