import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartUnitsManager } from "@/components/admin/property/ApartUnitsManager"
import { useParams } from "react-router-dom"

export default function PropertyUnits() {
  const { propertyId } = useParams()

  if (!propertyId) {
    return <div>ID de la propriété manquant</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartUnitsManager propertyId={propertyId} />
      </div>
    </AgencyLayout>
  )
}