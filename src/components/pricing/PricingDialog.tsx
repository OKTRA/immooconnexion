import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AgencySignupForm } from "./AgencySignupForm"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
}

export function PricingDialog({ open, onOpenChange, planId, planName }: PricingDialogProps) {
  const handleSubmit = async (formData: any) => {
    // TODO: Intégrer avec l'API Orange Money
    console.log("Form data to send to Orange Money:", formData)
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
        />
      </DialogContent>
    </Dialog>
  )
}