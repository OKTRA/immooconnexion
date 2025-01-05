import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "@/components/admin/profile/ProfileForm"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"
import { Profile } from "../profile/types"

interface AgencyUserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  agencyId: string;
  onSuccess?: () => void;
}

export function AgencyUserEditDialog({ 
  open, 
  onOpenChange,
  userId,
  agencyId,
  onSuccess
}: AgencyUserEditDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const { 
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile
  } = useAgencyUserEdit(userId, agencyId, onSuccess)

  const handleAuthUserCreation = async () => {
    await handleCreateAuthUser();
    return;
  }

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
              onCreateAuthUser={handleAuthUserCreation}
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