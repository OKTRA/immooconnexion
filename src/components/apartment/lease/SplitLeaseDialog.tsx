import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SplitLeaseFormFields } from "./form/SplitLeaseFormFields"
import { useLease } from "./hooks/useLease"

interface SplitLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  unitId?: string
}

export function SplitLeaseDialog({
  open,
  onOpenChange,
  tenantId,
  unitId: initialUnitId
}: SplitLeaseDialogProps) {
  const {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  } = useLease({ 
    initialUnitId,
    tenantId,
    onSuccess: () => onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un bail partagé (A/B)</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <SplitLeaseFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            disabled={!formData.unit_id}
            tenantId={tenantId}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}