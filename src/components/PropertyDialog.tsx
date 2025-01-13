import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PropertyFormFields } from "./property/PropertyFormFields"
import { useState } from "react"
import { PropertyDialogProps, PropertyFormData } from "./property/types"

export function PropertyDialog({ 
  property,
  open,
  onOpenChange
}: PropertyDialogProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    bien: property?.bien || '',
    type: property?.type || '',
    chambres: property?.chambres || 0,
    ville: property?.ville || '',
    loyer: property?.loyer || 0,
    taux_commission: property?.taux_commission || 0,
    caution: property?.caution || 0,
    property_category: property?.property_category || 'house',
    owner_name: property?.owner_name || '',
    owner_phone: property?.owner_phone || '',
    country: property?.country || '',
    quartier: property?.quartier || ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Image handling logic here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <PropertyFormFields 
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
        />
      </DialogContent>
    </Dialog>
  )
}