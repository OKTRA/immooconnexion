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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!user) throw new Error("Non authentifié")

        const { data: adminData } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .maybeSingle()

        if (!adminData?.is_super_admin) {
          throw new Error("Accès non autorisé")
        }

        const { data, error } = await supabase
          .from("properties")
          .select(`
            *,
            agency:agencies(
              id,
              name
            )
          `)
          .order("created_at", { ascending: false })

        if (error) throw error
        
        return data.map(property => ({
          ...property,
          agency_name: property.agency?.name || 'N/A'
        }))
      } catch (error: any) {
        console.error('Error fetching properties:', error)
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors du chargement des propriétés",
          variant: "destructive"
        })
        return []
      }
    },
  })

  const filteredProperties = properties.filter(
    (property) =>
      property.bien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agency_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
                <TableCell>{property.agency_name}</TableCell>
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