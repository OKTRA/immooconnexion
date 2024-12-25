import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "../profile/ProfileForm"
import { Plus } from "lucide-react"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { useAddProfileHandler } from "../profile/AddProfileHandler"
import { useToast } from "@/hooks/use-toast"
import { AgencyUsersList } from "./AgencyUsersList"

interface AgencyUsersProps {
  agencyId: string
  onRefetch?: () => void
}

export function AgencyUsers({ agencyId, onRefetch }: AgencyUsersProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [editStep, setEditStep] = useState<1 | 2>(1)
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

  const handleUpdateAuth = async (editedUser: any) => {
    try {
      // Check if email is being changed
      if (editedUser.email !== selectedUser.email) {
        // Check for duplicate email
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', editedUser.email)
          .single()

        if (existingUser) {
          toast({
            title: "Erreur",
            description: "Cet email est déjà utilisé",
            variant: "destructive",
          })
          return
        }
      }

      // Update auth user if password or email changed
      if (editedUser.password || editedUser.email !== selectedUser.email) {
        const updateData: any = {}
        if (editedUser.password) updateData.password = editedUser.password
        if (editedUser.email !== selectedUser.email) updateData.email = editedUser.email

        const { error: authError } = await supabase.auth.admin.updateUserById(
          editedUser.id,
          updateData
        )
        if (authError) throw authError
      }

      setSelectedUser(editedUser)
      setEditStep(2)
    } catch (error: any) {
      console.error("Error updating auth user:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProfile = async (editedUser: any) => {
    try {
      const { password, ...profileData } = editedUser
      
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", editedUser.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })
      refetch()
      setShowEditDialog(false)
      setEditStep(1)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setEditStep(1)
    setShowEditDialog(true)
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

      <AgencyUsersList 
        users={users}
        onEdit={handleEdit}
        refetch={refetch}
      />

      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setEditStep(1)
        }
        setShowEditDialog(open)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editStep === 1 ? "Modifier les informations d'authentification" : "Modifier le profil"}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <ProfileForm
              newProfile={selectedUser}
              setNewProfile={editStep === 1 ? handleUpdateAuth : handleUpdateProfile}
              selectedAgencyId={agencyId}
              isEditing={true}
              step={editStep}
            />
          )}
        </DialogContent>
      </Dialog>

      <AddProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        agencyId={agencyId}
        onProfileCreated={refetch}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleCreateAuthUser={handleCreateAuthUser}
        handleUpdateProfile={handleUpdateProfile}
      />
    </div>
  )
}