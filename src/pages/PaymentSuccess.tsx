import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const [isVerifying, setIsVerifying] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!paymentId) {
          toast({
            title: "Erreur",
            description: "Identifiant de paiement manquant",
            variant: "destructive",
          })
          navigate('/pricing')
          return
        }

        // Récupérer les informations du paiement
        const { data: paymentAttempt, error: fetchError } = await supabase
          .from('payment_attempts')
          .select('*')
          .eq('payment_id', paymentId)
          .single()

        if (fetchError || !paymentAttempt) {
          throw new Error("Paiement non trouvé")
        }

        if (paymentAttempt.status === 'pending') {
          // Attendre 5 secondes et réessayer
          setTimeout(() => {
            verifyPayment()
          }, 5000)
          return
        }

        if (paymentAttempt.status !== 'success') {
          throw new Error("Le paiement n'a pas été complété avec succès")
        }

        // Créer l'agence
        const agencyData = paymentAttempt.agency_data
        const { data: agency, error: agencyError } = await supabase
          .from('agencies')
          .insert([{
            ...agencyData,
            subscription_plan_id: paymentAttempt.subscription_plan_id,
            status: 'active'
          }])
          .select()
          .single()

        if (agencyError) throw agencyError

        toast({
          title: "Succès",
          description: "Votre agence a été créée avec succès. Veuillez vous connecter et lire nos conditions d'utilisation.",
        })

        // Rediriger vers la page de connexion
        navigate('/login')
      } catch (error: any) {
        console.error('Error:', error)
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        })
        navigate('/pricing')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [paymentId, navigate, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {isVerifying ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold">Vérification du paiement...</h1>
            <p className="text-muted-foreground">
              Veuillez patienter pendant que nous vérifions votre paiement
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">
            Redirection en cours...
          </p>
        )}
      </div>
    </div>
  )
}