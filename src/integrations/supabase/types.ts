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
          created_at: string | null
          id: string
          is_super_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_super_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agencies: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          list_properties_on_site: boolean | null
          name: string
          phone: string | null
          show_phone_on_site: boolean | null
          subscription_plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          list_properties_on_site?: boolean | null
          name: string
          phone?: string | null
          show_phone_on_site?: boolean | null
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          list_properties_on_site?: boolean | null
          name?: string
          phone?: string | null
          show_phone_on_site?: boolean | null
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          agency_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          montant: number
          property_id: string | null
          start_date: string | null
          statut: string | null
          tenant_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          montant: number
          property_id?: string | null
          start_date?: string | null
          statut?: string | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          montant?: number
          property_id?: string | null
          start_date?: string | null
          statut?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
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
      expenses: {
        Row: {
          agency_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          montant: number
          property_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          montant: number
          property_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          montant?: number
          property_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
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
          agency_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          agency_id: string | null
          bien: string
          caution: number | null
          chambres: number | null
          created_at: string | null
          frais_agence: number | null
          id: string
          loyer: number | null
          photo_url: string | null
          statut: string | null
          taux_commission: number | null
          type: string
          updated_at: string | null
          user_id: string | null
          ville: string | null
        }
        Insert: {
          agency_id?: string | null
          bien: string
          caution?: number | null
          chambres?: number | null
          created_at?: string | null
          frais_agence?: number | null
          id?: string
          loyer?: number | null
          photo_url?: string | null
          statut?: string | null
          taux_commission?: number | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          agency_id?: string | null
          bien?: string
          caution?: number | null
          chambres?: number | null
          created_at?: string | null
          frais_agence?: number | null
          id?: string
          loyer?: number | null
          photo_url?: string | null
          statut?: string | null
          taux_commission?: number | null
          type?: string
          updated_at?: string | null
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
          contract_id: string | null
          created_at: string | null
          damage_description: string | null
          deposit_returned: number | null
          has_damages: boolean | null
          id: string
          inspection_date: string | null
          photo_urls: string[] | null
          repair_costs: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          damage_description?: string | null
          deposit_returned?: number | null
          has_damages?: boolean | null
          id?: string
          inspection_date?: string | null
          photo_urls?: string[] | null
          repair_costs?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          damage_description?: string | null
          deposit_returned?: number | null
          has_damages?: boolean | null
          id?: string
          inspection_date?: string | null
          photo_urls?: string[] | null
          repair_costs?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inspections_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: string[] | null
          id: string
          max_properties: number | null
          max_tenants: number | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          max_properties?: number | null
          max_tenants?: number | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          max_properties?: number | null
          max_tenants?: number | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          agency_fees: number | null
          agency_id: string | null
          birth_date: string | null
          created_at: string | null
          id: string
          nom: string
          phone_number: string | null
          photo_id_url: string | null
          prenom: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agency_fees?: number | null
          agency_id?: string | null
          birth_date?: string | null
          created_at?: string | null
          id?: string
          nom: string
          phone_number?: string | null
          photo_id_url?: string | null
          prenom: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agency_fees?: number | null
          agency_id?: string | null
          birth_date?: string | null
          created_at?: string | null
          id?: string
          nom?: string
          phone_number?: string | null
          photo_id_url?: string | null
          prenom?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
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
