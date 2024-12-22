import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    console.log("Setting up auth state change listener")
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session)
      if (session) {
        navigate("/")
      }
    })

    return () => {
      console.log("Cleaning up auth state change listener")
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleError = (error: Error) => {
    console.error("Auth error:", error)
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { background: 'rgb(59 130 246)', color: 'white' },
                anchor: { color: 'rgb(59 130 246)' },
              }
            }}
            theme="light"
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                  loading_button_label: "Connexion en cours...",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login