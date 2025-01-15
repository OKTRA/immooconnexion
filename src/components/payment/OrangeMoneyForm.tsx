import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface OrangeMoneyFormProps {
  amount: number
  description: string
  planId?: string
  agencyId?: string
  onSuccess?: () => void
  formData: {
    agency_name?: string
    agency_address?: string
    agency_phone?: string
    country?: string
    city?: string
    first_name?: string
    last_name?: string
    email?: string
    password?: string
    confirm_password?: string
  }
}

export function OrangeMoneyForm({ 
  amount, 
  description, 
  planId,
  agencyId,
  onSuccess,
  formData 
}: OrangeMoneyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
      }

      // Sauvegarder la tentative de paiement
      const { error: saveError } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: paymentId,
          payment_method: 'orange_money',
          amount,
          agency_data: agencyData,
          subscription_plan_id: planId || agencyId,
          status: 'pending'
        })

      if (saveError) throw saveError

      // Get the access token for the authenticated user
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        throw new Error('No access token available')
      }

      // Initialiser le paiement Orange Money en utilisant l'URL complète de la fonction Edge
      const response = await supabase.functions.invoke('initialize-orange-money-payment', {
        body: {
          amount,
          payment_id: paymentId,
        }
      })

      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors de l\'initialisation du paiement')
      }

      const data = response.data

      if (onSuccess) {
        onSuccess()
      }
      
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