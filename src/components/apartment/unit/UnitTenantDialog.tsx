import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UnitTenantForm } from "./UnitTenantForm"

interface UnitTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unitId: string
  tenant?: any
}

export function UnitTenantDialog({
  open,
  onOpenChange,
  unitId,
  tenant
}: UnitTenantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <UnitTenantForm
          unitId={unitId}
          tenant={tenant}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}