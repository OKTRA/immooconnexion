import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyUsersList } from "./AgencyUsersList"
import { AgencyUserEditDialog } from "./AgencyUserEditDialog"
import { useToast } from "@/hooks/use-toast"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"
import { Profile } from "../profile/types"

interface AgencyUsersProps {
  agencyId: string
  onRefetch?: () => void
}

export function AgencyUsers({ agencyId, onRefetch }: AgencyUsersProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: users = [], refetch } = useQuery({
    queryKey: ["agency-users", agencyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error)
        throw error
      }

      return data as Profile[]
    },
  })

  const {
    newProfile,
    setNewProfile,
    isSubmitting,
    handleCreateAuthUser,
    handleUpdateProfile,
  } = useAgencyUserEdit(selectedUserId, agencyId, async () => {
    await refetch()
    if (onRefetch) {
      onRefetch()
    }
    setShowEditDialog(false)
    setSelectedUserId(null)
  })

  const handleEdit = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId)
    if (userToEdit) {
      setNewProfile({
        ...userToEdit,
        password: "", // Clear password for edit form
      })
      setSelectedUserId(userId)
      setShowEditDialog(true)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès",
      })
      
      await refetch()
      if (onRefetch) {
        onRefetch()
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <AgencyUsersList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AgencyUserEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        isSubmitting={isSubmitting}
        handleCreateAuthUser={handleCreateAuthUser}
        handleUpdateProfile={handleUpdateProfile}
        isEditing={!!selectedUserId}
      />
    </div>
  )
}