import { DialogTitle } from "@/components/ui/dialog"

interface DialogHeaderProps {
  children?: React.ReactNode;
  isEditing?: boolean;
}

export function DialogHeader({ children, isEditing }: DialogHeaderProps) {
  return (
    <DialogTitle>
      {children || (isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur")}
    </DialogTitle>
  )
}