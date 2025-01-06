import { Dialog, DialogContent } from "@/components/ui/dialog"
import { UnitFormFields } from "./unit-dialog/UnitFormFields"
import { useForm } from "react-hook-form"
import { ApartmentUnit } from "@/types/apartment"

interface ApartmentUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUnit?: ApartmentUnit
  apartmentId: string
  onSuccess: () => void
}

export function ApartmentUnitDialog({
  open,
  onOpenChange,
  selectedUnit,
  apartmentId,
  onSuccess
}: ApartmentUnitDialogProps) {
  const form = useForm({
    defaultValues: selectedUnit || {
      unit_number: "",
      floor_number: 0,
      area: 0,
      rent_amount: 0,
      deposit_amount: 0,
      status: "available",
      description: ""
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <UnitFormFields
          form={form}
          selectedUnit={selectedUnit}
          apartmentId={apartmentId}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}