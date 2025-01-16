import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InitialPaymentForm } from "./InitialPaymentForm"

interface InitialPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
  agencyId: string
  defaultValues?: {
    deposit_amount: number
    agency_fees: number
  }
}

export function InitialPaymentDialog({
  open,
  onOpenChange,
  leaseId,
  agencyId,
  defaultValues,
}: InitialPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paiements initiaux</DialogTitle>
        </DialogHeader>
        <InitialPaymentForm
          leaseId={leaseId}
          agencyId={agencyId}
          onSuccess={() => onOpenChange(false)}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  )
}