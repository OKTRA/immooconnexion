export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          created_at: string
          current_profiles_count: number | null
          current_properties_count: number | null
          current_tenants_count: number | null
          id: string
          name: string
          subscription_plan_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_profiles_count?: number | null
          current_properties_count?: number | null
          current_tenants_count?: number | null
          id?: string
          name: string
          subscription_plan_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_profiles_count?: number | null
          current_properties_count?: number | null
          current_tenants_count?: number | null
          id?: string
          name?: string
          subscription_plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agencies_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          agency_id: string
          created_at: string
          deposit_amount: number
          end_date: string
          id: string
          monthly_rent: number
          property_id: string
          start_date: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          deposit_amount: number
          end_date: string
          id?: string
          monthly_rent: number
          property_id: string
          start_date: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          deposit_amount?: number
          end_date?: string
          id?: string
          monthly_rent?: number
          property_id?: string
          start_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          agency_id: string
          created_at: string
          description: string
          id: string
          priority: string
          property_id: string
          resolved_at: string | null
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          property_id: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          property_id?: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          message: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          message: string
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          message?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          agency_id: string
          amount: number
          contract_id: string
          created_at: string
          id: string
          payment_date: string
          payment_method: string | null
          reference_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          amount: number
          contract_id: string
          created_at?: string
          id?: string
          payment_date: string
          payment_method?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          amount?: number
          contract_id?: string
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_id: string
          created_at: string
          email: string
          employee_role: Database["public"]["Enums"]["employee_role"] | null
          first_name: string
          id: string
          last_name: string
          phone_number: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          email: string
          employee_role?: Database["public"]["Enums"]["employee_role"] | null
          first_name: string
          id: string
          last_name: string
          phone_number: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          email?: string
          employee_role?: Database["public"]["Enums"]["employee_role"] | null
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          agency_id: string
          created_at: string
          deposit: number
          id: string
          name: string
          photo_url: string | null
          rent: number
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          agency_id: string
          created_at?: string
          deposit?: number
          id?: string
          name: string
          photo_url?: string | null
          rent?: number
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          agency_id?: string
          created_at?: string
          deposit?: number
          id?: string
          name?: string
          photo_url?: string | null
          rent?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_profiles: number | null
          max_properties: number | null
          max_tenants: number | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_profiles?: number | null
          max_properties?: number | null
          max_tenants?: number | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_profiles?: number | null
          max_properties?: number | null
          max_tenants?: number | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      super_admins: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          agency_fees: number
          agency_id: string
          created_at: string
          deposit: number
          email: string
          first_name: string
          id: string
          last_name: string
          phone_number: string
          photo_url: string | null
          rent: number
          selected_property_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agency_fees?: number
          agency_id: string
          created_at?: string
          deposit?: number
          email: string
          first_name: string
          id?: string
          last_name: string
          phone_number: string
          photo_url?: string | null
          rent?: number
          selected_property_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agency_fees?: number
          agency_id?: string
          created_at?: string
          deposit?: number
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string
          photo_url?: string | null
          rent?: number
          selected_property_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_selected_property_id_fkey"
            columns: ["selected_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employee_role: "manager" | "staff"
      payment_status_type: "pending" | "completed" | "failed" | "refunded"
      user_role: "super_admin" | "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
