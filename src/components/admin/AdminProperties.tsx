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
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"

export function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      try {
        // Get the current user's profile to check if they're an admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) {
          console.error('Auth error:', authError)
          await supabase.auth.signOut()
          navigate("/login")
          throw new Error("Session expired. Please login again.")
        }

        if (!user) throw new Error("Non authentifié")

        // First check if user is a super admin
        const { data: adminData } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .maybeSingle()

        // If super admin, get all properties
        if (adminData?.is_super_admin) {
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
        }

        // If not super admin, check regular profile permissions
        const { data: profile } = await supabase
          .from("profiles")
          .select('role, agency_id')
          .eq("id", user.id)
          .maybeSingle()

        // Get properties based on regular admin permissions
        const query = supabase
          .from("properties")
          .select(`
            *,
            agency:agencies(
              id,
              name
            )
          `)
          .order("created_at", { ascending: false })

        if (profile?.role !== 'admin') {
          if (profile?.agency_id) {
            query.eq('agency_id', profile.agency_id)
          } else {
            return []
          }
        }

        const { data, error } = await query
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
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error)
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        })
      }
    }
  })

  const filteredProperties = properties.filter(
    (property) =>
      property.bien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agency_name.toLowerCase().includes(searchTerm.toLowerCase())
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