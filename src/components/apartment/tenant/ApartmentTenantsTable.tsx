import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { TenantActionButtons } from "@/components/apartment/tenant/TenantActionButtons"
import { useToast } from "@/hooks/use-toast"

interface ApartmentTenantsTableProps {
  onEdit?: (tenant: ApartmentTenant) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function ApartmentTenantsTable({ onEdit, onDelete, isLoading }: ApartmentTenantsTableProps) {
  const { toast } = useToast()
  
  const { data: tenants = [] } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments (
              name
            )
          ),
          apartment_leases (
            id,
            tenant_id,
            unit_id,
            start_date,
            end_date,
            rent_amount,
            deposit_amount,
            status,
            payment_frequency,
            duration_type,
            payment_type
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching tenants:", error)
        throw error
      }

      return data as ApartmentTenant[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })

      onDelete?.(id)
    } catch (error) {
      console.error("Error deleting tenant:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du locataire",
        variant: "destructive",
      })
    }
  }

  const handleInspection = (tenant: ApartmentTenant) => {
    // Cette fonction sera implémentée plus tard pour gérer les inspections
    console.log("Inspection for tenant:", tenant)
  }

  return (
    <ResponsiveTable>
      <ResponsiveTable.Header>
        <ResponsiveTable.Row>
          <ResponsiveTable.Head>Nom</ResponsiveTable.Head>
          <ResponsiveTable.Head>Email</ResponsiveTable.Head>
          <ResponsiveTable.Head>Téléphone</ResponsiveTable.Head>
          <ResponsiveTable.Head>Unité</ResponsiveTable.Head>
          <ResponsiveTable.Head>Statut</ResponsiveTable.Head>
          <ResponsiveTable.Head className="text-right">Actions</ResponsiveTable.Head>
        </ResponsiveTable.Row>
      </ResponsiveTable.Header>
      <ResponsiveTable.Body>
        {tenants.map((tenant) => {
          const currentLease = tenant.apartment_leases?.find(lease => lease.status === 'active')
          
          return (
            <ResponsiveTable.Row key={tenant.id}>
              <ResponsiveTable.Cell>
                {tenant.first_name} {tenant.last_name}
              </ResponsiveTable.Cell>
              <ResponsiveTable.Cell>{tenant.email}</ResponsiveTable.Cell>
              <ResponsiveTable.Cell>{tenant.phone_number}</ResponsiveTable.Cell>
              <ResponsiveTable.Cell>
                {tenant.apartment_units?.apartment?.name} - Unité {tenant.apartment_units?.unit_number}
              </ResponsiveTable.Cell>
              <ResponsiveTable.Cell>
                {currentLease?.status || "Inactif"}
              </ResponsiveTable.Cell>
              <ResponsiveTable.Cell className="text-right">
                <TenantActionButtons
                  tenant={tenant}
                  currentLease={currentLease}
                  onEdit={() => onEdit?.(tenant)}
                  onDelete={() => handleDelete(tenant.id)}
                  onInspection={() => handleInspection(tenant)}
                />
              </ResponsiveTable.Cell>
            </ResponsiveTable.Row>
          )
        })}
      </ResponsiveTable.Body>
    </ResponsiveTable>
  )
}