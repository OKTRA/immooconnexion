import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AdminSubscriptionPlans() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  const { data: plans = [], isLoading } = useQuery({
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

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-2xl font-bold mt-2">
              {plan.price.toLocaleString()} XOF
              <span className="text-sm font-normal text-muted-foreground">/mois</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features?.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
