import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PricingDialog } from "@/components/pricing/PricingDialog"
import { useState } from "react"
import { CurrentPlanCard } from "./CurrentPlanCard"
import { PlanCard } from "./PlanCard"

export function SubscriptionUpgradeTab() {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const { data: currentAgency, isError: isAgencyError } = useQuery({
    queryKey: ['current-agency'],
    queryFn: async () => {
      console.log("Fetching current agency data...")
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error("Profile fetch error:", profileError)
        throw profileError
      }

      if (!profile?.agency_id) {
        console.error("No agency associated with profile")
        throw new Error("Aucune agence associée")
      }

      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select(`
          *,
          subscription_plans (
            id,
            name,
            price,
            max_properties,
            max_tenants,
            max_users,
            features
          )
        `)
        .eq('id', profile.agency_id)
        .single()

      if (agencyError) {
        console.error("Agency fetch error:", agencyError)
        throw agencyError
      }

      console.log("Agency data fetched:", agency)
      return agency
    }
  })

  const { data: availablePlans = [], isError: isPlansError } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      console.log("Fetching available plans...")
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true })
      
      if (error) {
        console.error("Plans fetch error:", error)
        throw error
      }

      console.log("Available plans:", data)
      return data
    }
  })

  if (isAgencyError || isPlansError) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <p className="text-destructive">
            Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.
          </p>
        </Card>
      </div>
    )
  }

  const canDowngrade = (plan: any) => {
    if (!currentAgency) return false
    
    const exceedsProperties = plan.max_properties !== -1 && 
      currentAgency.current_properties_count > plan.max_properties
    
    const exceedsTenants = plan.max_tenants !== -1 && 
      currentAgency.current_tenants_count > plan.max_tenants
    
    const exceedsUsers = plan.max_users !== -1 && 
      currentAgency.current_profiles_count > plan.max_users

    return !exceedsProperties && !exceedsTenants && !exceedsUsers
  }

  const handlePlanSelect = (plan: any) => {
    const isDowngrade = plan.price < (currentAgency?.subscription_plans?.price || 0)
    
    if (isDowngrade && !canDowngrade(plan)) {
      toast({
        title: "Impossible de rétrograder",
        description: "Vous devez d'abord réduire votre utilisation pour correspondre aux limites du plan sélectionné.",
        variant: "destructive"
      })
      return
    }

    setSelectedPlan(plan)
    setShowUpgradeDialog(true)
  }

  if (!currentAgency) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <p>Chargement des données de l'abonnement...</p>
        </Card>
      </div>
    )
  }

  // Find the basic plan if current agency has no subscription plan
  const currentPlan = currentAgency.subscription_plans || 
    availablePlans.find((plan: any) => plan.price === 0) || 
    { name: 'Basic', price: 0, max_properties: 1, max_tenants: 1, max_users: 1 }

  return (
    <div className="space-y-6">
      <CurrentPlanCard 
        currentPlan={currentPlan}
        currentUsage={{
          properties: currentAgency.current_properties_count,
          tenants: currentAgency.current_tenants_count,
          users: currentAgency.current_profiles_count
        }}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Plans disponibles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {availablePlans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan?.id
            const canDowngradeToPlan = canDowngrade(plan)
            const isDowngrade = plan.price < (currentPlan?.price || 0)

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={isCurrentPlan}
                canDowngrade={canDowngradeToPlan}
                isDowngrade={isDowngrade}
                onSelect={() => handlePlanSelect(plan)}
              />
            )
          })}
        </div>
      </div>

      {selectedPlan && (
        <PricingDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          isUpgrade={true}
        />
      )}
    </div>
  )
}