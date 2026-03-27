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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      registrations: {
        Row: {
          authorization_letter_path: string | null
          certification_page_path: string | null
          created_at: string
          date_of_birth: string
          department: string
          faculty: string
          full_name: string
          hod_email: string
          hod_full_name: string
          hod_phone: string
          hod_title: string
          id: string
          institution: string
          local_government: string
          marital_status: string
          matriculation_number: string
          nationality: string
          nin: string
          nin_document_path: string | null
          nin_document_type: string | null
          nok_email: string
          nok_name: string
          nok_phone: string
          passport_photo_path: string | null
          payment_receipt_path: string | null
          payment_status: string
          phone_number: string
          programme_category: string
          programme_type: string
          project_file_paths: string[] | null
          project_title: string
          residential_address: string
          sex: string
          state_of_origin: string
          student_email: string | null
          supervisor_email: string
          supervisor_full_name: string
          supervisor_phone: string
          supervisor_title: string
          town_city: string
          updated_at: string
          user_id: string
        }
        Insert: {
          authorization_letter_path?: string | null
          certification_page_path?: string | null
          created_at?: string
          date_of_birth: string
          department: string
          faculty: string
          full_name: string
          hod_email: string
          hod_full_name: string
          hod_phone: string
          hod_title: string
          id?: string
          institution: string
          local_government: string
          marital_status: string
          matriculation_number: string
          nationality: string
          nin: string
          nin_document_path?: string | null
          nin_document_type?: string | null
          nok_email: string
          nok_name: string
          nok_phone: string
          passport_photo_path?: string | null
          payment_receipt_path?: string | null
          payment_status?: string
          phone_number: string
          programme_category: string
          programme_type: string
          project_file_paths?: string[] | null
          project_title: string
          residential_address: string
          sex: string
          state_of_origin: string
          student_email?: string | null
          supervisor_email: string
          supervisor_full_name: string
          supervisor_phone: string
          supervisor_title: string
          town_city: string
          updated_at?: string
          user_id: string
        }
        Update: {
          authorization_letter_path?: string | null
          certification_page_path?: string | null
          created_at?: string
          date_of_birth?: string
          department?: string
          faculty?: string
          full_name?: string
          hod_email?: string
          hod_full_name?: string
          hod_phone?: string
          hod_title?: string
          id?: string
          institution?: string
          local_government?: string
          marital_status?: string
          matriculation_number?: string
          nationality?: string
          nin?: string
          nin_document_path?: string | null
          nin_document_type?: string | null
          nok_email?: string
          nok_name?: string
          nok_phone?: string
          passport_photo_path?: string | null
          payment_receipt_path?: string | null
          payment_status?: string
          phone_number?: string
          programme_category?: string
          programme_type?: string
          project_file_paths?: string[] | null
          project_title?: string
          residential_address?: string
          sex?: string
          state_of_origin?: string
          student_email?: string | null
          supervisor_email?: string
          supervisor_full_name?: string
          supervisor_phone?: string
          supervisor_title?: string
          town_city?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
