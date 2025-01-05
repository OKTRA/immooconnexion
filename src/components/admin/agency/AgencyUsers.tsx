import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { useAddProfileHandler } from "../profile/AddProfileHandler"
import { AgencyUsersList } from "./AgencyUsersList"
import { AgencyUserEditDialog } from "./AgencyUserEditDialog"
import { useToast } from "@/hooks/use-toast"

interface AgencyUsersProps {
  agencyId: string
  onRefetch?: () => void
}

export function AgencyUsers({ agencyId, onRefetch }: AgencyUsersProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { toast } = useToast()
  
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

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId)
    setShowEditDialog(true)
  }

  const { 
    newProfile, 
    setNewProfile, 
    handleCreateAuthUser, 
    handleUpdateProfile: handleAddProfileUpdate 
  } = useAddProfileHandler({
    onSuccess: () => {
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès",
      })
      refetch()
      setShowAddDialog(false)
    },
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
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        userId={selectedUserId}
        agencyId={agencyId}
        onSuccess={() => {
          toast({
            title: "Utilisateur mis à jour",
            description: "L'utilisateur a été mis à jour avec succès",
          })
          refetch()
          setShowEditDialog(false)
        }}
      />

      <AddProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleCreateAuthUser={handleCreateAuthUser}
        handleUpdateProfile={handleAddProfileUpdate}
      />
    </div>
  )
}