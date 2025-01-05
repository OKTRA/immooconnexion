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
import { FreeSignupForm } from "./FreeSignupForm"
import { Loader2 } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)
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
      navigate('/agence/login')
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

  const onSubmit = async (data: PaymentFormData) => {
    if (amount === 0) {
      setIsLoading(true)
      return
    }
    setStep('payment')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Inscription réussie" 
              : planName 
                ? `${isUpgrade ? 'Mise à niveau -' : 'Inscription -'} Plan ${planName}` 
                : 'Inscription'}
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <div className="space-y-4">
            {paymentSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {isUpgrade 
                    ? "Votre abonnement a été mis à jour avec succès."
                    : "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."}
                </p>
                <Button onClick={handleClose} className="w-full">
                  {isUpgrade ? "Retour au tableau de bord" : "Aller à la page de connexion"}
                </Button>
              </div>
            ) : !isUpgrade && step === 'form' ? (
              amount === 0 ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <PaymentFormFields form={form} />
                    <FreeSignupForm 
                      formData={form.getValues()} 
                      tempAgencyId={agencyId || planId}
                      onSuccess={() => {
                        setPaymentSuccess(true)
                        navigate('/agence/login')
                      }}
                    />
                  </form>
                </Form>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <PaymentFormFields form={form} />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        "Continuer vers le paiement"
                      )}
                    </Button>
                  </form>
                </Form>
              )
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