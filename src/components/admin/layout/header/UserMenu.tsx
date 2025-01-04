import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserAvatar } from "./UserAvatar"
import { ThemeToggle } from "./ThemeToggle"
import { LogoutButton } from "./LogoutButton"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export function UserMenu() {
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No session')
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()

      return data
    },
    retry: false,
    meta: {
      errorMessage: "Failed to fetch user profile"
    }
  })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/super-admin/login")
      }
    }
    checkSession()
  }, [navigate])

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