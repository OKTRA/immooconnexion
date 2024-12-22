import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PropertyInfoProps {
  property: {
    bien: string
    type: string
    ville: string
    loyer: number
    frais_agence: number
    caution: number
    statut: string
    photo_url: string | null
  }
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Informations du bien</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm md:text-base">Nom du bien</h3>
            <p className="text-sm md:text-base">{property?.bien}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Type</h3>
            <p className="capitalize text-sm md:text-base">{property?.type}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Ville</h3>
            <p className="text-sm md:text-base">{property?.ville}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Loyer Mensuel</h3>
            <p className="text-sm md:text-base">{property?.loyer?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Frais Agence</h3>
            <p className="text-sm md:text-base">{property?.frais_agence?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Caution</h3>
            <p className="text-sm md:text-base">{property?.caution?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Statut</h3>
            <p className="capitalize text-sm md:text-base">{property?.statut}</p>
          </div>
        </div>
        {property?.photo_url && (
          <div className="mt-4 md:mt-0">
            <h3 className="font-semibold mb-2 text-sm md:text-base">Photo du bien</h3>
            <img
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
              alt={property.bien}
              className="rounded-lg w-full h-48 md:h-64 object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}