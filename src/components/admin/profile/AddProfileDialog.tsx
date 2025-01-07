import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "./ProfileForm"
import { Profile, ProfileFormData } from "@/types/profile"

interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProfile: ProfileFormData
  setNewProfile: (profile: ProfileFormData) => void
  handleCreateAuthUser: () => Promise<void>
  handleUpdateProfile: (userId: string) => Promise<void>
  isEditing?: boolean
}

export function AddProfileDialog({
  open,
  onOpenChange,
  newProfile,
  setNewProfile,
  handleCreateAuthUser,
  handleUpdateProfile,
  isEditing = false
}: AddProfileDialogProps) {
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
          <DialogTitle>
            {isEditing ? "Modifier le profil" : "Ajouter un nouveau profil"}
          </DialogTitle>
        </DialogHeader>
        <ProfileForm
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          onSuccess={handleSuccess}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  )
}