import { Button } from "@/components/ui/button"
import { CreditCard, Euro } from "lucide-react"

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
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Paiements Initiaux
        </Button>
      )}
      
      {initialPaymentsCompleted && (
        <Button 
          onClick={onRegularPaymentClick}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Euro className="mr-2 h-4 w-4" />
          Payer le Loyer
        </Button>
      )}
    </div>
  )
}