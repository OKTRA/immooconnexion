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
import { PropertyOwnerRow } from "./PropertyOwnerRow"

export function PropertyOwnersTable() {
  const { data: owners, isLoading } = useQuery({
    queryKey: ['property-owners'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (!profile?.agency_id) throw new Error('No agency found')

      const { data: owners } = await supabase
        .from('property_owners')
        .select(`
          *,
          agency_owners!inner(agency_id)
        `)
        .eq('agency_owners.agency_id', profile.agency_id)

      return owners || []
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
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners?.map((owner) => (
            <PropertyOwnerRow key={owner.id} owner={owner} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}