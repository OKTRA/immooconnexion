import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { PropertyUnitDialogProps, PropertyUnitFormData, PropertyUnitStatus } from "@/types/property"
import { usePropertyUnits } from "@/hooks/use-property-units"

export function PropertyUnitDialog({ 
  propertyId,
  open,
  onOpenChange,
  initialData
}: PropertyUnitDialogProps) {
  const { addUnit, updateUnit } = usePropertyUnits(propertyId)
  const [formData, setFormData] = useState<PropertyUnitFormData>(initialData || {
    unit_number: "",
    floor_number: 0,
    area: 0,
    rent_amount: 0,
    deposit_amount: 0,
    status: "available",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (initialData) {
      await updateUnit.mutateAsync({
        ...formData,
        property_id: propertyId,
      })
    } else {
      await addUnit.mutateAsync({
        ...formData,
        property_id: propertyId,
      })
    }
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit_number">Numéro d'unité</Label>
            <Input
              id="unit_number"
              value={formData.unit_number}
              onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor_number">Étage</Label>
            <Input
              id="floor_number"
              type="number"
              value={formData.floor_number}
              onChange={(e) => setFormData({ ...formData, floor_number: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Surface (m²)</Label>
            <Input
              id="area"
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent_amount">Loyer</Label>
            <Input
              id="rent_amount"
              type="number"
              value={formData.rent_amount}
              onChange={(e) => setFormData({ ...formData, rent_amount: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit_amount">Caution</Label>
            <Input
              id="deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={(e) => setFormData({ ...formData, deposit_amount: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: PropertyUnitStatus) => setFormData({ ...formData, status: value })}
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit">
              {initialData ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}