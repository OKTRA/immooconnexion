import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SaleFormFields } from "./form/SaleFormFields"
import { PhotoUpload } from "./form/PhotoUpload"
import { useSaleForm } from "./form/useSaleForm"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la vente" : "Enregistrer une vente"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <SaleFormFields
              formData={formData}
              onChange={handleFormChange}
            />
            <PhotoUpload
              onFilesSelected={setSelectedFiles}
              existingPhotos={initialData?.photo_urls}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : isEditing ? "Modifier" : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}