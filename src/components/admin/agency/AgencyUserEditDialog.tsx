import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "./form/DialogHeader"
import { ProfileForm } from "../profile/ProfileForm"
import { Profile } from "../profile/types"

interface AgencyUserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProfile: Profile
  setNewProfile: (profile: Profile) => void
  handleCreateAuthUser: () => Promise<void>
  handleUpdateProfile: (userId: string) => Promise<void>
  isEditing: boolean
}

export function AgencyUserEditDialog({
  open,
  onOpenChange,
  newProfile,
  setNewProfile,
  handleCreateAuthUser,
  handleUpdateProfile,
  isEditing
}: AgencyUserEditDialogProps) {
  const handleSuccess = async () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader isEditing={isEditing} />
        <ProfileForm
          isEditing={isEditing}
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          onCreateAuthUser={handleCreateAuthUser}
          onUpdateProfile={handleUpdateProfile}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}