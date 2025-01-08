import { Card, CardContent } from "@/components/ui/card"

interface TenantDetailsProps {
  tenant: any
  currentLease?: any
}

export function TenantDetailsCard({ tenant, currentLease }: TenantDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium">Nom complet</p>
        <p className="text-sm text-muted-foreground">
          {tenant.first_name} {tenant.last_name}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium">Téléphone</p>
        <p className="text-sm text-muted-foreground">{tenant.phone_number || "-"}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Email</p>
        <p className="text-sm text-muted-foreground">{tenant.email || "-"}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Date de naissance</p>
        <p className="text-sm text-muted-foreground">
          {tenant.birth_date ? new Date(tenant.birth_date).toLocaleDateString() : "-"}
        </p>
      </div>
      {currentLease && (
        <>
          <div>
            <p className="text-sm font-medium">Loyer mensuel</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.rent_amount?.toLocaleString()} FCFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Caution</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.deposit_amount?.toLocaleString()} FCFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Date de début</p>
            <p className="text-sm text-muted-foreground">
              {new Date(currentLease.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Date de fin</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.end_date ? new Date(currentLease.end_date).toLocaleDateString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.status}
            </p>
          </div>
        </>
      )}
    </div>
  )
}