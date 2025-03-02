
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { PaymentTypeSelector } from "./components/PaymentTypeSelector"
import { CurrentPaymentForm } from "./components/CurrentPaymentForm"
import { HistoricalPaymentForm } from "./components/HistoricalPaymentForm"
import { LatePaymentForm } from "./components/LatePaymentForm"
import { useLeasePaymentStatus } from "./hooks/useLeasePaymentStatus"
import { PaymentType, PaymentFormProps } from "./types"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export function PaymentForm({ 
  onSuccess, 
  lease,
  leaseId,
  isHistorical = false
}: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>("current")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: paymentStatus } = useLeasePaymentStatus(leaseId || lease.id)

  // Force late payment type if there are late payments
  useEffect(() => {
    if (paymentStatus?.hasLatePayments && paymentType === "current") {
      setPaymentType("late")
    }
  }, [paymentStatus?.hasLatePayments, paymentType])

  const handleSuccess = () => {
    toast({
      title: "Paiement effectué",
      description: "Le paiement a été enregistré avec succès.",
    })
    if (onSuccess) {
      onSuccess()
    }
  }

  const renderPaymentForm = () => {
    switch (paymentType) {
      case "current":
        return (
          <CurrentPaymentForm
            lease={lease}
            onSuccess={handleSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )
      case "historical":
        return (
          <HistoricalPaymentForm
            lease={lease}
            onSuccess={handleSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )
      case "late":
        return (
          <LatePaymentForm
            lease={lease}
            onSuccess={handleSuccess}
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
      <Card className="p-4 md:p-6">
        <PaymentTypeSelector
          value={paymentType}
          onChange={setPaymentType}
          hasLatePayments={paymentStatus?.hasLatePayments}
          latePaymentsCount={paymentStatus?.latePaymentsCount}
          totalLateAmount={paymentStatus?.totalLateAmount}
        />
      </Card>
      <Card className="p-4 md:p-6">
        {renderPaymentForm()}
      </Card>
    </div>
  )
}
