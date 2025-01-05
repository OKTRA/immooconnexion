import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { clearSession } from "@/utils/sessionUtils"
import { useToast } from "@/hooks/use-toast"
import { LogoutButton } from "./LogoutButton"

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSessionChecked, setIsSessionChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          clearSession()
          navigate("/login")
          return
        }
        
        // Verify the session is still valid
        const { error: userError } = await supabase.auth.getUser()
        if (userError && userError.message !== "session_not_found") {
          console.error('User verification error:', userError)
          clearSession()
          navigate("/login")
          return
        }
        
        setIsSessionChecked(true)
      } catch (error) {
        console.error('Auth check error:', error)
        clearSession()
        navigate("/login")
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        clearSession()
        navigate("/login")
        return
      }
      
      if (event === 'TOKEN_REFRESHED' && !session) {
        clearSession()
        navigate("/login")
        return
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          clearSession()
          throw new Error('No user found')
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (error) {
          console.error('Profile fetch error:', error)
          throw error
        }
        return data
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        clearSession()
        navigate("/login")
        return null
      }
    },
    enabled: isSessionChecked
  })

  if (!isSessionChecked) {
    return null
  }

  return <LogoutButton />
}