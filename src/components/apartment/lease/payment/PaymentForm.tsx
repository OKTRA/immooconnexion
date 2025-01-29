import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { PaymentTypeField } from "./components/form/PaymentTypeField"
import { PeriodSelector } from "./components/form/PeriodSelector"
import { PaymentMethodField } from "./components/form/PaymentMethodField"
import { LeaseData } from "../types"
import { Loader2 } from "lucide-react"
import { useLeaseMutations } from "../hooks/useLeaseMutations"
import { PaymentTypeSelector, PaymentType } from "./components/PaymentTypeSelector"
import { CurrentPaymentForm } from "./components/CurrentPaymentForm"
import { HistoricalPaymentForm } from "./components/HistoricalPaymentForm"
import { LatePaymentForm } from "./components/LatePaymentForm"

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
  const [paymentType, setPaymentType] = useState<PaymentType>("current")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      />
      {renderPaymentForm()}
    </div>
  )
}