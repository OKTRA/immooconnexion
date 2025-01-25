import { useParams } from "react-router-dom"
import { PaymentMonitoringDashboard } from "@/components/apartment/payment/PaymentMonitoringDashboard"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

export default function ApartmentTenantPayments() {
  const { leaseId } = useParams<{ leaseId: string }>()

  if (!leaseId) {
    return <div>Bail non trouvé</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6 space-y-6">
        <PaymentMonitoringDashboard leaseId={leaseId} />
      </div>
    </AgencyLayout>
  )
}