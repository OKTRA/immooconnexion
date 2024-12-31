import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { initializeCinetPay } from "@/utils/cinetpay"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const paymentFormSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
})

type PaymentFormData = z.infer<typeof paymentFormSchema>

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
    console.log("Initializing payment with:", { amount, description, formData }) // Debug log

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
          customer_phone: formData.phone
        }
      })

      console.log("Response from initialize-payment:", data) // Debug log

      if (error) {
        console.error("Supabase function error:", error) // Debug log
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Informations de paiement</CardTitle>
        <CardDescription>
          Montant à payer: {amount.toLocaleString()} FCFA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>
                    Tel qu'il apparaît sur votre pièce d'identité
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>
                    Pour recevoir votre reçu de paiement
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+225 XX XX XX XX XX" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>
                    Pour vous contacter en cas de besoin
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Chargement..." : `Payer ${amount.toLocaleString()} FCFA`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}