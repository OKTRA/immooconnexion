import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PropertyUnitForm } from "./PropertyUnitForm"
import { usePropertyUnitForm } from "./hooks/usePropertyUnitForm"
import { PropertyUnitFormData } from "./types/propertyUnit"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface PropertyUnitDialogProps {
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: PropertyUnitFormData
}

export function PropertyUnitDialog({
  propertyId,
  open,
  onOpenChange,
  initialData
}: PropertyUnitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { formData, setFormData, handleSubmit } = usePropertyUnitForm(propertyId, initialData)

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    const success = await handleSubmit()
    setIsSubmitting(false)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleFieldChange = (field: keyof PropertyUnitFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>

        <PropertyUnitForm
          formData={formData}
          onChange={handleFieldChange}
        />

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleFormSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Modification..." : "Création..."}
              </>
            ) : (
              initialData ? "Modifier" : "Créer"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}