import { ApartmentCard } from "./ApartmentCard"
import { ApartmentSkeleton } from "./ApartmentSkeleton"
import { EmptyApartmentState } from "./EmptyApartmentState"

interface ApartmentListProps {
  apartments: Array<{
    id: string
    name: string
    address: string
    unit_count: number
  }>
  isLoading: boolean
  onViewUnits: (apartmentId: string) => void
}

export function ApartmentList({ apartments, isLoading, onViewUnits }: ApartmentListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <ApartmentSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!apartments?.length) {
    return <EmptyApartmentState owners={[]} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {apartments.map((apartment) => (
        <ApartmentCard
          key={apartment.id}
          apartment={apartment}
          onViewUnits={onViewUnits}
        />
      ))}
    </div>
  )
}