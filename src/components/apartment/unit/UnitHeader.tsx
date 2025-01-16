import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface UnitHeaderProps {
  unit: {
    unit_number: string
    apartment?: {
      name: string
    }
    current_lease?: {
      tenant: {
        first_name: string | null
        last_name: string | null
        email?: string
        phone_number?: string
        birth_date?: string
        profession?: string
      }
      start_date: string
      end_date?: string
      rent_amount: number
      deposit_amount: number
      status: string
    }
  }
}

export function UnitHeader({ unit }: UnitHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Unité {unit.unit_number} - {unit.apartment?.name}
          </h1>
          <p className="text-muted-foreground">
            Détails et gestion de l'unité
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {unit.current_lease && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Locataire actuel</h2>
                <Badge variant={unit.current_lease.status === 'active' ? 'default' : 'secondary'}>
                  {unit.current_lease.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nom complet</p>
                  <p className="text-sm text-muted-foreground">
                    {unit.current_lease.tenant.first_name || ''} {unit.current_lease.tenant.last_name || ''}
                  </p>
                </div>
                {unit.current_lease.tenant.phone_number && (
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.current_lease.tenant.phone_number}
                    </p>
                  </div>
                )}
                {unit.current_lease.tenant.email && (
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.current_lease.tenant.email}
                    </p>
                  </div>
                )}
                {unit.current_lease.tenant.profession && (
                  <div>
                    <p className="text-sm font-medium">Profession</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.current_lease.tenant.profession}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Date de début</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(unit.current_lease.start_date), 'PP', { locale: fr })}
                  </p>
                </div>
                {unit.current_lease.end_date && (
                  <div>
                    <p className="text-sm font-medium">Date de fin</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(unit.current_lease.end_date), 'PP', { locale: fr })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Loyer mensuel</p>
                  <p className="text-sm text-muted-foreground">
                    {unit.current_lease.rent_amount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Caution</p>
                  <p className="text-sm text-muted-foreground">
                    {unit.current_lease.deposit_amount.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}