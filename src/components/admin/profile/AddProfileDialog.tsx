import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "./ProfileForm"
import { Profile } from "./types"

interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProfile: Profile
  setNewProfile: (profile: Profile) => void
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
          onSubmit={handleCreateAuthUser}
          onUpdate={handleUpdateProfile}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  )
}