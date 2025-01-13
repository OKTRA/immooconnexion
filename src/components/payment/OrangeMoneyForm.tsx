import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface OrangeMoneyFormProps {
  amount: number
  description: string
  agencyId?: string | null
  onSuccess?: () => void
  onError?: (error: any) => void
  formData: any
}

export function OrangeMoneyForm({
  amount,
  description,
  agencyId,
  onSuccess,
  onError,
  formData
}: OrangeMoneyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      console.log("Initializing Orange Money payment...")

      const { data, error } = await supabase.functions.invoke('initialize-orange-money-payment', {
        body: {
          amount,
          description,
          metadata: {
            agency_id: agencyId,
            customer_email: formData.email,
            customer_name: `${formData.first_name} ${formData.last_name}`,
            customer_phone: formData.phone_number
          }
        }
      })

      if (error) throw error

      console.log("Payment URL received:", data.payment_url)
      // Redirection vers la page de paiement Orange Money
      window.location.href = data.payment_url

      onSuccess?.()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      })
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Montant à payer</p>
            <p className="text-2xl font-bold">{amount.toLocaleString()} FCFA</p>
          </div>
          <img 
            src="/orange-money-logo.png" 
            alt="Orange Money" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          "Payer avec Orange Money"
        )}
      </Button>
    </div>
  )
}