import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { LeaseFormFields } from "./LeaseFormFields"
import { useLease } from "./useLease"

interface LeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unitId: string
  tenantId?: string
}

export function LeaseDialog({
  open,
  onOpenChange,
  unitId,
  tenantId,
}: LeaseDialogProps) {
  const {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
  } = useLease(unitId, tenantId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau contrat de location</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <div className="space-y-6 py-4">
            <LeaseFormFields
              formData={formData}
              setFormData={setFormData}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le contrat"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}