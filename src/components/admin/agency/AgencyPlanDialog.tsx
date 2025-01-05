import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AgencySubscriptionPlan } from "./AgencySubscriptionPlan"
import { Agency } from "./types"

interface AgencyPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agency: Agency
  onPlanChange: (planId: string) => void
}

export function AgencyPlanDialog({ 
  open, 
  onOpenChange, 
  agency, 
  onPlanChange 
}: AgencyPlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le plan d'abonnement</DialogTitle>
        </DialogHeader>
        <AgencySubscriptionPlan 
          agency={agency}
          onPlanChange={(planId) => {
            onPlanChange(planId)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}