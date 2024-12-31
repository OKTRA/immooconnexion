import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface CinetPayFormProps {
  amount: number
  description: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function CinetPayForm({ amount, description, onSuccess, onError }: CinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount,
          description,
          customer: customerInfo
        }
      })

      if (error) throw error

      if (data.code === '201') {
        // Initialiser CinetPay Seamless
        // @ts-ignore - CinetPay est chargé via CDN
        new window.CinetPay({
          apikey: data.apikey,
          site_id: data.site_id,
          notify_url: data.notify_url,
          return_url: data.return_url,
          trans_id: data.trans_id,
          amount: data.amount,
          currency: data.currency,
          channels: 'ALL',
          description: data.description,
          customer_name: data.customer_name,
          customer_surname: data.customer_surname,
          customer_email: data.customer_email,
          customer_phone_number: data.customer_phone_number,
          lang: 'fr',
        }).getCheckout({
          onClose: () => {
            toast({
              title: "Paiement annulé",
              description: "Vous avez fermé la fenêtre de paiement",
            })
          },
          onSuccess: () => {
            toast({
              title: "Paiement réussi",
              description: "Votre paiement a été effectué avec succès",
            })
            onSuccess?.()
          },
          onError: (error: any) => {
            console.error('CinetPay error:', error)
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
      console.error('Payment error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="surname">Prénom</Label>
        <Input
          id="surname"
          value={customerInfo.surname}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, surname: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Chargement..." : `Payer ${amount.toLocaleString()} FCFA`}
      </Button>
    </form>
  )
}