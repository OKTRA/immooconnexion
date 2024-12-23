import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pmgymlbyebdqfwkovwvd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ3ltbGJ5ZWJkcWZ3a292d3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDUwOTksImV4cCI6MjA1MDEyMTA5OX0.s4-gUjINoe_VRE4nK-weSEidm5JjEJThJFDKzQgtmfk";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web'
      }
    }
  }
);