import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, UserPlus } from "lucide-react"
import { useState } from "react"
import { UnitTenantDialog } from "./UnitTenantDialog"

interface UnitTenantTabProps {
  unitId: string
}

export function UnitTenantTab({ unitId }: UnitTenantTabProps) {
  const [showDialog, setShowDialog] = useState(false)

  const { data: currentLease, isLoading } = useQuery({
    queryKey: ["unit-current-lease", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants (
            id,
            first_name,
            last_name,
            email,
            phone_number
          )
        `)
        .eq("unit_id", unitId)
        .eq("status", "active")
        .single()

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Locataire actuel</h2>
        {!currentLease && (
          <Button onClick={() => setShowDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un locataire
          </Button>
        )}
      </div>

      {currentLease ? (
        <Card>
          <CardHeader>
            <CardTitle>Informations du bail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Locataire</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.tenant.first_name} {currentLease.tenant.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.tenant.email || "-"}
                  <br />
                  {currentLease.tenant.phone_number || "-"}
                </p>
              </div>
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
                  {format(new Date(currentLease.start_date), "PP", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Date de fin</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(currentLease.end_date), "PP", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Statut</p>
                <Badge variant={currentLease.status === "active" ? "success" : "secondary"}>
                  {currentLease.status === "active" ? "Actif" : "Terminé"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Aucun locataire actuellement dans cette unité
            </p>
          </CardContent>
        </Card>
      )}

      <UnitTenantDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        unitId={unitId}
      />
    </div>
  )
}