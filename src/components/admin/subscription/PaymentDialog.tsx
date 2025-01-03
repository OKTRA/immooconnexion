import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CinetPayForm } from "@/components/payment/CinetPayForm"
import { PaymentFormData } from "@/components/payment/types"
import { PaymentDialogProps } from "./types"

export function PaymentDialog({ plan, isOpen, onOpenChange, onSuccess }: PaymentDialogProps) {
  const defaultFormData: PaymentFormData = {
    email: "",
    password: "",
    confirm_password: "",
    agency_name: "",
    agency_address: "",
    country: "",
    city: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paiement du plan {plan.name}</DialogTitle>
        </DialogHeader>
        <CinetPayForm
          amount={plan.price}
          description={`Abonnement au plan ${plan.name}`}
          onSuccess={onSuccess}
          formData={defaultFormData}
        />
      </DialogContent>
    </Dialog>
  )
}