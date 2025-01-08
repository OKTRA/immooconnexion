import { useParams } from "react-router-dom"
import { useApartmentDetails } from "@/hooks/use-apartment-details"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { ApartmentUnitsTab } from "@/components/apartment/tabs/ApartmentUnitsTab"
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab"
import { ApartmentUnit } from "@/types/apartment"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: apartment, isLoading: isLoadingApartment } = useApartmentDetails(id!)
  const { 
    data: units = [], 
    isLoading: isLoadingUnits,
    deleteUnit,
    createUnit,
    updateUnit
  } = useApartmentUnits(id!)

  if (!id) return null
  
  if (isLoadingApartment || isLoadingUnits) {
    return <div>Loading...</div>
  }

  if (!apartment) {
    return <div>Apartment not found</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{apartment.name}</h1>
      
      <div className="space-y-6">
        <ApartmentUnitsTab
          apartmentId={id}
          units={units}
          isLoading={isLoadingUnits}
          onCreateUnit={async (data) => {
            await createUnit.mutateAsync(data)
          }}
          onUpdateUnit={async (data) => {
            await updateUnit.mutateAsync(data)
          }}
          onDeleteUnit={async (unitId) => {
            await deleteUnit.mutateAsync(unitId)
          }}
          onEdit={(unit: ApartmentUnit) => {
            console.log("Edit unit:", unit)
          }}
        />
      </div>
    </div>
  )
}