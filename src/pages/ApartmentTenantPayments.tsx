import { useParams } from "react-router-dom"
import { PaymentMonitoringDashboard } from "@/components/apartment/payment/PaymentMonitoringDashboard"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

export default function ApartmentTenantPayments() {
  const { tenantId } = useParams<{ tenantId: string }>()

  if (!tenantId) {
    return <div>Locataire non trouvé</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6 space-y-6">
        <PaymentMonitoringDashboard tenantId={tenantId} />
      </div>
    </AgencyLayout>
  )
}