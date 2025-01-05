import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface ApartmentUnitDialogProps {
  isOpen: boolean
  onClose: () => void
  editingUnit?: any
  apartmentId: string
  onSubmit: (data: any) => void
}

export function ApartmentUnitDialog({
  isOpen,
  onClose,
  editingUnit,
  apartmentId,
  onSubmit,
}: ApartmentUnitDialogProps) {
  const [formData, setFormData] = useState({
    unit_number: editingUnit?.unit_number || "",
    floor_number: editingUnit?.floor_number || "",
    area: editingUnit?.area || "",
    rent: editingUnit?.rent || "",
    deposit: editingUnit?.deposit || "",
    category: editingUnit?.category || "studio",
    status: editingUnit?.status || "available",
    amenities: editingUnit?.amenities || [],
    description: editingUnit?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      id: editingUnit?.id,
      apartment_id: apartmentId,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Surface (m²)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="f1">F1</SelectItem>
                  <SelectItem value="f2">F2</SelectItem>
                  <SelectItem value="f3">F3</SelectItem>
                  <SelectItem value="f4">F4</SelectItem>
                  <SelectItem value="f5">F5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Loyer</Label>
              <Input
                id="rent"
                type="number"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Caution</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit}
                onChange={(e) =>
                  setFormData({ ...formData, deposit: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
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
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="reserved">Réservé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {editingUnit ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}