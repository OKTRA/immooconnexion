import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertySalesTable } from "./PropertySalesTable"
import { PropertiesForSale } from "./PropertiesForSale"

export function PropertySalesTabs() {
  return (
    <Tabs defaultValue="sales" className="mt-8">
      <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
        <TabsTrigger value="sales">Ventes</TabsTrigger>
        <TabsTrigger value="properties">Biens à vendre</TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="sales">
          <PropertySalesTable />
        </TabsContent>
        <TabsContent value="properties">
          <PropertiesForSale />
        </TabsContent>
      </div>
    </Tabs>
  )
}