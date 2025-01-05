import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AgencyPlanSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function AgencyPlanSelect({ value, onValueChange }: AgencyPlanSelectProps) {
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
    <Select 
      value={value || ""} 
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sélectionner un plan" />
      </SelectTrigger>
      <SelectContent>
        {plans.map((plan) => (
          <SelectItem key={plan.id} value={plan.id}>
            {plan.name} ({plan.price} FCFA)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}