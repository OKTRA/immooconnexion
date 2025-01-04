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
import { supabase } from "@/integrations/supabase/client"

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

  const handleFreePlanSignup = async (data: PaymentFormData) => {
    try {
      // Create auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signUpError) throw signUpError

      // Update agency status to active since it's free
      if (tempAgencyId) {
        const { error: updateError } = await supabase
          .from('agencies')
          .update({ 
            status: 'active',
            name: data.agency_name,
            address: data.agency_address,
            country: data.country,
            city: data.city,
            phone: data.phone_number
          })
          .eq('id', tempAgencyId)

        if (updateError) throw updateError
      }

      setPaymentSuccess(true)
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      })
    } catch (error: any) {
      console.error('Error during free plan signup:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
    }
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

    // Si le plan est gratuit, on bypass le paiement
    if (amount === 0) {
      await handleFreePlanSignup(data)
      return
    }

    // Sinon on continue avec le processus de paiement normal
    console.log("Form data submitted:", data)
    setFormData(data)
    setShowPaymentMethods(true)
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
    if (!formData) {
      return null
    }

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