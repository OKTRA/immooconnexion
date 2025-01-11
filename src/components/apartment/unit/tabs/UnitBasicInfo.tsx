import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApartmentUnitStatus } from "@/types/apartment"

interface UnitBasicInfoProps {
  unit: {
    unit_number: string;
    floor_number: number | null;
    area: number | null;
    status: ApartmentUnitStatus;
    description: string | null;
  }
}

export function UnitBasicInfo({ unit }: UnitBasicInfoProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de base</CardTitle>
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
            <p className="text-sm text-muted-foreground">{unit.area ? `${unit.area} m²` : "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut</p>
            {getStatusBadge(unit.status)}
          </div>
          {unit.description && (
            <div className="col-span-2">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{unit.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}