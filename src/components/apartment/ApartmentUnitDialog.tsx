import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyUnit } from "@/components/admin/property/types/propertyUnit";
import { UnitFormFields } from "./unit-dialog/UnitFormFields";

export interface ApartmentUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentId: string;
  selectedUnit?: PropertyUnit;
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
            {selectedUnit ? "Modifier l'unité" : "Nouvelle unité"}
          </DialogTitle>
        </DialogHeader>
        <UnitFormFields
          apartmentId={apartmentId}
          selectedUnit={selectedUnit}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}