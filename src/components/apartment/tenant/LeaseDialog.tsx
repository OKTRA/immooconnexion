import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LeaseFormFields } from "../lease/LeaseFormFields"
import { useLease } from "../lease/useLease"
import { useState } from "react"
import { SimpleUnitSelector } from "./form/SimpleUnitSelector"

interface LeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  unitId?: string
}

export function LeaseDialog({
  open,
  onOpenChange,
  tenantId,
  unitId: initialUnitId
}: LeaseDialogProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId || '')
  
  const {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  } = useLease(selectedUnitId, tenantId)

  const canSubmit = !!selectedUnitId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un bail</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          {!initialUnitId && (
            <div className="mb-6">
              <SimpleUnitSelector
                value={selectedUnitId}
                onValueChange={setSelectedUnitId}
              />
            </div>
          )}
          <LeaseFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            disabled={!canSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}