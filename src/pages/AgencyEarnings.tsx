import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AgencyEarningsTable } from "@/components/AgencyEarningsTable"

const AgencyEarnings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block md:w-[15%] min-w-[200px]">
          <AppSidebar />
        </div>
        <main className="w-full md:w-[85%] p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Gains</h1>
          <AgencyEarningsTable />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AgencyEarnings