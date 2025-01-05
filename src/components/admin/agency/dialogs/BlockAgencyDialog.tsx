import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Agency } from "@/integrations/supabase/types/agencies"

interface BlockAgencyDialogProps {
  agency: Agency
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function BlockAgencyDialog({ agency, open, onOpenChange, onConfirm }: BlockAgencyDialogProps) {
  const isBlocked = agency.status === 'blocked'
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBlocked ? 'Débloquer cette agence ?' : 'Bloquer cette agence ?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBlocked 
              ? "Cette action permettra aux utilisateurs de l'agence de se reconnecter."
              : "Cette action empêchera tous les utilisateurs de l'agence de se connecter."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isBlocked ? 'Débloquer' : 'Bloquer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}