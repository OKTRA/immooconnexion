import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { initializeCinetPay } from "@/utils/cinetpay"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormFields } from "./PaymentFormFields"
import { paymentFormSchema, type PaymentFormData } from "./types"

interface CinetPayFormProps {
  amount: number
  description: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function CinetPayForm({ amount, description, onSuccess, onError }: CinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })

  const handlePayment = async (formData: PaymentFormData) => {
    setIsLoading(true)
    console.log("Initializing payment with:", { amount, description, formData })

    try {
      if (!amount || amount <= 0) {
        throw new Error("Le montant doit être supérieur à 0")
      }

      if (!description) {
        throw new Error("La description est requise")
      }

      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: Number(amount),
          description: description.trim(),
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_country: formData.country, // Now using ISO country code
          password: formData.password
        }
      })

      console.log("Response from initialize-payment:", data)

      if (error) {
        console.error("Supabase function error:", error)
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
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone_number: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_country: formData.country, // Now using ISO country code
          mode: 'PRODUCTION' as const,
          lang: 'fr',
          metadata: 'user1',
        }

        initializeCinetPay(config, {
          onClose: () => {
            setIsLoading(false)
            toast({
              title: "Paiement annulé",
              description: "Vous avez fermé la fenêtre de paiement",
            })
          },
          onSuccess: (data: any) => {
            setIsLoading(false)
            console.log("Succès du paiement:", data)
            toast({
              title: "Paiement réussi",
              description: "Votre paiement a été effectué avec succès",
            })
            onSuccess?.()
          },
          onError: (error: any) => {
            setIsLoading(false)
            console.error('Erreur CinetPay:', error)
            toast({
              title: "Erreur de paiement",
              description: "Une erreur est survenue lors du paiement",
              variant: "destructive",
            })
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
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
      onError?.(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
        <PaymentFormFields form={form} />
        
        <Button 
          type="submit"
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : `Payer ${amount.toLocaleString()} FCFA`}
        </Button>
      </form>
    </Form>
  )
}