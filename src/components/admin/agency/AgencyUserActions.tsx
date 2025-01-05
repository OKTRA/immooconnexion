import { Button } from "@/components/ui/button"
import { Lock, UserCog, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProfileForm } from "../profile/ProfileForm"

interface AgencyUserActionsProps {
  userId: string
  onEditAuth?: () => void
  onEditProfile: () => void
  refetch: () => void
}

export function AgencyUserActions({ userId, onEditAuth, onEditProfile, refetch }: AgencyUserActionsProps) {
  const { toast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  const handleDelete = async () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  const handleEditClick = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setProfileData(data)
      setShowEditDialog(true)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          email: updatedData.email,
          phone_number: updatedData.phone_number,
          role: updatedData.role,
        })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      })
      refetch()
      setShowEditDialog(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditAuth}
          className="text-blue-500 hover:text-blue-600"
        >
          <Lock className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className="text-green-500 hover:text-green-600"
        >
          <UserCog className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Modifier le profil</h2>
            {profileData && (
              <ProfileForm
                isEditing={true}
                newProfile={profileData}
                setNewProfile={setProfileData}
                onUpdateProfile={handleUpdateProfile}
                selectedAgencyId={profileData.agency_id}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}