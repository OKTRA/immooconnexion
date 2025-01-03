import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface AddPlanFormProps {
  onSubmit: (plan: any) => void
  onSuccess?: () => void
}

export function AddPlanForm({ onSubmit, onSuccess }: AddPlanFormProps) {
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    max_properties: -1,
    max_tenants: -1,
    max_users: -1,
    features: [] as string[],
  })
  const [featuresInput, setFeaturesInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...newPlan,
      features: featuresInput.split('\n').filter(Boolean),
    })
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du plan</Label>
        <Input
          id="name"
          value={newPlan.name}
          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Prix (FCFA)</Label>
        <Input
          id="price"
          type="number"
          value={newPlan.price}
          onChange={(e) => setNewPlan({ ...newPlan, price: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="max_properties">Nombre maximum de propriétés (-1 pour illimité)</Label>
        <Input
          id="max_properties"
          type="number"
          value={newPlan.max_properties}
          onChange={(e) => setNewPlan({ ...newPlan, max_properties: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="max_tenants">Nombre maximum de locataires (-1 pour illimité)</Label>
        <Input
          id="max_tenants"
          type="number"
          value={newPlan.max_tenants}
          onChange={(e) => setNewPlan({ ...newPlan, max_tenants: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="max_users">Nombre maximum d'utilisateurs (-1 pour illimité)</Label>
        <Input
          id="max_users"
          type="number"
          value={newPlan.max_users}
          onChange={(e) => setNewPlan({ ...newPlan, max_users: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="features">Fonctionnalités (une par ligne)</Label>
        <Textarea
          id="features"
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          rows={5}
        />
      </div>
      <Button type="submit" className="w-full">Ajouter le plan</Button>
    </form>
  )
}