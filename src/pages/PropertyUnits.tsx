import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"
import { useParams } from "react-router-dom"

export default function PropertyUnits() {
  const { propertyId } = useParams()

  if (!propertyId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestion des Appartements</h1>
        <p>Veuillez sélectionner une propriété pour voir ses unités.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Appartements</h1>
      <PropertyUnitsManager propertyId={propertyId} />
    </div>
  )
}