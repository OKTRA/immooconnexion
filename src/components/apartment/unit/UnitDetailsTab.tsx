import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApartmentUnitStatus } from "@/components/apartment/types"

interface UnitDetailsTabProps {
  unit: {
    unit_number: string;
    floor_number: number | null;
    area: number | null;
    rent_amount: number;
    deposit_amount: number | null;
    status: ApartmentUnitStatus;
    photo_urls?: string[];
  };
  hasActiveLease: boolean;
}

export function UnitDetailsTab({ unit, hasActiveLease }: UnitDetailsTabProps) {
  const getStatusBadge = (status: string, hasActiveLease: boolean) => {
    if (hasActiveLease) {
      return <Badge variant="default">Occupé</Badge>
    }
    switch (status) {
      case 'available':
        return <Badge variant="success">Disponible</Badge>
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
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
            <p className="text-sm font-medium">Loyer</p>
            <p className="text-sm text-muted-foreground">{unit.rent_amount?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <p className="text-sm font-medium">Caution</p>
            <p className="text-sm text-muted-foreground">{unit.deposit_amount?.toLocaleString() || "-"} FCFA</p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut</p>
            {getStatusBadge(unit.status, hasActiveLease)}
          </div>
        </div>
        {unit.photo_urls && unit.photo_urls.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Photos</p>
            <div className="grid grid-cols-2 gap-4">
              {unit.photo_urls.map((url, index) => (
                <img 
                  key={index}
                  src={url} 
                  alt={`Unit ${index + 1}`} 
                  className="rounded-lg w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}