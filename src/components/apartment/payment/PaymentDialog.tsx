import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaymentForm } from "./PaymentForm"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
}

export function PaymentDialog({ open, onOpenChange, tenantId }: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Effectuer un paiement</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          onSuccess={() => onOpenChange(false)} 
          tenantId={tenantId}
        />
      </DialogContent>
    </Dialog>
  )
}