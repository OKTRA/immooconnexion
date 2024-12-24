import { Button } from "@/components/ui/button"
import { UserMinus, Trash2, Edit, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

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

  const handleToggleBlockUser = async (userId: string, currentRole: string | null) => {
    // Si l'utilisateur est bloqué, on le remet en tant qu'utilisateur normal
    // Sinon, on le met en tant qu'utilisateur normal (cas où il était admin)
    const newRole = currentRole === "admin" ? "user" : "admin"
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: currentRole === "admin" ? "Utilisateur rétrogradé" : "Utilisateur promu admin",
        description: currentRole === "admin" 
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
        onClick={() => handleDeleteUser(profile.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}