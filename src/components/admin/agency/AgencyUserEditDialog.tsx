import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { ProfileForm } from "../../admin/profile/ProfileForm"
import { Profile } from "../profile/types"
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

  const handleAuthUserCreation = async () => {
    if (handleCreateAuthUser) {
      return await handleCreateAuthUser()
    }
    return ""
  }

  const handleProfileUpdate = async (userId: string) => {
    if (handleUpdateProfile) {
      await handleUpdateProfile(userId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="py-6">
          <ProfileForm
            isEditing={!!userId}
            newProfile={newProfile}
            setNewProfile={setNewProfile}
            onCreateAuthUser={handleAuthUserCreation}
            onUpdateProfile={handleProfileUpdate}
            selectedAgencyId={agencyId}
            step={step}
            setStep={setStep}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}