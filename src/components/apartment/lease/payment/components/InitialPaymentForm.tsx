import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PaymentFields } from "./PaymentFields"
import { PaymentCountdown } from "./PaymentCountdown"
import { useInitialPayments } from "../hooks/useInitialPayments"
import { PaymentMethod } from "@/types/payment"

interface InitialPaymentFormProps {
  leaseId: string
  depositAmount?: number
  rentAmount?: number
  paymentFrequency?: string
  onSuccess?: () => void
}

export function InitialPaymentForm({
  leaseId,
  depositAmount = 0,
  rentAmount = 0,
  paymentFrequency,
  onSuccess
}: InitialPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [firstRentDate, setFirstRentDate] = useState<Date>(new Date())
  const { handleInitialPayments, isSubmitting } = useInitialPayments(leaseId, onSuccess)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleInitialPayments(
      depositAmount,
      rentAmount,
      firstRentDate,
      paymentMethod
    )
  }

  const agencyFees = rentAmount ? Math.round(rentAmount * 0.5) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <PaymentFields
          depositAmount={depositAmount}
          agencyFees={agencyFees}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          firstRentDate={firstRentDate}
          onFirstRentDateChange={setFirstRentDate}
        />
      </Card>

      {paymentFrequency && (
        <PaymentCountdown
          firstRentDate={firstRentDate}
          frequency={paymentFrequency}
        />
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !depositAmount || !rentAmount}
        className="w-full"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer les paiements initiaux"}
      </Button>
    </form>
  )
}