import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BasicInfoFields } from "./unit-form/BasicInfoFields"
import { PricingFields } from "./unit-form/PricingFields"
import { AmenitiesSection } from "./unit-form/AmenitiesSection"
import { PhotoUploadSection } from "./unit-form/PhotoUploadSection"
import { DialogHeader } from "./unit-dialog/DialogHeader"
import { ParentPropertyInfo } from "./unit-dialog/ParentPropertyInfo"
import { StatusSection } from "./unit-dialog/StatusSection"
import { DescriptionSection } from "./unit-dialog/DescriptionSection"
import { DialogActions } from "./unit-dialog/DialogActions"

interface PropertyUnitDialogProps {
  isOpen: boolean
  onClose: () => void
  editingUnit?: any
  propertyId: string
  onSubmit: (data: any) => void
}

export function PropertyUnitDialog({ 
  isOpen, 
  onClose, 
  editingUnit, 
  propertyId, 
  onSubmit 
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
    status: editingUnit?.status || "available"
  })

  const { data: propertyData } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()
      
      if (error) throw error
      return data
    }
  })

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      property_id: propertyId,
      photos: selectedFiles
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
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <DialogHeader editingUnit={editingUnit} />
        <ScrollArea className="flex-1 p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ParentPropertyInfo propertyData={propertyData} />

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <BasicInfoFields formData={formData} setFormData={setFormData} />
            </div>

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <PricingFields formData={formData} setFormData={setFormData} />
            </div>

            <StatusSection 
              status={formData.status}
              onStatusChange={(value) => setFormData({ ...formData, status: value })}
            />

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <AmenitiesSection 
                formData={formData} 
                setFormData={setFormData}
                amenitiesList={amenitiesList}
              />
            </div>

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <PhotoUploadSection 
                onPhotosChange={(files) => setSelectedFiles(files)} 
              />
            </div>

            <DescriptionSection 
              description={formData.description}
              onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
            />

            <DialogActions onClose={onClose} editingUnit={editingUnit} />
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}