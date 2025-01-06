import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UnitDialogForm } from "./unit-dialog/UnitDialogForm"
import { useUnitMutations } from "./unit-dialog/useUnitMutations"

const unitSchema = z.object({
  unit_number: z.string().min(1, "Le numéro d'unité est requis"),
  floor_number: z.string(),
  area: z.string(),
  rent_amount: z.string().min(1, "Le loyer est requis"),
  deposit_amount: z.string(),
  status: z.enum(["available", "occupied", "maintenance"]),
  description: z.string().optional(),
})

interface ApartmentUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ApartmentUnit) => void
  initialData?: ApartmentUnit
  apartmentId: string
  isEditing?: boolean
}

export function ApartmentUnitDialog({
  open,
  onOpenChange,
  initialData,
  apartmentId,
  isEditing = false
}: ApartmentUnitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createUnit, updateUnit } = useUnitMutations(apartmentId)

  const form = useForm<ApartmentUnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: initialData ? {
      unit_number: initialData.unit_number,
      floor_number: initialData.floor_number?.toString() || "",
      area: initialData.area?.toString() || "",
      rent_amount: initialData.rent_amount.toString(),
      deposit_amount: initialData.deposit_amount?.toString() || "",
      status: initialData.status,
      description: initialData.description || "",
    } : {
      unit_number: "",
      floor_number: "",
      area: "",
      rent_amount: "",
      deposit_amount: "",
      status: "available",
      description: "",
    }
  })

  const handleSubmit = async (formData: ApartmentUnitFormData) => {
    try {
      setIsSubmitting(true)
      
      if (isEditing && initialData) {
        await updateUnit.mutateAsync({ ...formData, id: initialData.id })
      } else {
        await createUnit.mutateAsync(formData)
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting unit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <UnitDialogForm
            form={form}
            apartmentId={apartmentId}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}