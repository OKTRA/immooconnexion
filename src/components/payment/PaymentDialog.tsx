import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormFields } from "./PaymentFormFields"
import { paymentFormSchema, type PaymentFormData, type PaymentDialogProps } from "./types"
import { CinetPayForm } from "./CinetPayForm"
import { PaydunyaForm } from "./PaydunyaForm"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { FreeSignupForm } from "./FreeSignupForm"

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  planId, 
  planName, 
  amount,
  tempAgencyId,
  propertyId 
}: PaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("cinetpay")
  const [formData, setFormData] = useState<PaymentFormData | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    toast({
      title: "Succès",
      description: "Votre paiement a été traité. Vous pouvez maintenant vous connecter pour accéder à votre tableau de bord.",
    })
  }

  const handleFormSubmit = async (data: PaymentFormData) => {
    const result = await form.trigger()
    if (!result) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      })
      return
    }

    setFormData(data)
    // Si le plan est gratuit, on ne montre pas les méthodes de paiement
    if (amount === 0) {
      setShowPaymentMethods(false)
    } else {
      setShowPaymentMethods(true)
    }
  }

  const handleClose = () => {
    if (paymentSuccess) {
      navigate('/agence/login')
    }
    setShowPaymentMethods(false)
    setFormData(null)
    onOpenChange(false)
  }

  const renderPaymentForm = () => {
    if (!formData) return null

    // Si le plan est gratuit, on affiche le formulaire d'inscription gratuite
    if (amount === 0) {
      return (
        <FreeSignupForm 
          formData={formData}
          tempAgencyId={tempAgencyId}
          onSuccess={() => setPaymentSuccess(true)}
        />
      )
    }

    // Sinon on affiche le formulaire de paiement approprié
    switch (paymentMethod) {
      case "cinetpay":
        return (
          <CinetPayForm 
            amount={amount || 0}
            description={planName ? `Abonnement au plan ${planName}` : 'Paiement'}
            agencyId={tempAgencyId}
            onSuccess={handlePaymentSuccess}
            formData={formData}
          />
        )
      case "paydunya":
        return (
          <PaydunyaForm 
            amount={amount || 0}
            description={planName ? `Abonnement au plan ${planName}` : 'Paiement'}
            agencyId={tempAgencyId}
            onSuccess={handlePaymentSuccess}
            formData={formData}
          />
        )
      case "orange-money":
        return (
          <div className="text-center p-4">
            <p className="text-sm text-gray-500">
              L'intégration Orange Money sera bientôt disponible
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Inscription réussie" 
              : planName 
                ? `Finaliser l'inscription - Plan ${planName}` 
                : 'Paiement'}
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <div className="space-y-4">
            {paymentSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {amount === 0 
                    ? "Votre compte a été créé. Vous pouvez maintenant vous connecter pour accéder à votre tableau de bord."
                    : "Votre paiement a été traité et votre compte a été créé. Vous pouvez maintenant vous connecter pour accéder à votre tableau de bord."}
                </p>
                <Button onClick={handleClose} className="w-full">
                  Aller à la connexion
                </Button>
              </div>
            ) : formData && amount === 0 ? (
              renderPaymentForm()
            ) : showPaymentMethods && amount > 0 ? (
              <div className="space-y-4">
                <PaymentMethodSelector 
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
                {renderPaymentForm()}
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                  <PaymentFormFields form={form} />
                  <Button type="submit" className="w-full">
                    {amount === 0 ? "Créer mon compte" : "Continuer"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}