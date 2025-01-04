import { PublicHeader } from "@/components/layout/PublicHeader"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { LoginForm } from "@/components/auth/LoginForm"
import { WarningDialog } from "@/components/auth/WarningDialog"

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkAndClearSession = async () => {
      try {
        setIsLoading(true)
        
        // First, clear any existing session
        await supabase.auth.signOut()
        
        // Clear any stored session data
        localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token')

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session check error:', error)
          if (error.message.includes('Failed to fetch')) {
            toast({
              title: "Erreur de connexion",
              description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
              variant: "destructive"
            })
          }
          return
        }

        if (session) {
          // Vérifier si l'utilisateur est un admin
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role, has_seen_warning')
            .eq('id', session.user.id)
            .single()

          if (profileData?.role === 'admin') {
            if (!profileData.has_seen_warning) {
              setShowWarning(true)
              // Update has_seen_warning to true
              await supabase
                .from('profiles')
                .update({ has_seen_warning: true })
                .eq('id', session.user.id)
            } else {
              navigate("/agence/admin")
            }
          } else {
            navigate("/")
          }
        }
      } catch (error: any) {
        console.error('Session check error:', error)
        toast({
          title: "Erreur d'authentification",
          description: "Une erreur est survenue. Veuillez vous reconnecter.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAndClearSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Vérifier si l'utilisateur est un admin
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, has_seen_warning')
          .eq('id', session.user.id)
          .single()

        if (profileData?.role === 'admin') {
          if (!profileData.has_seen_warning) {
            setShowWarning(true)
            // Update has_seen_warning to true
            await supabase
              .from('profiles')
              .update({ has_seen_warning: true })
              .eq('id', session.user.id)
          } else {
            navigate("/agence/admin")
          }
        } else {
          navigate("/")
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, toast])

  const handleWarningClose = () => {
    setShowWarning(false)
    navigate("/agence/admin")
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
        }}
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PublicHeader />
      <div 
        className="relative min-h-screen flex flex-col items-center justify-center p-4"
        style={{
          background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
        }}
      >
        <LoginForm />
        <WarningDialog open={showWarning} onClose={handleWarningClose} />
      </div>
    </div>
  )
}

export default Login