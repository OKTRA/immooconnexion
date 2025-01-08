import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ApartmentTenantForm } from "./ApartmentTenantForm"
import { useState } from "react"
import { ApartmentUnit } from "@/types/apartment"

interface ApartmentTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant?: any
  apartmentId: string
  availableUnits: ApartmentUnit[]
}

export function ApartmentTenantDialog({
  open,
  onOpenChange,
  tenant,
  apartmentId,
  availableUnits
}: ApartmentTenantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <ApartmentTenantForm
          tenant={tenant}
          apartmentId={apartmentId}
          availableUnits={availableUnits}
          onSuccess={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}