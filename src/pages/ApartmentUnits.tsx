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
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ApartmentUnit } from "@/types/apartment"

export default function ApartmentUnits() {
  const { id } = useParams<{ id: string }>()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null)
  
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

  const handleSubmit = async (data: ApartmentUnit) => {
    if (selectedUnit) {
      await updateUnit.mutateAsync(data)
    } else {
      await createUnit.mutateAsync(data)
    }
    setShowAddDialog(false)
    setSelectedUnit(null)
  }

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Unités</h2>
          <Button onClick={() => {
            setSelectedUnit(null)
            setShowAddDialog(true)
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une unité
          </Button>
        </div>

        <ApartmentUnitsSection
          apartmentId={id}
          units={units}
          isLoading={unitsLoading}
          onEdit={(unit) => {
            setSelectedUnit(unit)
            setShowAddDialog(true)
          }}
          onDelete={async (unitId) => {
            await deleteUnit.mutateAsync(unitId)
          }}
        />

        <ApartmentUnitDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleSubmit}
          initialData={selectedUnit}
          apartmentId={id}
          isEditing={!!selectedUnit}
        />
      </div>
    </AgencyLayout>
  )
}