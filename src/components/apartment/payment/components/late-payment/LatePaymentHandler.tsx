import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PaymentFormData, PaymentPeriod } from "@/types/payment"
import { LatePaymentSummary } from "./LatePaymentSummary"
import { LatePaymentPeriodList } from "./LatePaymentPeriodList"
import { LatePaymentForm } from "./LatePaymentForm"
import { Card } from "@/components/ui/card"

interface LatePaymentHandlerProps {
  leaseId: string
  onSuccess?: () => void
}

export function LatePaymentHandler({ leaseId, onSuccess }: LatePaymentHandlerProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Mock data for now - will be replaced with real data from API
  const periods: PaymentPeriod[] = []
  const penalties = 0

  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriods(prev => 
      prev.includes(periodId) 
        ? prev.filter(id => id !== periodId)
        : [...prev, periodId]
    )
  }

  const handleSubmit = async (data: PaymentFormData) => {
    if (selectedPeriods.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une période",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement payment submission
      toast({
        title: "Succès",
        description: "Le paiement a été enregistré",
      })
      onSuccess?.()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = periods.reduce((sum, period) => sum + period.amount, 0) + penalties

  return (
    <div className="space-y-6">
      <LatePaymentSummary 
        periods={periods}
        penalties={penalties}
      />
      
      <LatePaymentPeriodList
        periods={periods}
        selectedPeriods={selectedPeriods}
        onPeriodSelect={handlePeriodSelect}
      />

      <Card className="p-6">
        <LatePaymentForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          totalAmount={totalAmount}
        />
      </Card>
    </div>
  )
}