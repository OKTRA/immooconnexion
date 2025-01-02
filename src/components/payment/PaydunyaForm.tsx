import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { PaymentFormData } from "./types"

interface PaydunyaFormProps {
  amount: number
  description: string
  agencyId?: string | null
  onSuccess?: () => void
  onError?: (error: any) => void
  formData: PaymentFormData
}

export function PaydunyaForm({ 
  amount, 
  description, 
  agencyId,
  onSuccess,
  onError,
  formData
}: PaydunyaFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      
      // Initialiser le paiement avec PayDunya
      const { data, error } = await supabase.functions.invoke('initialize-paydunya-payment', {
        body: {
          amount,
          description,
          agency_id: agencyId,
          metadata: {
            user_data: {
              email: formData.email,
              password: formData.password,
              first_name: formData.first_name,
              last_name: formData.last_name,
              phone: formData.phone_number
            },
            agency_data: {
              name: formData.agency_name,
              address: formData.agency_address,
              country: formData.country,
              city: formData.city,
              phone: formData.phone_number,
              email: formData.email
            },
            subscription_plan_id: agencyId
          }
        }
      })

      if (error) throw error

      if (data?.payment_url) {
        // Rediriger vers la page de paiement PayDunya
        window.location.href = data.payment_url
      } else {
        throw new Error("URL de paiement non reçue")
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation du paiement PayDunya:", error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Vous allez être redirigé vers PayDunya pour effectuer votre paiement de {amount.toLocaleString()} FCFA
      </div>
      <Button 
        onClick={handlePayment} 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          "Payer avec PayDunya"
        )}
      </Button>
    </div>
  )
}