import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AgencyBlockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isBlocked: boolean
}

export function AgencyBlockDialog({ open, onOpenChange, onConfirm, isBlocked }: AgencyBlockDialogProps) {
  const { toast } = useToast()

  const handleConfirm = async () => {
    try {
      const newStatus = isBlocked ? 'active' : 'blocked'
      
      const { error } = await supabase
        .from('agencies')
        .update({ status: newStatus })
        .eq('id', agency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: newStatus === 'blocked' 
          ? "L'agence a été bloquée avec succès" 
          : "L'agence a été débloquée avec succès",
      })
      onConfirm()
    } catch (error: any) {
      console.error('Error toggling agency status:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la modification du statut",
        variant: "destructive",
      })
    }
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBlocked ? "Débloquer l'agence" : "Bloquer l'agence"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBlocked 
              ? "Êtes-vous sûr de vouloir débloquer cette agence ? Les utilisateurs pourront à nouveau se connecter."
              : "Êtes-vous sûr de vouloir bloquer cette agence ? Les utilisateurs ne pourront plus se connecter."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            {isBlocked ? "Débloquer" : "Bloquer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}