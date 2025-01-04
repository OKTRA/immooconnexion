import { Button } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()
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

  const { data: propertyData, isError, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .maybeSingle()
        
        if (error) {
          console.error("Error fetching property:", error)
          throw error
        }

        if (!data) {
          console.log("No property found with ID:", propertyId)
          toast({
            title: "Propriété non trouvée",
            description: "La propriété demandée n'existe pas",
            variant: "destructive",
          })
          return null
        }

        return data
      } catch (err) {
        console.error("Error in property query:", err)
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de la propriété",
          variant: "destructive",
        })
        throw err
      }
    },
    enabled: !!propertyId
  })

  const [selectedFiles, setSelectedFiles] = useState(null)

  const handleSubmit = (e) => {
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

  if (isError) {
    console.error("Query error:", error)
    return null
  }

  if (!propertyData) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <DialogHeader 
          title={editingUnit ? "Modifier l'unité" : "Ajouter une nouvelle unité"} 
        />
        
        <ScrollArea className="flex-1 p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ParentPropertyInfo property={propertyData} />
            
            <BasicInfoFields 
              formData={formData}
              setFormData={setFormData}
            />
            
            <PricingFields 
              formData={formData}
              setFormData={setFormData}
            />
            
            <StatusSection 
              formData={formData}
              setFormData={setFormData}
            />
            
            <AmenitiesSection 
              formData={formData}
              setFormData={setFormData}
              amenitiesList={amenitiesList}
            />
            
            <PhotoUploadSection 
              onPhotosChange={(files) => setSelectedFiles(files)}
            />
            
            <DescriptionSection 
              formData={formData}
              setFormData={setFormData}
            />
            
            <DialogActions 
              onClose={onClose}
              isEditing={!!editingUnit}
            />
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}