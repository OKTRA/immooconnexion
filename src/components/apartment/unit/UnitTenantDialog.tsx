import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UnitTenantForm } from "./UnitTenantForm"
import { useState } from "react"

export interface UnitTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string;
  onSuccess?: (tenantId: string) => void;
}

export function UnitTenantDialog({
  open,
  onOpenChange,
  unitId,
  onSuccess
}: UnitTenantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un locataire</DialogTitle>
        </DialogHeader>
        <UnitTenantForm
          unitId={unitId}
          onSuccess={(tenantId) => {
            if (onSuccess) {
              onSuccess(tenantId)
            }
            onOpenChange(false)
          }}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}