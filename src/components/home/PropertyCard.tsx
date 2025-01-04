import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Home, BedDouble, Bath } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  property: {
    id: string;
    bien: string;
    type: string;
    ville?: string;
    loyer?: number;
    chambres?: number;
    photo_url?: string;
    agency?: {
      name: string;
      address?: string;
    } | null;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate()

  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800" 
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div className="aspect-[16/9] relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        {property.photo_url ? (
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
            alt={property.bien}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 shadow-sm">
            {property.type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {property.bien}
            </h3>
            {property.ville && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                {property.ville}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            {property.chambres && (
              <div className="flex items-center">
                <BedDouble className="h-4 w-4 mr-1" />
                {property.chambres} ch.
              </div>
            )}
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              {property.type}
            </div>
          </div>

          {property.loyer && (
            <div className="text-2xl font-bold text-primary">
              {property.loyer.toLocaleString()} FCFA
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> /mois</span>
            </div>
          )}

          {property.agency && (
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-gray-100">{property.agency.name}</div>
                {property.agency.address && (
                  <div className="text-gray-500 dark:text-gray-400 mt-1">{property.agency.address}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}