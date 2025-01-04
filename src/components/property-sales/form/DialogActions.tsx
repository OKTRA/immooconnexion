import { Button } from "@/components/ui/button"

interface DialogActionsProps {
  onCancel: () => void
  onSubmit: () => void
  isSubmitting: boolean
  isEditing: boolean
}

export function DialogActions({ onCancel, onSubmit, isSubmitting, isEditing }: DialogActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : isEditing ? "Modifier" : "Enregistrer"}
      </Button>
    </div>
  )
}