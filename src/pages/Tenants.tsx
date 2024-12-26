import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TenantsTable } from "@/components/TenantsTable"
import { TenantsDialog } from "@/components/TenantsDialog"

const Tenants = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block md:w-[15%] min-w-[200px]">
          <AppSidebar />
        </div>
        <main className="w-full md:w-[85%] p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Gestion des Locataires</h1>
            <TenantsDialog />
          </div>

          <TenantsTable />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Tenants