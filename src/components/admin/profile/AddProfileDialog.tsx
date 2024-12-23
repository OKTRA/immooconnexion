import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./ProfileForm"

interface AddProfileDialogProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  newProfile: any;
  setNewProfile: (profile: any) => void;
  handleAddUser: () => void;
}

export function AddProfileDialog({ 
  showAddDialog, 
  setShowAddDialog, 
  newProfile, 
  setNewProfile, 
  handleAddUser 
}: AddProfileDialogProps) {
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau profil</DialogTitle>
        </DialogHeader>
        <ProfileForm newProfile={newProfile} setNewProfile={setNewProfile} />
        <Button onClick={handleAddUser} className="w-full">
          Ajouter
        </Button>
      </DialogContent>
    </Dialog>
  );
}