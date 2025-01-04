import { AgencyEarningsTable } from "@/components/AgencyEarningsTable"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

const AgencyEarnings = () => {
  return (
    <AgencyLayout>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Gains</h1>
      <AgencyEarningsTable />
    </AgencyLayout>
  )
}

export default AgencyEarnings