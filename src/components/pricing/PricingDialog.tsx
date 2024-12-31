import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AgencySignupForm } from "./AgencySignupForm"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { CinetPayForm } from "../payment/CinetPayForm"
import { SignupFormData } from "./types"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
}

export function PricingDialog({ open, onOpenChange, planId, planName }: PricingDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState<SignupFormData | null>(null)

  const handleSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      // Store form data with plan information
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
    toast({
      title: "Demande envoyée",
      description: "Votre demande a été envoyée avec succès. Un administrateur examinera votre dossier.",
    })
    onOpenChange(false)
    // Reset states
    setShowPayment(false)
    setFormData(null)
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
    onOpenChange(false)
    // Reset states when dialog is closed
    setShowPayment(false)
    setFormData(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showPayment ? "Paiement" : `Inscription - Plan ${planName}`}
          </DialogTitle>
          <DialogDescription>
            {showPayment 
              ? "Pour finaliser votre inscription, veuillez procéder au paiement."
              : "Remplissez le formulaire ci-dessous pour créer votre compte."}
          </DialogDescription>
        </DialogHeader>
        {showPayment ? (
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