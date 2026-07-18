export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booking_leads: {
        Row: {
          cell_phone: string | null
          committed: boolean | null
          completed: boolean | null
          created_at: string
          desired_outcome: string | null
          email: string | null
          full_name: string | null
          id: string
          primary_carrier: string | null
          session_id: string
          source: string | null
          updated_at: string
          whats_not_working: string | null
          whats_working: string | null
        }
        Insert: {
          cell_phone?: string | null
          committed?: boolean | null
          completed?: boolean | null
          created_at?: string
          desired_outcome?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          primary_carrier?: string | null
          session_id: string
          source?: string | null
          updated_at?: string
          whats_not_working?: string | null
          whats_working?: string | null
        }
        Update: {
          cell_phone?: string | null
          committed?: boolean | null
          completed?: boolean | null
          created_at?: string
          desired_outcome?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          primary_carrier?: string | null
          session_id?: string
          source?: string | null
          updated_at?: string
          whats_not_working?: string | null
          whats_working?: string | null
        }
        Relationships: []
      }
      core4_entries: {
        Row: {
          balance_completed: boolean | null
          balance_note: string | null
          being_completed: boolean | null
          being_note: string | null
          body_completed: boolean | null
          body_note: string | null
          business_completed: boolean | null
          business_note: string | null
          created_at: string | null
          date: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_completed?: boolean | null
          balance_note?: string | null
          being_completed?: boolean | null
          being_note?: string | null
          body_completed?: boolean | null
          body_note?: string | null
          business_completed?: boolean | null
          business_note?: string | null
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_completed?: boolean | null
          balance_note?: string | null
          being_completed?: boolean | null
          being_note?: string | null
          body_completed?: boolean | null
          body_note?: string | null
          business_completed?: boolean | null
          business_note?: string | null
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      core4_monthly_missions: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          items: Json | null
          month_year: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          weekly_measurable: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          items?: Json | null
          month_year: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          weekly_measurable?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          items?: Json | null
          month_year?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          weekly_measurable?: string | null
        }
        Relationships: []
      }
      daily_frame_commitments: {
        Row: {
          completed_at: string | null
          core4_domain: string
          created_at: string
          current_state: string
          declared_commitment: string
          flow_session_id: string | null
          frame_date: string
          gratitude_balance: string
          gratitude_being: string
          gratitude_body: string
          gratitude_business: string
          id: string
          if_then_plan: string
          likely_obstacle: string
          measurable_proof: string
          status: string
          target_outcome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          core4_domain: string
          created_at?: string
          current_state?: string
          declared_commitment?: string
          flow_session_id?: string | null
          frame_date?: string
          gratitude_balance?: string
          gratitude_being?: string
          gratitude_body?: string
          gratitude_business?: string
          id?: string
          if_then_plan?: string
          likely_obstacle?: string
          measurable_proof?: string
          status?: string
          target_outcome?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          core4_domain?: string
          created_at?: string
          current_state?: string
          declared_commitment?: string
          flow_session_id?: string | null
          frame_date?: string
          gratitude_balance?: string
          gratitude_being?: string
          gratitude_body?: string
          gratitude_business?: string
          id?: string
          if_then_plan?: string
          likely_obstacle?: string
          measurable_proof?: string
          status?: string
          target_outcome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_frame_commitments_flow_session_id_fkey"
            columns: ["flow_session_id"]
            isOneToOne: false
            referencedRelation: "flow_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      directive_applications: {
        Row: {
          agency_name: string | null
          cell_phone: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
        }
        Insert: {
          agency_name?: string | null
          cell_phone?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
        }
        Update: {
          agency_name?: string | null
          cell_phone?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
        }
        Relationships: []
      }
      flow_challenge_logs: {
        Row: {
          ai_challenge: string | null
          created_at: string | null
          id: string
          original_response: string | null
          question_id: string
          revised_response: string | null
          session_id: string
          user_action: string | null
        }
        Insert: {
          ai_challenge?: string | null
          created_at?: string | null
          id?: string
          original_response?: string | null
          question_id: string
          revised_response?: string | null
          session_id: string
          user_action?: string | null
        }
        Update: {
          ai_challenge?: string | null
          created_at?: string | null
          id?: string
          original_response?: string | null
          question_id?: string
          revised_response?: string | null
          session_id?: string
          user_action?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_challenge_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "flow_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_profiles: {
        Row: {
          accountability_style: string | null
          background_notes: string | null
          core_values: string[] | null
          created_at: string | null
          current_challenges: string | null
          current_goals: string | null
          faith_tradition: string | null
          feedback_preference: string | null
          full_name: string | null
          growth_edge: string | null
          id: string
          life_roles: string[] | null
          overwhelm_response: string | null
          peak_state: string | null
          preferred_name: string | null
          spiritual_beliefs: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accountability_style?: string | null
          background_notes?: string | null
          core_values?: string[] | null
          created_at?: string | null
          current_challenges?: string | null
          current_goals?: string | null
          faith_tradition?: string | null
          feedback_preference?: string | null
          full_name?: string | null
          growth_edge?: string | null
          id?: string
          life_roles?: string[] | null
          overwhelm_response?: string | null
          peak_state?: string | null
          preferred_name?: string | null
          spiritual_beliefs?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accountability_style?: string | null
          background_notes?: string | null
          core_values?: string[] | null
          created_at?: string | null
          current_challenges?: string | null
          current_goals?: string | null
          faith_tradition?: string | null
          feedback_preference?: string | null
          full_name?: string | null
          growth_edge?: string | null
          id?: string
          life_roles?: string[] | null
          overwhelm_response?: string | null
          peak_state?: string | null
          preferred_name?: string | null
          spiritual_beliefs?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flow_sessions: {
        Row: {
          agent_metadata: Json | null
          ai_analysis_json: Json | null
          completed_at: string | null
          created_at: string | null
          current_question_id: string | null
          domain: string | null
          flow_template_id: string
          id: string
          pdf_url: string | null
          responses_json: Json
          session_token: string
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_metadata?: Json | null
          ai_analysis_json?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_question_id?: string | null
          domain?: string | null
          flow_template_id: string
          id?: string
          pdf_url?: string | null
          responses_json?: Json
          session_token?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_metadata?: Json | null
          ai_analysis_json?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_question_id?: string | null
          domain?: string | null
          flow_template_id?: string
          id?: string
          pdf_url?: string | null
          responses_json?: Json
          session_token?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_sessions_flow_template_id_fkey"
            columns: ["flow_template_id"]
            isOneToOne: false
            referencedRelation: "flow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_templates: {
        Row: {
          ai_analysis_prompt: string | null
          ai_challenge_enabled: boolean | null
          ai_challenge_intensity: string | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          questions_json: Json
          slug: string
          updated_at: string | null
        }
        Insert: {
          ai_analysis_prompt?: string | null
          ai_challenge_enabled?: boolean | null
          ai_challenge_intensity?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          questions_json?: Json
          slug: string
          updated_at?: string | null
        }
        Update: {
          ai_analysis_prompt?: string | null
          ai_challenge_enabled?: boolean | null
          ai_challenge_intensity?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          questions_json?: Json
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      focus_items: {
        Row: {
          column_order: number
          column_status: string
          completed: boolean
          completed_at: string | null
          completion_feeling: string | null
          completion_proof: string | null
          created_at: string
          description: string | null
          domain: string | null
          id: string
          priority_level: string
          scheduled_date: string | null
          scheduled_time: string | null
          source_name: string | null
          source_session_id: string | null
          source_type: string | null
          sub_tag_id: string | null
          title: string
          updated_at: string
          user_id: string
          week_key: string | null
          zone: string
        }
        Insert: {
          column_order?: number
          column_status?: string
          completed?: boolean
          completed_at?: string | null
          completion_feeling?: string | null
          completion_proof?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          priority_level?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          source_name?: string | null
          source_session_id?: string | null
          source_type?: string | null
          sub_tag_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          week_key?: string | null
          zone?: string
        }
        Update: {
          column_order?: number
          column_status?: string
          completed?: boolean
          completed_at?: string | null
          completion_feeling?: string | null
          completion_proof?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          priority_level?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          source_name?: string | null
          source_session_id?: string | null
          source_type?: string | null
          sub_tag_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          week_key?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_items_source_session_id_fkey"
            columns: ["source_session_id"]
            isOneToOne: false
            referencedRelation: "flow_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_items_sub_tag_id_fkey"
            columns: ["sub_tag_id"]
            isOneToOne: false
            referencedRelation: "playbook_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      life_targets_brainstorm: {
        Row: {
          clarity_score: number | null
          created_at: string
          domain: string
          id: string
          is_primary: boolean | null
          is_selected: boolean | null
          quarter: string
          rewritten_target: string | null
          session_id: string | null
          target_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clarity_score?: number | null
          created_at?: string
          domain: string
          id?: string
          is_primary?: boolean | null
          is_selected?: boolean | null
          quarter: string
          rewritten_target?: string | null
          session_id?: string | null
          target_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clarity_score?: number | null
          created_at?: string
          domain?: string
          id?: string
          is_primary?: boolean | null
          is_selected?: boolean | null
          quarter?: string
          rewritten_target?: string | null
          session_id?: string | null
          target_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      life_targets_quarterly: {
        Row: {
          balance_action_pool: Json | null
          balance_daily_actions: Json | null
          balance_daily_habit: string | null
          balance_monthly_missions: Json | null
          balance_narrative: string | null
          balance_narrative2: string | null
          balance_primary_is_target1: boolean | null
          balance_target: string | null
          balance_target2: string | null
          being_action_pool: Json | null
          being_daily_actions: Json | null
          being_daily_habit: string | null
          being_monthly_missions: Json | null
          being_narrative: string | null
          being_narrative2: string | null
          being_primary_is_target1: boolean | null
          being_target: string | null
          being_target2: string | null
          body_action_pool: Json | null
          body_daily_actions: Json | null
          body_daily_habit: string | null
          body_monthly_missions: Json | null
          body_narrative: string | null
          body_narrative2: string | null
          body_primary_is_target1: boolean | null
          body_target: string | null
          body_target2: string | null
          business_action_pool: Json | null
          business_daily_actions: Json | null
          business_daily_habit: string | null
          business_monthly_missions: Json | null
          business_narrative: string | null
          business_narrative2: string | null
          business_primary_is_target1: boolean | null
          business_target: string | null
          business_target2: string | null
          created_at: string
          id: string
          quarter: string
          raw_session_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_action_pool?: Json | null
          balance_daily_actions?: Json | null
          balance_daily_habit?: string | null
          balance_monthly_missions?: Json | null
          balance_narrative?: string | null
          balance_narrative2?: string | null
          balance_primary_is_target1?: boolean | null
          balance_target?: string | null
          balance_target2?: string | null
          being_action_pool?: Json | null
          being_daily_actions?: Json | null
          being_daily_habit?: string | null
          being_monthly_missions?: Json | null
          being_narrative?: string | null
          being_narrative2?: string | null
          being_primary_is_target1?: boolean | null
          being_target?: string | null
          being_target2?: string | null
          body_action_pool?: Json | null
          body_daily_actions?: Json | null
          body_daily_habit?: string | null
          body_monthly_missions?: Json | null
          body_narrative?: string | null
          body_narrative2?: string | null
          body_primary_is_target1?: boolean | null
          body_target?: string | null
          body_target2?: string | null
          business_action_pool?: Json | null
          business_daily_actions?: Json | null
          business_daily_habit?: string | null
          business_monthly_missions?: Json | null
          business_narrative?: string | null
          business_narrative2?: string | null
          business_primary_is_target1?: boolean | null
          business_target?: string | null
          business_target2?: string | null
          created_at?: string
          id?: string
          quarter: string
          raw_session_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_action_pool?: Json | null
          balance_daily_actions?: Json | null
          balance_daily_habit?: string | null
          balance_monthly_missions?: Json | null
          balance_narrative?: string | null
          balance_narrative2?: string | null
          balance_primary_is_target1?: boolean | null
          balance_target?: string | null
          balance_target2?: string | null
          being_action_pool?: Json | null
          being_daily_actions?: Json | null
          being_daily_habit?: string | null
          being_monthly_missions?: Json | null
          being_narrative?: string | null
          being_narrative2?: string | null
          being_primary_is_target1?: boolean | null
          being_target?: string | null
          being_target2?: string | null
          body_action_pool?: Json | null
          body_daily_actions?: Json | null
          body_daily_habit?: string | null
          body_monthly_missions?: Json | null
          body_narrative?: string | null
          body_narrative2?: string | null
          body_primary_is_target1?: boolean | null
          body_target?: string | null
          body_target2?: string | null
          business_action_pool?: Json | null
          business_daily_actions?: Json | null
          business_daily_habit?: string | null
          business_monthly_missions?: Json | null
          business_narrative?: string | null
          business_narrative2?: string | null
          business_primary_is_target1?: boolean | null
          business_target?: string | null
          business_target2?: string | null
          created_at?: string
          id?: string
          quarter?: string
          raw_session_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      member_emails: {
        Row: {
          created_at: string
          email: string
          error: string | null
          id: string
          kind: string
          member_id: string
          ref_key: string
          resend_id: string | null
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          error?: string | null
          id?: string
          kind: string
          member_id: string
          ref_key: string
          resend_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          error?: string | null
          id?: string
          kind?: string
          member_id?: string
          ref_key?: string
          resend_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_emails_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      mirror_drip_sends: {
        Row: {
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string
          day_offset: number
          email: string
          id: string
          resend_id: string | null
          scheduled_at: string | null
          send_error: string | null
          status: string
          submission_id: string
          tier: string
          weakest_pillar: string
        }
        Insert: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          day_offset: number
          email: string
          id?: string
          resend_id?: string | null
          scheduled_at?: string | null
          send_error?: string | null
          status?: string
          submission_id: string
          tier: string
          weakest_pillar: string
        }
        Update: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          day_offset?: number
          email?: string
          id?: string
          resend_id?: string | null
          scheduled_at?: string | null
          send_error?: string | null
          status?: string
          submission_id?: string
          tier?: string
          weakest_pillar?: string
        }
        Relationships: [
          {
            foreignKeyName: "mirror_drip_sends_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "mirror_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      mirror_submissions: {
        Row: {
          carrier: string
          created_at: string
          device_type: string | null
          email: string
          fbclid: string | null
          full_name: string
          gclid: string | null
          id: string
          landing_path: string | null
          phone: string
          pillar_scores: Json
          question_scores: Json
          referrer: string | null
          tier: string
          total_score: number
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          weakest_pillar: string
        }
        Insert: {
          carrier: string
          created_at?: string
          device_type?: string | null
          email: string
          fbclid?: string | null
          full_name: string
          gclid?: string | null
          id?: string
          landing_path?: string | null
          phone: string
          pillar_scores: Json
          question_scores: Json
          referrer?: string | null
          tier: string
          total_score: number
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          weakest_pillar: string
        }
        Update: {
          carrier?: string
          created_at?: string
          device_type?: string | null
          email?: string
          fbclid?: string | null
          full_name?: string
          gclid?: string | null
          id?: string
          landing_path?: string | null
          phone?: string
          pillar_scores?: Json
          question_scores?: Json
          referrer?: string | null
          tier?: string
          total_score?: number
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          weakest_pillar?: string
        }
        Relationships: []
      }
      playbook_tags: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      theta_affirmations: {
        Row: {
          approved: boolean
          category: string
          created_at: string
          edited: boolean
          id: string
          order_index: number | null
          session_id: string
          target_id: string | null
          text: string
          tone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          category: string
          created_at?: string
          edited?: boolean
          id?: string
          order_index?: number | null
          session_id: string
          target_id?: string | null
          text: string
          tone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          category?: string
          created_at?: string
          edited?: boolean
          id?: string
          order_index?: number | null
          session_id?: string
          target_id?: string | null
          text?: string
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theta_affirmations_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "theta_targets"
            referencedColumns: ["id"]
          },
        ]
      }
      theta_targets: {
        Row: {
          balance: string | null
          being: string | null
          body: string | null
          business: string | null
          created_at: string
          id: string
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: string | null
          being?: string | null
          body?: string | null
          business?: string | null
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: string | null
          being?: string | null
          body?: string | null
          business?: string | null
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      theta_tracks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          error_message: string | null
          id: string
          session_id: string
          status: string
          user_id: string
          voice_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          error_message?: string | null
          id?: string
          session_id: string
          status: string
          user_id: string
          voice_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          error_message?: string | null
          id?: string
          session_id?: string
          status?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          analysis_generation_completed_at: string | null
          analysis_generation_started_at: string | null
          coaching_analysis: string | null
          completed_at: string | null
          core4_points: number
          created_at: string | null
          current_step: number
          domain_reflections: Json | null
          flow_points: number
          gratitude_note: string | null
          id: string
          next_week_one_big_thing: string | null
          playbook_points: number
          status: string
          total_points: number
          updated_at: string | null
          user_id: string
          week_key: string
        }
        Insert: {
          analysis_generation_completed_at?: string | null
          analysis_generation_started_at?: string | null
          coaching_analysis?: string | null
          completed_at?: string | null
          core4_points?: number
          created_at?: string | null
          current_step?: number
          domain_reflections?: Json | null
          flow_points?: number
          gratitude_note?: string | null
          id?: string
          next_week_one_big_thing?: string | null
          playbook_points?: number
          status?: string
          total_points?: number
          updated_at?: string | null
          user_id: string
          week_key: string
        }
        Update: {
          analysis_generation_completed_at?: string | null
          analysis_generation_started_at?: string | null
          coaching_analysis?: string | null
          completed_at?: string | null
          core4_points?: number
          created_at?: string | null
          current_step?: number
          domain_reflections?: Json | null
          flow_points?: number
          gratitude_note?: string | null
          id?: string
          next_week_one_big_thing?: string | null
          playbook_points?: number
          status?: string
          total_points?: number
          updated_at?: string | null
          user_id?: string
          week_key?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_power_play_count: {
        Args: { p_date?: string; p_exclude_id?: string; p_user_id?: string }
        Returns: number
      }
      is_active_member: { Args: { uid: string }; Returns: boolean }
      is_admin_member: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
