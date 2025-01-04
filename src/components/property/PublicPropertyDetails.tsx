import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Home, BedDouble, Wallet, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export function PublicPropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: property, isLoading } = useQuery({
    queryKey: ['public-property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(name, address, phone, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        Propriété non trouvée
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <Card className="w-full overflow-hidden bg-white">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                {property.bien}
              </CardTitle>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {property.ville}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                  <Home className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{property.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Chambres</p>
                    <p className="font-medium">{property.chambres}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loyer Mensuel</p>
                    <p className="font-medium">{property.loyer?.toLocaleString()} FCFA</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Frais d'Agence</p>
                    <p className="font-medium">{property.frais_agence?.toLocaleString() || 0} FCFA</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Caution</p>
                    <p className="font-medium">{property.caution?.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>

              {property.agency && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Informations de l'agence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{property.agency.name}</p>
                    {property.agency.address && (
                      <p className="text-sm text-gray-600">{property.agency.address}</p>
                    )}
                    {property.agency.phone && (
                      <p className="text-sm text-gray-600">{property.agency.phone}</p>
                    )}
                    {property.agency.email && (
                      <p className="text-sm text-gray-600">{property.agency.email}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {property.photo_url && (
              <div className="relative h-[300px] md:h-full rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
                  alt={property.bien}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}