import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyFeesTable } from "./earnings/AgencyFeesTable"
import { RentalCommissionsTable } from "./earnings/RentalCommissionsTable"

interface ContractWithProperties {
  id: string
  property_id: string
  montant: number
  type: string
  created_at: string
  agency_id: string | null
  properties: {
    bien: string
    frais_agence: number | null
    taux_commission: number | null
  }
}

export function AgencyEarningsTable() {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['agency-earnings'],
    queryFn: async () => {
      console.log('Fetching agency earnings...')
      
      // Get current user's profile to check role
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      let query = supabase
        .from('contracts')
        .select(`
          id,
          property_id,
          montant,
          type,
          created_at,
          agency_id,
          properties (
            bien,
            frais_agence,
            taux_commission
          )
        `)
        .order('created_at', { ascending: false })

      // If not admin, only show agency's contracts
      if (profile?.role !== 'admin') {
        query = query.eq('agency_id', user.id)
      }
      
      const { data: contracts, error } = await query
      
      if (error) {
        console.error('Error fetching contracts:', error)
        throw error
      }

      // Séparer les frais d'agence et les loyers
      const agencyFees = (contracts as ContractWithProperties[])
        .filter(contract => contract.type === 'frais_agence')
        .map(contract => ({
          id: contract.id,
          bien: contract.properties?.bien || 'Frais direct',
          montant: contract.montant,
          datePerception: new Date(contract.created_at).toISOString().split('T')[0],
        }))

      const rentals = (contracts as ContractWithProperties[])
        .filter(contract => contract.type === 'loyer')
        .map(contract => {
          const commissionMensuelle = (contract.montant * (contract.properties?.taux_commission || 0)) / 100
          
          return {
            id: contract.id,
            bien: contract.properties?.bien || '',
            loyer: contract.montant,
            tauxCommission: contract.properties?.taux_commission || 0,
            commissionMensuelle: commissionMensuelle,
            gainProprietaire: contract.montant - commissionMensuelle,
            datePerception: new Date(contract.created_at).toISOString().split('T')[0],
          }
        })

      return {
        agencyFees,
        rentals
      }
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-8">
      <AgencyFeesTable fees={earnings?.agencyFees || []} />
      <RentalCommissionsTable rentals={earnings?.rentals || []} />
    </div>
  )
}