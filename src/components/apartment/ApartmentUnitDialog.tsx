import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "../form/DialogHeader"
import { UnitFormFields } from "./unit-dialog/UnitFormFields"
import { useUnitForm } from "./unit-dialog/useUnitForm"
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

  const handleFormSubmit = async () => {
    try {
      await handleSubmit()
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {isEditing ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
        </DialogHeader>
        <UnitFormFields
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          imagePreviewUrls={previewUrls}
        />
      </DialogContent>
    </Dialog>
  )
}