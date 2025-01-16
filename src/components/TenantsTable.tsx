import { Table } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { TenantsTableHeader } from "./tenants/TenantsTableHeader"
import { TenantsTableContent } from "./tenants/TenantsTableContent"
import { TenantDisplay, useTenants } from "@/hooks/use-tenants"
import { useToast } from "./ui/use-toast"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TenantsTableProps {
  onEdit: (tenant: TenantDisplay) => void
}

export function TenantsTable({ onEdit }: TenantsTableProps) {
  const { toast } = useToast()
  const { tenants, isLoading, error, session, refetch } = useTenants()
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      console.error('Tenant fetch error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des locataires. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDelete = async (id: string) => {
    if (!id) return
    setTenantToDelete(id)
  }

  const confirmDelete = async () => {
    if (!tenantToDelete) return

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantToDelete)

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
    } finally {
      setTenantToDelete(null)
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

      <AlertDialog open={!!tenantToDelete} onOpenChange={(open) => !open && setTenantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTenantToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}