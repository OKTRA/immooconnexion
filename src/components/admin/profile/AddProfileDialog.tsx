import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "./ProfileForm"
import { useState } from "react"
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits"
import { useToast } from "@/hooks/use-toast"
import { UserRole } from "@/types/profile"

export interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencyId?: string
  onProfileCreated?: () => void
  newProfile?: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone_number: string
    role: UserRole
  }
  setNewProfile?: (profile: any) => void
  handleCreateAuthUser?: () => Promise<string>
  handleUpdateProfile?: (userId: string) => Promise<void>
  showAddDialog?: boolean
  setShowAddDialog?: (show: boolean) => void
}

export function AddProfileDialog({ 
  open, 
  onOpenChange,
  agencyId,
  onProfileCreated,
  newProfile,
  setNewProfile,
  handleCreateAuthUser,
  handleUpdateProfile
}: AddProfileDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const { checkLimitReached } = useSubscriptionLimits()
  const { toast } = useToast()

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen && agencyId) {
      const limitReached = await checkLimitReached('user')
      if (limitReached) {
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
          setStep={setStep}
          agencyId={agencyId}
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          onCreateAuthUser={handleCreateAuthUser}
          onUpdateProfile={handleUpdateProfile}
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