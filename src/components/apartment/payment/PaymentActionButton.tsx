import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentDialog } from "./PaymentDialog"
import { useState } from "react"

interface PaymentActionButtonProps {
  tenantId?: string
  leaseId?: string
}

export function PaymentActionButton({ tenantId, leaseId }: PaymentActionButtonProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowPaymentDialog(true)}
        title="Effectuer un paiement"
      >
        <CreditCard className="h-4 w-4" />
      </Button>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tenantId={tenantId}
        leaseId={leaseId}
      />
    </>
  )
}