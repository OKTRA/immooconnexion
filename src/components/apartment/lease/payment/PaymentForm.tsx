import { useState, useEffect } from "react"
import { PaymentTypeSelector } from "./components/PaymentTypeSelector"
import { CurrentPaymentForm } from "./components/CurrentPaymentForm"
import { HistoricalPaymentForm } from "./components/HistoricalPaymentForm"
import { LatePaymentForm } from "./components/LatePaymentForm"
import { useLeasePaymentStatus } from "./hooks/useLeasePaymentStatus"
import { LeaseData } from "./types"

interface PaymentFormProps {
  onSuccess?: () => void;
  leaseId: string;
  lease: LeaseData;
  isHistorical?: boolean;
}

export function PaymentForm({ 
  onSuccess, 
  leaseId,
  lease,
  isHistorical = false
}: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<'current' | 'historical' | 'late'>("current")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: paymentStatus } = useLeasePaymentStatus(leaseId)

  // Force late payment type if there are late payments
  useEffect(() => {
    if (paymentStatus?.hasLatePayments && paymentType === "current") {
      setPaymentType("late")
    }
  }, [paymentStatus?.hasLatePayments])

  const renderPaymentForm = () => {
    switch (paymentType) {
      case "current":
        return (
          <CurrentPaymentForm
            lease={lease}
            onSuccess={onSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )
      case "historical":
        return (
          <HistoricalPaymentForm
            lease={lease}
            onSuccess={onSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )
      case "late":
        return (
          <LatePaymentForm
            lease={lease}
            onSuccess={onSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <PaymentTypeSelector
        value={paymentType}
        onChange={setPaymentType}
        hasLatePayments={paymentStatus?.hasLatePayments}
        latePaymentsCount={paymentStatus?.latePaymentsCount}
        totalLateAmount={paymentStatus?.totalLateAmount}
      />
      {renderPaymentForm()}
    </div>
  )
}