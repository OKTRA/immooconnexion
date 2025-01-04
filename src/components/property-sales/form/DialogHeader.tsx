import { DialogHeader as BaseDialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DialogHeaderProps {
  isEditing: boolean
}

export function DialogHeader({ isEditing }: DialogHeaderProps) {
  return (
    <BaseDialogHeader>
      <DialogTitle>
        {isEditing ? "Modifier la vente" : "Enregistrer une vente"}
      </DialogTitle>
    </BaseDialogHeader>
  )
}