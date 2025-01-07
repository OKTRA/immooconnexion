import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "../form/DialogHeader"
import { ProfileForm } from "../../profile/ProfileForm"
import { ProfileFormData } from "@/types/profile"

interface AgencyUserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProfile: ProfileFormData
  setNewProfile: (profile: ProfileFormData) => void
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
    if (isEditing && newProfile.id) {
      await handleUpdateProfile(newProfile.id)
    } else {
      await handleCreateAuthUser()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        </DialogHeader>
        <ProfileForm
          isEditing={isEditing}
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}