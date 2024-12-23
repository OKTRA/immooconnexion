import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SubscriptionPlanRow } from "./SubscriptionPlanRow"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function AdminSubscriptionPlans() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    max_properties: 0,
    max_tenants: 0,
    features: [] as string[],
  })
  const [featuresInput, setFeaturesInput] = useState("")
  const { toast } = useToast()
  
  const { data: plans = [], refetch } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price", { ascending: true })

      if (error) throw error
      return data
    },
  })

  const handleAddPlan = async () => {
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .insert({
          ...newPlan,
          features: featuresInput.split('\n').filter(Boolean),
        })

      if (error) throw error

      toast({
        title: "Plan ajouté",
        description: "Le nouveau plan d'abonnement a été ajouté avec succès",
      })
      setShowAddDialog(false)
      setNewPlan({
        name: "",
        price: 0,
        max_properties: 0,
        max_tenants: 0,
        features: [],
      })
      setFeaturesInput("")
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du plan",
        variant: "destructive",
      })
    }
  }

  const handleEditPlan = async (plan: any) => {
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .update(plan)
        .eq("id", plan.id)

      if (error) throw error

      toast({
        title: "Plan mis à jour",
        description: "Le plan d'abonnement a été mis à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du plan",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .delete()
        .eq("id", planId)

      if (error) throw error

      toast({
        title: "Plan supprimé",
        description: "Le plan d'abonnement a été supprimé avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du plan",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un plan
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Max Propriétés</TableHead>
            <TableHead>Max Locataires</TableHead>
            <TableHead>Fonctionnalités</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <SubscriptionPlanRow
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <div>
              <Label htmlFor="features">Fonctionnalités (une par ligne)</Label>
              <Textarea
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={5}
              />
            </div>
            <Button onClick={handleAddPlan} className="w-full">
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}