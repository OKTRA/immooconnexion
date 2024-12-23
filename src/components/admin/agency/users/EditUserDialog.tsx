import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "../../profile/ProfileForm"

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUser: any
  onSave: (editedUser: any) => void
  agencyId: string
}

export function EditUserDialog({ 
  open, 
  onOpenChange, 
  selectedUser, 
  onSave,
  agencyId 
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <ProfileForm
            newProfile={selectedUser}
            setNewProfile={onSave}
            selectedAgencyId={agencyId}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}