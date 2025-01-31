import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://apidxwaaogboeoctlhtz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWR4d2Fhb2dib2VvY3RsaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3MzQwMDAsImV4cCI6MjAyMjMxMDAwMH0.SZEpxWSO2Ef4mFHQo_1_7DAtAP4qXxbVTXgEhLwGYbw'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})