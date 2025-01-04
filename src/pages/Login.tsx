import { PublicHeader } from "@/components/layout/PublicHeader"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

const Login = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<"sign_in" | "forgotten_password">("sign_in")
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
        <Card className="w-[90%] max-w-[320px] shadow-lg bg-white/90 backdrop-blur-sm border-0 rounded-lg overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-semibold text-center">Connexion</CardTitle>
            <CardDescription className="text-center text-sm">
              Bienvenue sur votre espace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#517fa4",
                      brandAccent: "#243949",
                    },
                  },
                },
                className: {
                  container: "space-y-3",
                  button: "w-full bg-gradient-to-r from-[#243949] to-[#517fa4] hover:from-[#2c4456] hover:to-[#5c8fb8] text-white font-medium py-2 px-4 rounded-md transition-all duration-200",
                  label: "block text-sm font-medium text-gray-700",
                  input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#517fa4] focus:ring-[#517fa4] sm:text-sm",
                  anchor: "text-sm text-[#517fa4] hover:text-[#243949] transition-colors",
                },
              }}
              theme="light"
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "Se connecter",
                    loading_button_label: "Connexion...",
                  },
                  forgotten_password: {
                    link_text: "Mot de passe oublié ?",
                    button_label: "Réinitialiser",
                    email_label: "Email",
                    password_label: "Nouveau mot de passe",
                    confirmation_text: "Vérifiez vos emails",
                  },
                },
              }}
              view={view}
              showLinks={false}
              redirectTo={window.location.origin}
              onlyThirdPartyProviders={false}
              magicLink={false}
            />
            {view === "sign_in" && (
              <div className="text-center mt-3">
                <button 
                  onClick={() => setView("forgotten_password")}
                  className="text-sm text-[#517fa4] hover:text-[#243949] transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}
            {view === "forgotten_password" && (
              <div className="text-center mt-3">
                <button 
                  onClick={() => setView("sign_in")}
                  className="text-sm text-[#517fa4] hover:text-[#243949] transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={showWarning} onOpenChange={handleWarningClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Avertissement Important</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Bienvenue sur notre plateforme. Avant de continuer, veuillez prendre note des points suivants :
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Toute utilisation malveillante de la plateforme entraînera la suspension immédiate de votre compte</li>
                  <li>En cas de non-respect des conditions d'utilisation, votre compte sera bloqué sans possibilité de remboursement</li>
                  <li>Vous êtes responsable de toutes les actions effectuées depuis votre compte</li>
                </ul>
                <p className="font-semibold mt-4">
                  En continuant, vous acceptez ces conditions.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleWarningClose}>
                J'ai compris et j'accepte
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default Login