import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ProfileUsageStatsProps {
  userId: string
  planId: string | undefined
}

export function ProfileUsageStats({ userId, planId }: ProfileUsageStatsProps) {
  const { data: plan } = useQuery({
    queryKey: ["subscription-plan", planId],
    queryFn: async () => {
      if (!planId) return null
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", planId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!planId,
  })

  const { data: propertiesCount = 0 } = useQuery({
    queryKey: ["properties-count", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)

      if (error) throw error
      return count || 0
    },
  })

  const { data: tenantsCount = 0 } = useQuery({
    queryKey: ["tenants-count", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contracts")
        .select("*", { count: 'exact', head: true })
        .eq("tenant_id", userId)

      if (error) throw error
      return count || 0
    },
  })

  if (!plan) return null

  const propertiesPercentage = plan.max_properties === -1 ? 0 : (propertiesCount / plan.max_properties) * 100
  const tenantsPercentage = plan.max_tenants === -1 ? 0 : (tenantsCount / plan.max_tenants) * 100

  const isNearLimit = (percentage: number) => percentage >= 80

  return (
    <div className="space-y-4 mt-4">
      <div>
        <div className="flex justify-between mb-2">
          <span>Propriétés utilisées</span>
          <span>{propertiesCount} / {plan.max_properties === -1 ? "∞" : plan.max_properties}</span>
        </div>
        <Progress value={propertiesPercentage} className="h-2" />
        {isNearLimit(propertiesPercentage) && (
          <Alert variant="warning" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Proche de la limite de propriétés. Envisagez une mise à niveau.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span>Locataires gérés</span>
          <span>{tenantsCount} / {plan.max_tenants === -1 ? "∞" : plan.max_tenants}</span>
        </div>
        <Progress value={tenantsPercentage} className="h-2" />
        {isNearLimit(tenantsPercentage) && (
          <Alert variant="warning" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Proche de la limite de locataires. Envisagez une mise à niveau.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}