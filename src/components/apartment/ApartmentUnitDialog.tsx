import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useUnitForm } from "./unit-dialog/useUnitForm"
import { UnitFormFields } from "./unit-dialog/UnitFormFields"
import { ApartmentUnit } from "@/types/apartment"

interface ApartmentUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ApartmentUnit
  apartmentId: string
  onSubmit: (data: ApartmentUnit) => Promise<void>
  isEditing?: boolean
}

export function ApartmentUnitDialog({
  open,
  onOpenChange,
  initialData,
  apartmentId,
  onSubmit,
  isEditing = false,
}: ApartmentUnitDialogProps) {
  const {
    formData,
    setFormData,
    images,
    setImages,
    previewUrls,
    handleSubmit,
  } = useUnitForm(apartmentId, initialData, onSubmit)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleFormSubmit = () => {
    const unitData: ApartmentUnit = {
      id: initialData?.id || '',
      apartment_id: apartmentId,
      unit_number: formData.unit_number,
      floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
      area: formData.area ? parseFloat(formData.area) : null,
      rent_amount: parseInt(formData.rent_amount),
      deposit_amount: formData.deposit_amount ? parseInt(formData.deposit_amount) : null,
      status: formData.status,
      description: formData.description || null,
      created_at: initialData?.created_at,
      updated_at: initialData?.updated_at,
    }
    handleSubmit()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <div className="space-y-6 py-4">
            <UnitFormFields
              formData={formData}
              setFormData={setFormData}
              handleImageChange={handleImageChange}
              imagePreviewUrls={previewUrls}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleFormSubmit}>
                {isEditing ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}