import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "./ProfileForm"
import { useState } from "react"
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits"
import { useToast } from "@/hooks/use-toast"

interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencyId?: string
  onProfileCreated?: () => void
}

export function AddProfileDialog({ 
  open, 
  onOpenChange,
  agencyId,
  onProfileCreated
}: AddProfileDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const { checkAndNotifyLimits } = useSubscriptionLimits()
  const { toast } = useToast()

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen && agencyId) {
      const canAdd = await checkAndNotifyLimits(agencyId, 'user')
      if (!canAdd) {
        return
      }
    }
    if (!newOpen) {
      setStep(1)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Créer un compte" : "Informations du profil"}
          </DialogTitle>
        </DialogHeader>
        <ProfileForm
          step={step}
          onStepChange={setStep}
          agencyId={agencyId}
          onSuccess={() => {
            onProfileCreated?.()
            toast({
              title: "Succès",
              description: "Le profil a été créé avec succès",
            })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}