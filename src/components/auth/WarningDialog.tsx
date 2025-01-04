import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface WarningDialogProps {
  open: boolean
  onClose: () => void
}

export function WarningDialog({ open, onClose }: WarningDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Avertissement Important</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bienvenue sur notre plateforme. Avant de continuer, veuillez prendre note des points suivants :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Toute utilisation malveillante de la plateforme entraînera la suspension immédiate de votre compte</li>
              <li>En cas de non-respect des conditions d'utilisation, votre compte sera bloqué sans possibilité de remboursement</li>
              <li>Vous êtes responsable de toutes les actions effectuées depuis votre compte</li>
            </ul>
            <p className="font-semibold mt-4">
              En continuant, vous acceptez ces conditions.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            J'ai compris et j'accepte
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}