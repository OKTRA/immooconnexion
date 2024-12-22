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
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function AdminTenants() {
  const [searchTerm, setSearchTerm] = useState("")
  
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

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher par nom, prénom ou téléphone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      <div className="rounded-md border">
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
            {filteredTenants.map((tenant) => (
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
    </div>
  )
}