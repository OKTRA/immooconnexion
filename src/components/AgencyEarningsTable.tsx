import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyFeesTable } from "./earnings/AgencyFeesTable"
import { RentalCommissionsTable } from "./earnings/RentalCommissionsTable"
import { Skeleton } from "@/components/ui/skeleton"
import type { ContractWithProperties } from "@/integrations/supabase/client"

export function AgencyEarningsTable() {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['agency-earnings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) throw new Error("Agence non trouvée")

      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          id,
          montant,
          type,
          created_at,
          properties (
            bien,
            taux_commission
          )
        `)
        .eq('agency_id', profile.agency_id)
        .order('created_at', { ascending: false })
        .limit(50) as { data: ContractWithProperties[], error: any }
      
      if (error) throw error

      const agencyFees = contracts
        .filter(contract => contract.type === 'frais_agence')
        .map(contract => ({
          id: contract.id,
          bien: contract.properties?.bien || 'Frais direct',
          montant: contract.montant,
          datePerception: new Date(contract.created_at).toISOString().split('T')[0],
        }))

      const rentals = contracts
        .filter(contract => contract.type === 'loyer')
        .map(contract => {
          const commissionMensuelle = (contract.montant * (contract.properties?.taux_commission || 0)) / 100
          return {
            id: contract.id,
            bien: contract.properties?.bien || '',
            loyer: contract.montant,
            tauxCommission: contract.properties?.taux_commission || 0,
            commissionMensuelle,
            gainProprietaire: contract.montant - commissionMensuelle,
            datePerception: new Date(contract.created_at).toISOString().split('T')[0],
          }
        })

      return { agencyFees, rentals }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AgencyFeesTable fees={earnings?.agencyFees || []} />
      <RentalCommissionsTable rentals={earnings?.rentals || []} />
    </div>
  )
}