import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PropertyFormFields } from "./property/PropertyFormFields"
import { PropertyDialogProps } from "./property/types"

export function PropertyDialog({ 
  property,
  open,
  onOpenChange
}: PropertyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <PropertyFormFields property={property} />
      </DialogContent>
    </Dialog>
  )
}