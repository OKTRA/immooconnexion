import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector"
import { OrangeMoneyForm } from "@/components/payment/OrangeMoneyForm"
import { CinetPayForm } from "@/components/payment/CinetPayForm"
import { PaydunyaForm } from "@/components/payment/PaydunyaForm"
import { AgencyInfoFields } from "./registration/AgencyInfoFields"
import { AdminAccountFields } from "./registration/AdminAccountFields"
import { formSchema, FormData } from "./types"

interface AgencyRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId?: string
  planName?: string
  amount?: number
}

export function AgencyRegistrationDialog({ 
  open, 
  onOpenChange,
  planId,
  planName,
  amount = 0
}: AgencyRegistrationDialogProps) {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("orange_money")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirm_password: "",
    agency_name: "",
    agency_address: "",
    agency_phone: "",
    country: "",
    city: "",
    first_name: "",
    last_name: ""
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData
  })

  const handleSubmit = async (data: FormData) => {
    setFormData({ ...formData, ...data })
    setShowPaymentMethods(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {showPaymentMethods ? "Choisissez votre méthode de paiement" : "Inscription de l'agence"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh] px-6 pb-6">
          {!showPaymentMethods ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <AgencyInfoFields form={form} />
                <AdminAccountFields form={form} />
                <Button type="submit" className="w-full">
                  Continuer vers le paiement
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />

              {paymentMethod === "orange_money" && (
                <OrangeMoneyForm
                  amount={amount}
                  description={`Inscription - Plan ${planName}`}
                  planId={planId}
                  formData={formData}
                />
              )}

              {paymentMethod === "cinetpay" && (
                <CinetPayForm
                  amount={amount}
                  description={`Inscription - Plan ${planName}`}
                  agencyId={planId}
                  formData={formData}
                />
              )}

              {paymentMethod === "paydunya" && (
                <PaydunyaForm
                  amount={amount}
                  description={`Inscription - Plan ${planName}`}
                  agencyId={planId}
                  formData={formData}
                />
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}