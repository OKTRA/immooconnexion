import { PropertyTable } from "@/components/PropertyTable"
import { PropertyDialog } from "@/components/PropertyDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2 } from "lucide-react"

const Properties = () => {
  return (
    <AgencyLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Biens</h1>
        <PropertyDialog />
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Liste des biens</TabsTrigger>
          <TabsTrigger value="units" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Unités/Appartements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <PropertyTable />
        </TabsContent>

        <TabsContent value="units">
          <PropertyTable propertyType="appartement" />
        </TabsContent>
      </Tabs>
    </AgencyLayout>
  )
}

export default Properties