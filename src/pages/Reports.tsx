import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { OverviewStats } from "@/components/reports/OverviewStats"
import { OccupancyStatus } from "@/components/reports/OccupancyStatus"
import { RevenueEvolution } from "@/components/reports/RevenueEvolution"
import { PropertyAnalysisReport } from "@/components/reports/PropertyAnalysisReport"
import { TenantPaymentsReport } from "@/components/reports/TenantPaymentsReport"

const Reports = () => {
  return (
    <AgencyLayout>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Rapports</h1>
      <div className="space-y-8">
        <OverviewStats />
        <OccupancyStatus />
        <RevenueEvolution />
        <PropertyAnalysisReport />
        <TenantPaymentsReport />
      </div>
    </AgencyLayout>
  )
}

export default Reports