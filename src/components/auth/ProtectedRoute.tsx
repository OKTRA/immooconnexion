import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { supabase, clearSession } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !sessionData.session) {
          clearSession()
          setIsAuthenticated(false)
          return
        }

        // Verify the user exists
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          clearSession()
          await supabase.auth.signOut()
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        clearSession()
        setIsAuthenticated(false)
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter",
          variant: "destructive"
        })
      }
    }

    // Initial check
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        clearSession()
        setIsAuthenticated(false)
        return
      }
      
      setIsAuthenticated(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/agence/login" replace />
  }

  return <Outlet />
}