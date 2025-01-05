import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AgencyDeleteDialogProps {
  agencyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AgencyDeleteDialog({ agencyId, open, onOpenChange, onSuccess }: AgencyDeleteDialogProps) {
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      // First check if there are any contracts
      const { data: contracts } = await supabase
        .from('contracts')
        .select('id')
        .eq('agency_id', agencyId)
        .limit(1)

      if (contracts && contracts.length > 0) {
        toast({
          title: "Suppression impossible",
          description: "Cette agence a des contrats actifs. Veuillez d'abord les supprimer.",
          variant: "destructive",
        })
        onOpenChange(false)
        return
      }

      // Delete associated profiles first
      const { error: profilesError } = await supabase
        .from('profiles')
        .delete()
        .eq('agency_id', agencyId)

      if (profilesError) {
        console.error('Error deleting profiles:', profilesError)
        throw new Error("Erreur lors de la suppression des profils associés")
      }

      // Then delete the agency
      const { error: agencyError } = await supabase
        .from('agencies')
        .delete()
        .eq('id', agencyId)

      if (agencyError) throw agencyError

      toast({
        title: "Succès",
        description: "L'agence et ses données associées ont été supprimées avec succès",
      })
      
      onSuccess()
    } catch (error: any) {
      console.error('Error deleting agency:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de l'agence",
        variant: "destructive",
      })
    }
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement l'agence et toutes ses données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}