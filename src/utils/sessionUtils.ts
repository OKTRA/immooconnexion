import { supabase } from "@/integrations/supabase/client"

export const getSupabaseSessionKey = () => {
  const url = new URL(supabase.supabaseUrl)
  return `sb-${url.host}-auth-token`
}