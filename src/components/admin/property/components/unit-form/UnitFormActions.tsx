import { Button } from "@/components/ui/button"

interface UnitFormActionsProps {
  onClose: () => void;
  editingUnit: any | null;
}

export function UnitFormActions({ onClose, editingUnit }: UnitFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onClose}>
        Annuler
      </Button>
      <Button type="submit">
        {editingUnit ? "Modifier" : "Ajouter"}
      </Button>
    </div>
  )
}