import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SteppedProfileForm } from "../../admin/profile/form/SteppedProfileForm"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"
import { Profile } from "@/types/profile"

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
  onSuccess
}: AgencyUserEditDialogProps) {
  const [step, setStep] = useState(1)
  const {
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile
  } = useAgencyUserEdit(userId || null, agencyId, () => {
    onSuccess?.()
    onOpenChange(false)
  })

  const handleProfileChange = (data: Partial<Profile>) => {
    setNewProfile((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const handleStepSubmit = async () => {
    if (step === 1) {
      setStep(2)
      return
    }

    try {
      if (!userId) {
        await handleCreateAuthUser()
      } else {
        await handleUpdateProfile()
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{userId ? "Modifier" : "Ajouter"} un utilisateur</DialogTitle>
        </DialogHeader>
        <SteppedProfileForm
          isEditing={!!userId}
          newProfile={newProfile}
          setNewProfile={handleProfileChange}
          onCreateAuthUser={handleStepSubmit}
          onUpdateProfile={handleUpdateProfile}
          selectedAgencyId={agencyId}
          step={step}
          setStep={setStep}
        />
      </DialogContent>
    </Dialog>
  )
}