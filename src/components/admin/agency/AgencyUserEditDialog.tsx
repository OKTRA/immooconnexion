import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "@/components/admin/profile/ProfileForm"
import { useAgencyUserEdit } from "../agency/hooks/useAgencyUserEdit"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"

interface AgencyUserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
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
  } = useAgencyUserEdit(userId, agencyId, onSuccess)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {userId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ProfileForm
              newProfile={newProfile}
              setNewProfile={setNewProfile}
              isEditing={!!userId}
              onCreateAuthUser={handleCreateAuthUser}
              onUpdateProfile={handleUpdateProfile}
              selectedAgencyId={agencyId}
              step={step}
              setStep={setStep}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}