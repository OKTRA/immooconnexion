import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { PropertySalesTabs } from "@/components/property-sales/PropertySalesTabs"

const PropertySales = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Propriétés à vendre</h1>
          </div>

          <PropertySalesTabs />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertySales