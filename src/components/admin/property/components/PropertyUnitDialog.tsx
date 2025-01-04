import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { BasicInfoFields } from "./unit-form/BasicInfoFields"
import { PricingFields } from "./unit-form/PricingFields"
import { AmenitiesSection } from "./unit-form/AmenitiesSection"
import { PhotoUploadSection } from "./unit-form/PhotoUploadSection"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

interface PropertyUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUnit?: any;
  propertyId: string;
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

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

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
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            {editingUnit ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Appartement</Label>
              <Input
                value={propertyData?.bien || ""}
                readOnly
                className="mt-1 bg-purple-50/50 dark:bg-gray-700/50 border-purple-100 dark:border-gray-600"
              />
            </div>

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <BasicInfoFields formData={formData} setFormData={setFormData} />
            </div>

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
              <PricingFields formData={formData} setFormData={setFormData} />
            </div>
            
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm space-y-2">
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="occupied">Occupé</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm space-y-2">
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée de l'unité..."
                className="h-32 bg-white dark:bg-gray-700"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              >
                {editingUnit ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}