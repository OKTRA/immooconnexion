import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { Loader2 } from "lucide-react"
import { UnitTenantDialog } from "./UnitTenantDialog"
import { useState } from "react"

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
        .maybeSingle()

      if (error) {
        console.error("Error fetching lease:", error)
        throw error
      }
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
          <CardContent className="space-y-4 pt-6">
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
                  {new Date(currentLease.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Date de fin</p>
                <p className="text-sm text-muted-foreground">
                  {currentLease.end_date ? new Date(currentLease.end_date).toLocaleDateString() : "-"}
                </p>
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