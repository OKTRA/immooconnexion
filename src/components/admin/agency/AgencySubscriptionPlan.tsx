import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Agency } from "./types"
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits"

interface AgencySubscriptionPlanProps {
  agency: Agency
  onPlanChange: (planId: string) => void
}

export function AgencySubscriptionPlan({ agency, onPlanChange }: AgencySubscriptionPlanProps) {
  const { data: plans = [] } = useQuery({
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

  const { checkDowngradeEligibility } = useSubscriptionLimits()
  const selectedPlan = plans.find(p => p.id === agency.subscription_plan_id)
  const showDowngradeWarning = selectedPlan && !checkDowngradeEligibility(selectedPlan)

  const handlePlanChange = (planId: string) => {
    const currentPlan = plans.find(p => p.id === agency.subscription_plan_id)
    const newPlan = plans.find(p => p.id === planId)
    
    if (!currentPlan || !newPlan) return
    
    const isDowngrade = newPlan.price < currentPlan.price
    
    if (isDowngrade && !checkDowngradeEligibility(newPlan)) {
      return
    }
    
    onPlanChange(planId)
  }

  return (
    <div className="col-span-2">
      <Label htmlFor="subscription_plan">Plan d'abonnement</Label>
      <Select 
        value={agency.subscription_plan_id || ""} 
        onValueChange={handlePlanChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un plan" />
        </SelectTrigger>
        <SelectContent>
          {plans.map((plan) => {
            const isDisabled = plan.price < (selectedPlan?.price || 0) && 
              !checkDowngradeEligibility(plan)
            return (
              <SelectItem 
                key={plan.id} 
                value={plan.id}
                disabled={isDisabled}
              >
                {plan.name} ({plan.price} FCFA) - 
                {plan.max_properties === -1 ? "∞" : plan.max_properties} propriétés, 
                {plan.max_tenants === -1 ? "∞" : plan.max_tenants} locataires,
                {plan.max_users === -1 ? "∞" : plan.max_users} utilisateurs
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {showDowngradeWarning && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Impossible de rétrograder vers ce plan. L'agence dépasse les limites suivantes :
            {selectedPlan.max_properties !== -1 && agency.current_properties_count > selectedPlan.max_properties && (
              <div>- Propriétés : {agency.current_properties_count} / {selectedPlan.max_properties}</div>
            )}
            {selectedPlan.max_tenants !== -1 && agency.current_tenants_count > selectedPlan.max_tenants && (
              <div>- Locataires : {agency.current_tenants_count} / {selectedPlan.max_tenants}</div>
            )}
            {selectedPlan.max_users !== -1 && agency.current_profiles_count > selectedPlan.max_users && (
              <div>- Utilisateurs : {agency.current_profiles_count} / {selectedPlan.max_users}</div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}