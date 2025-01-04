import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UnitFormHeaderProps {
  editingUnit: any | null;
}

export function UnitFormHeader({ editingUnit }: UnitFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {editingUnit ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
      </DialogTitle>
    </DialogHeader>
  )
}