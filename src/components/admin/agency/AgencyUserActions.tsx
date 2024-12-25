import { Button } from "@/components/ui/button"
import { Edit, Trash2, Lock, UserCog } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AgencyUserActionsProps {
  userId: string
  onEditAuth: () => void
  onEditProfile: () => void
  refetch: () => void
}

export function AgencyUserActions({ userId, onEditAuth, onEditProfile, refetch }: AgencyUserActionsProps) {
  const { toast } = useToast()

  const handleDelete = async () => {
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
    }
  }

  return (
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
        onClick={onEditProfile}
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
  )
}