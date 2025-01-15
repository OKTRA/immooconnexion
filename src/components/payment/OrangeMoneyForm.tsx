import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface OrangeMoneyFormProps {
  amount: number
  agencyData: {
    name: string
    address: string
    country: string
    city: string
    email: string
  }
  subscriptionPlanId: string
}

export function OrangeMoneyForm({ amount, agencyData, subscriptionPlanId }: OrangeMoneyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Générer un ID de paiement unique
      const paymentId = `om_${Date.now()}_${Math.random().toString(36).substring(7)}`

      // Sauvegarder la tentative de paiement
      const { error: saveError } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: paymentId,
          payment_method: 'orange_money',
          amount,
          agency_data: agencyData,
          subscription_plan_id: subscriptionPlanId
        })

      if (saveError) throw saveError

      // Initialiser le paiement Orange Money
      const response = await fetch('/api/initialize-orange-money-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          payment_id: paymentId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'initialisation du paiement')
      }

      // Rediriger vers la page de paiement Orange Money
      window.location.href = data.payment_url

    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Traitement en cours..." : "Payer avec Orange Money"}
    </Button>
  )
}