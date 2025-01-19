import { useParams } from "react-router-dom"
import { useApartment } from "@/hooks/use-apartment"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"

export default function ApartmentUnits() {
  const { id } = useParams<{ id: string }>()
  
  const {
    data: apartment,
    isLoading: apartmentLoading,
    error: apartmentError
  } = useApartment(id || '')

  const {
    units,
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(id || null)

  if (!id) {
    return <div>ID d'appartement manquant</div>
  }

  return (
    <ApartmentUnitsSection
      apartmentId={id}
      units={units}
      isLoading={unitsLoading || apartmentLoading}
      onCreateUnit={createUnit.mutateAsync}
      onUpdateUnit={updateUnit.mutateAsync}
      onDeleteUnit={deleteUnit.mutateAsync}
      onEdit={() => {}}
    />
  )
}