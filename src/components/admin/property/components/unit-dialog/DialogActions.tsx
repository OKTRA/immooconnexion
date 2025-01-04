import { Button } from "@/components/ui/button"

interface DialogActionsProps {
  onClose: () => void
  editingUnit: any
}

export function DialogActions({ onClose, editingUnit }: DialogActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onClose}>
        Annuler
      </Button>
      <Button
        type="submit"
        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
      >
        {editingUnit ? "Modifier" : "Ajouter"}
      </Button>
    </div>
  )
}