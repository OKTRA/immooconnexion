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
  agencyData?: {
    name: string
    address?: string
    phone?: string
    email?: string
    subscription_plan_id: string
    show_phone_on_site?: boolean
    list_properties_on_site?: boolean
    country?: string
    city?: string
  }
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function CinetPayForm({ amount, description, agencyData, onSuccess, onError }: CinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })

  const handlePayment = async (formData: PaymentFormData) => {
    setIsLoading(true)
    console.log("Initializing payment with:", { amount, description, formData })

    try {
      let agency_id: string | undefined
      let user_id: string | undefined

      if (agencyData) {
        // Create the agency if agencyData is provided
        const { data: agency, error: agencyError } = await supabase
          .from('agencies')
          .insert({
            ...agencyData,
            status: 'pending'
          })
          .select()
          .single()

        if (agencyError) throw agencyError
        agency_id = agency.id

        // Create the auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              role: 'admin',
            },
          },
        })

        if (authError) {
          // If auth user creation fails, delete the agency
          await supabase
            .from('agencies')
            .delete()
            .eq('id', agency.id)
          throw authError
        }

        if (!authData.user) throw new Error("No user data returned")
        user_id = authData.user.id

        // Update the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            email: formData.email,
            role: 'admin',
            agency_id: agency.id,
            status: 'pending'
          })
          .eq('id', authData.user.id)

        if (profileError) throw profileError

        // Create administrator record
        const { error: adminError } = await supabase
          .from('administrators')
          .insert({
            id: authData.user.id,
            agency_id: agency.id,
            is_super_admin: false
          })

        if (adminError) throw adminError
      }

      // Initialize payment
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: Number(amount),
          description: description.trim(),
          customer_email: formData.email,
          agency_id,
          user_id
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
            agency_id,
            user_id
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
            toast({
              title: "Paiement réussi",
              description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
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