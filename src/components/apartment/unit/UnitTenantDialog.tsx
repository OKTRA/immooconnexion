import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UnitTenantForm } from "./UnitTenantForm"
import { useState } from "react"

export interface UnitTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unitId: string
  initialData?: any
}

export function UnitTenantDialog({
  open,
  onOpenChange,
  unitId,
  initialData
}: UnitTenantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <UnitTenantForm
          unitId={unitId}
          initialData={initialData}
          onSuccess={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}