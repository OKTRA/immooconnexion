import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InitialPaymentForm } from "../form/InitialPaymentForm"
import { RegularPaymentForm } from "./RegularPaymentForm"
import { LeaseData } from "../types"

interface PaymentDialogsProps {
  lease: LeaseData;
  showInitialPaymentDialog: boolean;
  showRegularPaymentDialog: boolean;
  onInitialDialogChange: (show: boolean) => void;
  onRegularDialogChange: (show: boolean) => void;
  onSuccess?: () => void;
}

export function PaymentDialogs({
  lease,
  showInitialPaymentDialog,
  showRegularPaymentDialog,
  onInitialDialogChange,
  onRegularDialogChange,
  onSuccess
}: PaymentDialogsProps) {
  console.log("PaymentDialogs received lease:", {
    depositAmount: lease.deposit_amount,
    rentAmount: lease.rent_amount,
    paymentFrequency: lease.payment_frequency
  })

  return (
    <>
      <Dialog open={showInitialPaymentDialog} onOpenChange={onInitialDialogChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Paiements Initiaux</DialogTitle>
          </DialogHeader>
          <InitialPaymentForm
            leaseId={lease.id}
            depositAmount={lease.deposit_amount}
            rentAmount={lease.rent_amount}
            paymentFrequency={lease.payment_frequency}
            firstRentDate={new Date(lease.start_date)}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegularPaymentDialog} onOpenChange={onRegularDialogChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nouveau Paiement</DialogTitle>
          </DialogHeader>
          <RegularPaymentForm
            lease={lease}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}