import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InitialPaymentForm } from "./InitialPaymentForm"
import { ApartmentLease } from "@/types/apartment"

interface InitialPaymentDialogProps {
  lease: ApartmentLease
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InitialPaymentDialog({
  lease,
  open,
  onOpenChange,
}: InitialPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Paiements Initiaux</DialogTitle>
        </DialogHeader>
        <InitialPaymentForm 
          lease={lease}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}