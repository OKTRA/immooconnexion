import { ApartmentTenant } from "@/types/apartment"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TenantForm } from "@/components/tenant/TenantForm"
import { TenantTable } from "@/components/tenant/TenantTable"
import { Skeleton } from "@/components/ui/skeleton"

export interface ApartmentTenantsTabProps {
  apartmentId: string
  isLoading: boolean
  onDeleteTenant: (id: string) => Promise<void>
  onEditTenant: () => void
  onInspection: () => void
}

export function ApartmentTenantsTab({
  apartmentId,
  isLoading,
  onDeleteTenant,
  onEditTenant,
  onInspection
}: ApartmentTenantsTabProps) {
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          id,
          first_name,
          last_name,
          phone_number,
          birth_date,
          photo_id_url,
          agency_fees,
          profession
        `)
        .eq("apartment_id", apartmentId)

      if (error) throw error
      return data as ApartmentTenant[]
    }
  })

  if (isLoading || tenantsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locataires</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau locataire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un locataire</DialogTitle>
            </DialogHeader>
            <TenantForm apartmentId={apartmentId} />
          </DialogContent>
        </Dialog>
      </div>

      <TenantTable
        tenants={tenants}
        onDelete={onDeleteTenant}
        onEdit={onEditTenant}
        onInspection={onInspection}
      />
    </div>
  )
}
