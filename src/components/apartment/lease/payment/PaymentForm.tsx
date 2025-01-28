import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { LeaseData } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentTypeField } from "./form/PaymentTypeField"
import { PeriodSelector } from "./form/PeriodSelector"
import { PaymentMethodField } from "./form/PaymentMethodField"

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
  const [periods, setPeriods] = useState(1)
  const [notes, setNotes] = useState("")
  const [paymentType, setPaymentType] = useState<'current' | 'advance'>('current')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.rpc(
        'create_lease_payment',
        {
          p_lease_id: leaseId,
          p_amount: lease.rent_amount * periods,
          p_payment_type: 'rent',
          p_payment_method: paymentMethod,
          p_payment_date: paymentDate,
          p_notes: notes,
          p_payment_status_type: paymentType === 'advance' ? 'paid_advance' : 'paid_current'
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

  const totalAmount = lease.rent_amount * periods

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <PaymentTypeField
            value={paymentType}
            onChange={setPaymentType}
          />

          <PeriodSelector
            periods={periods}
            maxPeriods={12}
            periodLabel={lease.payment_frequency === 'monthly' ? 'mois' : 'période(s)'}
            rentAmount={lease.rent_amount}
            onPeriodsChange={setPeriods}
          />

          <PaymentMethodField
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <div className="space-y-2">
            <Label>Date de paiement</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes sur le paiement (optionnel)"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant total</span>
              <span className="text-lg font-bold">{totalAmount.toLocaleString()} FCFA</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {periods} {lease.payment_frequency === 'monthly' ? 'mois' : 'période(s)'} × {lease.rent_amount.toLocaleString()} FCFA
            </p>
          </div>
        </CardContent>
      </Card>

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