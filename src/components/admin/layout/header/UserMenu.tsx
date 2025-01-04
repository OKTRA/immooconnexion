import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserAvatar } from "./UserAvatar"
import { ThemeToggle } from "./ThemeToggle"
import { LogoutButton } from "./LogoutButton"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSessionChecked, setIsSessionChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID
          localStorage.removeItem(`sb-${projectId}-auth-token`)
          navigate("/agence/login")
          return
        }
        setIsSessionChecked(true)
      } catch (error) {
        console.error('Auth check error:', error)
        navigate("/agence/login")
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session || event === 'SIGNED_OUT') {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID
        localStorage.removeItem(`sb-${projectId}-auth-token`)
        navigate("/agence/login")
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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (error) throw error
        return data
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        return null
      }
    },
    enabled: isSessionChecked,
    retry: false,
    meta: {
      errorMessage: "Failed to fetch user profile"
    }
  })

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <UserAvatar profile={profile} />
        <ThemeToggle />
        <LogoutButton />
      </div>
    </TooltipProvider>
  )
}