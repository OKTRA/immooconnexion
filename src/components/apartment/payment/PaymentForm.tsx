import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { LeaseData } from "./types"
import { format, addMonths } from "date-fns"

interface PaymentFormProps {
  onSuccess?: () => void
  leaseId: string
  lease: LeaseData
  isHistorical?: boolean
}

export function PaymentForm({ 
  onSuccess, 
  leaseId,
  lease,
  isHistorical = false
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [months, setMonths] = useState(1)
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const periodStart = new Date(paymentDate)
      const periodEnd = addMonths(periodStart, months)

      const { data, error } = await supabase.rpc(
        'create_lease_payment',
        {
          p_lease_id: leaseId,
          p_amount: lease.rent_amount * months,
          p_payment_type: 'rent',
          p_payment_method: paymentMethod,
          p_payment_date: paymentDate,
          p_period_start: format(periodStart, 'yyyy-MM-dd'),
          p_period_end: format(periodEnd, 'yyyy-MM-dd'),
          p_notes: notes
        }
      )

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting payment:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Montant mensuel</Label>
          <Input
            type="text"
            value={`${lease.rent_amount.toLocaleString()} FCFA`}
            disabled
          />
        </div>

        <div>
          <Label>Nombre de mois</Label>
          <Input
            type="number"
            min="1"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Montant total</Label>
          <Input
            type="text"
            value={`${(lease.rent_amount * months).toLocaleString()} FCFA`}
            disabled
          />
        </div>

        <div>
          <Label>Mode de paiement</Label>
          <PaymentMethodSelect
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        <div>
          <Label>Date de paiement</Label>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
      </Button>
    </form>
  )
}