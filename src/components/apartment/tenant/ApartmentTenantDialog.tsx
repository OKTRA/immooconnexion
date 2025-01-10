import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApartmentTenantForm } from "./ApartmentTenantForm"
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
      <DialogContent className="max-w-3xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <ApartmentTenantForm
            apartmentId={apartmentId}
            onSuccess={handleSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            initialData={tenant}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}