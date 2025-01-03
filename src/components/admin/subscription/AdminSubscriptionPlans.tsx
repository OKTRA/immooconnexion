import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PlansTable } from "./PlansTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddPlanForm } from "./AddPlanForm"
import { useToast } from "@/hooks/use-toast"
import { SubscriptionPlan } from "./types"

const AdminSubscriptionPlans = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { toast } = useToast()
  
  const { data: plans = [], refetch } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const handleEdit = async (plan: SubscriptionPlan) => {
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .update({
          name: plan.name,
          price: plan.price,
          max_properties: plan.max_properties,
          max_tenants: plan.max_tenants,
          max_users: plan.max_users,
          features: plan.features
        })
        .eq("id", plan.id)

      if (error) throw error

      toast({
        title: "Plan mis à jour",
        description: "Le plan d'abonnement a été mis à jour avec succès"
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du plan",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Plan supprimé",
        description: "Le plan d'abonnement a été supprimé avec succès"
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du plan",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un plan
        </Button>
      </div>

      <PlansTable 
        plans={plans} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        refetch={refetch}
      />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un plan d'abonnement</DialogTitle>
          </DialogHeader>
          <AddPlanForm 
            onSubmit={async (plan) => {
              try {
                const { error } = await supabase
                  .from("subscription_plans")
                  .insert(plan)
                
                if (error) throw error

                toast({
                  title: "Plan ajouté",
                  description: "Le plan d'abonnement a été ajouté avec succès"
                })
                setShowAddDialog(false)
                refetch()
              } catch (error) {
                toast({
                  title: "Erreur",
                  description: "Une erreur est survenue lors de l'ajout du plan",
                  variant: "destructive"
                })
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminSubscriptionPlans