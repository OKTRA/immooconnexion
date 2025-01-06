import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAgencies } from "@/hooks/useAgencies"

export function SubscriptionNotification() {
  const { agencyId } = useAgencies()
  const navigate = useNavigate()

  const { data: agency } = useQuery({
    queryKey: ["agency-subscription", agencyId],
    queryFn: async () => {
      if (!agencyId) return null
      
      const { data, error } = await supabase
        .from("agencies")
        .select(`
          *,
          subscription_plans (
            name,
            price
          )
        `)
        .eq("id", agencyId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!agencyId
  })

  if (!agency?.subscription_end_date) return null

  const endDate = new Date(agency.subscription_end_date)
  const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry > 7) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          {daysUntilExpiry <= 0 
            ? "Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser nos services."
            : `Votre abonnement expire dans ${daysUntilExpiry} jour${daysUntilExpiry > 1 ? 's' : ''}. Renouvelez-le pour éviter toute interruption.`
          }
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/subscription-upgrade")}
          className="ml-4 whitespace-nowrap"
        >
          Renouveler maintenant
        </Button>
      </AlertDescription>
    </Alert>
  )
}