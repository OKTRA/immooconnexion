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
      setIsLoading(true)
      console.log("Initializing payment with:", { amount, description, values })

      // Créer l'utilisateur auth avec statut temporaire
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: 'admin',
            status: 'pending'
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("No user data returned")

      // Mettre à jour le profil avec l'ID de l'agence et statut temporaire
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          email: values.email,
          role: 'admin',
          agency_id: agencyId,
          status: 'pending'
        })
        .eq('id', authData.user.id)

      if (profileError) throw profileError

      // Créer l'entrée administrateur
      const { error: adminError } = await supabase
        .from('administrators')
        .insert({
          id: authData.user.id,
          agency_id: agencyId,
          is_super_admin: false
        })

      if (adminError) throw adminError

      // Initialiser le paiement
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: Number(amount),
          description: description.trim(),
          customer_email: values.email,
          agency_id: agencyId,
          user_id: authData.user.id
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
          mode: 'PRODUCTION' as const,
          lang: 'fr',
          metadata: JSON.stringify({
            agency_id: agencyId,
            user_id: authData.user.id
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
          onSuccess: (data: any) => {
            setIsLoading(false)
            console.log("Succès du paiement:", data)
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