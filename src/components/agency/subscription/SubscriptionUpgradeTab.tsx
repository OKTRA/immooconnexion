import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PricingDialog } from "@/components/pricing/PricingDialog"
import { useState } from "react"
import { CurrentPlanCard } from "./CurrentPlanCard"
import { SubscriptionPlansGrid } from "./SubscriptionPlansGrid"
import { FreePlanInfo } from "./FreePlanInfo"
import { SubscriptionPlan } from "@/components/admin/subscription/types"

export function SubscriptionUpgradeTab() {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const { data: currentAgency, isError: isAgencyError } = useQuery({
    queryKey: ['current-agency'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('id', profile.agency_id)
        .single()

      if (agencyError) throw agencyError
      return agency
    }
  })

  const { data: availablePlans = [] } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true })
      
      if (error) throw error
      return data
    }
  })

  if (isAgencyError) {
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

  const canDowngrade = (plan: SubscriptionPlan) => {
    if (!currentAgency) return false
    
    const exceedsProperties = plan.max_properties !== -1 && 
      currentAgency.current_properties_count > plan.max_properties
    
    const exceedsTenants = plan.max_tenants !== -1 && 
      currentAgency.current_tenants_count > plan.max_tenants
    
    const exceedsUsers = plan.max_users !== -1 && 
      currentAgency.current_profiles_count > plan.max_users

    return !exceedsProperties && !exceedsTenants && !exceedsUsers
  }

  const handlePlanSelect = (plan: SubscriptionPlan) => {
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
  const basicPlan = availablePlans.find((plan: SubscriptionPlan) => plan.price === 0) || {
    id: 'basic',
    name: 'Basic',
    price: 0,
    max_properties: 1,
    max_tenants: 1,
    max_users: 1,
    features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const currentPlan = currentAgency.subscription_plans || basicPlan

  return (
    <div className="space-y-6">
      {currentPlan.price === 0 ? (
        <FreePlanInfo />
      ) : (
        <CurrentPlanCard 
          currentPlan={currentPlan}
          currentUsage={{
            properties: currentAgency.current_properties_count,
            tenants: currentAgency.current_tenants_count,
            users: currentAgency.current_profiles_count
          }}
        />
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Plans disponibles</h2>
        <SubscriptionPlansGrid 
          availablePlans={availablePlans}
          currentPlan={currentPlan}
          onPlanSelect={handlePlanSelect}
          canDowngrade={canDowngrade}
        />
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