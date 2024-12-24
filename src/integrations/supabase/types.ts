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
      administrators: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_super_admin: boolean | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          is_super_admin?: boolean | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_super_admin?: boolean | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      agencies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          list_properties_on_site: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          show_phone_on_site: boolean | null
          subscription_plan_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          list_properties_on_site?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          show_phone_on_site?: boolean | null
          subscription_plan_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          list_properties_on_site?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          show_phone_on_site?: boolean | null
          subscription_plan_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          agency_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          montant: number
          property_id: string
          start_date: string
          statut: string
          tenant_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          montant: number
          property_id: string
          start_date?: string
          statut?: string
          tenant_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          montant?: number
          property_id?: string
          start_date?: string
          statut?: string
          tenant_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          agency_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          montant: number
          property_id: string | null
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          montant: number
          property_id?: string | null
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          montant?: number
          property_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_tenant: boolean | null
          last_name: string
          list_properties_on_site: boolean | null
          password_hash: string | null
          phone_number: string
          role: string
          show_phone_on_site: boolean | null
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          email: string
          first_name: string
          id: string
          is_tenant?: boolean | null
          last_name: string
          list_properties_on_site?: boolean | null
          password_hash?: string | null
          phone_number: string
          role?: string
          show_phone_on_site?: boolean | null
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_tenant?: boolean | null
          last_name?: string
          list_properties_on_site?: boolean | null
          password_hash?: string | null
          phone_number?: string
          role?: string
          show_phone_on_site?: boolean | null
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
          agency_id: string
          bien: string
          caution: number | null
          chambres: number | null
          created_at: string
          frais_agence: number | null
          id: string
          loyer: number | null
          photo_url: string | null
          statut: string | null
          taux_commission: number | null
          type: string
          updated_at: string
          user_id: string | null
          ville: string | null
        }
        Insert: {
          agency_id: string
          bien: string
          caution?: number | null
          chambres?: number | null
          created_at?: string
          frais_agence?: number | null
          id?: string
          loyer?: number | null
          photo_url?: string | null
          statut?: string | null
          taux_commission?: number | null
          type: string
          updated_at?: string
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          agency_id?: string
          bien?: string
          caution?: number | null
          chambres?: number | null
          created_at?: string
          frais_agence?: number | null
          id?: string
          loyer?: number | null
          photo_url?: string | null
          statut?: string | null
          taux_commission?: number | null
          type?: string
          updated_at?: string
          user_id?: string | null
          ville?: string | null
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
      property_inspections: {
        Row: {
          contract_id: string
          created_at: string
          damage_description: string | null
          deposit_returned: number | null
          has_damages: boolean | null
          id: string
          inspection_date: string
          photo_urls: string[] | null
          repair_costs: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          damage_description?: string | null
          deposit_returned?: number | null
          has_damages?: boolean | null
          id?: string
          inspection_date?: string
          photo_urls?: string[] | null
          repair_costs?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          damage_description?: string | null
          deposit_returned?: number | null
          has_damages?: boolean | null
          id?: string
          inspection_date?: string
          photo_urls?: string[] | null
          repair_costs?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_inspections_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_inspections_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "payment_history_with_tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: string[]
          id: string
          max_properties: number
          max_tenants: number
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          features: string[]
          id?: string
          max_properties: number
          max_tenants: number
          name: string
          price: number
        }
        Update: {
          created_at?: string
          features?: string[]
          id?: string
          max_properties?: number
          max_tenants?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      tenants: {
        Row: {
          agency_fees: number | null
          agency_id: string | null
          birth_date: string | null
          created_at: string
          id: string
          nom: string | null
          phone_number: string | null
          photo_id_url: string | null
          prenom: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agency_fees?: number | null
          agency_id?: string | null
          birth_date?: string | null
          created_at?: string
          id: string
          nom?: string | null
          phone_number?: string | null
          photo_id_url?: string | null
          prenom?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agency_fees?: number | null
          agency_id?: string | null
          birth_date?: string | null
          created_at?: string
          id?: string
          nom?: string | null
          phone_number?: string | null
          photo_id_url?: string | null
          prenom?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      payment_history_with_tenant: {
        Row: {
          agency_id: string | null
          created_at: string | null
          end_date: string | null
          id: string | null
          montant: number | null
          property_id: string | null
          property_name: string | null
          start_date: string | null
          statut: string | null
          tenant_id: string | null
          tenant_nom: string | null
          tenant_prenom: string | null
          type: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
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
