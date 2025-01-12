import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface TenantHeaderProps {
  tenant: any
}

export function TenantHeader({ tenant }: TenantHeaderProps) {
  const currentLease = tenant.apartment_leases?.[0]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={tenant.photo_id_url} alt={`${tenant.first_name} ${tenant.last_name}`} />
            <AvatarFallback>{tenant.first_name?.[0]}{tenant.last_name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {tenant.first_name} {tenant.last_name}
                </h1>
                <Badge variant={currentLease?.status === 'active' ? 'default' : 'secondary'}>
                  {currentLease?.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <div className="text-muted-foreground">
                <p>Téléphone: {tenant.phone_number || 'Non renseigné'}</p>
                <p>Email: {tenant.email || 'Non renseigné'}</p>
                <p>Profession: {tenant.profession || 'Non renseignée'}</p>
                {tenant.birth_date && (
                  <p>Date de naissance: {format(new Date(tenant.birth_date), 'PP', { locale: fr })}</p>
                )}
              </div>
            </div>

            {currentLease && (
              <div className="border-t pt-4">
                <h2 className="font-semibold mb-2">Informations du bail</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Appartement</p>
                    <p className="font-medium">
                      {tenant.apartment_units?.apartment?.name} - Unité {tenant.apartment_units?.unit_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de début</p>
                    <p className="font-medium">
                      {format(new Date(currentLease.start_date), 'PP', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                    <p className="font-medium">
                      {currentLease.rent_amount?.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Caution</p>
                    <p className="font-medium">
                      {currentLease.deposit_amount?.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}