import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

const PropertyUnits = () => {
  const { propertyId } = useParams()

  return (
    <AgencyLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Unités</h1>
        {/* Units management content will be implemented later */}
      </div>
    </AgencyLayout>
  )
}

export default PropertyUnits