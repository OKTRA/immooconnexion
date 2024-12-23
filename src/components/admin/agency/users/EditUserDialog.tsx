import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "../../profile/ProfileForm"
import { Button } from "@/components/ui/button"

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
  const [editedProfile, setEditedProfile] = useState(selectedUser)

  const handleSave = () => {
    onSave(editedProfile)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <>
            <ProfileForm
              newProfile={editedProfile}
              setNewProfile={setEditedProfile}
              selectedAgencyId={agencyId}
            />
            <Button onClick={handleSave} className="w-full">
              Enregistrer
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}