import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SubscriptionPlanRowProps {
  plan: any
  onEdit: (plan: any) => void
  onDelete: (id: string) => void
}

export function SubscriptionPlanRow({ plan, onEdit, onDelete }: SubscriptionPlanRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedPlan, setEditedPlan] = useState(plan)
  const [featuresInput, setFeaturesInput] = useState(plan.features.join('\n'))

  const handleSaveEdit = () => {
    const updatedPlan = {
      ...editedPlan,
      features: featuresInput.split('\n').filter(Boolean)
    }
    onEdit(updatedPlan)
    setShowEditDialog(false)
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{plan.name}</TableCell>
        <TableCell>{plan.price.toLocaleString()} FCFA</TableCell>
        <TableCell className="hidden md:table-cell">
          {plan.max_properties === -1 ? "Illimité" : plan.max_properties}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {plan.max_tenants === -1 ? "Illimité" : plan.max_tenants}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {plan.max_users === -1 ? "Illimité" : plan.max_users}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <ul className="list-disc list-inside">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="truncate">{feature}</li>
            ))}
          </ul>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(plan.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
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
            <Button onClick={handleSaveEdit} className="w-full">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}