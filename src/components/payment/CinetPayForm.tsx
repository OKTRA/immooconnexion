import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CinetPayFormProps {
  amount: number
  description: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function CinetPayForm({ amount, description, onSuccess, onError }: CinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez entrer votre numéro de téléphone",
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
          phone: phoneNumber
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
          channels: 'MOBILE_MONEY',
          description: data.description,
          customer_phone_number: phoneNumber,
          customer_country: 'CI',
          customer_state: 'CI',
          lang: 'fr',
          metadata: 'user1',
        }

        // @ts-ignore - CinetPay est chargé via CDN
        new window.CinetPay({
          ...config,
          mode: 'EMBEDDED', // Mode seamless
          style: {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            buttonColor: "#22C55E",
            buttonTextColor: "#FFFFFF",
          }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Demo CinetPay</span>
          <span>{amount.toLocaleString()} XOF</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <div className="flex mt-2">
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  <span className="text-sm text-muted-foreground">+225</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01 23 45 67 89"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <img src="/lovable-uploads/dfb9aae4-c6be-40f4-93f5-b6ce1819cfc4.png" alt="Mobile Money Options" className="h-12" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>
            {isLoading ? "Chargement..." : `Payer ${amount.toLocaleString()} XOF`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}