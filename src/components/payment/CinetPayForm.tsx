import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
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
  agencyId?: string | null
}

export function CinetPayForm({ amount, description, onSuccess, onError, agencyId }: CinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })

  const handlePayment = async (formData: PaymentFormData) => {
    setIsLoading(true)
    console.log("Initializing payment with:", { amount, description, formData })

    try {
      // Créer l'utilisateur auth avec statut temporaire
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
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
          email: formData.email,
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
          customer_email: formData.email,
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
          customer_email: formData.email,
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