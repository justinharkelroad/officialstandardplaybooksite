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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
