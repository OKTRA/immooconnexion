import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LeaseFormFields } from "./form/LeaseFormFields"
import { useLease } from "./hooks/useLease"
import { CreateLeaseDialogProps } from "./types"

export function CreateLeaseDialog({
  open,
  onOpenChange,
  tenantId,
  unitId
}: CreateLeaseDialogProps) {
  const {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  } = useLease(unitId, tenantId)

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
            disabled={!formData.unit_id}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}