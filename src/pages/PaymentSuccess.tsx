import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PaymentSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error)
        navigate("/login")
      } else if (!session) {
        navigate("/login")
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin" />
      <h1 className="text-2xl font-bold mt-4">Paiement réussi !</h1>
      <p className="text-lg mt-2">Merci pour votre inscription.</p>
      <Button className="mt-4" onClick={() => navigate("/agence/dashboard")}>
        Accéder au tableau de bord
      </Button>
    </div>
  )
}
