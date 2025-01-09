import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UnitTenantForm } from "../unit/UnitTenantForm"
import { useState } from "react"

interface ApartmentTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartmentId: string
  tenant?: any
}

export function ApartmentTenantDialog({
  open,
  onOpenChange,
  apartmentId,
  tenant
}: ApartmentTenantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <UnitTenantForm
          unitId={tenant?.unit_id || ""}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          initialData={tenant}
        />
      </DialogContent>
    </Dialog>
  )
}