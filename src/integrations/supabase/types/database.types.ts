export interface Database {
  public: {
    Tables: {
      administrators: {
        Row: {
          id: string
          is_super_admin: boolean
          created_at: string
          updated_at: string
          agency_id: string | null
        }
        Insert: {
          id: string
          is_super_admin?: boolean
          created_at?: string
          updated_at?: string
          agency_id?: string | null
        }
        Update: {
          id?: string
          is_super_admin?: boolean
          created_at?: string
          updated_at?: string
          agency_id?: string | null
        }
      }
      contracts: {
        Row: {
          id: string
          property_id: string | null
          tenant_id: string | null
          montant: number
          type: string
          statut: string | null
          start_date: string | null
          end_date: string | null
          agency_id: string | null
          created_at: string | null
          updated_at: string | null
          created_by_user_id: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          tenant_id?: string | null
          montant: number
          type: string
          statut?: string | null
          start_date?: string | null
          end_date?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          created_by_user_id?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          tenant_id?: string | null
          montant?: number
          type?: string
          statut?: string | null
          start_date?: string | null
          end_date?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          created_by_user_id?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone_number: string | null
          role: string | null
          agency_id: string | null
          created_at: string | null
          updated_at: string | null
          is_tenant: boolean | null
          status: string | null
          has_seen_warning: boolean | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone_number?: string | null
          role?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_tenant?: boolean | null
          status?: string | null
          has_seen_warning?: boolean | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone_number?: string | null
          role?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_tenant?: boolean | null
          status?: string | null
          has_seen_warning?: boolean | null
        }
      }
      properties: {
        Row: {
          id: string
          bien: string
          type: string
          chambres: number | null
          ville: string | null
          loyer: number | null
          frais_agence: number | null
          taux_commission: number | null
          caution: number | null
          photo_url: string | null
          statut: string | null
          user_id: string | null
          agency_id: string | null
          created_at: string | null
          updated_at: string | null
          created_by_user_id: string | null
          parent_property_id: string | null
          rental_type: string | null
          property_category: string
          owner_name: string | null
          owner_phone: string | null
          country: string | null
          quartier: string | null
        }
        Insert: {
          id?: string
          bien: string
          type: string
          chambres?: number | null
          ville?: string | null
          loyer?: number | null
          frais_agence?: number | null
          taux_commission?: number | null
          caution?: number | null
          photo_url?: string | null
          statut?: string | null
          user_id?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          created_by_user_id?: string | null
          parent_property_id?: string | null
          rental_type?: string | null
          property_category: string
          owner_name?: string | null
          owner_phone?: string | null
          country?: string | null
          quartier?: string | null
        }
        Update: {
          id?: string
          bien?: string
          type?: string
          chambres?: number | null
          ville?: string | null
          loyer?: number | null
          frais_agence?: number | null
          taux_commission?: number | null
          caution?: number | null
          photo_url?: string | null
          statut?: string | null
          user_id?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          created_by_user_id?: string | null
          parent_property_id?: string | null
          rental_type?: string | null
          property_category?: string
          owner_name?: string | null
          owner_phone?: string | null
          country?: string | null
          quartier?: string | null
        }
      }
      tenants: {
        Row: {
          id: string
          first_name: string
          last_name: string
          birth_date: string | null
          phone_number: string | null
          photo_id_url: string | null
          agency_fees: number | null
          user_id: string | null
          agency_id: string | null
          created_at: string | null
          updated_at: string | null
          profession: string | null
          created_by_user_id: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          birth_date?: string | null
          phone_number?: string | null
          photo_id_url?: string | null
          agency_fees?: number | null
          user_id?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          profession?: string | null
          created_by_user_id?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          birth_date?: string | null
          phone_number?: string | null
          photo_id_url?: string | null
          agency_fees?: number | null
          user_id?: string | null
          agency_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          profession?: string | null
          created_by_user_id?: string | null
        }
      }
    }
  }
}