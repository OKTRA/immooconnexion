import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://apidxwaaogboeoctlhtz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWR4d2Fhb2dib2VvY3RsaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNjgzMjIsImV4cCI6MjA1MDY0NDMyMn0.yMVZWGae0Wtkq1l49Na9kE02SCV0ul_oT91nspJ1dM0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

export { supabaseUrl };