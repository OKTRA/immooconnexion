import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { LeaseData } from "../types"
import { useLeaseMutations } from "@/components/apartment/lease/hooks/useLeaseMutations"

interface InitialPaymentFormProps {
  onSuccess?: () => void
  lease: LeaseData
}

export function InitialPaymentForm({ onSuccess, lease }: InitialPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const { handleInitialPayments } = useLeaseMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await handleInitialPayments.mutateAsync({
        leaseId: lease.id,
        depositAmount: lease.deposit_amount,
        rentAmount: lease.rent_amount
      })
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting initial payments:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
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
            <Label>Frais d'agence (50% du loyer)</Label>
            <Input
              type="text"
              value={`${Math.round(lease.rent_amount * 0.5).toLocaleString()} FCFA`}
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
        </div>
      </Card>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer les paiements initiaux"}
      </Button>
    </form>
  )
}