import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InitialPaymentForm } from "@/components/apartment/payment/components/InitialPaymentForm"
import { PaymentForm } from "@/components/apartment/payment/PaymentForm"
import { LeaseData } from "../types"

interface PaymentDialogsProps {
  lease: LeaseData
  showInitialPaymentDialog: boolean
  showRegularPaymentDialog: boolean
  onInitialDialogChange: (open: boolean) => void
  onRegularDialogChange: (open: boolean) => void
  onSuccess: () => void
}

export function PaymentDialogs({
  lease,
  showInitialPaymentDialog,
  showRegularPaymentDialog,
  onInitialDialogChange,
  onRegularDialogChange,
  onSuccess
}: PaymentDialogsProps) {
  return (
    <>
      <Dialog open={showInitialPaymentDialog} onOpenChange={onInitialDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiements Initiaux</DialogTitle>
          </DialogHeader>
          <InitialPaymentForm 
            onSuccess={onSuccess}
            lease={lease}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegularPaymentDialog} onOpenChange={onRegularDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Paiement de Loyer</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            onSuccess={onSuccess}
            leaseId={lease.id}
            lease={lease}
            isHistorical={false}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}