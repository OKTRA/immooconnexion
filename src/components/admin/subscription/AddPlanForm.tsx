import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface AddPlanFormProps {
  onSubmit: (plan: any) => void
}

export function AddPlanForm({ onSubmit }: AddPlanFormProps) {
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    max_properties: 0,
    max_tenants: 0,
    features: [] as string[],
  })
  const [featuresInput, setFeaturesInput] = useState("")

  const handleSubmit = () => {
    onSubmit({
      ...newPlan,
      features: featuresInput.split('\n').filter(Boolean),
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du plan</Label>
          <Input
            id="name"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="price">Prix (FCFA)</Label>
          <Input
            id="price"
            type="number"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="max_properties">Nombre maximum de propriétés (-1 pour illimité)</Label>
          <Input
            id="max_properties"
            type="number"
            value={newPlan.max_properties}
            onChange={(e) => setNewPlan({ ...newPlan, max_properties: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="max_tenants">Nombre maximum de locataires (-1 pour illimité)</Label>
          <Input
            id="max_tenants"
            type="number"
            value={newPlan.max_tenants}
            onChange={(e) => setNewPlan({ ...newPlan, max_tenants: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="features">Fonctionnalités (une par ligne)</Label>
        <Textarea
          id="features"
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          rows={5}
          className="mt-1"
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Ajouter
      </Button>
    </div>
  )
}