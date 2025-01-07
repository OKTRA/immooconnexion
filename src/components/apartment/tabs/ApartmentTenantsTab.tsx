import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ApartmentTenantsTable } from "../tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "../tenant/ApartmentTenantDialog"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TenantPaymentsTab } from "../tenant/TenantPaymentsTab"
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
  const [selectedTab, setSelectedTab] = useState("list")

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

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          {selectedTenant && (
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list">
          <ApartmentTenantsTable
            tenants={tenants}
            onEdit={(tenant) => {
              setSelectedTenant(tenant);
              onEditTenant(tenant);
            }}
            onDelete={(id) => setTenantToDelete(id)}
          />
        </TabsContent>

        <TabsContent value="payments">
          {selectedTenant && (
            <TenantPaymentsTab tenantId={selectedTenant.id} />
          )}
        </TabsContent>
      </Tabs>

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