import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CreditCard, PlusCircle } from "lucide-react"
import { InitialPaymentDialog } from "./components/InitialPaymentDialog"
import { RegularPaymentDialog } from "./components/RegularPaymentDialog"
import { ApartmentLease } from "@/types/apartment"

interface PaymentActionButtonProps {
  lease: ApartmentLease
}

export function PaymentActionButton({ lease }: PaymentActionButtonProps) {
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false)
  const [showRegularPaymentDialog, setShowRegularPaymentDialog] = useState(false)

  if (!lease.initial_payments_completed) {
    return (
      <>
        <Button 
          onClick={() => setShowInitialPaymentDialog(true)}
          variant="ghost"
          size="icon"
          className="text-green-600"
        >
          <CreditCard className="h-4 w-4" />
        </Button>

        <InitialPaymentDialog
          lease={lease}
          open={showInitialPaymentDialog}
          onOpenChange={setShowInitialPaymentDialog}
        />
      </>
    )
  }

  return (
    <>
      <Button 
        onClick={() => setShowRegularPaymentDialog(true)}
        variant="ghost"
        size="icon"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>

      <RegularPaymentDialog
        lease={lease}
        open={showRegularPaymentDialog}
        onOpenChange={setShowRegularPaymentDialog}
      />
    </>
  )
}