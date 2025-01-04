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

    // Si le plan est gratuit, créer directement l'agence et le profil
    if (amount === 0) {
      try {
        // Créer l'utilisateur auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              role: 'admin',
            },
          },
        })

        if (authError) throw authError
        if (!authData.user) throw new Error("Aucun utilisateur créé")

        // Créer l'agence
        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .insert({
            name: data.agency_name,
            email: data.email,
            phone: data.phone_number,
            address: data.agency_address,
            subscription_plan_id: planId,
            status: 'active', // Actif immédiatement pour les plans gratuits
            country: data.country,
            city: data.city
          })
          .select()
          .single()

        if (agencyError) throw agencyError

        // Mettre à jour le profil avec l'ID de l'agence
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            agency_id: agencyData.id,
            role: 'admin',
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number
          })
          .eq('id', authData.user.id)

        if (profileError) throw profileError

        // Créer l'entrée administrateur
        const { error: adminError } = await supabase
          .from('administrators')
          .insert({
            id: authData.user.id,
            agency_id: agencyData.id,
            is_super_admin: false
          })

        if (adminError) throw adminError

        setPaymentSuccess(true)
        toast({
          title: "Succès",
          description: "Votre compte a été créé avec succès",
        })
      } catch (error: any) {
        console.error('Error during free signup:', error)
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la création du compte",
          variant: "destructive"
        })
      }
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
                {paymentMethod === "cinetpay" && formData && (
                  <CinetPayForm 
                    amount={amount}
                    description={`Abonnement au plan ${planName}`}
                    agencyId={tempAgencyId}
                    onSuccess={() => setPaymentSuccess(true)}
                    formData={formData}
                  />
                )}
                {paymentMethod === "paydunya" && formData && (
                  <PaydunyaForm 
                    amount={amount}
                    description={`Abonnement au plan ${planName}`}
                    agencyId={tempAgencyId}
                    onSuccess={() => setPaymentSuccess(true)}
                    formData={formData}
                  />
                )}
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