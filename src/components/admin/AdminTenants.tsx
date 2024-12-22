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
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function AdminTenants() {
  const { data: tenants = [] } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Date de naissance</TableHead>
            <TableHead>Frais d'agence</TableHead>
            <TableHead>Date de création</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.nom || "-"}</TableCell>
              <TableCell>{tenant.prenom || "-"}</TableCell>
              <TableCell>{tenant.phone_number || "-"}</TableCell>
              <TableCell>
                {tenant.birth_date
                  ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                  : "-"}
              </TableCell>
              <TableCell>
                {tenant.agency_fees
                  ? new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                    }).format(tenant.agency_fees)
                  : "-"}
              </TableCell>
              <TableCell>
                {format(new Date(tenant.created_at), "Pp", { locale: fr })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}