import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/apartment/payment/PaymentForm"
import { LeaseData } from "../types"

interface PaymentDialogsProps {
  showInitialPaymentDialog: boolean
  showRegularPaymentDialog: boolean
  setShowInitialPaymentDialog: (show: boolean) => void
  setShowRegularPaymentDialog: (show: boolean) => void
  onSuccess: () => void
  leaseId: string
  lease: LeaseData
}

export function PaymentDialogs({
  showInitialPaymentDialog,
  showRegularPaymentDialog,
  setShowInitialPaymentDialog,
  setShowRegularPaymentDialog,
  onSuccess,
  leaseId,
  lease
}: PaymentDialogsProps) {
  return (
    <>
      <Dialog open={showInitialPaymentDialog} onOpenChange={setShowInitialPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiements Initiaux</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            onSuccess={onSuccess}
            leaseId={leaseId}
            lease={lease}
            isHistorical={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegularPaymentDialog} onOpenChange={setShowRegularPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Paiement de Loyer</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            onSuccess={onSuccess}
            leaseId={leaseId}
            lease={lease}
            isHistorical={false}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}