import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./ProfileForm"
import { AgencyFields } from "./AgencyFields"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddProfileDialogProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  newProfile: any;
  setNewProfile: (profile: any) => void;
  handleAddUser: (agencyData?: any) => void;
}

export function AddProfileDialog({ 
  showAddDialog, 
  setShowAddDialog, 
  newProfile, 
  setNewProfile, 
  handleAddUser 
}: AddProfileDialogProps) {
  const [agencyData, setAgencyData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau profil</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="agency">Agence</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm newProfile={newProfile} setNewProfile={setNewProfile} />
          </TabsContent>
          <TabsContent value="agency">
            <AgencyFields agencyData={agencyData} setAgencyData={setAgencyData} />
          </TabsContent>
        </Tabs>
        <Button onClick={() => handleAddUser(agencyData)} className="w-full">
          Ajouter
        </Button>
      </DialogContent>
    </Dialog>
  );
}