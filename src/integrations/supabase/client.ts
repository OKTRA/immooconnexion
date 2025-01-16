import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://apidxwaaogboeoctlhtz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWR4d2Fhb2dib2VvY3RsaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjE1MTgsImV4cCI6MjAxODQ5NzUxOH0.xp6GWmGcTVgNJH-Qb_pu8KeQzrRBEVoqVGzXhPwUVXI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: localStorage,
    storageKey: 'sb-apidxwaaogboeoctlhtz-auth-token',
    flowType: 'pkce'
  },
  global: {
    headers: { 'x-client-info': 'supabase-js-web' }
  }
});

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Delete all supabase data from storage on sign out
    localStorage.removeItem('sb-apidxwaaogboeoctlhtz-auth-token');
  }
});