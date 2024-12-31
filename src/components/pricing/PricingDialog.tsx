import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AgencySignupForm } from "./AgencySignupForm"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { CinetPayForm } from "../payment/CinetPayForm"
import { SignupFormData } from "./types"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
}

export function PricingDialog({ open, onOpenChange, planId, planName }: PricingDialogProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [formData, setFormData] = useState<SignupFormData | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const handleSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      
      // Create auth user first
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

      if (!authData.user) throw new Error("No user data returned")

      // Store user ID for later use
      setUserId(authData.user.id)

      // Create initial profile with pending status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.agency_name,
          email: data.email,
          role: 'admin',
          status: 'pending'
        })
        .eq('id', authData.user.id)

      if (profileError) throw profileError

      setFormData({
        ...data,
        subscription_plan_id: planId
      })
      setShowPayment(true)
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du compte",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!userId || !formData) return

    try {
      // Update profile and create agency after successful payment
      const { error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: formData.agency_name,
          address: formData.agency_address,
          phone: formData.agency_phone,
          country: formData.country,
          city: formData.city,
          subscription_plan_id: planId,
          status: 'pending'
        })

      if (agencyError) throw agencyError

      // Sign out the user so they can log in properly
      await supabase.auth.signOut()

      setPaymentSuccess(true)
      toast({
        title: "Paiement réussi",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      })
    } catch (error: any) {
      console.error('Error finalizing account:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la finalisation du compte",
        variant: "destructive",
      })
    }
  }

  const handlePaymentError = (error: any) => {
    console.error('Error during payment:', error)
    toast({
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors du paiement",
      variant: "destructive",
    })
  }

  const handleClose = () => {
    if (paymentSuccess) {
      navigate('/login')
    }
    onOpenChange(false)
    setShowPayment(false)
    setPaymentSuccess(false)
    setFormData(null)
    setUserId(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Inscription réussie" 
              : showPayment 
                ? "Paiement" 
                : `Inscription - Plan ${planName}`}
          </DialogTitle>
          <DialogDescription>
            {paymentSuccess 
              ? "Votre compte est en cours d'examen par notre équipe."
              : showPayment 
                ? "Pour finaliser votre inscription, veuillez procéder au paiement."
                : "Remplissez le formulaire ci-dessous pour créer votre compte."}
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Nous avons bien reçu votre paiement et votre demande d'inscription. 
              Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <p className="text-sm text-gray-600">
              À votre première connexion, vous devrez compléter les informations de votre agence.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Aller à la page de connexion
              </Button>
            </div>
          </div>
        ) : showPayment ? (
          <Card className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Après validation du paiement, vous pourrez vous connecter à votre compte.
              </p>
              <CinetPayForm 
                amount={1000} // Remplacer par le montant réel du plan
                description={`Abonnement au plan ${planName}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </Card>
        ) : (
          <AgencySignupForm 
            subscriptionPlanId={planId} 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}