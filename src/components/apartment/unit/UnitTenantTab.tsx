import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { UnitTenantDialog } from "./UnitTenantDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TenantDetailsCard } from "./TenantDetailsCard"
import { TenantActionButtons } from "./TenantActionButtons"
import { LeaseDialog } from "../lease/LeaseDialog"

interface UnitTenantTabProps {
  unitId: string
}

export function UnitTenantTab({ unitId }: UnitTenantTabProps) {
  const [showTenantDialog, setShowTenantDialog] = useState(false)
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState<string>()

  const { data: tenant, isLoading } = useQuery({
    queryKey: ["unit-tenant", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_leases (
            id,
            rent_amount,
            deposit_amount,
            start_date,
            end_date,
            status,
            payment_type,
            initial_fees_paid
          )
        `)
        .eq("unit_id", unitId)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  const handleTenantCreated = (tenantId: string) => {
    setSelectedTenantId(tenantId)
    setShowTenantDialog(false)
    setShowLeaseDialog(true)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!tenant) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Aucun locataire associé à cette unité
              </p>
              <Button onClick={() => setShowTenantDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un locataire
              </Button>
            </div>
          </CardContent>
        </Card>

        <UnitTenantDialog
          open={showTenantDialog}
          onOpenChange={setShowTenantDialog}
          unitId={unitId}
          onSuccess={handleTenantCreated}
        />

        {selectedTenantId && (
          <LeaseDialog
            open={showLeaseDialog}
            onOpenChange={setShowLeaseDialog}
            unitId={unitId}
            tenantId={selectedTenantId}
          />
        )}
      </div>
    )
  }

  const currentLease = tenant.apartment_leases?.[0]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <TenantDetailsCard tenant={tenant} currentLease={currentLease} />
          <TenantActionButtons
            tenant={tenant}
            currentLease={currentLease}
            onEdit={() => setShowTenantDialog(true)}
            onDelete={async () => {
              // Handle delete
            }}
            onInspection={() => {
              // Handle inspection
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}