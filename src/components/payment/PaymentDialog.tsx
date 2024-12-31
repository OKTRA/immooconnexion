import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormFields } from "./PaymentFormFields"
import { paymentFormSchema, type PaymentFormData, type PaymentDialogProps } from "./types"
import { CinetPayForm } from "./CinetPayForm"
import { Card } from "@/components/ui/card"

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  planId, 
  planName, 
  amount,
  tempAgencyId 
}: PaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Finaliser l'inscription - Plan {planName}</DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Pour finaliser votre inscription, veuillez créer votre compte et procéder au paiement.
            </p>
            <Form {...form}>
              <form className="space-y-4">
                <PaymentFormFields form={form} />
                <CinetPayForm 
                  amount={amount}
                  description={`Abonnement au plan ${planName}`}
                  agencyId={tempAgencyId}
                />
              </form>
            </Form>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}