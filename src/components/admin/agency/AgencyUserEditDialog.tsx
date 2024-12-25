import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "../profile/ProfileForm"

interface AgencyUserEditDialogProps {
  showEditDialog: boolean
  setShowEditDialog: (show: boolean) => void
  selectedUser: any
  editStep: 1 | 2
  setEditStep: (step: 1 | 2) => void
  handleUpdateAuth: (user: any) => Promise<void>
  handleUpdateProfile: (user: any) => Promise<void>
  agencyId: string
}

export function AgencyUserEditDialog({
  showEditDialog,
  setShowEditDialog,
  selectedUser,
  editStep,
  setEditStep,
  handleUpdateAuth,
  handleUpdateProfile,
  agencyId
}: AgencyUserEditDialogProps) {
  return (
    <Dialog open={showEditDialog} onOpenChange={(open) => {
      if (!open) {
        setEditStep(1)
      }
      setShowEditDialog(open)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editStep === 1 ? "Modifier les informations d'authentification" : "Modifier le profil"}
          </DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <ProfileForm
            newProfile={selectedUser}
            setNewProfile={editStep === 1 ? handleUpdateAuth : handleUpdateProfile}
            selectedAgencyId={agencyId}
            isEditing={true}
            step={editStep}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}