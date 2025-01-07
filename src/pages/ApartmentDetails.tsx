import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Separator } from "@/components/ui/separator"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartmentDetails } from "@/hooks/use-apartment-details"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const {
    apartment,
    apartmentLoading,
    units,
    unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentDetails(id)

  if (!id) return null

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <div className="grid gap-6">
        {apartment && <ApartmentInfo apartment={apartment} />}
        <Separator />
        <ApartmentUnitsSection
          apartmentId={id}
          units={units}
          isLoading={unitsLoading}
          onCreateUnit={(data) => createUnit.mutateAsync(data)}
          onUpdateUnit={(data) => updateUnit.mutateAsync(data)}
          onDeleteUnit={(unitId) => deleteUnit.mutateAsync(unitId)}
        />
      </div>
    </AgencyLayout>
  )
}