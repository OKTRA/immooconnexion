import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./ProfileForm"

interface AddProfileDialogProps {
  showAddDialog?: boolean
  setShowAddDialog?: (show: boolean) => void
  newProfile?: any
  setNewProfile?: (profile: any) => void
  handleAddUser?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddProfileDialog({ 
  showAddDialog, 
  setShowAddDialog,
  newProfile,
  setNewProfile,
  handleAddUser,
  open,
  onOpenChange,
}: AddProfileDialogProps) {
  const isOpen = open ?? showAddDialog
  const handleOpenChange = onOpenChange ?? setShowAddDialog

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau profil</DialogTitle>
        </DialogHeader>
        <ProfileForm 
          newProfile={newProfile} 
          setNewProfile={setNewProfile} 
        />
        <Button onClick={handleAddUser} className="w-full">
          Ajouter
        </Button>
      </DialogContent>
    </Dialog>
  )
}