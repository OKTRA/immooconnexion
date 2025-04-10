import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AgencyPropertiesProps {
  agencyId: string
}

export function AgencyProperties({ agencyId }: AgencyPropertiesProps) {
  console.log("AgencyProperties component - agencyId:", agencyId)

  const { data: properties = [], isLoading: propertiesLoading, error: propertiesError } = useQuery({
    queryKey: ["agency-properties", agencyId],
    queryFn: async () => {
      console.log("Fetching properties for agency:", agencyId)
      
      const { data: profile } = await supabase.auth.getUser()
      console.log("Current user:", profile?.user?.id)

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching properties:", error)
        throw error
      }

      console.log("Properties data:", data)
      return data || []
    },
    enabled: !!agencyId,
    retry: 1
  })

  const { data: propertySales = [], isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ["agency-property-sales", agencyId],
    queryFn: async () => {
      console.log("Fetching property sales for agency:", agencyId)

      const { data: profile } = await supabase.auth.getUser()
      console.log("Current user for sales:", profile?.user?.id)

      const { data, error } = await supabase
        .from("property_sales")
        .select(`
          *,
          property:properties(bien)
        `)
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching property sales:", error)
        throw error
      }

      console.log("Property sales data:", data)
      return data || []
    },
    enabled: !!agencyId,
    retry: 1
  })

  // Log any errors
  if (propertiesError) console.error("Properties query error:", propertiesError)
  if (salesError) console.error("Sales query error:", salesError)

  if (propertiesLoading || salesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (propertiesError || salesError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Une erreur est survenue lors du chargement des données. Veuillez réessayer.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="properties" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="properties">Biens</TabsTrigger>
        <TabsTrigger value="sales">Ventes</TabsTrigger>
      </TabsList>

      <TabsContent value="properties">
        <div className="rounded-md border overflow-x-auto">
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
      </TabsContent>

      <TabsContent value="sales">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bien</TableHead>
                <TableHead>Acheteur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Prix de vente</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Date de vente</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertySales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.property?.bien}</TableCell>
                  <TableCell>{sale.buyer_name}</TableCell>
                  <TableCell>{sale.buyer_contact || "-"}</TableCell>
                  <TableCell>{sale.sale_price?.toLocaleString()} FCFA</TableCell>
                  <TableCell>{sale.commission_amount?.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    {format(new Date(sale.sale_date), "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={sale.payment_status === "completed" ? "success" : "secondary"}>
                      {sale.payment_status === "completed" ? "Payé" : "En attente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {propertySales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucune vente trouvée pour cette agence
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}