import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { useAddProfileHandler } from "../profile/AddProfileHandler"
import { AgencyUsersList } from "./AgencyUsersList"
import { AgencyUserEditDialog } from "./AgencyUserEditDialog"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"

interface AgencyUsersProps {
  agencyId: string
  onRefetch?: () => void
}

export function AgencyUsers({ agencyId, onRefetch }: AgencyUsersProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  const { data: users = [], refetch, isLoading, error } = useQuery({
    queryKey: ["agency-users", agencyId],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user?.id)
          .maybeSingle()

        if (adminError) throw adminError

        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            email,
            role,
            agency_id
          `)
          .eq("agency_id", agencyId)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      } catch (error: any) {
        console.error("Error fetching users:", error)
        throw error
      }
    },
  })

  const {
    showEditDialog,
    setShowEditDialog,
    editStep,
    setEditStep,
    selectedUser,
    handleUpdateAuth,
    handleUpdateProfile,
    handleEdit
  } = useAgencyUserEdit({ onSuccess: refetch })

  const { 
    newProfile, 
    setNewProfile, 
    handleCreateAuthUser, 
    handleUpdateProfile: handleAddProfileUpdate 
  } = useAddProfileHandler({
    onSuccess: refetch,
    onClose: () => setShowAddDialog(false),
    agencyId
  })

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

      <AgencyUsersList 
        users={users}
        onEdit={handleEdit}
        refetch={refetch}
        agencyId={agencyId}
      />

      <AgencyUserEditDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedUser={selectedUser}
        editStep={editStep}
        setEditStep={setEditStep}
        handleUpdateAuth={handleUpdateAuth}
        handleUpdateProfile={handleUpdateProfile}
        agencyId={agencyId}
      />

      <AddProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        agencyId={agencyId}
        onProfileCreated={refetch}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleCreateAuthUser={handleCreateAuthUser}
        handleUpdateProfile={handleAddProfileUpdate}
      />
    </div>
  )
}