import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { PropertySalesTabs } from "@/components/property-sales/PropertySalesTabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { PropertySaleDialog } from "@/components/property-sales/PropertySaleDialog"

const PropertySales = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle vente
            </Button>
          </div>

          <PropertySalesTabs />

          <PropertySaleDialog
            propertyId=""
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
          />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertySales