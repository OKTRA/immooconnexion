import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TenantHeaderProps {
  tenant: any
}

export function TenantHeader({ tenant }: TenantHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={tenant.photo_id_url} alt={`${tenant.first_name} ${tenant.last_name}`} />
            <AvatarFallback>{tenant.first_name?.[0]}{tenant.last_name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {tenant.first_name} {tenant.last_name}
              </h1>
              <Badge>
                {tenant.apartment_leases?.[0]?.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>

            <div className="text-muted-foreground">
              <p>Appartement: {tenant.apartment_units?.apartment?.name}</p>
              <p>Unité: {tenant.apartment_units?.unit_number}</p>
              <p>Téléphone: {tenant.phone_number}</p>
              <p>Email: {tenant.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}