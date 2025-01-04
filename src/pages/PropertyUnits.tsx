import { PropertyTable } from "@/components/PropertyTable"
import { PropertyDialog } from "@/components/PropertyDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"

const PropertyUnits = () => {
  return (
    <AgencyLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Unités</h1>
        <PropertyDialog />
      </div>

      <div className="space-y-8">
        <PropertyTable propertyType="appartement" />
        <PropertyUnitsManager propertyId="" />
      </div>
    </AgencyLayout>
  )
}

export default PropertyUnits