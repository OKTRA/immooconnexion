import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentLease } from "@/types/apartment"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface InitialPaymentFormProps {
  lease: ApartmentLease
  onSuccess?: () => void
}

export function InitialPaymentForm({ lease, onSuccess }: InitialPaymentFormProps) {
  const queryClient = useQueryClient()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInitialPayment = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('handle_initial_payments', {
        p_lease_id: lease.id,
        p_deposit_amount: lease.deposit_amount,
        p_agency_fees: Math.round(lease.rent_amount * 0.5)
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Paiements initiaux enregistrés",
        description: "Les paiements initiaux ont été enregistrés avec succès",
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await handleInitialPayment.mutateAsync()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Caution</Label>
          <Input
            type="text"
            value={`${lease.deposit_amount?.toLocaleString()} FCFA`}
            disabled
          />
        </div>

        <div>
          <Label>Frais d'agence</Label>
          <Input
            type="text"
            value={`${Math.round(lease.rent_amount * 0.5).toLocaleString()} FCFA`}
            disabled
          />
        </div>

        <div>
          <Label>Mode de paiement</Label>
          <Select
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Espèces</SelectItem>
              <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
              <SelectItem value="check">Chèque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer les paiements
      </Button>
    </form>
  )
}