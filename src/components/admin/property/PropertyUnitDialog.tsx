import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { BasicInfoFields } from "./unit-form/BasicInfoFields"
import { PricingFields } from "./unit-form/PricingFields"
import { AmenitiesSection } from "./unit-form/AmenitiesSection"
import { PhotoUploadSection } from "./unit-form/PhotoUploadSection"
import { UnitFormHeader } from "./unit-form/UnitFormHeader"
import { ApartmentIdField } from "./unit-form/ApartmentIdField"
import { StatusSelect } from "./unit-form/StatusSelect"
import { UnitDescription } from "./unit-form/UnitDescription"
import { UnitFormActions } from "./unit-form/UnitFormActions"

interface PropertyUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUnit?: any;
  propertyId: string;  // This will contain the apartment ID
  onSubmit: (data: any) => void;
}

export function PropertyUnitDialog({
  isOpen,
  onClose,
  editingUnit,
  propertyId,
  onSubmit,
}: PropertyUnitDialogProps) {
  const [formData, setFormData] = useState({
    unit_number: editingUnit?.unit_number || "",
    floor_number: editingUnit?.floor_number || "",
    area: editingUnit?.area || "",
    rent: editingUnit?.rent || "",
    deposit: editingUnit?.deposit || "",
    description: editingUnit?.description || "",
    category: editingUnit?.category || "standard",
    amenities: editingUnit?.amenities || [],
    status: editingUnit?.status || "available",
    apartment_id: propertyId,
    photo_url: editingUnit?.photo_url || null
  })

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      apartment_id: propertyId,
      photo: selectedFiles?.[0] || null
    })
  }

  const amenitiesList = [
    "Climatisation",
    "Balcon",
    "Parking",
    "Ascenseur",
    "Sécurité 24/7",
    "Piscine",
    "Salle de sport",
    "Internet",
    "Meublé",
    "Vue sur mer"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <UnitFormHeader editingUnit={editingUnit} />
        <ScrollArea className="flex-1 h-[calc(90vh-8rem)]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ApartmentIdField propertyId={propertyId} />
              <BasicInfoFields formData={formData} setFormData={setFormData} />
              <PricingFields formData={formData} setFormData={setFormData} />
              <StatusSelect 
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
              />
              <AmenitiesSection 
                formData={formData} 
                setFormData={setFormData}
                amenitiesList={amenitiesList}
              />
              <PhotoUploadSection 
                onPhotosChange={(files) => setSelectedFiles(files)} 
              />
              <UnitDescription
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
              />
              <UnitFormActions onClose={onClose} editingUnit={editingUnit} />
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}