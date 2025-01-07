import { useParams, Navigate } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartment } from "@/hooks/use-apartment"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApartmentPaymentsTab } from "@/components/apartment/tabs/ApartmentPaymentsTab"
import { ApartmentLateFeesTab } from "@/components/apartment/tabs/ApartmentLateFeesTab"
import { ApartmentDepositsTab } from "@/components/apartment/tabs/ApartmentDepositsTab"
import { ApartmentUnit } from "@/types/apartment"
import { useState } from "react"
import { useApartmentTenants } from "@/components/apartment/tenant/useApartmentTenants"
import { ApartmentTenantDialog } from "@/components/apartment/tenant/ApartmentTenantDialog"
import { ApartmentTenantsTable } from "@/components/apartment/tenant/ApartmentTenantsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
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

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)
  
  // Validate ID format (basic UUID validation)
  const isValidUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  
  if (!isValidUUID) {
    return <Navigate to="/agence/appartements" replace />
  }

  const {
    data: apartment,
    isLoading: apartmentLoading
  } = useApartment(id)

  const {
    data: units = [],
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(id)

  const {
    data: tenants = [],
    isLoading: tenantsLoading,
    refetch: refetchTenants
  } = useApartmentTenants(id)

  const handleEdit = (unit: ApartmentUnit) => {
    console.log("Edit unit:", unit)
  }

  const handleEditTenant = (tenant: any) => {
    setSelectedTenant(tenant)
    setIsDialogOpen(true)
  }

  const handleDeleteTenant = async () => {
    if (!tenantToDelete) return

    try {
      const { error } = await supabase
        .from('apartment_tenants')
        .delete()
        .eq('id', tenantToDelete)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })

      refetchTenants()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setTenantToDelete(null)
    }
  }

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <div className="container mx-auto py-6">
        <Tabs defaultValue="units" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="units">Unités</TabsTrigger>
            <TabsTrigger value="tenants">Locataires</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="late-fees">Pénalités de retard</TabsTrigger>
            <TabsTrigger value="deposits">Cautions</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="units">
              <ApartmentUnitsSection
                apartmentId={id}
                units={units}
                isLoading={unitsLoading}
                onCreateUnit={async (data) => {
                  await createUnit.mutateAsync(data)
                }}
                onUpdateUnit={async (data) => {
                  await updateUnit.mutateAsync(data)
                }}
                onDeleteUnit={async (unitId) => {
                  await deleteUnit.mutateAsync(unitId)
                }}
                onEdit={handleEdit}
              />
            </TabsContent>

            <TabsContent value="tenants">
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
                  onEdit={handleEditTenant}
                  onDelete={(id) => setTenantToDelete(id)}
                />

                <ApartmentTenantDialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  tenant={selectedTenant}
                  apartmentId={id}
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
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              {apartment && <ApartmentInfo apartment={apartment} />}
            </TabsContent>

            <TabsContent value="payments">
              <ApartmentPaymentsTab />
            </TabsContent>

            <TabsContent value="late-fees">
              <ApartmentLateFeesTab apartmentId={id} />
            </TabsContent>

            <TabsContent value="deposits">
              <ApartmentDepositsTab apartmentId={id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}