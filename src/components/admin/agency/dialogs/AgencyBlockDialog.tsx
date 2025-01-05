import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface AgencyBlockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isBlocked: boolean
}

export function AgencyBlockDialog({ open, onOpenChange, onConfirm, isBlocked }: AgencyBlockDialogProps) {
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
            onClick={onConfirm}
            className={isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            {isBlocked ? "Débloquer" : "Bloquer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}