import { Dialog, DialogContent as BaseDialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "./form/DialogHeader"
import { ProfileForm } from "../profile/ProfileForm"
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
  onSuccess
}: AgencyUserEditDialogProps) {
  const {
    newProfile,
    setNewProfile,
    isSubmitting,
    handleCreateAuthUser,
    handleUpdateProfile
  } = useAgencyUserEdit(userId || null, agencyId, () => {
    onSuccess?.()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <BaseDialogContent className="max-w-2xl">
        <DialogHeader isEditing={!!userId} />
        <ProfileForm
          isEditing={!!userId}
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          onCreateAuthUser={handleCreateAuthUser}
          onUpdateProfile={handleUpdateProfile}
          selectedAgencyId={agencyId}
        />
      </BaseDialogContent>
    </Dialog>
  )
}