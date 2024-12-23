import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Agency } from "./types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgencyFormProps {
  agency: Agency
  setAgency: (agency: Agency) => void
}

export function AgencyForm({ agency, setAgency }: AgencyFormProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={agency.name}
          onChange={(e) => setAgency({ ...agency, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={agency.address || ""}
          onChange={(e) => setAgency({ ...agency, address: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={agency.phone || ""}
          onChange={(e) => setAgency({ ...agency, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={agency.email || ""}
          onChange={(e) => setAgency({ ...agency, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="subscription_plan">Plan d'abonnement</Label>
        <Select 
          value={agency.subscription_plan_id || ""} 
          onValueChange={(value) => setAgency({ ...agency, subscription_plan_id: value })}
        >
          <SelectTrigger>
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
      </div>
    </div>
  )
}