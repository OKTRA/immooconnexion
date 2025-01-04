import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building2, MapPin, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyCardProps {
  property: {
    id: string;
    bien: string;
    type: string;
    ville?: string;
    loyer?: number;
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
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div className="aspect-[16/9] relative bg-gray-100">
        {property.photo_url ? (
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
            alt={property.bien}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-semibold">{property.bien}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Building2 className="h-4 w-4 mr-1" />
          {property.type}
        </div>
        {property.ville && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {property.ville}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {property.loyer && (
          <div className="text-xl font-bold text-red-500">
            {property.loyer.toLocaleString()} FCFA
          </div>
        )}
        {property.agency && (
          <div className="text-sm text-gray-600 border-t pt-2 mt-2">
            <div className="font-medium">{property.agency.name}</div>
            {property.agency.address && (
              <div className="text-gray-500">{property.agency.address}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}