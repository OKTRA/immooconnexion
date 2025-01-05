import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { ProfileForm } from "../../admin/profile/ProfileForm"
import { Profile } from "@/types/profile"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"

interface AgencyUserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  agencyId: string
  onSuccess?: () => void
}

export function AgencyUserEditDialog({
  open,
  onOpenChange,
  userId,
  agencyId,
  onSuccess,
}: AgencyUserEditDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  
  const {
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile,
  } = useAgencyUserEdit(userId, agencyId, onSuccess)

  const handleProfileChange = (profile: Partial<Profile>) => {
    setNewProfile(prev => ({
      ...prev,
      ...profile,
      agency_id: agencyId // Ensure agency_id is always set
    }))
  }

  const handleStepSubmit = async () => {
    if (step === 1) {
      // Just move to next step without creating auth user yet
      setStep(2)
      return
    }

    // Only create auth user on final step
    if (!userId) {
      await handleCreateAuthUser()
    } else {
      await handleUpdateProfile()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="py-6">
          <ProfileForm
            isEditing={!!userId}
            newProfile={newProfile}
            setNewProfile={handleProfileChange}
            onCreateAuthUser={handleStepSubmit}
            onUpdateProfile={handleUpdateProfile}
            selectedAgencyId={agencyId}
            step={step}
            setStep={setStep}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}