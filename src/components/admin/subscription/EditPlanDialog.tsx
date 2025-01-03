import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { EditPlanDialogProps } from "./types"

export function EditPlanDialog({ plan, isOpen, onOpenChange, onSave }: EditPlanDialogProps) {
  const [editedPlan, setEditedPlan] = useState(plan)
  const [featuresInput, setFeaturesInput] = useState(plan.features.join('\n'))

  const handleSave = () => {
    onSave({
      ...editedPlan,
      features: featuresInput.split('\n').filter(Boolean)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du plan</Label>
              <Input
                id="name"
                value={editedPlan.name}
                onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA)</Label>
              <Input
                id="price"
                type="number"
                value={editedPlan.price}
                onChange={(e) => setEditedPlan({ ...editedPlan, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_properties">Nombre maximum de propriétés (-1 pour illimité)</Label>
              <Input
                id="max_properties"
                type="number"
                value={editedPlan.max_properties}
                onChange={(e) => setEditedPlan({ ...editedPlan, max_properties: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_tenants">Nombre maximum de locataires (-1 pour illimité)</Label>
              <Input
                id="max_tenants"
                type="number"
                value={editedPlan.max_tenants}
                onChange={(e) => setEditedPlan({ ...editedPlan, max_tenants: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_users">Nombre maximum d'utilisateurs (-1 pour illimité)</Label>
              <Input
                id="max_users"
                type="number"
                value={editedPlan.max_users}
                onChange={(e) => setEditedPlan({ ...editedPlan, max_users: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Fonctionnalités (une par ligne)</Label>
            <Textarea
              id="features"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}