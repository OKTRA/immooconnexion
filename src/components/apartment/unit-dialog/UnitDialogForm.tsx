import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { ApartmentUnitFormData } from "@/types/apartment"
import { UnitFormFields } from "./UnitFormFields"

interface UnitDialogFormProps {
  form: UseFormReturn<ApartmentUnitFormData>
  apartmentId: string
  isSubmitting: boolean
  isEditing: boolean
  onSubmit: (data: ApartmentUnitFormData) => Promise<void>
  onCancel: () => void
}

export function UnitDialogForm({
  form,
  apartmentId,
  isSubmitting,
  isEditing,
  onSubmit,
  onCancel
}: UnitDialogFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UnitFormFields 
          form={form} 
          apartmentId={apartmentId}
          onSuccess={onCancel}
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Chargement..." : isEditing ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  )
}