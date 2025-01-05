import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "../../admin/profile/ProfileForm"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"
import { Profile } from "@/types/profile"

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
    handleCreateAuthUser,
    handleUpdateProfile
  } = useAgencyUserEdit(userId || null, agencyId, () => {
    onSuccess?.()
    onOpenChange(false)
  })

  const handleProfileChange = (data: Partial<Profile>) => {
    setNewProfile((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!userId) {
        await handleCreateAuthUser()
      } else {
        await handleUpdateProfile()
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{userId ? "Modifier" : "Ajouter"} un utilisateur</DialogTitle>
        </DialogHeader>
        <ProfileForm
          isEditing={!!userId}
          newProfile={newProfile}
          setNewProfile={handleProfileChange}
          onCreateAuthUser={handleSubmit}
          onUpdateProfile={handleUpdateProfile}
          selectedAgencyId={agencyId}
        />
      </DialogContent>
    </Dialog>
  )
}