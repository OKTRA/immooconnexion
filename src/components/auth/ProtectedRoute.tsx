import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    let mounted = true

    const clearSession = async () => {
      try {
        await supabase.auth.signOut()
        localStorage.clear() // Nettoie tout le localStorage
        if (mounted) {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Erreur lors du nettoyage de la session:", error)
      }
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          await clearSession()
          return
        }

        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          await clearSession()
          return
        }

        if (mounted) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error)
        await clearSession()
      }
    }

    // Vérification initiale
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        await clearSession()
        return
      }
      
      if (mounted) {
        await checkAuth()
      }
    })

    return () => {
      mounted = false
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
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}