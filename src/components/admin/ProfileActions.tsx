import { Button } from "@/components/ui/button"
import { UserMinus, Trash2, UserPlus, Edit, UserCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ProfileActionsProps {
  profile: {
    id: string
    role: string
  }
  onEdit: (profile: any) => void
  refetch: () => void
}

export function ProfileActions({ profile, onEdit, refetch }: ProfileActionsProps) {
  const { toast } = useToast()

  const handleToggleBlockUser = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "blocked" ? "user" : "blocked"
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: currentRole === "blocked" ? "Utilisateur débloqué" : "Utilisateur bloqué",
        description: currentRole === "blocked" 
          ? "L'utilisateur a été débloqué avec succès"
          : "L'utilisateur a été bloqué avec succès",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleToggleBlockUser(profile.id, profile.role || "user")}
        title={profile.role === "blocked" ? "Débloquer" : "Bloquer"}
      >
        {profile.role === "blocked" ? (
          <UserCheck className="h-4 w-4" />
        ) : (
          <UserMinus className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(profile)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => handleDeleteUser(profile.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}