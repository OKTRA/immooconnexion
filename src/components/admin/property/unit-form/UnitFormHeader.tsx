import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UnitFormHeaderProps {
  editingUnit?: any;
}

export function UnitFormHeader({ editingUnit }: UnitFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {editingUnit ? "Modifier l'unité" : "Ajouter une unité"}
      </DialogTitle>
    </DialogHeader>
  )
}