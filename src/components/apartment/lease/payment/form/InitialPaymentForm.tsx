import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaymentCountdown } from "../components/PaymentCountdown"
import { InitialPaymentFields } from "../components/InitialPaymentFields"
import { useLeaseMutations } from "../hooks/useLeaseMutations"
import { PaymentMethod } from "@/types/payment"
import { toast } from "@/components/ui/use-toast"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [firstRentDate, setFirstRentDate] = useState<Date>(new Date())
  const { handleInitialPayments } = useLeaseMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!depositAmount || !rentAmount) {
      toast({
        title: "Erreur",
        description: "Les montants de la caution et du loyer sont requis",
        variant: "destructive"
      })
      return
    }

    console.log("Starting initial payment submission:", {
      leaseId,
      depositAmount,
      rentAmount,
      firstRentDate: firstRentDate.toISOString(),
      paymentFrequency
    })

    setIsSubmitting(true)

    try {
      const result = await handleInitialPayments.mutateAsync({
        leaseId,
        depositAmount,
        rentAmount,
        firstRentStartDate: firstRentDate
      })

      console.log("Initial payment submission result:", result)
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting initial payments:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InitialPaymentFields
        depositAmount={depositAmount}
        rentAmount={rentAmount}
        paymentMethod={paymentMethod}
        firstRentDate={firstRentDate}
        onPaymentMethodChange={setPaymentMethod}
        onFirstRentDateChange={setFirstRentDate}
      />

      {paymentFrequency && firstRentDate && (
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