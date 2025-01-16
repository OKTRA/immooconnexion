import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://apidxwaaogboeoctlhtz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWR4d2Fhb2dib2VvY3RsaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjE1MTgsImV4cCI6MjAxODQ5NzUxOH0.xp6GWmGcTVgNJH-Qb_pu8KeQzrRBEVoqVGzXhPwUVXI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: localStorage,
    storageKey: 'sb-apidxwaaogboeoctlhtz-auth-token'
  }
})

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('sb-apidxwaaogboeoctlhtz-auth-token')
  }
})

// Define proper TypeScript interfaces for our database schema
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          bien: string
          taux_commission: number
          type: string
          statut: string
          agency_id: string | null
        }
      }
      agencies: {
        Row: {
          id: string
          name: string
          address: string | null
          status: string
          list_properties_on_site: boolean
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          max_properties: number
          max_tenants: number
          max_users: number
          features: string[]
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          agency_id: string | null
        }
      }
      tenants: {
        Row: {
          id: string
          nom: string
          prenom: string
          agency_id: string | null
        }
      }
    }
  }
}