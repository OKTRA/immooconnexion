import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentTypeField } from "./form/PaymentTypeField"
import { PeriodSelector } from "./form/PeriodSelector"
import { PaymentMethodField } from "./form/PaymentMethodField"
import { LeaseData } from "../types"
import { Loader2 } from "lucide-react"
import { useLeaseMutations } from "../hooks/useLeaseMutations"

interface CurrentPaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
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

  const { handleInitialPayments } = useLeaseMutations()
  const totalAmount = lease.rent_amount * periods

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await handleInitialPayments.mutateAsync({
        leaseId: lease.id,
        depositAmount: lease.deposit_amount,
        rentAmount: totalAmount
      })

      if (error) throw error

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Détails du paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        disabled={isSubmitting}
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