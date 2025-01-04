import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProfileForm } from "./ProfileForm"

export interface AddProfileDialogProps {
  showAddDialog?: boolean
  setShowAddDialog?: (show: boolean) => void
  newProfile?: any
  setNewProfile?: (profile: any) => void
  handleAddUser?: () => void
  handleCreateAuthUser?: () => Promise<string>
  handleUpdateProfile?: (userId: string) => Promise<void>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  agencyId?: string
  onProfileCreated?: () => void
}

export function AddProfileDialog({ 
  showAddDialog, 
  setShowAddDialog,
  newProfile,
  setNewProfile,
  handleCreateAuthUser,
  handleUpdateProfile,
  open,
  onOpenChange,
  agencyId,
  onProfileCreated
}: AddProfileDialogProps) {
  const isOpen = open ?? showAddDialog
  const handleOpenChange = onOpenChange ?? setShowAddDialog

  const handleSubmit = () => {
    if (onProfileCreated) {
      onProfileCreated()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau profil</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)] md:h-auto">
          <ProfileForm 
            newProfile={newProfile} 
            setNewProfile={setNewProfile}
            onSubmit={handleSubmit}
            onCreateAuthUser={handleCreateAuthUser}
            onUpdateProfile={handleUpdateProfile}
            selectedAgencyId={agencyId}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}