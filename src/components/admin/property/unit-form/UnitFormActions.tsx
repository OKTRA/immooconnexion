import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"

interface UnitFormActionsProps {
  onClose: () => void;
  editingUnit?: any;
}

export function UnitFormActions({ onClose, editingUnit }: UnitFormActionsProps) {
  return (
    <DialogFooter>
      <Button variant="outline" type="button" onClick={onClose}>
        Annuler
      </Button>
      <Button type="submit">
        {editingUnit ? "Modifier" : "Ajouter"}
      </Button>
    </DialogFooter>
  )
}