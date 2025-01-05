import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PricingDialog } from "@/components/pricing/PricingDialog"
import { useState } from "react"

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
    const isDowngrade = plan.price < currentAgency?.subscription_plans.price
    
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Plan actuel</h2>
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{currentAgency.subscription_plans?.name || 'Plan non défini'}</h3>
              <p className="text-sm text-muted-foreground">
                {currentAgency.subscription_plans?.price?.toLocaleString() || 0} FCFA/mois
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Propriétés: {currentAgency.current_properties_count} / {currentAgency.subscription_plans?.max_properties === -1 ? '∞' : currentAgency.subscription_plans?.max_properties}</p>
              <p>Locataires: {currentAgency.current_tenants_count} / {currentAgency.subscription_plans?.max_tenants === -1 ? '∞' : currentAgency.subscription_plans?.max_tenants}</p>
              <p>Utilisateurs: {currentAgency.current_profiles_count} / {currentAgency.subscription_plans?.max_users === -1 ? '∞' : currentAgency.subscription_plans?.max_users}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Plans disponibles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {availablePlans.map((plan) => {
            const isCurrentPlan = plan.id === currentAgency.subscription_plans?.id
            const canDowngradeToPlan = canDowngrade(plan)
            const isDowngrade = plan.price < (currentAgency.subscription_plans?.price || 0)

            return (
              <Card key={plan.id} className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.price.toLocaleString()} FCFA/mois
                    </p>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.max_properties === -1 ? 'Propriétés illimitées' : `${plan.max_properties} propriétés`}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.max_tenants === -1 ? 'Locataires illimités' : `${plan.max_tenants} locataires`}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.max_users === -1 ? 'Utilisateurs illimités' : `${plan.max_users} utilisateurs`}
                    </li>
                    {plan.features?.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isDowngrade && !canDowngradeToPlan && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Réduisez votre utilisation pour pouvoir rétrograder</span>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {isCurrentPlan ? 'Plan actuel' : 'Sélectionner'}
                  </Button>
                </div>
              </Card>
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