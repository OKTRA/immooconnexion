import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { initializeCinetPay } from "@/utils/cinetpay"
import { Loader2 } from "lucide-react"
import { PaymentFormData, CinetPayFormProps } from "./types"

interface ExtendedCinetPayFormProps extends CinetPayFormProps {
  formData: PaymentFormData
}

export function CinetPayForm({ 
  amount, 
  description, 
  onSuccess, 
  onError, 
  agencyId,
  formData 
}: ExtendedCinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      console.log("Initializing payment with:", { amount, description, formData })

      // Structure the metadata
      const metadata = {
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

      console.log("Payment metadata:", metadata)

      // Initialize payment
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: Number(amount),
          description: description.trim(),
          metadata: JSON.stringify(metadata),
          payment_method: 'cinetpay'
        }
      })

      if (error) {
        console.error('Payment initialization error:', error)
        throw error
      }

      if (data.code === '201') {
        const config = {
          apikey: data.apikey,
          site_id: data.site_id,
          notify_url: data.notify_url,
          return_url: data.return_url,
          trans_id: data.trans_id,
          amount: data.amount,
          currency: 'XOF',
          channels: 'ALL',
          description: data.description,
          customer_email: formData.email,
          customer_name: formData.first_name,
          customer_surname: formData.last_name,
          customer_phone_number: formData.phone_number,
          customer_address: formData.agency_address,
          customer_city: formData.city,
          customer_country: formData.country,
          mode: 'PRODUCTION' as const,
          lang: 'fr',
          metadata: data.metadata
        }

        console.log("Initializing CinetPay with config:", config);

        initializeCinetPay(config, {
          onClose: () => {
            setIsLoading(false)
            toast({
              title: "Paiement annulé",
              description: "Vous avez fermé la fenêtre de paiement",
            })
          },
          onSuccess: () => {
            setIsLoading(false)
            console.log("Payment success")
            onSuccess?.()
          },
          onError: (error: any) => {
            setIsLoading(false)
            console.error('CinetPay error:', error)
            onError?.(error)
            toast({
              title: "Erreur de paiement",
              description: error.message || "Une erreur est survenue lors du paiement",
              variant: "destructive"
            })
          },
        })
      } else {
        throw new Error(data.message || 'Error initializing payment')
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error('Payment error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive"
      })
      onError?.(error)
    }
  }

  return (
    <div className="space-y-4">
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
          `Payer ${amount.toLocaleString()} FCFA`
        )}
      </Button>
    </div>
  )
}