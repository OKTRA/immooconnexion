import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface ApartmentTenantsTableProps {
  onEdit?: (tenant: ApartmentTenant) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function ApartmentTenantsTable({ onEdit, onDelete, isLoading }: ApartmentTenantsTableProps) {
  const navigate = useNavigate()
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
        {tenants.map((tenant) => (
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
              {tenant.apartment_leases?.[0]?.status || "Inactif"}
            </ResponsiveTable.Cell>
            <ResponsiveTable.Cell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/agence/tenants/${tenant.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(tenant)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tenant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </ResponsiveTable.Cell>
          </ResponsiveTable.Row>
        ))}
      </ResponsiveTable.Body>
    </ResponsiveTable>
  )
}