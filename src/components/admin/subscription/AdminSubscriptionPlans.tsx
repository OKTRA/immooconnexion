import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PlansTable } from "./PlansTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddPlanForm } from "./AddPlanForm"

const AdminSubscriptionPlans = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un plan
        </Button>
      </div>

      <PlansTable plans={plans} refetch={refetch} />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un plan d'abonnement</DialogTitle>
          </DialogHeader>
          <AddPlanForm onSuccess={() => {
            setShowAddDialog(false)
            refetch()
          }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminSubscriptionPlans