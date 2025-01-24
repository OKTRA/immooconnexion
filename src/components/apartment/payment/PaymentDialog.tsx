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
  tenantId?: string
  leaseId?: string
}

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  tenantId,
  leaseId 
}: PaymentDialogProps) {
  if (!tenantId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau Paiement</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          onSuccess={() => onOpenChange(false)} 
          tenantId={tenantId}
          leaseId={leaseId}
        />
      </DialogContent>
    </Dialog>
  )
}