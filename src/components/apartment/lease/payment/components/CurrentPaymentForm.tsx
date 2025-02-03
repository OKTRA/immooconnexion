import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentTypeField } from "./form/PaymentTypeField"
import { PeriodSelector } from "./form/PeriodSelector"
import { PaymentMethodField } from "./form/PaymentMethodField"
import { LeaseData } from "../types"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"

interface CurrentPaymentFormProps {
  lease: LeaseData
  onSuccess?: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export function CurrentPaymentForm({
  lease,
  onSuccess,
  isSubmitting,
  setIsSubmitting
}: CurrentPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [periods, setPeriods] = useState(1)
  const [notes, setNotes] = useState("")
  const [advancePayment, setAdvancePayment] = useState(false)

  // Fetch the first rent start date from initial payment
  const { data: firstRentStartDate } = useQuery({
    queryKey: ["first-rent-date", lease.id],
    queryFn: async () => {
      console.log("Fetching first rent start date for lease:", lease.id)
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select("first_rent_start_date")
        .eq("lease_id", lease.id)
        .eq("payment_type", "deposit")
        .single()

      if (error) {
        console.error("Error fetching first rent date:", error)
        throw error
      }

      console.log("First rent start date:", data?.first_rent_start_date)
      return data?.first_rent_start_date
    }
  })

  const totalAmount = lease.rent_amount * periods

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!firstRentStartDate) {
        throw new Error("Date de début du premier loyer non trouvée")
      }

      console.log("Starting payment submission with first rent date:", firstRentStartDate)

      const periodStart = new Date(firstRentStartDate)
      let periodEnd = new Date(periodStart)

      // Calculer la date de fin selon la fréquence
      switch (lease.payment_frequency) {
        case 'monthly':
          periodEnd.setMonth(periodEnd.getMonth() + periods)
          break
        case 'weekly':
          periodEnd.setDate(periodEnd.getDate() + (7 * periods))
          break
        case 'daily':
          periodEnd.setDate(periodEnd.getDate() + periods)
          break
        case 'quarterly':
          periodEnd.setMonth(periodEnd.getMonth() + (3 * periods))
          break
        case 'yearly':
          periodEnd.setFullYear(periodEnd.getFullYear() + periods)
          break
      }
      periodEnd.setDate(periodEnd.getDate() - 1) // Ajuster pour la fin de période

      console.log("Calculated period:", {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString()
      })

      const { data, error } = await supabase.rpc('create_lease_payment', {
        p_lease_id: lease.id,
        p_amount: totalAmount,
        p_payment_type: 'rent',
        p_payment_method: paymentMethod,
        p_payment_date: paymentDate,
        p_period_start: periodStart.toISOString().split('T')[0],
        p_period_end: periodEnd.toISOString().split('T')[0],
        p_notes: notes,
        p_payment_status_type: advancePayment ? 'paid_advance' : 'late'
      })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error submitting payment:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement du paiement",
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
            value={advancePayment ? 'advance' : 'current'}
            onChange={(value) => setAdvancePayment(value === 'advance')}
          />

          <PeriodSelector
            periods={periods}
            maxPeriods={12}
            periodLabel={lease.payment_frequency === 'monthly' ? 'mois' : 'semaines'}
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
            <Label>Notes (optionnel)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes sur le paiement"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant total</span>
              <span className="text-lg font-bold">{totalAmount.toLocaleString()} FCFA</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {periods} {lease.payment_frequency === 'monthly' ? 'mois' : 'semaines'} × {lease.rent_amount.toLocaleString()} FCFA
            </p>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !firstRentStartDate}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          "Enregistrer le paiement"
        )}
      </Button>
    </form>
  )
}