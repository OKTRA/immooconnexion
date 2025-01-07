import { ApartmentUnitsSection } from "../ApartmentUnitsSection"
import { ApartmentUnit } from "@/types/apartment"

interface ApartmentUnitsTabProps {
  apartmentId: string
  units: ApartmentUnit[]
  isLoading: boolean
  onCreateUnit: (data: ApartmentUnit) => Promise<void>
  onUpdateUnit: (data: ApartmentUnit) => Promise<void>
  onDeleteUnit: (unitId: string) => Promise<void>
  onEdit: (unit: ApartmentUnit) => void
}

export function ApartmentUnitsTab({
  apartmentId,
  units,
  isLoading,
  onCreateUnit,
  onUpdateUnit,
  onDeleteUnit,
  onEdit
}: ApartmentUnitsTabProps) {
  return (
    <ApartmentUnitsSection
      apartmentId={apartmentId}
      units={units}
      isLoading={isLoading}
      onCreateUnit={onCreateUnit}
      onUpdateUnit={onUpdateUnit}
      onDeleteUnit={onDeleteUnit}
      onEdit={onEdit}
    />
  )
}