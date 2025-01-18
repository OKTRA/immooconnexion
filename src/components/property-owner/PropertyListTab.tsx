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
  const [assetType, setAssetType] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [searchLocation, setSearchLocation] = useState("")

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["owner-assets", ownerId, assetType, status, searchLocation],
    queryFn: async () => {
      let query = supabase
        .from('owner_combined_assets')
        .select('*')
        .eq('owner_id', ownerId)

      if (assetType !== "all") {
        query = query.eq('asset_type', assetType)
      }

      if (status !== "all") {
        query = query.eq('status', status)
      }

      if (searchLocation) {
        query = query.or(`city.ilike.%${searchLocation}%,neighborhood.ilike.%${searchLocation}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching assets:", error)
        throw error
      }

      console.log("Fetched assets:", data)
      return data
    }
  })

  // Calculate summary stats
  const totalRevenue = assets.reduce((sum, p) => sum + (p.total_revenue || 0), 0)
  const occupiedAssets = assets.filter(p => p.status === 'occupé' || p.status === 'active').length
  const totalAssets = assets.length
  const occupancyRate = totalAssets ? (occupiedAssets / totalAssets) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Revenus Totaux"
          value={`${totalRevenue.toLocaleString()} FCFA`}
          icon={Home}
        />
        <StatCard
          title="Biens Occupés"
          value={`${occupiedAssets}/${totalAssets}`}
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
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger>
              <SelectValue placeholder="Type de bien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="property">Propriétés</SelectItem>
              <SelectItem value="apartment">Immeubles</SelectItem>
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
              <SelectItem value="active">Actif</SelectItem>
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
          {assets.map((asset) => (
            <Card key={asset.asset_id}>
              <div className="aspect-video relative bg-gray-100">
                {asset.photo_url ? (
                  <img
                    src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${asset.photo_url}`}
                    alt={asset.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {asset.asset_type === 'property' ? (
                      <Home className="h-12 w-12 text-gray-400" />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2"
                  variant={asset.status === 'disponible' ? 'default' : 'secondary'}
                >
                  {asset.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{asset.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {asset.city}
                  {asset.neighborhood && `, ${asset.neighborhood}`}
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Type:</span>{' '}
                    {asset.asset_type === 'property' ? 'Propriété' : 'Immeuble'}
                  </p>
                  {asset.rent_amount > 0 && (
                    <p>
                      <span className="font-medium">Loyer:</span>{' '}
                      {asset.rent_amount.toLocaleString()} FCFA
                    </p>
                  )}
                  {asset.total_units > 0 && (
                    <p>
                      <span className="font-medium">Unités:</span>{' '}
                      {asset.total_units}
                    </p>
                  )}
                  <div className="flex justify-between pt-2">
                    <span>Revenus: {asset.total_revenue?.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {assets.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Aucun bien trouvé
            </div>
          )}
        </div>
      )}
    </div>
  )
}