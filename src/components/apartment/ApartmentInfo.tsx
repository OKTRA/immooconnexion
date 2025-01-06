import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApartmentInfoProps {
  apartment: any;
}

export function ApartmentInfo({ apartment }: ApartmentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Adresse</dt>
            <dd>{apartment.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Description</dt>
            <dd>{apartment.description || "Aucune description"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Nombre d'unités</dt>
            <dd>{apartment.apartment_units?.length || 0}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}