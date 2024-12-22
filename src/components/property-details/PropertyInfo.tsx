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
    <Card>
      <CardHeader>
        <CardTitle>Informations du bien</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">Nom du bien</h3>
            <p>{property?.bien}</p>
          </div>
          <div>
            <h3 className="font-semibold">Type</h3>
            <p className="capitalize">{property?.type}</p>
          </div>
          <div>
            <h3 className="font-semibold">Ville</h3>
            <p>{property?.ville}</p>
          </div>
          <div>
            <h3 className="font-semibold">Loyer Mensuel</h3>
            <p>{property?.loyer?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <h3 className="font-semibold">Frais Agence</h3>
            <p>{property?.frais_agence?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <h3 className="font-semibold">Caution</h3>
            <p>{property?.caution?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <h3 className="font-semibold">Statut</h3>
            <p className="capitalize">{property?.statut}</p>
          </div>
        </div>
        {property?.photo_url && (
          <div>
            <h3 className="font-semibold mb-2">Photo du bien</h3>
            <img
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
              alt={property.bien}
              className="rounded-lg w-full object-cover h-48"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}