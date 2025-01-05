import { supabase } from "@/integrations/supabase/client"

const getSupabaseSessionKey = () => {
  return `sb-apidxwaaogboeoctlhtz-auth-token`
}

const clearSession = () => {
  localStorage.removeItem(getSupabaseSessionKey())
}

const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      clearSession()
      return null
    }
    return session
  } catch (error) {
    console.error('Error checking session:', error)
    clearSession()
    return null
  }
}

export { getSupabaseSessionKey, clearSession, checkSession }