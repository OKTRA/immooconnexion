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

  const handleProfileChange = (profile: Profile) => {
    setNewProfile(profile)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="py-6">
          <ProfileForm
            isEditing={!!userId}
            newProfile={newProfile}
            setNewProfile={handleProfileChange}
            onCreateAuthUser={handleCreateAuthUser}
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