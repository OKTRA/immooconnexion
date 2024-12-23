import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AgencyUserTable } from "./users/AgencyUserTable"
import { EditUserDialog } from "./users/EditUserDialog"
import { useAgencyUsers } from "./users/useAgencyUsers"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { useAddProfileHandler } from "../profile/AddProfileHandler"

interface AgencyUsersProps {
  agencyId: string
  onRefetch?: () => void
}

export function AgencyUsers({ agencyId, onRefetch }: AgencyUsersProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  const { data: users = [], refetch, isLoading, error } = useAgencyUsers(agencyId)

  const { newProfile, setNewProfile, handleAddUser } = useAddProfileHandler({
    onSuccess: () => {
      refetch()
      setShowAddDialog(false)
      toast({
        title: "Succès",
        description: "L'utilisateur a été ajouté avec succès",
      })
    },
    onClose: () => setShowAddDialog(false),
    agencyId
  })

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleSaveEdit = async (editedUser: any) => {
    try {
      const { error } = await supabase
        .from("local_admins")
        .update(editedUser)
        .eq("id", editedUser.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })
      refetch()
      setShowEditDialog(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Chargement des utilisateurs...</div>
  }

  if (error) {
    return <div>Erreur lors du chargement des utilisateurs</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un agent
        </Button>
      </div>

      <AgencyUserTable 
        users={users}
        onEdit={handleEdit}
        refetch={refetch}
      />

      <EditUserDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        selectedUser={selectedUser}
        onSave={handleSaveEdit}
        agencyId={agencyId}
      />

      <AddProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        agencyId={agencyId}
        onProfileCreated={refetch}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleAddUser={handleAddUser}
      />
    </div>
  )
}