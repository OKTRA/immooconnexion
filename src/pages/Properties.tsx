import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { PropertyTable } from "@/components/PropertyTable"
import { PropertyDialog } from "@/components/PropertyDialog"

const Properties = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="w-[15%] min-w-[200px]">
          <AppSidebar />
        </div>
        <main className="w-[85%] p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Gestion des Biens</h1>
            <PropertyDialog />
          </div>

          <PropertyTable />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Properties