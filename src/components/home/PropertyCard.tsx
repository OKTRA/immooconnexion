import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  property: {
    bien: string
    ville: string
    chambres: number
    type: string
    loyer: number
    photo_url: string | null
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={property.photo_url ? 
            `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}` :
            "/placeholder.svg"
          }
          alt={property.bien}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{property.bien}</h3>
        <p className="text-gray-600 text-lg mb-4">{property.ville}</p>
        
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-gray-500" />
            <span>{property.chambres}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 text-gray-500" />
            <span>{property.type === 'appartement' ? '1' : '2'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-5 w-5 text-gray-500" />
            <span>120m²</span>
          </div>
        </div>
        
        <p className="text-2xl font-bold text-red-500">
          {property.loyer?.toLocaleString()} FCFA <span className="text-base font-normal">/mois</span>
        </p>
      </CardContent>
    </Card>
  )
}