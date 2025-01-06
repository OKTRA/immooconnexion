import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UnitFormFields } from "./unit-dialog/UnitFormFields"
import { ApartmentUnit } from "./types"

export interface ApartmentUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentId: string;
  selectedUnit?: ApartmentUnit;
  onSuccess: () => void;
}

export function ApartmentUnitDialog({
  open,
  onOpenChange,
  apartmentId,
  selectedUnit,
  onSuccess
}: ApartmentUnitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedUnit ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>
        <UnitFormFields
          selectedUnit={selectedUnit}
          apartmentId={apartmentId}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}