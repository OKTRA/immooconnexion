import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "../profile/ProfileForm"
import { AgencyUserActions } from "./AgencyUserActions"
import { Plus } from "lucide-react"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { useAddProfileHandler } from "../profile/AddProfileHandler"
import { useToast } from "@/hooks/use-toast"

interface AgencyUsersProps {
  agencyId: string
  onRefetch?: () => void
}

export function AgencyUsers({ agencyId, onRefetch }: AgencyUsersProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  const { data: users = [], refetch, isLoading, error } = useQuery({
    queryKey: ["agency-users", agencyId],
    queryFn: async () => {
      try {
        // Check if user is super admin first
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user?.id)
          .maybeSingle()

        if (adminError) throw adminError

        // If super admin, can fetch all users
        if (adminData?.is_super_admin) {
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
        }

        // For regular users, fetch based on permissions
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
      console.log("Saving edited user:", editedUser)
      const { error } = await supabase
        .from("profiles")
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
      console.error("Error updating user:", error)
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name || "-"}</TableCell>
                <TableCell>{user.last_name || "-"}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role || "user"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <AgencyUserActions
                    userId={user.id}
                    onEdit={() => handleEdit(user)}
                    refetch={refetch}
                  />
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Aucun utilisateur trouvé pour cette agence
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <ProfileForm
              newProfile={selectedUser}
              setNewProfile={handleSaveEdit}
              selectedAgencyId={agencyId}
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
        handleAddUser={handleAddUser}
      />
    </div>
  )
}