import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AgencyStatusDialogProps {
  agencyId: string
  currentStatus: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AgencyStatusDialog({ 
  agencyId, 
  currentStatus, 
  open, 
  onOpenChange, 
  onSuccess 
}: AgencyStatusDialogProps) {
  const { toast } = useToast()
  const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
  const actionText = currentStatus === 'blocked' ? 'débloquer' : 'bloquer'

  const handleStatusChange = async () => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ status: newStatus })
        .eq('id', agencyId)

      if (error) throw error

      toast({
        title: "Succès",
        description: `L'agence a été ${currentStatus === 'blocked' ? 'débloquée' : 'bloquée'} avec succès`,
      })
      
      onSuccess()
    } catch (error: any) {
      console.error('Error updating agency status:', error)
      toast({
        title: "Erreur",
        description: error.message || `Une erreur est survenue lors de la mise à jour du statut de l'agence`,
        variant: "destructive",
      })
    }
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l'action</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir {actionText} cette agence ? 
            {currentStatus === 'active' && " Cela empêchera l'agence d'accéder à ses données."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleStatusChange}
            className={currentStatus === 'blocked' ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}