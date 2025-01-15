import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { FormData } from "../agency/types"

interface OrangeMoneyFormProps {
  amount: number
  description: string
  planId: string
  formData: FormData
}

export function OrangeMoneyForm({ amount, description, planId, formData }: OrangeMoneyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Générer un ID de paiement unique
      const paymentId = `om_${Date.now()}_${Math.random().toString(36).substring(7)}`

      // Préparer les données de l'agence
      const agencyData = {
        name: formData.agency_name,
        address: formData.agency_address,
        phone: formData.agency_phone,
        country: formData.country,
        city: formData.city,
        email: formData.email
      }

      // Sauvegarder la tentative de paiement
      const { error: saveError } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: paymentId,
          payment_method: 'orange_money',
          amount,
          agency_data: agencyData,
          subscription_plan_id: planId,
          status: 'pending'
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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de l\'initialisation du paiement')
      }

      const data = await response.json()
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