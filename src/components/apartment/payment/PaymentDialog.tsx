import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "./PaymentForm"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
  paymentType?: 'rent' | 'deposit' | 'agency_fees'
}

export function PaymentDialog({ 
  open, 
  onOpenChange,
  leaseId,
  paymentType = 'rent'
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {paymentType === 'rent' ? 'Nouveau paiement de loyer' : 
             paymentType === 'deposit' ? 'Paiement de la caution' : 
             'Paiement des frais d\'agence'}
          </DialogTitle>
        </DialogHeader>
        <PaymentForm 
          onSuccess={() => onOpenChange(false)}
          leaseId={leaseId}
          paymentType={paymentType}
        />
      </DialogContent>
    </Dialog>
  )
}