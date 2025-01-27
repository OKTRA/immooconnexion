import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaymentForm } from "../PaymentForm"
import { ApartmentLease } from "@/types/apartment"

interface RegularPaymentDialogProps {
  lease: ApartmentLease
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegularPaymentDialog({
  lease,
  open,
  onOpenChange,
}: RegularPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau Paiement de Loyer</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          lease={lease}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}