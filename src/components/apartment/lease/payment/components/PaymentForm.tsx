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

const FREQUENCY_LIMITS = {
  daily: 31,
  weekly: 4,
  monthly: 12,
  quarterly: 4,
  biannual: 2,
  yearly: 5
}

const FREQUENCY_LABELS = {
  daily: "jour(s)",
  weekly: "semaine(s)",
  monthly: "mois",
  quarterly: "trimestre(s)",
  biannual: "semestre(s)",
  yearly: "année(s)"
}

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

  const frequency = lease.payment_frequency
  const maxPeriods = FREQUENCY_LIMITS[frequency] || 12
  const periodLabel = FREQUENCY_LABELS[frequency] || "mois"

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
      <Card>
        <CardContent className="pt-6 space-y-4">
          <PaymentTypeField
            value={paymentType}
            onChange={setPaymentType}
          />

          <PeriodSelector
            periods={periods}
            maxPeriods={maxPeriods}
            periodLabel={periodLabel}
            rentAmount={lease.rent_amount}
            onPeriodsChange={setPeriods}
          />

          <PaymentMethodField
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

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