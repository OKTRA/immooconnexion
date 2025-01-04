import { PropertyTable } from "@/components/PropertyTable"
import { PropertyDialog } from "@/components/PropertyDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

const Properties = () => {
  return (
    <AgencyLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Biens</h1>
        <PropertyDialog />
      </div>
      <PropertyTable />
    </AgencyLayout>
  )
}

export default Properties