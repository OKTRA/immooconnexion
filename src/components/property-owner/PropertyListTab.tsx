import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, MapPin, AlertCircle } from "lucide-react"
import { useState } from "react"
import { StatCard } from "@/components/StatCard"

interface PropertyListTabProps {
  ownerId: string
}

export function PropertyListTab({ ownerId }: PropertyListTabProps) {
  const [propertyType, setPropertyType] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [searchLocation, setSearchLocation] = useState("")

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["owner-properties", ownerId, propertyType, status, searchLocation],
    queryFn: async () => {
      let query = supabase
        .from('owner_properties_details')
        .select(`
          *,
          contracts:contracts(
            tenant_id,
            montant,
            statut,
            tenants(
              nom,
              prenom
            )
          ),
          property_inspections(
            status,
            has_damages,
            updated_at
          )
        `)
        .eq('owner_id', ownerId)

      if (propertyType !== "all") {
        query = query.eq('property_category', propertyType)
      }

      if (status !== "all") {
        query = query.eq('status', status)
      }

      if (searchLocation) {
        query = query.or(`city.ilike.%${searchLocation}%,neighborhood.ilike.%${searchLocation}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    }
  })

  // Calculate summary stats
  const totalRevenue = properties.reduce((sum, p) => sum + (p.total_revenue || 0), 0)
  const occupiedProperties = properties.filter(p => p.status === 'occupé').length
  const totalProperties = properties.length
  const occupancyRate = totalProperties ? (occupiedProperties / totalProperties) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Revenus Totaux"
          value={`${totalRevenue.toLocaleString()} FCFA`}
          icon={Home}
        />
        <StatCard
          title="Propriétés Occupées"
          value={`${occupiedProperties}/${totalProperties}`}
          icon={Building2}
        />
        <StatCard
          title="Taux d'Occupation"
          value={`${Math.round(occupancyRate)}%`}
          icon={AlertCircle}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-48">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Type de bien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="house">Maisons</SelectItem>
              <SelectItem value="apartment">Appartements</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="occupé">Occupé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Input
            placeholder="Rechercher par ville ou quartier"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const currentTenant = property.contracts?.[0]?.tenants
            const latestInspection = property.property_inspections?.[0]
            const maintenanceStatus = latestInspection?.has_damages ? 'attention' : 'bon'

            return (
              <Card key={property.property_id} className="overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  {property.photo_url ? (
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
                      alt={property.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {property.property_category === 'house' ? (
                        <Home className="h-12 w-12 text-gray-400" />
                      ) : (
                        <Building2 className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                  )}
                  <Badge 
                    className="absolute top-2 right-2"
                    variant={property.status === 'disponible' ? 'default' : 'secondary'}
                  >
                    {property.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{property.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.city}, {property.neighborhood}
                  </div>
                  <div className="space-y-2 text-sm">
                    {currentTenant && (
                      <p>
                        <span className="font-medium">Locataire:</span>{' '}
                        {currentTenant.prenom} {currentTenant.nom}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Loyer:</span>{' '}
                      {property.contracts?.[0]?.montant?.toLocaleString()} FCFA
                    </p>
                    <p>
                      <span className="font-medium">État:</span>{' '}
                      <Badge variant={maintenanceStatus === 'attention' ? 'destructive' : 'default'}>
                        {maintenanceStatus === 'attention' ? 'Nécessite attention' : 'Bon état'}
                      </Badge>
                    </p>
                    <div className="flex justify-between pt-2">
                      <span>Contrats: {property.total_contracts}</span>
                      <span>Revenue: {property.total_revenue?.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {properties.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Aucun bien trouvé
            </div>
          )}
        </div>
      )}
    </div>
  )
}