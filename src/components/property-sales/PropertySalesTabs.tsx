import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertySalesTable } from "./PropertySalesTable"
import { PropertiesForSale } from "./PropertiesForSale"
import { useState } from "react"
import { PropertySaleDialog } from "./PropertySaleDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function PropertySalesTabs() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div>
      <Tabs defaultValue="sales" className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
            <TabsTrigger value="sales">Historique des ventes</TabsTrigger>
            <TabsTrigger value="properties">Portefeuille immobilier</TabsTrigger>
          </TabsList>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle transaction
          </Button>
        </div>
        
        <div className="mt-6">
          <TabsContent value="sales">
            <PropertySalesTable />
          </TabsContent>
          <TabsContent value="properties">
            <PropertiesForSale />
          </TabsContent>
        </div>
      </Tabs>

      <PropertySaleDialog
        propertyId=""
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  )
}