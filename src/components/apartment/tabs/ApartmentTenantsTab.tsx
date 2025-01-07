import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ApartmentTenantsTable } from "../tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "../tenant/ApartmentTenantDialog"
import { useState } from "react"
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

interface ApartmentTenantsTabProps {
  apartmentId: string
  tenants: any[]
  isLoading: boolean
  onDeleteTenant: (id: string) => Promise<void>
  onEditTenant: (tenant: any) => void
}

export function ApartmentTenantsTab({
  apartmentId,
  tenants,
  isLoading,
  onDeleteTenant,
  onEditTenant
}: ApartmentTenantsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)

  const handleDeleteTenant = async () => {
    if (tenantToDelete) {
      await onDeleteTenant(tenantToDelete)
      setTenantToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locataires</h2>
        <Button onClick={() => {
          setSelectedTenant(null)
          setIsDialogOpen(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un locataire
        </Button>
      </div>

      <ApartmentTenantsTable
        tenants={tenants}
        onEdit={onEditTenant}
        onDelete={(id) => setTenantToDelete(id)}
      />

      <ApartmentTenantDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tenant={selectedTenant}
        apartmentId={apartmentId}
      />

      <AlertDialog 
        open={!!tenantToDelete} 
        onOpenChange={(open) => !open && setTenantToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTenantToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTenant} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}