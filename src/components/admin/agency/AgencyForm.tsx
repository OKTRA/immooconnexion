import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Agency } from "./types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface AgencyFormProps {
  agency: Agency
  setAgency: (agency: Agency) => void
  onSubmit?: (agency: Agency) => void
}

export function AgencyForm({ agency, setAgency, onSubmit }: AgencyFormProps) {
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

  const canDowngrade = (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId)
    if (!selectedPlan || !agency) return false
    
    const exceedsProperties = selectedPlan.max_properties !== -1 && 
      (agency.current_properties_count || 0) > selectedPlan.max_properties
    
    const exceedsTenants = selectedPlan.max_tenants !== -1 && 
      (agency.current_tenants_count || 0) > selectedPlan.max_tenants
    
    const exceedsUsers = selectedPlan.max_users !== -1 && 
      (agency.current_profiles_count || 0) > selectedPlan.max_users

    return !exceedsProperties && !exceedsTenants && !exceedsUsers
  }

  const handlePlanChange = (planId: string) => {
    const currentPlan = plans.find(p => p.id === agency.subscription_plan_id)
    const newPlan = plans.find(p => p.id === planId)
    
    if (!currentPlan || !newPlan) return
    
    const isDowngrade = newPlan.price < currentPlan.price
    
    if (isDowngrade && !canDowngrade(planId)) {
      return
    }
    
    setAgency({ ...agency, subscription_plan_id: planId })
  }

  const selectedPlan = plans.find(p => p.id === agency.subscription_plan_id)
  const showDowngradeWarning = selectedPlan && !canDowngrade(selectedPlan.id)

  return (
    <ScrollArea className="h-[calc(100vh-200px)] md:h-auto">
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
                const isDisabled = plan.price < (selectedPlan?.price || 0) && !canDowngrade(plan.id)
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
      </div>
    </ScrollArea>
  )
}