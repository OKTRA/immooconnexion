import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { UnitTenantDialog } from "./UnitTenantDialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"
import { useToast } from "@/hooks/use-toast"
import { TenantDetailsCard } from "./TenantDetailsCard"
import { TenantActionButtons } from "./TenantActionButtons"
import { Contract } from "@/integrations/supabase/types/contracts"

interface UnitTenantTabProps {
  unitId: string
}

export function UnitTenantTab({ unitId }: UnitTenantTabProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showInspectionDialog, setShowInspectionDialog] = useState(false)
  const { toast } = useToast()

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
            status
          )
        `)
        .eq("unit_id", unitId)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", tenant?.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé",
      })
    } catch (error) {
      console.error("Error deleting tenant:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!tenant) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Aucun locataire associé à cette unité</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentLease = tenant.apartment_leases?.[0]

  const contractData: Contract = {
    id: currentLease?.id || '',
    montant: currentLease?.rent_amount || 0,
    type: 'location',
    rent_amount: currentLease?.rent_amount,
    deposit_amount: currentLease?.deposit_amount,
    start_date: currentLease?.start_date,
    end_date: currentLease?.end_date,
    status: currentLease?.status
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <TenantDetailsCard tenant={tenant} currentLease={currentLease} />
          <TenantActionButtons
            tenant={tenant}
            currentLease={currentLease}
            onEdit={() => setShowEditDialog(true)}
            onDelete={handleDelete}
            onInspection={() => setShowInspectionDialog(true)}
          />
        </CardContent>
      </Card>

      <UnitTenantDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        unitId={unitId}
        initialData={tenant}
      />

      {currentLease && (
        <InspectionDialog
          open={showInspectionDialog}
          onOpenChange={setShowInspectionDialog}
          contract={currentLease}
        />
      )}
    </div>
  )
}
