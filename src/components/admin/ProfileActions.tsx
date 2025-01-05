import { Button } from "@/components/ui/button"
import { UserMinus, Trash2, Edit, UserCheck } from "lucide-react"
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

interface ProfileActionsProps {
  profile: {
    id: string
    role: string | null
  }
  onEdit: () => void
  refetch: () => void
}

export function ProfileActions({ profile, onEdit, refetch }: ProfileActionsProps) {
  const { toast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRoleConfirm, setShowRoleConfirm] = useState(false)

  const handleToggleBlockUser = async (userId: string, currentRole: string | null) => {
    setShowRoleConfirm(true)
  }

  const confirmRoleChange = async () => {
    const newRole = profile.role === "admin" ? "user" : "admin"
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: profile.role === "admin" ? "Utilisateur rétrogradé" : "Utilisateur promu admin",
        description: profile.role === "admin" 
          ? "L'utilisateur a été rétrogradé avec succès"
          : "L'utilisateur a été promu admin avec succès",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut de l'utilisateur",
        variant: "destructive",
      })
    } finally {
      setShowRoleConfirm(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleToggleBlockUser(profile.id, profile.role)}
          title={profile.role === "admin" ? "Rétrograder" : "Promouvoir admin"}
        >
          {profile.role === "admin" ? (
            <UserMinus className="h-4 w-4" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
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

      <AlertDialog open={showRoleConfirm} onOpenChange={setShowRoleConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le changement de rôle</AlertDialogTitle>
            <AlertDialogDescription>
              {profile.role === "admin" 
                ? "Êtes-vous sûr de vouloir rétrograder cet utilisateur ?"
                : "Êtes-vous sûr de vouloir promouvoir cet utilisateur en tant qu'administrateur ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}