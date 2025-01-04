import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentDialog } from "../payment/PaymentDialog"
import { useState } from "react"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
  amount?: number
  isUpgrade?: boolean
}

export function PricingDialog({ 
  open, 
  onOpenChange, 
  planId, 
  planName,
  amount = 0,
  isUpgrade = false
}: PricingDialogProps) {
  const [showPayment, setShowPayment] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Changement de plan - {planName}
          </DialogTitle>
        </DialogHeader>
        {showPayment && (
          <PaymentDialog
            open={showPayment}
            onOpenChange={setShowPayment}
            planId={planId}
            planName={planName}
            amount={amount}
            isUpgrade={true}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}