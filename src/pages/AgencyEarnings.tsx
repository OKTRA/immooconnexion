import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencyEarningsTable } from "@/components/AgencyEarningsTable"

const AgencyEarnings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="w-full p-4 md:p-8 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Gains</h1>
          <AgencyEarningsTable />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AgencyEarnings