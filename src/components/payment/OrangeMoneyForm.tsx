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
  formData: {
    email: string
    agency_name: string
    agency_address: string
    country: string
    city: string
    first_name: string
    last_name: string
    phone_number: string
  }
}

export function OrangeMoneyForm({ 
  amount,
  description,
  agencyId,
  onSuccess,
  formData
}: OrangeMoneyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)

      // Sauvegarder la tentative de paiement
      const { data: paymentAttempt, error: paymentError } = await supabase
        .from('payment_attempts')
        .insert([{
          payment_method: 'orange_money',
          amount,
          agency_data: {
            name: formData.agency_name,
            address: formData.agency_address,
            country: formData.country,
            city: formData.city,
            email: formData.email
          },
          subscription_plan_id: agencyId
        }])
        .select()
        .single()

      if (paymentError) throw paymentError

      // Initialiser le paiement Orange Money
      const { data, error } = await supabase.functions.invoke('initialize-orange-money-payment', {
        body: {
          amount,
          description,
          payment_id: paymentAttempt.id,
          customer: {
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number
          }
        }
      })

      if (error) throw error

      // Rediriger vers l'URL de paiement Orange Money
      if (data?.payment_url) {
        window.location.href = data.payment_url
      } else {
        throw new Error("URL de paiement non reçue")
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initialisation du paiement...
          </>
        ) : (
          "Payer avec Orange Money"
        )}
      </Button>
    </form>
  )
}