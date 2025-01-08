import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApartmentTenantForm } from "./ApartmentTenantForm"
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartmentId: string
  tenant?: ApartmentTenant | null
}

export function ApartmentTenantDialog({
  open,
  onOpenChange,
  apartmentId,
  tenant
}: ApartmentTenantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <ApartmentTenantForm
            apartmentId={apartmentId}
            initialData={tenant}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}