import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { PaymentFormData } from "./types"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      console.log("Initializing PayDunya payment with:", { amount, description, agencyId })
      
      // Initialize payment with PayDunya
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

      console.log("PayDunya response:", { data, error })

      if (error) {
        console.error("PayDunya initialization error:", error)
        throw error
      }

      if (!data?.token) {
        throw new Error("Token de paiement non reçu")
      }

      // Create PayDunya payment form
      const paydunyaForm = document.createElement('form')
      paydunyaForm.method = 'POST'
      paydunyaForm.action = 'https://app.paydunya.com/checkout/receipt'
      
      const tokenInput = document.createElement('input')
      tokenInput.type = 'hidden'
      tokenInput.name = 'token'
      tokenInput.value = data.token
      
      paydunyaForm.appendChild(tokenInput)
      document.body.appendChild(paydunyaForm)
      paydunyaForm.submit()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Detailed PayDunya error:", error)
      const errorMessage = error.message || "Une erreur est survenue lors de l'initialisation du paiement"
      toast({
        title: "Erreur de paiement",
        description: errorMessage,
        variant: "destructive",
      })
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
            Initialisation du paiement...
          </>
        ) : (
          "Payer avec PayDunya"
        )}
      </Button>
    </div>
  )
}