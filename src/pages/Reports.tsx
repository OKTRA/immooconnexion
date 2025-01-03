import { SidebarProvider } from "@/components/ui/sidebar"
import { OverviewStats } from "@/components/reports/OverviewStats"
import { OccupancyStatus } from "@/components/reports/OccupancyStatus"
import { RevenueEvolution } from "@/components/reports/RevenueEvolution"
import { PropertyAnalysisReport } from "@/components/reports/PropertyAnalysisReport"
import { TenantPaymentsReport } from "@/components/reports/TenantPaymentsReport"

const Reports = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="w-full p-4 md:p-8 min-w-0">
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