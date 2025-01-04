import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"

interface AgencyTenantsProps {
  agencyId: string
}

export function AgencyTenants({ agencyId }: AgencyTenantsProps) {
  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ["agency-tenants", agencyId],
    queryFn: async () => {
      if (!agencyId) throw new Error("Agency ID is required")

      console.log("Fetching tenants for agency:", agencyId) // Debug log

      const { data, error } = await supabase
        .from("tenants")
        .select(`
          id,
          nom,
          prenom,
          phone_number,
          birth_date,
          agency_fees,
          agency_id
        `)
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching tenants:", error)
        throw error
      }

      console.log("Fetched tenants:", data) // Debug log
      return data || []
    },
    enabled: !!agencyId
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des locataires
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Date de naissance</TableHead>
            <TableHead>Frais d'agence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.nom}</TableCell>
              <TableCell>{tenant.prenom}</TableCell>
              <TableCell>{tenant.phone_number}</TableCell>
              <TableCell>
                {tenant.birth_date 
                  ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                  : "Non renseignée"}
              </TableCell>
              <TableCell>
                {tenant.agency_fees
                  ? `${tenant.agency_fees.toLocaleString()} FCFA`
                  : "Non renseignés"}
              </TableCell>
            </TableRow>
          ))}
          {tenants.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucun locataire trouvé pour cette agence
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}