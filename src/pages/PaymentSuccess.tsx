import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface AgencyData {
  name: string
  address: string
  phone: string
  country: string
  city: string
  email: string
  password: string
  first_name: string
  last_name: string
}

interface PaymentAttempt {
  payment_id: string
  agency_data: AgencyData
  subscription_plan_id: string
  status: string
}

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

        const typedPaymentAttempt = paymentAttempt as PaymentAttempt

        if (typedPaymentAttempt.status === 'pending') {
          // Attendre 5 secondes et réessayer
          setTimeout(() => {
            verifyPayment()
          }, 5000)
          return
        }

        if (typedPaymentAttempt.status !== 'success') {
          throw new Error("Le paiement n'a pas été complété avec succès")
        }

        // Créer l'agence
        const { data: agency, error: agencyError } = await supabase
          .from('agencies')
          .insert([{
            name: typedPaymentAttempt.agency_data.name,
            address: typedPaymentAttempt.agency_data.address,
            phone: typedPaymentAttempt.agency_data.phone,
            country: typedPaymentAttempt.agency_data.country,
            city: typedPaymentAttempt.agency_data.city,
            email: typedPaymentAttempt.agency_data.email,
            subscription_plan_id: typedPaymentAttempt.subscription_plan_id,
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