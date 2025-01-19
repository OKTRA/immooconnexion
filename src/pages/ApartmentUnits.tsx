import { useParams, Navigate } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartment } from "@/hooks/use-apartment"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { useState } from "react"
import { ApartmentUnit } from "@/types/apartment"

export default function ApartmentUnits() {
  const { id } = useParams<{ id: string }>()
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

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <div className="container mx-auto py-6">
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
          onEdit={(unit) => {
            setSelectedUnit(unit)
          }}
        />
      </div>
    </AgencyLayout>
  )
}