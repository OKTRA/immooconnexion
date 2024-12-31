import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { initializeCinetPay } from "@/utils/cinetpay"
import { useForm, FormProvider } from "react-hook-form"
import { PaymentFormData, CinetPayFormProps } from "./types"
import { Loader2 } from "lucide-react"
import { PaymentFormFields } from "./PaymentFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentFormSchema } from "./types"

export function CinetPayForm({ amount, description, onSuccess, onError, agencyId }: CinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })

  const handlePayment = async () => {
    try {
      const values = methods.getValues()
      
      // Validate form
      const result = await methods.trigger()
      if (!result) {
        return // Form validation failed
      }

      setIsLoading(true)
      console.log("Initializing payment with:", { amount, description, values })

      // Initialize payment without creating user yet
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: Number(amount),
          description: description.trim(),
          subscription_plan_id: agencyId,
          agency_name: values.agency_name,
          agency_address: values.agency_address,
          country: values.country,
          city: values.city,
          user_email: values.email,
          user_first_name: values.first_name,
          user_last_name: values.last_name,
          user_phone: values.phone_number,
          password: values.password
        }
      })

      if (error) throw error

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
          customer_email: values.email,
          customer_name: values.first_name,
          customer_surname: values.last_name,
          customer_phone_number: values.phone_number,
          customer_address: values.agency_address,
          customer_city: values.city,
          customer_country: values.country,
          mode: 'PRODUCTION' as const,
          lang: 'fr',
          metadata: JSON.stringify({
            agency_id: agencyId,
            subscription_plan_id: agencyId
          }),
        }

        initializeCinetPay(config, {
          onClose: () => {
            setIsLoading(false)
            toast({
              title: "Paiement annulé",
              description: "Vous avez fermé la fenêtre de paiement",
            })
          },
          onSuccess: async (data: any) => {
            setIsLoading(false)
            console.log("Succès du paiement:", data)
            // Let the webhook handle user creation
            onSuccess?.()
          },
          onError: (error: any) => {
            setIsLoading(false)
            console.error('Erreur CinetPay:', error)
            onError?.(error)
          },
        })
      } else {
        throw new Error(data.message || 'Erreur lors de l\'initialisation du paiement')
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error('Erreur de paiement:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive"
      })
      onError?.(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <PaymentFormFields form={methods} />
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
    </FormProvider>
  )
}