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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const filteredProperties = properties.filter(
    (property) =>
      property.bien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher par nom, ville ou type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bien</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Loyer</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>{property.bien}</TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.ville || "-"}</TableCell>
                <TableCell>
                  {property.loyer
                    ? new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(property.loyer)
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      property.statut === "disponible"
                        ? "success"
                        : property.statut === "occupé"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {property.statut || "Non défini"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(property.created_at), "Pp", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}