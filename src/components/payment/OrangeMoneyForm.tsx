import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface OrangeMoneyFormProps {
  amount: number
  description: string
  planId?: string
  onSuccess?: () => void
  formData: {
    email: string
    password: string
    confirm_password: string
    agency_name: string
    agency_address: string
    agency_phone: string
    country: string
    city: string
    first_name: string
    last_name: string
  }
}

export function OrangeMoneyForm({ 
  amount, 
  description,
  planId,
  onSuccess,
  formData 
}: OrangeMoneyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Starting payment initialization...")

      // Créer une entrée dans payment_attempts
      const paymentId = `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const { error: saveError } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: paymentId,
          agency_data: {
            ...formData,
            payment_id: paymentId
          },
          subscription_plan_id: planId || '',
          status: 'pending',
          payment_method: 'orange_money',
          amount: amount
        })

      if (saveError) {
        console.error("Error saving payment attempt:", saveError)
        throw saveError
      }

      console.log("Payment attempt saved, initializing Orange Money payment...")

      // Initialiser le paiement Orange Money
      const { data, error } = await supabase.functions.invoke(
        'initialize-orange-money-payment',
        {
          body: {
            amount,
            description,
            metadata: {
              payment_id: paymentId,
              customer_email: formData.email,
              customer_phone: formData.agency_phone,
              customer_name: `${formData.first_name} ${formData.last_name}`,
              registration_data: formData
            }
          }
        }
      )

      if (error) {
        console.error("Error initializing payment:", error)
        throw new Error(error.message || 'Erreur lors de l\'initialisation du paiement')
      }

      console.log("Payment initialized successfully:", data)

      if (!data?.payment_url) {
        throw new Error('URL de paiement non reçue')
      }

      // Rediriger vers l'URL de paiement Orange Money
      window.location.href = data.payment_url

      if (onSuccess) {
        onSuccess()
      }

    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-500 mb-4">
          <p>Vous allez être redirigé vers Orange Money pour effectuer le paiement de:</p>
          <p className="font-semibold text-lg">{amount.toLocaleString()} FCFA</p>
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            'Payer avec Orange Money'
          )}
        </Button>
      </div>
    </form>
  )
}