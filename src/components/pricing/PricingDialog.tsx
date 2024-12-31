import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AgencySignupForm } from "./AgencySignupForm"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { CinetPayForm } from "../payment/CinetPayForm"

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
  const [formData, setFormData] = useState<any>(null)

  const handleSubmit = async (data: any) => {
    setFormData({
      ...data,
      subscription_plan_id: planId
    })
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Demande envoyée",
      description: "Votre demande a été envoyée avec succès. Un administrateur examinera votre dossier.",
    })
    onOpenChange(false)
  }

  const handlePaymentError = (error: any) => {
    console.error('Error during payment:', error)
    toast({
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors du paiement",
      variant: "destructive",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showPayment ? "Paiement" : `Inscription - Plan ${planName}`}
          </DialogTitle>
        </DialogHeader>
        {showPayment ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Pour finaliser votre inscription, veuillez procéder au paiement.
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