import { Dialog, DialogContent as BaseDialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "./form/DialogHeader"
import { DialogContent } from "./form/DialogContent"
import { DialogActions } from "./form/DialogActions"
import { useSaleForm } from "./form/useSaleForm"

interface PropertySaleDialogProps {
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  isEditing?: boolean
}

export function PropertySaleDialog({ 
  propertyId, 
  open, 
  onOpenChange, 
  initialData,
  isEditing 
}: PropertySaleDialogProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    selectedFiles,
    setSelectedFiles,
    handleSubmit
  } = useSaleForm(propertyId, initialData, () => {
    onOpenChange(false)
  })

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <BaseDialogContent className="max-h-[90vh]">
        <DialogHeader isEditing={!!isEditing} />
        <DialogContent
          formData={formData}
          onChange={handleFormChange}
          onFilesSelected={setSelectedFiles}
          existingPhotos={initialData?.photo_urls}
        />
        <DialogActions
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditing={!!isEditing}
        />
      </BaseDialogContent>
    </Dialog>
  )
}