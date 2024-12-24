import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { AddPlanForm } from "./AddPlanForm"
import { PlansTable } from "./PlansTable"

export function AdminSubscriptionPlans() {
  const [showAddDialog, setShowAddDialog] = useState(false)
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

  const handleAddPlan = async (newPlan: any) => {
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .insert(newPlan)

      if (error) throw error

      toast({
        title: "Plan ajouté",
        description: "Le nouveau plan d'abonnement a été ajouté avec succès",
      })
      setShowAddDialog(false)
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un plan
        </Button>
      </div>
      
      <PlansTable 
        plans={plans}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau plan</DialogTitle>
          </DialogHeader>
          <AddPlanForm onSubmit={handleAddPlan} />
        </DialogContent>
      </Dialog>
    </div>
  )
}