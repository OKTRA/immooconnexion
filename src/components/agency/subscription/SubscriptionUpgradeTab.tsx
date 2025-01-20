import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PricingDialog } from "@/components/pricing/PricingDialog"
import { useState } from "react"
import { CurrentPlanCard } from "./CurrentPlanCard"
import { SubscriptionPlansGrid } from "./SubscriptionPlansGrid"
import { FreePlanInfo } from "./FreePlanInfo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function SubscriptionUpgradeTab() {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
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

  if (!currentAgency) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <p>Chargement des données de l'abonnement...</p>
        </Card>
      </div>
    )
  }

  const currentPlan = currentAgency.subscription_plans || {
    id: 'basic',
    name: 'Basic',
    price: 0,
    max_properties: 1,
    max_tenants: 1,
    max_users: 1,
    features: []
  }

  const isAtLimit = currentAgency.current_properties_count >= currentPlan.max_properties || 
                   currentAgency.current_tenants_count >= currentPlan.max_tenants ||
                   currentAgency.current_profiles_count >= currentPlan.max_users

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

      {isAtLimit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous avez atteint la limite de votre plan actuel :
            {currentAgency.current_properties_count >= currentPlan.max_properties && (
              <div>- Propriétés : {currentAgency.current_properties_count}/{currentPlan.max_properties}</div>
            )}
            {currentAgency.current_tenants_count >= currentPlan.max_tenants && (
              <div>- Locataires : {currentAgency.current_tenants_count}/{currentPlan.max_tenants}</div>
            )}
            {currentAgency.current_profiles_count >= currentPlan.max_users && (
              <div>- Utilisateurs : {currentAgency.current_profiles_count}/{currentPlan.max_users}</div>
            )}
            Veuillez mettre à niveau votre abonnement pour continuer à utiliser toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Plans disponibles</h2>
        <SubscriptionPlansGrid 
          availablePlans={availablePlans}
          currentPlan={currentPlan}
          onPlanSelect={(plan) => {
            setSelectedPlan(plan)
            setShowUpgradeDialog(true)
          }}
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