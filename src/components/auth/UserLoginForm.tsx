import { useState } from "react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function UserLoginForm() {
  const [view, setView] = useState<"sign_in" | "forgotten_password">("sign_in")
  const { toast } = useToast()

  return (
    <div className="space-y-4">
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
            button: "w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition-colors",
            label: "block text-sm font-medium text-gray-700",
            input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm",
            anchor: "text-sm text-gray-600 hover:text-gray-900",
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
        view={view}
        showLinks={false}
      />
      {view === "sign_in" && (
        <div className="text-center mt-4">
          <button 
            onClick={() => setView("forgotten_password")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Mot de passe oublié ?
          </button>
        </div>
      )}
      {view === "forgotten_password" && (
        <div className="text-center mt-4">
          <button 
            onClick={() => setView("sign_in")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Retour à la connexion
          </button>
        </div>
      )}
    </div>
  )
}