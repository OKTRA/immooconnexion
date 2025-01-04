import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { CinetPayForm } from "./CinetPayForm"
import { PaydunyaForm } from "./PaydunyaForm"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { PaymentDialogProps } from "./types"
import { useForm } from "react-hook-form"
import { PaymentFormFields } from "./PaymentFormFields"
import { PaymentFormData, paymentFormSchema } from "./types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  planId, 
  planName, 
  amount = 0,
  isUpgrade = false,
  agencyId
}: PaymentDialogProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("cinetpay")
  const [step, setStep] = useState<'form' | 'payment'>(isUpgrade ? 'payment' : 'form')
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
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
  })

  const handleClose = () => {
    if (paymentSuccess) {
      navigate('/agence/dashboard')
    }
    onOpenChange(false)
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    toast({
      title: "Succès",
      description: isUpgrade 
        ? "Votre abonnement a été mis à jour avec succès" 
        : "Le paiement a été effectué avec succès",
    })
  }

  const onSubmit = (data: PaymentFormData) => {
    setStep('payment')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Paiement réussi" 
              : planName 
                ? `Paiement - Plan ${planName}` 
                : 'Paiement'}
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <div className="space-y-4">
            {paymentSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {isUpgrade 
                    ? "Votre abonnement a été mis à jour avec succès."
                    : "Votre paiement a été traité avec succès."}
                </p>
                <Button onClick={handleClose} className="w-full">
                  Retour au tableau de bord
                </Button>
              </div>
            ) : step === 'form' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <PaymentFormFields form={form} />
                  <Button type="submit" className="w-full">
                    Continuer vers le paiement
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <PaymentMethodSelector 
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
                {paymentMethod === "cinetpay" && (
                  <CinetPayForm 
                    amount={amount}
                    description={`${isUpgrade ? "Mise à niveau vers" : "Paiement pour"} ${planName}`}
                    agencyId={agencyId || planId}
                    onSuccess={handlePaymentSuccess}
                    formData={form.getValues()}
                  />
                )}
                {paymentMethod === "paydunya" && (
                  <PaydunyaForm 
                    amount={amount}
                    description={`${isUpgrade ? "Mise à niveau vers" : "Paiement pour"} ${planName}`}
                    agencyId={agencyId || planId}
                    onSuccess={handlePaymentSuccess}
                    formData={form.getValues()}
                  />
                )}
              </div>
            )}
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}