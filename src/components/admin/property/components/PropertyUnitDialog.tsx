import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { PropertyUnitDialogProps, PropertyUnitFormData } from "../types/propertyUnit"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function PropertyUnitDialog({ 
  isOpen, 
  onClose, 
  editingUnit, 
  propertyId,
  onSubmit 
}: PropertyUnitDialogProps) {
  const [formData, setFormData] = useState<PropertyUnitFormData>({
    unit_number: "",
    floor_number: "",
    area: "",
    rent: "",
    deposit: "",
    description: "",
    category: "standard"
  })

  useEffect(() => {
    if (editingUnit) {
      setFormData({
        unit_number: editingUnit.unit_number,
        floor_number: editingUnit.floor_number?.toString() || "",
        area: editingUnit.area?.toString() || "",
        rent: editingUnit.rent?.toString() || "",
        deposit: editingUnit.deposit?.toString() || "",
        description: editingUnit.description || "",
        category: editingUnit.category || "standard"
      })
    } else {
      setFormData({
        unit_number: "",
        floor_number: "",
        area: "",
        rent: "",
        deposit: "",
        description: "",
        category: "standard"
      })
    }
  }, [editingUnit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: editingUnit?.id || "",
      property_id: propertyId,
      unit_number: formData.unit_number,
      floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
      area: formData.area ? parseFloat(formData.area) : null,
      rent: formData.rent ? parseFloat(formData.rent) : null,
      deposit: formData.deposit ? parseFloat(formData.deposit) : null,
      description: formData.description,
      category: formData.category,
      status: editingUnit?.status || "available",
      photo_url: editingUnit?.photo_url || null,
      amenities: editingUnit?.amenities || null
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit_number">Numéro d'unité</Label>
            <Input
              id="unit_number"
              value={formData.unit_number}
              onChange={(e) =>
                setFormData({ ...formData, unit_number: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor_number">Étage</Label>
            <Input
              id="floor_number"
              type="number"
              value={formData.floor_number}
              onChange={(e) =>
                setFormData({ ...formData, floor_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Surface (m²)</Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rent">Loyer mensuel (FCFA)</Label>
            <Input
              id="rent"
              type="number"
              value={formData.rent}
              onChange={(e) =>
                setFormData({ ...formData, rent: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit">Caution (FCFA)</Label>
            <Input
              id="deposit"
              type="number"
              value={formData.deposit}
              onChange={(e) =>
                setFormData({ ...formData, deposit: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description de l'unité..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit">
              {editingUnit ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}