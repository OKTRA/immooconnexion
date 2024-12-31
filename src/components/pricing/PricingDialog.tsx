import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AgencySignupForm } from "./AgencySignupForm"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { CinetPayForm } from "../payment/CinetPayForm"
import { SignupFormData } from "./types"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

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

  const handleSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      setFormData({
        ...data,
        subscription_plan_id: planId
      })
      setShowPayment(true)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission du formulaire",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    toast({
      title: "Paiement réussi",
      description: "Votre demande a été envoyée avec succès. Un administrateur examinera votre dossier.",
    })
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
              Nous avons bien reçu votre paiement et votre demande d'inscription. Notre équipe va examiner votre dossier dans les plus brefs délais.
            </p>
            <p className="text-sm text-gray-600">
              Vous recevrez un email dès que votre compte sera activé avec vos identifiants de connexion.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Retourner à la page de connexion
              </Button>
            </div>
          </div>
        ) : showPayment ? (
          <Card className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Après validation du paiement, votre demande sera examinée par notre équipe.
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