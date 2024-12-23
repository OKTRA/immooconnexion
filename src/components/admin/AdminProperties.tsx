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
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      // Get the current user's profile to check if they're an admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      // If admin, get all properties, otherwise get only agency's properties
      const query = supabase
        .from("properties")
        .select("*, profiles(agency_name)")
        .order("created_at", { ascending: false })

      if (profile?.role !== 'admin') {
        query.eq('agency_id', user.id)
      }

      const { data, error } = await query
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

  if (isLoading) {
    return <div>Chargement...</div>
  }

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
              <TableHead>Agence</TableHead>
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
                <TableCell>{property.profiles?.agency_name || "N/A"}</TableCell>
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