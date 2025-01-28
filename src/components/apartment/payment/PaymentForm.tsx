import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { LeaseData } from "./types"
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const frequency = lease.payment_frequency as keyof typeof FREQUENCY_LIMITS
  const maxPeriods = FREQUENCY_LIMITS[frequency] || 12
  const periodLabel = FREQUENCY_LABELS[frequency] || "mois"

  const calculateEndDate = (startDate: Date, periodsCount: number) => {
    switch (frequency) {
      case 'daily':
        return addDays(startDate, periodsCount)
      case 'weekly':
        return addWeeks(startDate, periodsCount)
      case 'monthly':
        return addMonths(startDate, periodsCount)
      case 'quarterly':
        return addMonths(startDate, periodsCount * 3)
      case 'biannual':
        return addMonths(startDate, periodsCount * 6)
      case 'yearly':
        return addYears(startDate, periodsCount)
      default:
        return addMonths(startDate, periodsCount)
    }
  }

  const totalAmount = lease.rent_amount * periods

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const periodStart = new Date(paymentDate)
      const periodEnd = calculateEndDate(periodStart, periods)

      const { data, error } = await supabase.rpc(
        'create_lease_payment',
        {
          p_lease_id: leaseId,
          p_amount: totalAmount,
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
          <Label>Nombre de {periodLabel}</Label>
          <Select
            value={periods.toString()}
            onValueChange={(value) => setPeriods(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxPeriods }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {periodLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Montant total</Label>
          <Input
            type="text"
            value={`${totalAmount.toLocaleString()} FCFA`}
            disabled
          />
          <p className="text-sm text-muted-foreground mt-1">
            {periods} {periodLabel} × {lease.rent_amount.toLocaleString()} FCFA
          </p>
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