import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AgencyPropertiesProps {
  agencyId: string
}

export function AgencyProperties({ agencyId }: AgencyPropertiesProps) {
  const { data: properties = [] } = useQuery({
    queryKey: ["agency-properties", agencyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.bien}</TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell>{property.ville}</TableCell>
              <TableCell>{property.loyer?.toLocaleString()} FCFA</TableCell>
              <TableCell>
                <Badge variant={property.statut === "disponible" ? "success" : "secondary"}>
                  {property.statut}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {properties.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucun bien trouvé pour cette agence
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}