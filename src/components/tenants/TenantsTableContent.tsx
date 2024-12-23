import { TableBody } from "@/components/ui/table"
import { TenantTableRow } from "./TenantTableRow"
import { TenantDisplay } from "@/hooks/use-tenants"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface TenantsTableContentProps {
  tenants: TenantDisplay[]
  onEdit: (tenant: TenantDisplay) => void
}

export function TenantsTableContent({ tenants, onEdit }: TenantsTableContentProps) {
  const { toast } = useToast()

  if (tenants.length === 0) {
    return (
      <TableBody>
        <tr>
          <td colSpan={5} className="text-center py-4">
            Aucun locataire trouvé
          </td>
        </tr>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {tenants.map((tenant) => (
        <TenantTableRow
          key={tenant.id}
          tenant={tenant}
          onEdit={onEdit}
          onDelete={async (id) => {
            try {
              const { error } = await supabase
                .from('tenants')
                .delete()
                .eq('id', id)

              if (error) throw error

              toast({
                title: "Locataire supprimé",
                description: "Le locataire a été supprimé avec succès.",
              })
            } catch (error: any) {
              console.error('Error in handleDelete:', error)
              toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression.",
                variant: "destructive",
              })
            }
          }}
        />
      ))}
    </TableBody>
  )
}