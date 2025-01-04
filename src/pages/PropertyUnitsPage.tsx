import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"
import { useParams } from "react-router-dom"

export default function PropertyUnitsPage() {
  const { propertyId } = useParams()

  if (!propertyId) {
    return <div>ID de la propriété manquant</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Unités</h1>
        </div>
        <PropertyUnitsManager propertyId={propertyId} />
      </div>
    </AgencyLayout>
  )
}