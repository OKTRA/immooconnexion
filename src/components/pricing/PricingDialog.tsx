import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AgencySignupForm } from "./AgencySignupForm"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
}

export function PricingDialog({ open, onOpenChange, planId, planName }: PricingDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true)
      console.log("Form data to send to Orange Money:", {
        ...formData,
        subscription_plan_id: planId
      })

      // TODO: Integrate with Orange Money API here
      // For now, we'll simulate the API call
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subscription_plan_id: planId,
          phone: formData.user_phone // Orange Money requires the phone number
        })
      })

      if (!response.ok) {
        throw new Error('Failed to initiate payment')
      }

      const data = await response.json()
      
      // Redirect to Orange Money payment page or handle the response
      console.log("Payment initiated:", data)
      
      toast({
        title: "Redirection vers Orange Money",
        description: "Vous allez être redirigé vers la page de paiement",
      })

    } catch (error: any) {
      console.error('Error initiating payment:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'initiation du paiement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inscription - Plan {planName}</DialogTitle>
        </DialogHeader>
        <AgencySignupForm 
          subscriptionPlanId={planId} 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}