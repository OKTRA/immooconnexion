import { DialogHeader as BaseDialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DialogHeaderProps {
  editingUnit: any
}

export function DialogHeader({ editingUnit }: DialogHeaderProps) {
  return (
    <BaseDialogHeader className="p-6 pb-0">
      <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
        {editingUnit ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
      </DialogTitle>
    </BaseDialogHeader>
  )
}