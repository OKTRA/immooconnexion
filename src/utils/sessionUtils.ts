import { supabase } from "@/integrations/supabase/client"

const getSupabaseSessionKey = () => {
  return `sb-apidxwaaogboeoctlhtz-auth-token`
}

const clearSession = () => {
  // Remove session from localStorage
  localStorage.removeItem(getSupabaseSessionKey())
  
  // Clear any other session-related data
  sessionStorage.clear()
  
  // Clear cookies that might contain session data
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
  })
}

const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error?.message?.includes('session_not_found') || !session) {
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