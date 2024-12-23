import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgencyFieldsProps {
  agencyData: {
    name: string;
    address: string;
    phone: string;
    email: string;
    subscription_plan_id?: string;
  };
  setAgencyData: (data: any) => void;
}

export function AgencyFields({ agencyData, setAgencyData }: AgencyFieldsProps) {
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="agency_name">Nom de l'agence</Label>
        <Input
          id="agency_name"
          value={agencyData.name}
          onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
          placeholder="Nom de l'agence"
        />
      </div>
      <div>
        <Label htmlFor="agency_address">Adresse</Label>
        <Input
          id="agency_address"
          value={agencyData.address}
          onChange={(e) => setAgencyData({ ...agencyData, address: e.target.value })}
          placeholder="Adresse de l'agence"
        />
      </div>
      <div>
        <Label htmlFor="agency_phone">Téléphone</Label>
        <Input
          id="agency_phone"
          value={agencyData.phone}
          onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
          placeholder="Numéro de téléphone"
        />
      </div>
      <div>
        <Label htmlFor="agency_email">Email</Label>
        <Input
          id="agency_email"
          value={agencyData.email}
          onChange={(e) => setAgencyData({ ...agencyData, email: e.target.value })}
          placeholder="Email de l'agence"
          type="email"
        />
      </div>
      <div>
        <Label htmlFor="subscription_plan">Plan d'abonnement</Label>
        <Select 
          value={agencyData.subscription_plan_id} 
          onValueChange={(value) => setAgencyData({ ...agencyData, subscription_plan_id: value })}
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