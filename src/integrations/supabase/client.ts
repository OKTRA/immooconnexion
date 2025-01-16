import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://apidxwaaogboeoctlhtz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWR4d2Fhb2dib2VvY3RsaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjE1MTgsImV4cCI6MjAxODQ5NzUxOH0.xp6GWmGcTVgNJH-Qb_pu8KeQzrRBEVoqVGzXhPwUVXI'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-apidxwaaogboeoctlhtz-auth-token'
  }
})

// Add proper TypeScript interfaces for database schema
export interface ContractWithProperties {
  id: string
  property_id: string
  montant: number
  type: string
  created_at: string
  agency_id: string | null
  properties: {
    bien: string
    frais_agence: number | null
    taux_commission: number | null
  }
}

export interface Property {
  id: string
  bien: string
  type: string
  chambres?: number
  ville?: string
  loyer?: number
  agency?: {
    name: string
    address: string
  }
}

export interface SubscriptionPlan {
  id: string
  name: string
  max_properties: number
  max_tenants: number
  max_users: number
  features: string[]
}

export interface Tenant {
  id: string
  nom: string
  prenom: string
  bien?: string
}

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('sb-apidxwaaogboeoctlhtz-auth-token')
  }
})