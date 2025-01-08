import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ApartmentUnit } from "@/types/apartment"
import { ApartmentTenantsTable } from "../tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "../tenant/ApartmentTenantDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ApartmentTenantsTabProps {
  apartmentId: string
  units: ApartmentUnit[]
}

export function ApartmentTenantsTab({ apartmentId, units }: ApartmentTenantsTabProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!inner (
            unit_number,
            apartment_id
          )
        `)
        .eq("apartment_units.apartment_id", apartmentId)

      if (error) throw error
      return data
    }
  })

  const handleEdit = (tenant: any) => {
    setSelectedTenant(tenant)
    setShowDialog(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locataires</h2>
        <Button onClick={() => {
          setSelectedTenant(null)
          setShowDialog(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un locataire
        </Button>
      </div>

      <ApartmentTenantsTable
        tenants={tenants}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <ApartmentTenantDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        tenant={selectedTenant}
        apartmentId={apartmentId}
        availableUnits={units}
      />
    </div>
  )
}