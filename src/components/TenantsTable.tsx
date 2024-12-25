import { Table } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { TenantsTableHeader } from "./tenants/TenantsTableHeader"
import { TenantsTableContent } from "./tenants/TenantsTableContent"
import { TenantDisplay, useTenants } from "@/hooks/use-tenants"
import { useToast } from "./ui/use-toast"
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface TenantsTableProps {
  onEdit: (tenant: TenantDisplay) => void
}

export function TenantsTable({ onEdit }: TenantsTableProps) {
  const { toast } = useToast()
  const { tenants, isLoading, error, session, refetch } = useTenants()

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des locataires. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès.",
      })
      
      refetch()
    } catch (error: any) {
      console.error('Error deleting tenant:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du locataire.",
        variant: "destructive",
      })
    }
  }

  if (!session) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun locataire trouvé
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TenantsTableHeader />
          <TenantsTableContent 
            tenants={tenants} 
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        </Table>
      </div>
    </div>
  )
}