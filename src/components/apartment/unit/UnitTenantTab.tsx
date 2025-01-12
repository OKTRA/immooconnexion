import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface UnitTenantTabProps {
  unitId: string
  apartmentId: string
}

export function UnitTenantTab({ unitId, apartmentId }: UnitTenantTabProps) {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['unit-tenant', unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("unit_id", unitId)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Aucun locataire associé à cette unité
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Informations du locataire</h3>
            <p className="text-sm text-muted-foreground">
              {tenant.first_name} {tenant.last_name}
            </p>
          </div>
          {tenant.phone_number && (
            <div>
              <h3 className="font-medium">Téléphone</h3>
              <p className="text-sm text-muted-foreground">{tenant.phone_number}</p>
            </div>
          )}
          {tenant.email && (
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{tenant.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}