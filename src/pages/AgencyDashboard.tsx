import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PaymentNotifications } from "@/components/payment/PaymentNotifications"
import { LatePaymentFees } from "@/components/payment/LatePaymentFees"
import { DepositManagement } from "@/components/payment/DepositManagement"

export default function AgencyDashboard() {
  return (
    <AgencyLayout>
      <div className="space-y-6">
        <PaymentNotifications />
        <LatePaymentFees />
        <DepositManagement />
      </div>
    </AgencyLayout>
  )
}