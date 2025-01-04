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
    apartment_id: propertyId
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
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>ID de l'appartement</Label>
              <Input
                value={propertyId}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>

            <BasicInfoFields formData={formData} setFormData={setFormData} />
            <PricingFields formData={formData} setFormData={setFormData} />
            
            <div className="space-y-2">
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
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

            <AmenitiesSection 
              formData={formData} 
              setFormData={setFormData}
              amenitiesList={amenitiesList}
            />

            <PhotoUploadSection 
              onPhotosChange={(files) => setSelectedFiles(files)} 
            />

            <div className="space-y-2">
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée de l'unité..."
                className="h-32"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {editingUnit ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}