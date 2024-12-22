import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { AdminLoginForm } from "@/components/admin/AdminLoginForm"

const Login = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("user")

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Bienvenue sur votre espace de gestion immobilière
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Utilisateur</TabsTrigger>
              <TabsTrigger value="admin">Super Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user" className="space-y-4">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#000000",
                        brandAccent: "#333333",
                      },
                    },
                  },
                  className: {
                    container: "space-y-4",
                    button: "w-full",
                    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                    input: "rounded-md border border-gray-300 dark:border-gray-700",
                    anchor: "text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200",
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
                      loading_button_label: "Connexion en cours...",
                    },
                    forgotten_password: {
                      link_text: "Mot de passe oublié ?",
                      button_label: "Réinitialiser le mot de passe",
                      email_label: "Email",
                      password_label: "Nouveau mot de passe",
                      confirmation_text: "Vérifiez vos emails pour réinitialiser votre mot de passe",
                    },
                  },
                }}
                view="sign_in"
                showLinks={true}
                redirectTo={window.location.origin}
                onlyThirdPartyProviders={false}
                magicLink={false}
              />
            </TabsContent>
            <TabsContent value="admin">
              <AdminLoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login