import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "./PaymentForm"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
}

export function PaymentDialog({ 
  open, 
  onOpenChange,
  leaseId 
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau paiement</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          onSuccess={() => onOpenChange(false)}
          leaseId={leaseId}
        />
      </DialogContent>
    </Dialog>
  )
}