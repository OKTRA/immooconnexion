import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LeaseFormFields } from "./form/LeaseFormFields"
import { useLease } from "./useLease"

interface CreateLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  unitId?: string
}

export function CreateLeaseDialog({
  open,
  onOpenChange,
  tenantId,
  unitId: initialUnitId
}: CreateLeaseDialogProps) {
  const {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  } = useLease(initialUnitId, tenantId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un bail</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <LeaseFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}