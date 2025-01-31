import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { LeaseData } from "../types"
import { PaymentMethod } from "@/types/payment"

interface RegularPaymentFormProps {
  lease: LeaseData
  onSuccess?: () => void
}

export function RegularPaymentForm({ lease, onSuccess }: RegularPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Implement regular payment logic here
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Montant du loyer</Label>
            <Input
              type="text"
              value={`${lease.rent_amount?.toLocaleString()} FCFA`}
              disabled
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Mode de paiement</Label>
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value as PaymentMethod)}
            />
          </div>
        </div>
      </Card>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
      </Button>
    </form>
  )
}