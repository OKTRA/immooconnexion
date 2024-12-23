import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ProfilePlanSelectProps {
  value: string | undefined
  onValueChange: (value: string) => void
}

export function ProfilePlanSelect({ value, onValueChange }: ProfilePlanSelectProps) {
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

  return (
    <div>
      <Label htmlFor="subscription_plan_id">Plan d'abonnement</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un plan" />
        </SelectTrigger>
        <SelectContent>
          {plans.map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name} ({plan.max_properties === -1 ? "∞" : plan.max_properties} propriétés, {plan.max_tenants === -1 ? "∞" : plan.max_tenants} locataires)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}