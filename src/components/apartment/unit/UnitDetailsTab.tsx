import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ApartmentUnitStatus } from "@/components/apartment/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface UnitDetailsTabProps {
  unit: {
    id: string;
    unit_number: string;
    floor_number: number | null;
    area: number | null;
    rent_amount: number;
    deposit_amount: number | null;
    status: ApartmentUnitStatus;
    description: string | null;
    photo_urls?: string[];
  };
}

export function UnitDetailsTab({ unit }: UnitDetailsTabProps) {
  // Fetch current lease information
  const { data: currentLease } = useQuery({
    queryKey: ["unit-lease", unit.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants(
            first_name,
            last_name,
            phone_number
          )
        `)
        .eq("unit_id", unit.id)
        .eq("status", "active")
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  const getStatusBadge = (status: ApartmentUnitStatus) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Disponible</Badge>
      case "occupied":
        return <Badge variant="default">Occupé</Badge>
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateAgencyFees = (rentAmount: number) => {
    return rentAmount * 0.5 // 50% du loyer
  }

  return (
    <div className="space-y-6">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'unité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Numéro d'unité</p>
              <p className="text-sm text-muted-foreground">{unit.unit_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Étage</p>
              <p className="text-sm text-muted-foreground">{unit.floor_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Surface</p>
              <p className="text-sm text-muted-foreground">{unit.area || "-"} m²</p>
            </div>
            <div>
              <p className="text-sm font-medium">Statut</p>
              {getStatusBadge(unit.status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations financières */}
      <Card>
        <CardHeader>
          <CardTitle>Informations financières</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Loyer mensuel</p>
              <p className="text-sm text-muted-foreground">
                {unit.rent_amount?.toLocaleString()} FCFA
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Caution</p>
              <p className="text-sm text-muted-foreground">
                {unit.deposit_amount?.toLocaleString() || "-"} FCFA
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Frais d'agence</p>
              <p className="text-sm text-muted-foreground">
                {calculateAgencyFees(unit.rent_amount).toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations du bail actuel */}
      {currentLease && (
        <Card>
          <CardHeader>
            <CardTitle>Bail actuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Locataire</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.tenant?.first_name} {currentLease.tenant?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.tenant?.phone_number || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Date de début</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(currentLease.start_date), "PP", { locale: fr })}
                </p>
              </div>
              {currentLease.end_date && (
                <div>
                  <p className="text-sm font-medium">Date de fin</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(currentLease.end_date), "PP", { locale: fr })}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Fréquence de paiement</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.payment_frequency === "monthly" ? "Mensuel" : 
                   currentLease.payment_frequency === "quarterly" ? "Trimestriel" : 
                   currentLease.payment_frequency === "yearly" ? "Annuel" : 
                   currentLease.payment_frequency}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Type de durée</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.duration_type === "fixed" ? "Durée déterminée" :
                   currentLease.duration_type === "month_to_month" ? "Mois par mois" :
                   currentLease.duration_type === "yearly" ? "Annuel" :
                   currentLease.duration_type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos de l'unité */}
      {unit.photo_urls && unit.photo_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {unit.photo_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Unité ${unit.unit_number} - Photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}