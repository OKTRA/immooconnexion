import { DialogTitle } from "@/components/ui/dialog"

interface DialogHeaderProps {
  isEditing: boolean
}

export function DialogHeader({ isEditing }: DialogHeaderProps) {
  return (
    <DialogTitle>
      {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
    </DialogTitle>
  )
}