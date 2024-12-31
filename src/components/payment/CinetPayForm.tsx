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
    
    // Validation des champs requis
    if (!customerInfo.name || !customerInfo.surname || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

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
        // Initialiser CinetPay selon la documentation officielle
        // @ts-ignore - CinetPay est chargé via CDN
        new window.CinetPay({
          apikey: data.apikey,
          site_id: data.site_id,
          notify_url: data.notify_url,
          return_url: data.return_url,
          trans_id: data.trans_id,
          amount: data.amount,
          currency: 'XOF',
          channels: 'ALL',
          description: data.description,
          customer_name: customerInfo.name,
          customer_surname: customerInfo.surname,
          customer_email: customerInfo.email,
          customer_phone_number: customerInfo.phone,
          customer_address: '',
          customer_city: '',
          customer_country: 'CI',
          customer_state: 'CI',
          customer_zip_code: '000',
          lang: 'fr',
          metadata: 'user1', // Identifiant supplémentaire facultatif
        }).getCheckout({
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          placeholder="Entrez votre nom"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="surname">Prénom <span className="text-red-500">*</span></Label>
        <Input
          id="surname"
          placeholder="Entrez votre prénom"
          value={customerInfo.surname}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, surname: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+225 XX XX XX XX XX"
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