import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "./PaymentForm"
import { LeaseData } from "./types"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
  lease: LeaseData
}

export function PaymentDialog({
  open,
  onOpenChange,
  leaseId,
  lease
}: PaymentDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestion des Paiements</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          leaseId={leaseId}
          lease={lease}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}