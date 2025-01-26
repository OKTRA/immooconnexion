import { Button } from "@/components/ui/button"
import { CreditCard, PlusCircle } from "lucide-react"

interface PaymentButtonsProps {
  initialPaymentsCompleted: boolean
  onInitialPaymentClick: () => void
  onRegularPaymentClick: () => void
}

export function PaymentButtons({
  initialPaymentsCompleted,
  onInitialPaymentClick,
  onRegularPaymentClick
}: PaymentButtonsProps) {
  return (
    <div className="flex gap-4 justify-end">
      {!initialPaymentsCompleted && (
        <Button 
          onClick={onInitialPaymentClick}
          className="bg-green-500 hover:bg-green-600"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Paiements Initiaux
        </Button>
      )}
      
      {initialPaymentsCompleted && (
        <Button onClick={onRegularPaymentClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Paiement de Loyer
        </Button>
      )}
    </div>
  )
}