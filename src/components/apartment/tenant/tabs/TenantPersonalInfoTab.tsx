import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TenantPersonalInfoTabProps {
  tenant: any
}

export function TenantPersonalInfoTab({ tenant }: TenantPersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">
                {tenant.birth_date ? new Date(tenant.birth_date).toLocaleDateString() : 'Non renseignée'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profession</p>
              <p className="font-medium">{tenant.profession || 'Non renseignée'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Employeur</p>
              <p className="font-medium">{tenant.employer_name || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone employeur</p>
              <p className="font-medium">{tenant.employer_phone || 'Non renseigné'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Adresse employeur</p>
              <p className="font-medium">{tenant.employer_address || 'Non renseignée'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact d'urgence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p className="font-medium">{tenant.emergency_contact_name || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{tenant.emergency_contact_phone || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relation</p>
              <p className="font-medium">{tenant.emergency_contact_relationship || 'Non renseignée'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}