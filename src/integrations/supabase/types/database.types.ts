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
          statut: string
          start_date: string | null
          end_date: string | null
          agency_id: string | null
          created_at: string
          updated_at: string
          created_by_user_id: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          tenant_id?: string | null
          montant: number
          type: string
          statut?: string
          start_date?: string | null
          end_date?: string | null
          agency_id?: string | null
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          tenant_id?: string | null
          montant?: number
          type?: string
          statut?: string
          start_date?: string | null
          end_date?: string | null
          agency_id?: string | null
          created_at?: string
          updated_at?: string
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
          role: string
          agency_id: string | null
          created_at: string
          updated_at: string
          status: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone_number?: string | null
          role?: string
          agency_id?: string | null
          created_at?: string
          updated_at?: string
          status?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone_number?: string | null
          role?: string
          agency_id?: string | null
          created_at?: string
          updated_at?: string
          status?: string
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
          created_at: string
          updated_at: string
          created_by_user_id: string | null
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
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
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
          created_at?: string
          updated_at?: string
          created_by_user_id?: string | null
          property_category?: string
          owner_name?: string | null
          owner_phone?: string | null
          country?: string | null
          quartier?: string | null
        }
      }
    }
  }
}