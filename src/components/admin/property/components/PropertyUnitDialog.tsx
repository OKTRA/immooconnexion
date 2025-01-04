import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { PropertyUnitDialogProps, PropertyUnitFormData } from "../types/propertyUnit"

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
  })

  useEffect(() => {
    if (editingUnit) {
      setFormData({
        unit_number: editingUnit.unit_number,
        floor_number: editingUnit.floor_number?.toString() || "",
        area: editingUnit.area?.toString() || "",
      })
    } else {
      setFormData({
        unit_number: "",
        floor_number: "",
        area: "",
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
      status: editingUnit?.status || "available"
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