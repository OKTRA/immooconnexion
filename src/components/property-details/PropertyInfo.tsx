import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Home, BedDouble, Wallet } from "lucide-react"

interface PropertyInfoProps {
  property: {
    bien: string
    type: string
    ville: string
    loyer: number
    frais_agence: number | null
    caution: number
    statut: string
    photo_url: string | null
    chambres: number | null
  }
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <Card className="w-full overflow-hidden bg-white dark:bg-gray-800">
      <CardHeader className="border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold">{property?.bien}</CardTitle>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {property?.ville}
            </p>
          </div>
          <Badge 
            variant={property?.statut === 'disponible' ? 'success' : 'secondary'}
            className="capitalize px-3 py-1"
          >
            {property?.statut}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <Home className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{property?.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <BedDouble className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Chambres</p>
                  <p className="font-medium">{property?.chambres}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Loyer Mensuel</p>
                  <p className="font-medium">{property?.loyer?.toLocaleString()} FCFA</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Frais d'Agence</p>
                  <p className="font-medium">{property?.frais_agence?.toLocaleString() || 0} FCFA</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Caution</p>
                  <p className="font-medium">{property?.caution?.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          </div>

          {property?.photo_url && (
            <div className="relative h-[300px] md:h-full rounded-lg overflow-hidden">
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
                alt={property.bien}
                className="absolute inset-0 w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}