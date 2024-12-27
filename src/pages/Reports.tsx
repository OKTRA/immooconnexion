import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { OverviewStats } from "@/components/reports/OverviewStats"
import { OccupancyStatus } from "@/components/reports/OccupancyStatus"
import { RevenueEvolution } from "@/components/reports/RevenueEvolution"
import { PropertyAnalysisReport } from "@/components/reports/PropertyAnalysisReport"
import { TenantPaymentsReport } from "@/components/reports/TenantPaymentsReport"

const Reports = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block md:w-[15%] min-w-[200px]">
          <AppSidebar />
        </div>
        <main className="w-full md:w-[85%] p-4 md:p-8 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Rapports</h1>
          <div className="space-y-8">
            <OverviewStats />
            <OccupancyStatus />
            <RevenueEvolution />
            <PropertyAnalysisReport />
            <TenantPaymentsReport />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Reports