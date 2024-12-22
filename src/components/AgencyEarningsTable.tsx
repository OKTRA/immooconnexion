import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ContractWithProperties {
  id: string
  property_id: string
  montant: number
  type: string
  created_at: string
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
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          id,
          property_id,
          montant,
          type,
          created_at,
          properties (
            bien,
            frais_agence,
            taux_commission
          )
        `)
        .eq('type', 'loyer')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching contracts:', error)
        throw error
      }

      return (contracts as ContractWithProperties[]).map(contract => ({
        id: contract.id,
        bien: contract.properties?.bien || '',
        loyer: contract.montant,
        fraisAgence: contract.properties?.frais_agence || 0,
        tauxCommission: contract.properties?.taux_commission || 0,
        commissionMensuelle: (contract.montant * (contract.properties?.taux_commission || 0)) / 100,
        gainProprietaire: contract.montant - ((contract.montant * (contract.properties?.taux_commission || 0)) / 100),
        gainAgence: ((contract.montant * (contract.properties?.taux_commission || 0)) / 100) + (contract.properties?.frais_agence || 0),
        datePerception: new Date(contract.created_at).toISOString().split('T')[0],
      }))
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Frais d'Agence</TableHead>
            <TableHead>Taux Commission (%)</TableHead>
            <TableHead>Commission Mensuelle</TableHead>
            <TableHead>Gain Propriétaire</TableHead>
            <TableHead>Gain Agence</TableHead>
            <TableHead>Date Perception</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(earnings || []).map((earning) => (
            <TableRow key={earning.id}>
              <TableCell>{earning.bien}</TableCell>
              <TableCell>{earning.loyer} FCFA</TableCell>
              <TableCell>{earning.fraisAgence} FCFA</TableCell>
              <TableCell>{earning.tauxCommission}%</TableCell>
              <TableCell>{earning.commissionMensuelle} FCFA</TableCell>
              <TableCell>{earning.gainProprietaire} FCFA</TableCell>
              <TableCell>{earning.gainAgence} FCFA</TableCell>
              <TableCell>{earning.datePerception}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}