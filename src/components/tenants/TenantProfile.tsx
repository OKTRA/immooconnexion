import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"

interface TenantProfileProps {
  tenantId: string
}

export function TenantProfile({ tenantId }: TenantProfileProps) {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant-profile', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          contracts:contracts(
            *,
            property:properties(*)
          )
        `)
        .eq('id', tenantId)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Aucune information trouvée pour ce locataire
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{tenant.prenom} {tenant.nom}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{tenant.phone_number || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">
                {tenant.birth_date 
                  ? format(new Date(tenant.birth_date), 'PP', { locale: fr })
                  : 'Non renseignée'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frais d'agence</p>
              <p className="font-medium">
                {tenant.agency_fees
                  ? `${tenant.agency_fees.toLocaleString()} FCFA`
                  : 'Non renseignés'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {tenant.contracts && tenant.contracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contrat actif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bien</p>
                <p className="font-medium">{tenant.contracts[0].property?.bien || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                <p className="font-medium">
                  {tenant.contracts[0].montant
                    ? `${tenant.contracts[0].montant.toLocaleString()} FCFA`
                    : 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de début</p>
                <p className="font-medium">
                  {format(new Date(tenant.contracts[0].start_date), 'PP', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <p className="font-medium capitalize">{tenant.contracts[0].statut}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}